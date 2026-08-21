import { createAdminClient } from './supabase/admin';
import { headers } from 'next/headers';

/**
 * Système de Rate Limiting simple utilisant Supabase
 * @param action Nom de l'action à limiter (ex: 'place_order')
 * @param limit Nombre maximum de tentatives
 * @param windowMinutes Fenêtre de temps en minutes
 * @returns { success: boolean, error?: string }
 */
export async function checkRateLimit(
    action: string,
    limit: number = 3,
    windowMinutes: number = 60
) {
    const adminSupabase = createAdminClient();
    const headersList = await headers();

    // Récupérer l'IP du client (Next.js)
    const ip = headersList.get('x-forwarded-for') || 'unknown';

    try {
        // Calculer la date limite de la fenêtre
        const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

        // Compter les tentatives récentes pour cette IP et cette action
        const { count, error: countError } = await adminSupabase
            .from('RateLimit')
            .select('*', { count: 'exact', head: true })
            .eq('ip', ip)
            .eq('action', action)
            .gte('createdAt', windowStart);

        if (countError) throw countError;

        if (count && count >= limit) {
            return {
                success: false,
                error: `Trop de tentatives. Veuillez réessayer dans ${windowMinutes} minutes.`,
            };
        }

        // Enregistrer la nouvelle tentative
        await adminSupabase.from('RateLimit').insert([{ ip, action }]);

        return { success: true };
    } catch (error) {
        console.error('Rate limit error:', error);
        // En cas d'erreur technique, on laisse passer pour ne pas bloquer les clients
        return { success: true };
    }
}
