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
    const supabase = createPublicClient();
    try {
        const { data: categories, error } = await supabase
            .from('Category')
            .select('*')
            .order('name', { ascending: true });

        if (error || !categories || categories.length === 0) {
            return { categories: JULO_CATEGORIES };
        }

        return { categories };
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
