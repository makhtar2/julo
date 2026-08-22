'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { sendSMS } from '@/lib/sms';

export async function placeOrder(orderData) {
    try {
        const {
            items = [],
            totalPrice,
            address,
            paymentMethod = 'COD',
            deliveryMethod = 'DELIVERY',
            deliveryFee = 0,
            couponId = null,
            discountAmount = 0,
        } = orderData;

        if (!items || items.length === 0) {
            return { error: 'Votre panier est vide.' };
        }

        const supabaseUserClient = await createClient();
        const {
            data: { user },
        } = await supabaseUserClient.auth.getUser();

        let supabaseAdmin;
        try {
            supabaseAdmin = await createAdminClient();
        } catch {
            supabaseAdmin = null;
        }

        const orderId = `julo_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

        // If Supabase is connected and ready
        if (supabaseAdmin) {
            try {
                // 1. Create or save address
                let addressId = null;
                if (address) {
                    const { data: addressRecord } = await supabaseAdmin
                        .from('Address')
                        .insert([
                            {
                                userId: user?.id || null,
                                name: address.name || 'Client JULO',
                                phone: address.phone || '',
                                street: address.street || address.zone || '',
                                city: address.city || address.zone || '',
                                state: address.state || address.region || 'Dakar',
                                country: address.country || 'Sénégal',
                            },
                        ])
                        .select('id')
                        .single();

                    if (addressRecord) {
                        addressId = addressRecord.id;
                    }
                }

                // 2. Insert Order
                const { data: orderRecord, error: orderError } = await supabaseAdmin
                    .from('Order')
                    .insert([
                        {
                            userId: user?.id || null,
                            total: Number(totalPrice),
                            status: paymentMethod === 'WAVE' ? 'PENDING' : 'CONFIRMED',
                            paymentMethod: paymentMethod,
                            deliveryMethod: deliveryMethod,
                            deliveryFee: Number(deliveryFee),
                            addressId: addressId,
                            couponId: couponId,
                            discountAmount: Number(discountAmount),
                        },
                    ])
                    .select('id')
                    .single();

                if (orderRecord) {
                    const dbOrderId = orderRecord.id;

                    // 3. Insert Order Items
                    const orderItemsPayload = items.map((item) => ({
                        orderId: dbOrderId,
                        productId: item.id?.startsWith('julo-') ? null : item.id,
                        quantity: item.quantity,
                        price: item.price,
                    }));

                    if (orderItemsPayload.length > 0) {
                        await supabaseAdmin.from('OrderItem').insert(orderItemsPayload);
                    }

                    // 4. Decrement Stock
                    for (const item of items) {
                        if (item.id && !item.id.startsWith('julo-')) {
                            await supabaseAdmin.rpc('decrement_stock', {
                                p_product_id: item.id,
                                p_quantity: item.quantity,
                            });
                        }
                    }

                    // 5. Send Confirmation Email & SMS
                    const clientEmail = user?.email || address?.email;
                    const clientPhone = address?.phone;

                    if (clientEmail) {
                        sendOrderConfirmationEmail({
                            to: clientEmail,
                            orderId: dbOrderId,
                            items: items,
                            totalPrice: totalPrice,
                            address: address,
                        }).catch((err) => console.error('Confirmation email error:', err));
                    }

                    if (clientPhone) {
                        const shortId = dbOrderId.slice(-6).toUpperCase();
                        sendSMS({
                            to: clientPhone,
                            message: `JULO: Commande #${shortId} reçue avec succès (${totalPrice.toLocaleString('fr-SN')} FCFA). Merci de votre confiance !`,
                        }).catch((err) => console.error('SMS notification error:', err));
                    }

                    revalidatePath('/orders');
                    revalidatePath('/admin/orders');

                    return { success: true, orderId: dbOrderId };
                }
            } catch (dbErr) {
                console.warn(
                    'Supabase order insert notice, falling back to local order ID:',
                    dbErr
                );
            }
        }

        // Fallback for mock/demo checkout
        return { success: true, orderId: orderId };
    } catch (error) {
        console.error('Place order error:', error);
        return { error: error.message || 'Erreur lors de la validation de la commande.' };
    }
}

export async function getOrder(orderId) {
    try {
        const { createPublicClient } = await import('@/lib/supabase/server');
        const supabase = createPublicClient();

        const { data: order, error } = await supabase
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

        if (error || !order) {
            return {
                order: {
                    id: orderId,
                    total: 0,
                    status: 'CONFIRMED',
                    createdAt: new Date().toISOString(),
                    paymentMethod: 'COD',
                    deliveryMethod: 'DELIVERY',
                    orderItems: [],
                },
            };
        }

        return { order };
    } catch {
        return {
            order: {
                id: orderId,
                total: 0,
                status: 'CONFIRMED',
                createdAt: new Date().toISOString(),
                paymentMethod: 'COD',
                deliveryMethod: 'DELIVERY',
                orderItems: [],
            },
        };
    }
}

export const getPublicOrderDetails = getOrder;

export async function getUserOrders() {
    try {
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { error: 'Non authentifié.' };
        }

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
        return { orders: orders || [] };
    } catch (error) {
        console.error('Get user orders error:', error);
        return { orders: [] };
    }
}

export async function trackPublicOrder(orderId, phone) {
    if (!orderId || !phone) {
        return { error: 'Veuillez saisir votre numéro de commande et téléphone.' };
    }

    try {
        const { createAdminClient } = await import('@/lib/supabase/admin');
        const supabase = await createAdminClient();
        const cleanPhone = phone.replace(/[\s+-]/g, '');

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
            .order('createdAt', { ascending: false });

        if (error || !orders || orders.length === 0) {
            return {
                order: {
                    id: orderId,
                    status: 'PROCESSING',
                    createdAt: new Date().toISOString(),
                    address: { name: 'Client JULO', phone },
                },
            };
        }

        const cleanSearchId = orderId.trim().toLowerCase();
        const matched = orders.find((o) => {
            const idMatches =
                o.id.toLowerCase() === cleanSearchId ||
                o.id.toLowerCase().endsWith(cleanSearchId) ||
                o.id.slice(-6).toLowerCase() === cleanSearchId;
            const orderPhone = (o.address?.phone || '').replace(/[\s+-]/g, '');
            const phoneMatches =
                !cleanPhone || orderPhone.includes(cleanPhone) || cleanPhone.includes(orderPhone);
            return idMatches && phoneMatches;
        });

        if (!matched) {
            return {
                error: 'Aucune commande ne correspond à ces informations. Vérifiez le numéro de commande et le téléphone.',
            };
        }

        return { order: matched };
    } catch {
        return {
            order: {
                id: orderId,
                status: 'PROCESSING',
                createdAt: new Date().toISOString(),
                address: { name: 'Client JULO', phone },
            },
        };
    }
}

export async function getInvoiceData(orderId) {
    if (!orderId) return { error: 'Identifiant de facture manquant.' };

    try {
        const { createAdminClient } = await import('@/lib/supabase/admin');
        const supabase = await createAdminClient();

        const { data: order, error } = await supabase
            .from('Order')
            .select(
                `
                *,
                user:User(name, email),
                address:Address(*),
                orderItems:OrderItem(
                    *,
                    product:Product(*)
                )
            `
            )
            .eq('id', orderId)
            .single();

        if (error || !order) {
            return {
                order: {
                    id: orderId,
                    total: 0,
                    status: 'CONFIRMED',
                    createdAt: new Date().toISOString(),
                    paymentMethod: 'COD',
                    deliveryMethod: 'DELIVERY',
                    deliveryFee: 0,
                    orderItems: [],
                    address: {
                        name: 'Client JULO',
                        phone: '+221 75 446 90 97',
                        street: 'Dakar',
                        city: 'Dakar',
                    },
                },
            };
        }

        return { order };
    } catch {
        return {
            order: {
                id: orderId,
                total: 0,
                status: 'CONFIRMED',
                createdAt: new Date().toISOString(),
                paymentMethod: 'COD',
                deliveryMethod: 'DELIVERY',
                deliveryFee: 0,
                orderItems: [],
                address: {
                    name: 'Client JULO',
                    phone: '+221 75 446 90 97',
                    street: 'Dakar',
                    city: 'Dakar',
                },
            },
        };
    }
}
