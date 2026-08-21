'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getUserAddresses() {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error('Non autorisé');

        const { data: addresses, error } = await supabase
            .from('Address')
            .select('*')
            .eq('userId', user.id)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return { addresses };
    } catch (error) {
        console.error('Get addresses error:', error);
        return { error: error.message };
    }
}

export async function addAddress(formData) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error('Non autorisé');

        const { error } = await supabase.from('Address').insert([
            {
                ...formData,
                userId: user.id,
            },
        ]);

        if (error) throw error;
        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Add address error:', error);
        return { error: error.message };
    }
}

export async function deleteAddress(addressId) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error('Non autorisé');

        const { error } = await supabase
            .from('Address')
            .delete()
            .eq('id', addressId)
            .eq('userId', user.id);

        if (error) throw error;
        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Delete address error:', error);
        return { error: error.message };
    }
}
