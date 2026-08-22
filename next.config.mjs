import './lib/env.js';
import withBundleAnalyzer from '@next/bundle-analyzer';
import withPWAInit from '@ducanh2912/next-pwa';

const bundleAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const withPWA = withPWAInit({
    dest: 'public',
    disable: true, // Disable SW caching in App Router to avoid stale chunk errors on refresh
    register: false,
    skipWaiting: true,
});

// Autorise uniquement les origines tierces réellement utilisées par le site
// (PostHog, GTM, Facebook Pixel, Vercel Analytics, Supabase, Cloudinary).
// script-src/style-src gardent 'unsafe-inline' : les snippets GTM/Pixel sont
// injectés en inline (pas de nonce en place) et Framer Motion écrit des
// styles inline sur les éléments animés — les retirer casserait ces deux
// choses sans une passe de tests visuels complète.
const contentSecurityPolicy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.unsplash.com https://plus.unsplash.com https://res.cloudinary.com https://*.supabase.co https://www.facebook.com https://www.googletagmanager.com",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://eu.posthog.com https://www.google-analytics.com https://www.facebook.com https://connect.facebook.net https://vitals.vercel-insights.com https://va.vercel-scripts.com",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
    { key: 'X-DNS-Prefetch-Control', value: 'on' },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-XSS-Protection', value: '1; mode=block' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
    { key: 'Content-Security-Policy', value: contentSecurityPolicy },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), payment=(), usb=(), geolocation=(self)',
    },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    compress: true,
    turbopack: {},
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
            {
                source: '/(.*).html',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                ],
            },
            {
                source: '/sw.js',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    },
                    { key: 'Content-Type', value: 'application/javascript' },
                    { key: 'Service-Worker-Allowed', value: '/' },
                ],
            },
            {
                source: '/manifest.json',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'plus.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.supabase.co',
                port: '',
                pathname: '/**',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    allowedDevOrigins: ['192.168.1.133', '192.168.2.104', 'localhost:3000'],
    experimental: {
        optimizePackageImports: ['lucide-react', 'framer-motion'],
        serverActions: {
            // Les images produit admin sont acceptées jusqu'à 5 Mo (voir uploadProductImage) ;
            // la limite par défaut des Server Actions est 1 Mo et fait échouer l'upload
            // avec l'erreur générique "unexpected response was received from the server".
            bodySizeLimit: '8mb',
        },
    },
};

export default bundleAnalyzer(withPWA(nextConfig));
