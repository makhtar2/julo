import { updateSession } from '@/lib/supabase/proxy';
import { NextResponse } from 'next/server';

export async function proxy(request) {
    const { supabase, supabaseResponse, user } = await updateSession(request);

    const pathname = request.nextUrl.pathname;

    // 1. Protect Admin Routes
    if (pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Check role in database
        const { data: userData } = await supabase
            .from('User')
            .select('role')
            .eq('id', user.id)
            .single();

        if (userData?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 2. Redirect logged-in users away from auth pages
    if (user && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Security Headers
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.supabase.co https://res.cloudinary.com https://wa.me;
    font-src 'self' data: https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  `
        .replace(/\s{2,}/g, ' ')
        .trim();

    supabaseResponse.headers.set('Content-Security-Policy', cspHeader);
    supabaseResponse.headers.set('X-Frame-Options', 'DENY');
    supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff');
    supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block');

    return supabaseResponse;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
