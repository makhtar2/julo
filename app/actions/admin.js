'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { checkAdmin } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { sendOrderStatusEmail } from '@/lib/email';
import { sendSMS } from '@/lib/sms';

export async function getAdminStats() {
    try {
        await checkAdmin();
        const supabase = await createAdminClient();

        // 1. Nombre de produits
        const { count: productsCount } = await supabase
            .from('Product')
            .select('*', { count: 'exact', head: true });

        // 2. Revenu total (Somme des commandes validées, payées ou livrées)
        const { data: revenueData } = await supabase
            .from('Order')
            .select('total')
            .in('status', ['PAID', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']);

        const totalRevenue = revenueData?.reduce((acc, order) => acc + Number(order.total), 0) || 0;

        // 3. Nombre de commandes
        const { count: ordersCount } = await supabase
            .from('Order')
            .select('*', { count: 'exact', head: true });

        // 4. Nombre de clients
        const { count: usersCount } = await supabase
            .from('User')
            .select('*', { count: 'exact', head: true });

        // 5. Alertes de stock faible (stock <= 5)
        const { data: lowStockProducts } = await supabase
            .from('Product')
            .select('id, name, stock, images')
            .lte('stock', 5)
            .gt('stock', 0)
            .order('stock', { ascending: true });

        // 6. Meilleurs Clients (Basé sur le nombre de commandes et le total dépensé)
        const { data: customerData } = await supabase
            .from('Order')
            .select('total, userId, User(name, email)')
            .in('status', ['PAID', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']);

        const customersMap = {};
        customerData?.forEach((order) => {
            const userId = order.userId;
            if (!customersMap[userId]) {
                customersMap[userId] = {
                    name: order.User?.name || 'Client Anonyme',
                    email: order.User?.email || "Pas d'email",
                    totalSpent: 0,
                    ordersCount: 0,
                };
            }
            customersMap[userId].totalSpent += Number(order.total);
            customersMap[userId].ordersCount += 1;
        });

        const topCustomers = Object.values(customersMap)
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 5);

        // 7. Dernières commandes pour le graphique
        const { data: allOrders } = await supabase
            .from('Order')
            .select('total, createdAt')
            .order('createdAt', { ascending: true });

        return {
            products: productsCount || 0,
            revenue: totalRevenue,
            orders: ordersCount || 0,
            users: usersCount || 0,
            lowStock: lowStockProducts || [],
            topCustomers: topCustomers || [],
            allOrders: allOrders || [],
        };
    } catch (error) {
        console.error('Admin stats error:', error);
        return { products: 0, revenue: 0, orders: 0, users: 0, allOrders: [] };
    }
}

export async function getAdminOrders() {
    try {
        await checkAdmin();
        const supabase = await createAdminClient();
        const { data: orders, error } = await supabase
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
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return { orders };
    } catch (error) {
        console.error('Get admin orders error:', error);
        return { error: 'Erreur lors de la récupération des commandes.' };
    }
}

// sign=1 restores stock (order cancelled), sign=-1 reserves it again (cancellation reversed).
async function adjustStockForOrder(supabase, orderId, sign) {
    const { data: orderItems, error } = await supabase
        .from('OrderItem')
        .select('productId, quantity')
        .eq('orderId', orderId);

    if (error || !orderItems) {
        console.error('Failed to load order items for stock adjustment:', error);
        return;
    }

    for (const item of orderItems) {
        // decrement_stock(qty) does stock - qty, so a restore (sign=1) passes -quantity.
        const { error: rpcError } = await supabase.rpc('decrement_stock', {
            p_product_id: item.productId,
            p_quantity: -sign * item.quantity,
        });
        if (rpcError) {
            console.error(`Stock adjustment failed for product ${item.productId}:`, rpcError);
        }
    }
}

export async function updateOrder(orderId, orderData) {
    try {
        await checkAdmin();
        const supabase = await createAdminClient();

        // 1. Get current order data to calculate new total if deliveryFee changes
        const { data: currentOrder, error: getError } = await supabase
            .from('Order')
            .select('*')
            .eq('id', orderId)
            .single();

        if (getError) throw getError;

        let finalUpdate = { ...orderData };

        // 2. Recalculate total if deliveryFee is provided
        if (orderData.deliveryFee !== undefined) {
            const oldFee = Number(currentOrder.deliveryFee || 0);
            const newFee = Number(orderData.deliveryFee);
            const oldTotal = Number(currentOrder.total);
            finalUpdate.total = oldTotal - oldFee + newFee;
        }

        // 3. Update the order
        const { error } = await supabase.from('Order').update(finalUpdate).eq('id', orderId);

        if (error) throw error;

        // 3bis. Cancelling an order releases the stock it had reserved; un-cancelling
        // it (rare, but possible via a status correction) reserves it again.
        const wasCancelled = currentOrder.status === 'CANCELLED';
        const isNowCancelled = orderData.status === 'CANCELLED';
        if (orderData.status && orderData.status !== currentOrder.status) {
            if (isNowCancelled && !wasCancelled) {
                await adjustStockForOrder(supabase, orderId, 1);
            } else if (wasCancelled && !isNowCancelled) {
                await adjustStockForOrder(supabase, orderId, -1);
            }
        }

        // 4. Notifications if status changed (reuse logic from updateOrderStatus)
        if (orderData.status && orderData.status !== currentOrder.status) {
            const { data: orderDetails } = await supabase
                .from('Order')
                .select('user:User(name, email), address:Address(name, phone)')
                .eq('id', orderId)
                .single();

            if (orderDetails) {
                const status = orderData.status;
                const clientName =
                    orderDetails.user?.name || orderDetails.address?.name || 'Client';
                const clientEmail = orderDetails.user?.email;
                const clientPhone = orderDetails.address?.phone;
                const orderShortId = orderId.slice(-6).toUpperCase();

                if (clientEmail && ['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
                    sendOrderStatusEmail({
                        to: clientEmail,
                        orderId: orderId,
                        status: status,
                        name: clientName,
                    }).catch((err) => console.error('Failed to send status email', err));
                }

                if (clientPhone) {
                    let smsMessage = '';
                    if (status === 'PAID') {
                        smsMessage = `JULO: Votre commande #${orderShortId} est PAYÉE. Merci de votre confiance !`;
                    } else if (status === 'CONFIRMED') {
                        smsMessage = `JULO: Votre commande #${orderShortId} est CONFIRMÉE. Paiement à la livraison.`;
                    } else if (status === 'SHIPPED') {
                        smsMessage = `JULO: Votre commande #${orderShortId} est en cours de LIVRAISON !`;
                    }

                    if (smsMessage) {
                        sendSMS({ to: clientPhone, message: smsMessage }).catch((err) =>
                            console.error('Failed to send SMS', err)
                        );
                    }
                }
            }
        }

        revalidatePath('/admin/orders');
        return { success: true };
    } catch (error) {
        console.error('Update order error:', error);
        return { error: 'Erreur lors de la mise à jour de la commande.' };
    }
}

export async function updateOrderStatus(orderId, status) {
    return updateOrder(orderId, { status });
}
