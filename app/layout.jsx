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
        default: 'Julo | Smartphones, Ordinateurs & Sérigraphie au Sénégal',
        template: '%s | Julo Sénégal',
    },
    description:
        'Julo : Votre destination de référence pour l’achat de smartphones, ordinateurs et accessoires de qualité ainsi que vos impressions sérigraphiques au Sénégal.',
    keywords: [
        'julo',
        'julo sénégal',
        'smartphones dakar',
        'ordinateurs dakar',
        'accessoires tech dakar',
        'sérigraphie textile sénégal',
        'personnalisation t-shirt dakar',
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
        siteName: 'Julo',
        title: 'Julo | Smartphones, Ordinateurs & Sérigraphie au Sénégal',
        description:
            'Achetez vos équipements high-tech certifiés et commandez vos impressions textiles sur-mesure chez Julo au Sénégal.',
        images: [
            {
                url: '/assets/julo_logo_transparent.png',
                width: 1200,
                height: 630,
                alt: 'Julo - Tech & Sérigraphie au Sénégal',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Julo | Tech & Sérigraphie au Sénégal',
        description: 'Vente de smartphones, ordinateurs, accessoires et sérigraphie au Sénégal.',
        images: ['/assets/julo_logo_transparent.png'],
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
            'Vente de smartphones, ordinateurs, accessoires et services de sérigraphie au Sénégal.',
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
