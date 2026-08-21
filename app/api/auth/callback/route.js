import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // Use NEXT_PUBLIC_BASE_URL for production redirects, fallback to current origin
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || origin;
    // if "next" is in search params, use it as the redirection URL
    let next = searchParams.get('next') ?? '/';

    // Security: Validate "next" to prevent Open Redirect
    if (!next.startsWith('/') || next.startsWith('//')) {
        next = '/';
    }

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${baseUrl}${next}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`);
}
