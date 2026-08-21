'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { checkRateLimit } from '@/lib/rate-limit';

import { sendOrderConfirmationEmail, sendAdminNewOrderAlert } from '@/lib/email';
import { sendSMS } from '@/lib/sms';
import { Order } from '@/types';
import { getZonesForRegion } from '@/lib/deliveryZones';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function placeOrder(
    orderData: any
): Promise<{ success?: string; error?: string; orderId?: string }> {
    // Rate Limiting : Max 5 commandes par heure par IP
    const rateLimit = await checkRateLimit('place_order', 5, 60);
    if (!rateLimit.success) return { error: rateLimit.error };

    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const {
        items,
        address,
        paymentMethod,
        deliveryMethod = 'DELIVERY',
        couponId = null,
        // deliveryFee et discountAmount client-side ne sont volontairement PAS utilisés :
        // ils sont recalculés côté serveur ci-dessous pour empêcher toute manipulation du prix.
    } = orderData;

    // Stock réservé atomiquement pour cette tentative de commande ; relâché dans le
    // catch si une étape ultérieure échoue (adresse, commande, etc.).
    const reservedItems: { id: string; quantity: number }[] = [];

    try {
        // 0. Recalculate total price to prevent manipulation
        let calculatedTotal = 0;
        const validatedItems = [];

        for (const item of items) {
            const { data: product, error: prodError } = await adminSupabase
                .from('Product')
                .select('price, stock')
                .eq('id', item.id)
                .single();

            if (prodError || !product) throw new Error(`Produit non trouvé: ${item.id}`);
            if (item.quantity <= 0) throw new Error(`Quantité invalide pour: ${item.name}`);
            if (product.stock < item.quantity)
                throw new Error(`Stock insuffisant pour: ${item.name}`);

            const itemTotal = product.price * item.quantity;
            calculatedTotal += itemTotal;
            validatedItems.push({
                ...item,
                price: product.price, // Use server price
            });
        }

        // 0bis. Recalculate delivery fee server-side (never trust the client value)
        let calculatedDeliveryFee = 0;
        if (deliveryMethod === 'DELIVERY' && address?.state) {
            const zones = getZonesForRegion(address.state);
            const zoneMatch = zones.find((z) => z.name === address.city);
            // fee === -1 means "à négocier" : la commande démarre à 0, l'admin ajuste ensuite.
            if (zoneMatch && zoneMatch.fee > 0) {
                calculatedDeliveryFee = zoneMatch.fee;
            }
        }

        // 0ter. Recalculate discount server-side from a real, still-valid coupon
        let calculatedDiscount = 0;
        let validCouponId = null;
        if (couponId) {
            const { data: coupon } = await adminSupabase
                .from('Coupon')
                .select('*')
                .eq('id', couponId)
                .eq('isActive', true)
                .single();

            if (coupon) {
                const notExpired =
                    !coupon.expirationDate || new Date(coupon.expirationDate) >= new Date();
                const underLimit = coupon.usedCount < coupon.usageLimit;
                const meetsMin = calculatedTotal >= Number(coupon.minOrderAmount || 0);

                if (notExpired && underLimit && meetsMin) {
                    let discount =
                        coupon.type === 'PERCENTAGE'
                            ? (calculatedTotal * coupon.value) / 100
                            : Number(coupon.value);
                    if (coupon.maxDiscountAmount) {
                        discount = Math.min(discount, coupon.maxDiscountAmount);
                    }
                    calculatedDiscount = Math.min(discount, calculatedTotal);
                    validCouponId = coupon.id;
                }
            }
        }

        // 0quater. Réserver le stock de manière atomique (RPC) : empêche la survente
        // si deux clients commandent le même produit en même temps.
        for (const item of validatedItems) {
            const { data: reserved, error: reserveError } = await adminSupabase.rpc(
                'decrement_stock',
                { p_product_id: item.id, p_quantity: item.quantity }
            );

            if (reserveError || !reserved || reserved.length === 0) {
                throw new Error(
                    `Stock insuffisant pour: ${item.name} (une autre commande vient de le prendre, veuillez réessayer)`
                );
            }
            reservedItems.push({ id: item.id, quantity: item.quantity });
        }

        // 1. Gérer l'adresse
        let addressId = address.id;

        if (!addressId) {
            const { data: newAddress, error: addrError } = await adminSupabase
                .from('Address')
                .insert([
                    {
                        userId: user?.id || null,
                        name: address.name,
                        email: address.email || '',
                        phone: address.phone,
                        street: address.street,
                        city: address.city,
                        state: address.state,
                        zip: address.zip,
                        country: address.country || 'Sénégal',
                        latitude: address.latitude,
                        longitude: address.longitude,
                    },
                ])
                .select()
                .single();

            if (addrError) throw addrError;
            addressId = newAddress.id;
        }

        // 2. Créer la commande
        const initialStatus = paymentMethod === 'COD' ? 'CONFIRMED' : 'ORDER_PLACED'; // WAVE et autres : en attente de vérification

        const { data: order, error: orderError } = await adminSupabase
            .from('Order')
            .insert([
                {
                    userId: user?.id || null,
                    addressId: addressId,
                    couponId: validCouponId,
                    discountAmount: calculatedDiscount,
                    deliveryFee: calculatedDeliveryFee,
                    total: Math.max(
                        0,
                        calculatedTotal + calculatedDeliveryFee - calculatedDiscount
                    ),
                    status: initialStatus,
                    paymentMethod: paymentMethod || 'COD',
                },
            ])
            .select()
            .single();

        if (orderError) {
            console.error('Order insertion error:', orderError);
            throw new Error(`Erreur lors de la création de la commande: ${orderError.message}`);
        }

        // 3. Créer les OrderItems
        const orderItems = validatedItems.map((item) => ({
            orderId: order.id,
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
        }));

        const { error: itemsError } = await adminSupabase.from('OrderItem').insert(orderItems);
        if (itemsError) {
            console.error('Order items insertion error:', itemsError);
            // Roll back the order header so we don't leave an orphan Order with no items.
            await adminSupabase.from('Order').delete().eq('id', order.id);
            throw new Error(`Erreur lors de l'enregistrement des articles: ${itemsError.message}`);
        }

        // 4. Le stock a déjà été réservé atomiquement à l'étape 0quater.
        // Incrémenter l'usage du coupon, lui aussi de façon atomique.
        if (validCouponId) {
            const { data: incremented } = await adminSupabase.rpc('increment_coupon_usage', {
                p_coupon_id: validCouponId,
            });
            if (!incremented || incremented.length === 0) {
                console.error(
                    `Coupon ${validCouponId}: usage non comptabilisé (limite déjà atteinte au moment de l'écriture).`
                );
            }
        }

        // 5. Envoyer les notifications (Email & SMS)
        try {
            // Alerte Admin (Systématique)
            sendAdminNewOrderAlert({
                orderId: order.id,
                totalPrice: calculatedTotal + calculatedDeliveryFee - calculatedDiscount,
                items: validatedItems,
                customer: { name: address.name, phone: address.phone },
                address: address,
            }).catch((err) => console.error('Admin alert failed:', err));

            // Email Client (uniquement si email fourni)
            if (user?.email || address.email) {
                await sendOrderConfirmationEmail({
                    to: user?.email || address.email,
                    orderId: order.id,
                    totalPrice: calculatedTotal + calculatedDeliveryFee - calculatedDiscount,
                    items: validatedItems,
                });
            }

            // SMS uniquement pour COD confirmé (pas pour WAVE, en attente vérification)
            if (address.phone && initialStatus === 'CONFIRMED') {
                const orderShortId = order.id.slice(-6).toUpperCase();
                const smsMessage = `Global Air: Commande #${orderShortId} CONFIRMÉE. Paiement de ${(calculatedTotal + calculatedDeliveryFee - calculatedDiscount).toLocaleString('fr-SN')} FCFA à la livraison.`;
                await sendSMS({ to: address.phone, message: smsMessage });
            }
        } catch (err) {
            console.error('Silent notification error:', err);
        }

        revalidatePath('/orders');
        revalidatePath('/admin/orders');

        return { success: 'Commande enregistrée !', orderId: order.id };
    } catch (error: any) {
        console.error('Place order full error:', error);

        // Release any stock reserved during this attempt before failing out.
        for (const item of reservedItems) {
            await adminSupabase
                .rpc('decrement_stock', { p_product_id: item.id, p_quantity: -item.quantity })
                .then(({ error: releaseError }) => {
                    if (releaseError)
                        console.error(
                            `Failed to release reserved stock for ${item.id}:`,
                            releaseError
                        );
                });
        }

        return {
            error:
                error.message ||
                "Une erreur est survenue lors de l'enregistrement de votre commande.",
        };
    }
}

export async function getInvoiceData(orderId: string): Promise<{ order?: any; error?: string }> {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    let isAdmin = false;
    if (user) {
        const { data: userData } = await adminSupabase
            .from('User')
            .select('role')
            .eq('id', user.id)
            .single();
        isAdmin = userData?.role === 'ADMIN';
    }

    try {
        const { data: order, error } = await adminSupabase
            .from('Order')
            .select(
                `
                *,
                address:Address(*),
                user:User(*),
                orderItems:OrderItem(
                    *,
                    product:Product(*)
                )
            `
            )
            .eq('id', orderId)
            .single();

        if (error || !order) return { error: 'Commande non trouvée.' };

        // Autoriser si Admin
        if (isAdmin) return { order };

        // Pour les clients :
        // 1. Doit être sa propre commande (si rattachée à un utilisateur)
        if (order.userId && order.userId !== user?.id) {
            return { error: 'Accès non autorisé.' };
        }

        // 2. La facture n'est disponible que si la commande est validée (Status != ORDER_PLACED)
        if (order.status === 'ORDER_PLACED') {
            return {
                error: 'Votre facture sera disponible dès que votre commande sera validée par notre équipe.',
            };
        }

        return { order };
    } catch (error) {
        console.error('Get invoice data error:', error);
        return { error: 'Erreur lors de la récupération de la facture.' };
    }
}

export async function getPublicOrderDetails(
    orderId: string
): Promise<{ order?: any; error?: string }> {
    const adminSupabase = createAdminClient();

    try {
        const { data: order, error } = await adminSupabase
            .from('Order')
            .select(
                `
                *,
                address:Address(*),
                orderItems:OrderItem(
                    *,
                    product:Product(*)
                )
            `
            )
            .eq('id', orderId)
            .single();

        if (error || !order) return { error: 'Commande non trouvée.' };

        return { order };
    } catch (error) {
        console.error('Get public order details error:', error);
        return { error: 'Erreur lors de la récupération de la commande.' };
    }
}

export async function getUserOrders(): Promise<{
    orders?: Order[];
    error?: string;
}> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: 'Non connecté' };

    try {
        const { data: orders, error } = await supabase
            .from('Order')
            .select(
                `
                *,
                address:Address(*),
                orderItems:OrderItem(
                    *,
                    product:Product(*)
                )
            `
            )
            .eq('userId', user.id)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return { orders };
    } catch (error) {
        console.error('Get user orders error:', error);
        return { error: 'Erreur lors de la récupération des commandes.' };
    }
}

export async function trackPublicOrder(
    orderId: string,
    phone: string
): Promise<{ order?: any; error?: string }> {
    // Rate Limiting : Max 20 tentatives de suivi par heure par IP
    const rateLimit = await checkRateLimit('track_order', 20, 60);
    if (!rateLimit.success) return { error: rateLimit.error };

    const adminSupabase = createAdminClient();

    try {
        // Nettoyer l'ID et le téléphone
        const cleanId = orderId.trim();
        const cleanPhone = phone.replace(/\s+/g, '');

        if (!cleanId || !cleanPhone) {
            return { error: 'Veuillez remplir tous les champs.' };
        }

        const { data: orders, error } = await adminSupabase
            .from('Order')
            .select(
                `
                id,
                total,
                status,
                createdAt,
                address:Address!inner(phone, name, city)
            `
            )
            .ilike('id', `%${cleanId}`)
            .order('createdAt', { ascending: false })
            .limit(5);

        if (error) throw error;

        // Strict matching in JS to ignore spaces in both DB and input
        const matchedOrder = orders?.find((o: any) => {
            const addressData = Array.isArray(o.address) ? o.address[0] : o.address;
            const dbPhone = addressData?.phone?.replace(/\s+/g, '') || '';
            return dbPhone === cleanPhone;
        });

        if (!matchedOrder) {
            return { error: 'Aucune commande trouvée avec ces informations.' };
        }

        return { order: matchedOrder };
    } catch (error) {
        console.error('Track order error:', error);
        return { error: 'Erreur lors de la recherche de la commande.' };
    }
}
