'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';

export async function addBanner(bannerData) {
    try {
        await checkAdmin();
        const supabaseAdmin = await createAdminClient();

        const { data, error } = await supabaseAdmin
            .from('Banner')
            .insert([bannerData])
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/');
        revalidatePath('/admin/banners');
        return { success: 'Bannière ajoutée !', banner: data };
    } catch (error) {
        console.error('Add banner error:', error);
        return { error: "Erreur lors de l'ajout de la bannière." };
    }
}

export async function updateBanner(id, bannerData) {
    try {
        await checkAdmin();
        const supabaseAdmin = await createAdminClient();

        const { error } = await supabaseAdmin.from('Banner').update(bannerData).eq('id', id);

        if (error) throw error;

        revalidatePath('/');
        revalidatePath('/admin/banners');
        return { success: 'Bannière mise à jour !' };
    } catch (error) {
        console.error('Update banner error:', error);
        return { error: 'Erreur lors de la mise à jour.' };
    }
}

export async function deleteBanner(id) {
    try {
        await checkAdmin();
        const supabaseAdmin = await createAdminClient();

        const { error } = await supabaseAdmin.from('Banner').delete().eq('id', id);

        if (error) throw error;

        revalidatePath('/');
        revalidatePath('/admin/banners');
        return { success: 'Bannière supprimée !' };
    } catch (error) {
        console.error('Delete banner error:', error);
        return { error: 'Erreur lors de la suppression.' };
    }
}

export async function getBanners() {
    const { createPublicClient } = await import('@/lib/supabase/server');
    const supabase = createPublicClient();

    try {
        const { data: banners, error } = await supabase
            .from('Banner')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return { banners };
    } catch (error) {
        console.error('Get banners error:', error);
        return { error: 'Erreur lors de la récupération des bannières.' };
    }
}

export async function getActiveBanners() {
    const { createPublicClient } = await import('@/lib/supabase/server');
    const supabase = createPublicClient();

    try {
        const { data: banners, error } = await supabase
            .from('Banner')
            .select('*')
            .eq('isActive', true)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return { banners };
    } catch (error) {
        console.error('Get active banners error:', error);
        return { error: 'Erreur lors de la récupération des bannières actives.' };
    }
}
