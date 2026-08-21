'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendStockBackInStockEmail } from '@/lib/email';

export async function subscribeToStockNotification({ productId, email }) {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('StockNotification')
            .upsert([{ productId, email, isSent: false }], { onConflict: 'productId,email' });

        if (error) throw error;
        return { success: "Nous vous préviendrons dès que l'article sera de retour !" };
    } catch (error) {
        console.error('Stock subscription error:', error);
        return { error: "Erreur lors de l'inscription à l'alerte." };
    }
}

export async function processStockNotifications(product) {
    if (product.stock <= 0) return;

    try {
        const supabaseAdmin = await createAdminClient();

        // Get all unsent notifications for this product
        const { data: notifications, error } = await supabaseAdmin
            .from('StockNotification')
            .select('*')
            .eq('productId', product.id)
            .eq('isSent', false);

        if (error) throw error;
        if (!notifications || notifications.length === 0) return;

        const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://globalairsn.com'}/product/${product.id}`;

        // Send emails
        for (const notif of notifications) {
            await sendStockBackInStockEmail({
                to: notif.email,
                productName: product.name,
                productUrl,
                productPrice: product.price,
                productImage: product.images[0],
            });
        }

        // Mark notifications as sent
        await supabaseAdmin
            .from('StockNotification')
            .update({ isSent: true })
            .eq('productId', product.id)
            .eq('isSent', false);

        return { success: true, count: notifications.length };
    } catch (error) {
        console.error('Process notifications error:', error);
        return { error: "Erreur lors de l'envoi des notifications." };
    }
}
