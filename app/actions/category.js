'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';

export async function addCategory(name) {
    try {
        await checkAdmin();
        const supabaseAdmin = await createAdminClient();

        const { data: category, error } = await supabaseAdmin
            .from('Category')
            .insert([{ name }])
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/admin/products');
        revalidatePath('/shop');
        return { success: 'Catégorie ajoutée !', category };
    } catch (error) {
        return { error: "Erreur lors de l'ajout de la catégorie." };
    }
}

export async function getCategories() {
    const { JULO_CATEGORIES } = await import('@/lib/mockProducts');
    const { createPublicClient } = await import('@/lib/supabase/server');

    let allCategories = [...JULO_CATEGORIES];

    try {
        const supabase = createPublicClient();
        const { data: dbCategories } = await supabase
            .from('Category')
            .select('*')
            .order('name', { ascending: true });

        if (dbCategories && dbCategories.length > 0) {
            const existingNames = new Set(allCategories.map((c) => c.name.toLowerCase()));
            for (const cat of dbCategories) {
                const nameLow = (cat.name || '').toLowerCase();
                const isOldAppliance =
                    nameLow.includes('ventilateur') ||
                    nameLow.includes('climatiseur') ||
                    nameLow.includes('fontaine') ||
                    nameLow.includes('bouilloire') ||
                    nameLow.includes('valise') ||
                    nameLow.includes('woofer');
                if (!isOldAppliance && !existingNames.has(nameLow)) {
                    allCategories.push(cat);
                }
            }
        }
        return { categories: allCategories };
    } catch {
        return { categories: JULO_CATEGORIES };
    }
}

export async function deleteCategory(id) {
    try {
        await checkAdmin();
        const supabaseAdmin = await createAdminClient();

        const { error } = await supabaseAdmin.from('Category').delete().eq('id', id);

        if (error) throw error;

        revalidatePath('/admin/products');
        revalidatePath('/shop');
        return { success: 'Catégorie supprimée.' };
    } catch (error) {
        return { error: 'Erreur lors de la suppression de la catégorie.' };
    }
}
