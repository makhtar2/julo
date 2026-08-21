'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';

export async function addPost(postData) {
    try {
        await checkAdmin();
        const supabaseAdmin = await createAdminClient();

        const slug = postData.title
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

        const { data, error } = await supabaseAdmin
            .from('Post')
            .insert([{ ...postData, slug }])
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        return { success: 'Article publié !', post: data };
    } catch (error) {
        console.error('Add post error:', error);
        return { error: "Erreur lors de la publication de l'article." };
    }
}

export async function updatePost(id, postData) {
    try {
        await checkAdmin();
        const supabaseAdmin = await createAdminClient();

        const { error } = await supabaseAdmin.from('Post').update(postData).eq('id', id);

        if (error) throw error;

        revalidatePath('/blog');
        revalidatePath(`/blog/${id}`);
        revalidatePath('/admin/blog');
        return { success: 'Article mis à jour !' };
    } catch (error) {
        console.error('Update post error:', error);
        return { error: 'Erreur lors de la mise à jour.' };
    }
}

export async function deletePost(id) {
    try {
        await checkAdmin();
        const supabaseAdmin = await createAdminClient();

        const { error } = await supabaseAdmin.from('Post').delete().eq('id', id);

        if (error) throw error;

        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        return { success: 'Article supprimé !' };
    } catch (error) {
        console.error('Delete post error:', error);
        return { error: 'Erreur lors de la suppression.' };
    }
}

export async function getPosts() {
    const { createPublicClient } = await import('@/lib/supabase/server');
    const supabase = createPublicClient();

    try {
        const { data: posts, error } = await supabase
            .from('Post')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return { posts };
    } catch (error) {
        console.error('Get posts error:', error);
        return { error: 'Erreur lors de la récupération des articles.' };
    }
}

export async function getPost(id) {
    const { createPublicClient } = await import('@/lib/supabase/server');
    const supabase = createPublicClient();

    try {
        const { data: post, error } = await supabase.from('Post').select('*').eq('id', id).single();

        if (error) throw error;
        return { post };
    } catch (error) {
        console.error('Get post error:', error);
        return { error: 'Article non trouvé.' };
    }
}
