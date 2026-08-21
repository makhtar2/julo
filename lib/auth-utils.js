import { createClient } from '@/lib/supabase/server';

export async function checkAdmin() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Non autorisé');

    const { data: profile } = await supabase.from('User').select('role').eq('id', user.id).single();

    if (profile?.role !== 'ADMIN') throw new Error('Accès refusé');
    return true;
}
