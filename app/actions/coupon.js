'use server';

import { createPublicClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkAdmin } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

const MOCK_COUPONS = [
    {
        id: 'coup-1',
        code: 'BIENVENUEJULO',
        discount: 5000,
        minSpend: 50000,
        isActive: true,
    },
    {
        id: 'coup-2',
        code: 'JULO2026',
        discount: 10000,
        minSpend: 150000,
        isActive: true,
    },
    {
        id: 'coup-3',
        code: 'DAKARPROMO',
        discount: 3000,
        minSpend: 30000,
        isActive: true,
    },
];

export async function validateCoupon(code, totalPrice) {
    if (!code) return { error: 'Veuillez saisir un code promo.' };
    const normalizedCode = code.trim().toUpperCase();

    try {
        const supabase = createPublicClient();
        const { data: coupon, error } = await supabase
            .from('Coupon')
            .select('*')
            .eq('code', normalizedCode)
            .eq('isActive', true)
            .single();

        let targetCoupon = coupon;

        if (error || !targetCoupon) {
            targetCoupon = MOCK_COUPONS.find((c) => c.code === normalizedCode && c.isActive);
        }

        if (!targetCoupon) {
            return { error: 'Code promo invalide ou expiré.' };
        }

        if (targetCoupon.minSpend && totalPrice < Number(targetCoupon.minSpend)) {
            return {
                error: `Ce code nécessite un panier minimum de ${Number(targetCoupon.minSpend).toLocaleString('fr-SN')} FCFA.`,
            };
        }

        if (targetCoupon.expiryDate && new Date(targetCoupon.expiryDate) < new Date()) {
            return { error: 'Ce code promo a expiré.' };
        }

        return {
            success: true,
            coupon: {
                id: targetCoupon.id,
                code: targetCoupon.code,
                discount: Number(targetCoupon.discount),
            },
        };
    } catch {
        const fallback = MOCK_COUPONS.find((c) => c.code === normalizedCode && c.isActive);
        if (fallback) {
            if (fallback.minSpend && totalPrice < fallback.minSpend) {
                return {
                    error: `Ce code nécessite un panier minimum de ${fallback.minSpend.toLocaleString('fr-SN')} FCFA.`,
                };
            }
            return {
                success: true,
                coupon: {
                    id: fallback.id,
                    code: fallback.code,
                    discount: fallback.discount,
                },
            };
        }
        return { error: 'Code promo invalide.' };
    }
}

export async function getCoupons() {
    try {
        await checkAdmin();
        const supabase = await createAdminClient();
        const { data: coupons, error } = await supabase
            .from('Coupon')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) return { coupons: MOCK_COUPONS };
        return { coupons: coupons || MOCK_COUPONS };
    } catch {
        return { coupons: MOCK_COUPONS };
    }
}

export async function addCoupon(couponData) {
    try {
        await checkAdmin();
        const supabase = await createAdminClient();

        const { data: coupon, error } = await supabase
            .from('Coupon')
            .insert([
                {
                    code: couponData.code.trim().toUpperCase(),
                    discount: Number(couponData.discount),
                    minSpend: Number(couponData.minSpend || 0),
                    isActive: couponData.isActive ?? true,
                    expiryDate: couponData.expiryDate || null,
                },
            ])
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/admin/coupons');
        return { success: 'Code promo créé avec succès !', coupon };
    } catch (error) {
        return { error: error.message || 'Erreur lors de la création du code promo.' };
    }
}

export async function deleteCoupon(id) {
    try {
        await checkAdmin();
        const supabase = await createAdminClient();

        const { error } = await supabase.from('Coupon').delete().eq('id', id);
        if (error) throw error;

        revalidatePath('/admin/coupons');
        return { success: 'Code promo supprimé.' };
    } catch (error) {
        return { error: 'Erreur lors de la suppression.' };
    }
}
