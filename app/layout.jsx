import { Plus_Jakarta_Sans, Caveat } from 'next/font/google';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import WhatsAppButton from '@/components/WhatsAppButton';
import BottomNav from '@/components/BottomNav';
import Analytics from '@/components/Analytics';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import CacheBuster from '@/components/CacheBuster';
import ScrollToTop from '@/components/ScrollToTop';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
});

const scriptFont = Caveat({
    subsets: ['latin'],
    weight: ['500', '600', '700'],
    variable: '--font-script',
    display: 'swap',
});

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#FAF8F5',
};

export const metadata = {
    manifest: '/manifest.json',
    title: {
        default: 'Julo | Boutique High-Tech, Smartphones & Ordinateurs au Sénégal',
        template: '%s | Julo Sénégal',
    },
    description:
        'Julo : Votre boutique en ligne de référence pour l’achat de smartphones, ordinateurs et accessoires high-tech 100% originaux avec garantie au Sénégal.',
    keywords: [
        'julo',
        'julo sénégal',
        'smartphones dakar',
        'ordinateurs dakar',
        'accessoires tech dakar',
        'boutique tech sénégal',
        'iphone dakar',
        'samsung dakar',
    ],
    authors: [{ name: 'Julo' }],
    metadataBase: new URL('https://julo.sn'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'fr_SN',
        url: 'https://julo.sn',
        siteName: 'JULO Sénégal',
        title: 'JULO — L’Excellence High-Tech au Sénégal',
        description:
            'Smartphones, Ordinateurs & Accessoires Certifiés 100% Originaux avec Garantie et Livraison Express 24h au Sénégal.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'JULO Sénégal — Boutique High-Tech Officielle',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'JULO — L’Excellence High-Tech au Sénégal',
        description:
            'Smartphones, Ordinateurs & Accessoires Certifiés 100% Originaux avec Garantie et Livraison Express 24h au Sénégal.',
        images: ['/og-image.jpg'],
    },
};

export default function RootLayout({ children }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'OnlineStore',
        name: 'Julo',
        url: 'https://julo.sn',
        logo: 'https://julo.sn/assets/julo_logo_transparent.png',
        image: 'https://julo.sn/assets/julo_logo_transparent.png',
        description:
            'Boutique en ligne officielle de vente de smartphones, ordinateurs et accessoires high-tech au Sénégal.',
        brand: {
            '@type': 'Brand',
            name: 'Julo',
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Dakar',
            addressLocality: 'Dakar',
            addressCountry: 'SN',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+221-75-446-90-97',
            contactType: 'customer service',
            areaServed: 'SN',
            availableLanguage: 'French',
        },
        sameAs: ['https://wa.me/221754469097'],
    };

    return (
        <html lang="fr" className={`${scriptFont.variable}`}>
            <head>
                <link rel="preconnect" href="https://res.cloudinary.com" />
                <link rel="dns-prefetch" href="https://res.cloudinary.com" />
                <link rel="dns-prefetch" href="https://mpgjgsojeezqiovtkepz.supabase.co" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body
                className={`${jakarta.className} antialiased bg-[#FAF8F5] text-[#1C1B1F] overflow-x-hidden pb-24 sm:pb-0`}
            >
                <CacheBuster />
                <ScrollToTop />
                <Toaster />
                <Suspense fallback={null}>
                    <Analytics />
                </Suspense>
                {children}
                <VercelAnalytics />
                <PWAInstallPrompt />
                <WhatsAppButton />
                <BottomNav />
            </body>
        </html>
    );
}
