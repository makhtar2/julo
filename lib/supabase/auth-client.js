'use client';

import { createClient } from '@/lib/supabase/client';

/**
 * Initiates an OAuth sign-in flow with the specified provider.
 * This is a client-side function as Supabase OAuth needs to handle
 * the window redirection to the provider's login page.
 */
export async function signInWithSocialProvider(provider) {
    const supabase = createClient();

    // Dynamic calculation of the origin to handle dev/prod environments
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${origin}/api/auth/callback`,
        },
    });

    if (error) {
        console.error(`Error signing in with ${provider}:`, error.message);
        return { error: error.message };
    }

    return { data };
}
