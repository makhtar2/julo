'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { checkAdmin } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { checkRateLimit } from '@/lib/rate-limit';

export async function addCoupon(couponData: any) {
    try {
        await checkAdmin();
        const adminSupabase = createAdminClient();

        const { data, error } = await adminSupabase
            .from('Coupon')
            .insert([
                {
                    ...couponData,
                    code: couponData.code.toUpperCase(),
                    value: Number(couponData.value),
                    minOrderAmount: Number(couponData.minOrderAmount || 0),
                    maxDiscountAmount: couponData.maxDiscountAmount
                        ? Number(couponData.maxDiscountAmount)
                        : null,
                    expirationDate: couponData.expirationDate || null,
                    usageLimit: Number(couponData.usageLimit || 100),
                },
            ])
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/admin/coupons');
        return { success: 'Coupon ajouté !', coupon: data };
    } catch (error) {
        console.error('Add coupon error:', error);
        return { error: "Erreur lors de l'ajout du coupon." };
    }
}

export async function getCoupons() {
    try {
        await checkAdmin();
        const adminSupabase = createAdminClient();

        const { data: coupons, error } = await adminSupabase
            .from('Coupon')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return { coupons };
    } catch (error) {
        console.error('Get coupons error:', error);
        return { error: 'Erreur lors de la récupération des coupons.' };
    }
}

export async function deleteCoupon(id: string) {
    try {
        await checkAdmin();
        const adminSupabase = createAdminClient();

        const { error } = await adminSupabase.from('Coupon').delete().eq('id', id);

        if (error) throw error;

        revalidatePath('/admin/coupons');
        return { success: 'Coupon supprimé !' };
    } catch (error) {
        console.error('Delete coupon error:', error);
        return { error: 'Erreur lors de la suppression.' };
    }
}

export async function validateCoupon(code: string, orderAmount: number) {
    // Rate Limiting : max 10 tentatives de code promo par heure par IP
    const rateLimit = await checkRateLimit('validate_coupon', 10, 60);
    if (!rateLimit.success) return { error: rateLimit.error };

    const adminSupabase = createAdminClient();

    try {
        const { data: coupon, error } = await adminSupabase
            .from('Coupon')
            .select('*')
            .eq('code', code.toUpperCase())
            .eq('isActive', true)
            .single();

        if (error || !coupon) {
            return { error: 'Code promo invalide.' };
        }

        // Vérifier l'expiration
        if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) {
            return { error: 'Ce code promo a expiré.' };
        }

        // Vérifier la limite d'utilisation
        if (coupon.usedCount >= coupon.usageLimit) {
            return { error: 'Ce code promo n’est plus disponible.' };
        }

        // Vérifier le montant minimum
        if (orderAmount < coupon.minOrderAmount) {
            return {
                error: `Le montant minimum pour ce code est de ${Number(coupon.minOrderAmount).toLocaleString('fr-SN')} FCFA.`,
            };
        }

        // Calculer la réduction (ne peut jamais dépasser le montant de la commande)
        let discount = 0;
        if (coupon.type === 'PERCENTAGE') {
            discount = (orderAmount * coupon.value) / 100;
            if (coupon.maxDiscountAmount) {
                discount = Math.min(discount, coupon.maxDiscountAmount);
            }
        } else {
            discount = coupon.value;
        }
        // Sécurité : la remise ne peut pas dépasser le montant total
        discount = Math.min(discount, orderAmount);

        return {
            success: true,
            coupon: {
                id: coupon.id,
                code: coupon.code,
                discount: discount,
            },
        };
    } catch (error) {
        console.error('Coupon validation error:', error);
        return { error: 'Erreur lors de la validation du coupon.' };
    }
}
