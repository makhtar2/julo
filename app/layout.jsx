import { Outfit } from 'next/font/google';
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

const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600'] });

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#0f172a',
};

export const metadata = {
    manifest: '/manifest.json',
    title: {
        default: 'Julo | Électronique, Smartphones, PC & Sérigraphie/Infographie au Sénégal',
        template: '%s | Julo Sénégal',
    },
    description:
        'Julo : Votre destination pour l’achat de produits électroniques (smartphones, ordinateurs, accessoires) et services de sérigraphie/infographie personnalisés au Sénégal.',
    keywords: [
        'julo',
        'julo sénégal',
        'accessoires téléphone dakar',
        'smartphones sénégal',
        'ordinateurs portables dakar',
        'sérigraphie t-shirt dakar',
        'infographie logo sénégal',
        'personnalisation textile sénégal',
        'vente en ligne sénégal',
    ],
    authors: [{ name: 'Julo' }],
    metadataBase: new URL('https://julo.sn'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Julo - Électronique & Sérigraphie/Infographie au Sénégal',
        description:
            'Achetez vos téléphones, ordinateurs, accessoires et commandez vos impressions sérigraphiques et créations graphiques sur-mesure.',
        url: 'https://julo.sn',
        siteName: 'Julo',
        locale: 'fr_SN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Global Air Sénégal',
        description: "Le meilleur de l'électroménager à Dakar.",
        images: ['/assets/gs_logo.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: '0e83-pwIv5QOCpOeG5zxwJZ1_Y3zn2sXIfya3t4TCk8',
    },
};

export default function RootLayout({ children }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'OnlineStore',
        '@id': 'https://globalairsn.com#organization',
        name: 'Global Air Sénégal',
        url: 'https://globalairsn.com',
        logo: 'https://globalairsn.com/assets/gs_logo.jpg',
        image: 'https://globalairsn.com/assets/gs_logo.jpg',
        description:
            'Vente de climatiseurs, téléviseurs et électroménager premium au Sénégal.',
        brand: {
            '@type': 'Brand',
            name: 'Global Air',
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Avenue Cheikh Anta Diop',
            addressLocality: 'Dakar',
            addressCountry: 'SN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '14.6937',
            longitude: '-17.4441',
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '19:00',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+221-77-783-27-98',
            contactType: 'customer service',
            areaServed: 'SN',
            availableLanguage: 'French',
        },
        sameAs: [
            'https://www.facebook.com/GlobalAIRSenegal/',
            'https://www.instagram.com/globalairsn',
            'https://wa.me/221777832798',
        ],
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://globalairsn.com/shop?search={search_term_string}',
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <html lang="fr">
            <head>
                <link rel="preconnect" href="https://res.cloudinary.com" />
                <link rel="dns-prefetch" href="https://res.cloudinary.com" />
                <link rel="dns-prefetch" href="https://mpgjgsojeezqiovtkepz.supabase.co" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className={`${outfit.className} antialiased overflow-x-hidden pb-24 sm:pb-0`}>
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
