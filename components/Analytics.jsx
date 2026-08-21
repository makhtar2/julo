'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import Script from 'next/script';

export default function Analytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

    console.log('Pixel ID loaded:', PIXEL_ID);

    useEffect(() => {
        if (typeof window !== 'undefined' && POSTHOG_KEY) {
            posthog.init(POSTHOG_KEY, {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com',
                capture_pageview: false,
            });
        }
    }, [POSTHOG_KEY]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let url = window.origin + pathname;
        if (searchParams.toString()) {
            url = url + `?${searchParams.toString()}`;
        }

        // PostHog PageView
        if (POSTHOG_KEY) {
            posthog.capture('$pageview', { $current_url: url });
        }

        // Facebook PageView
        if (window.fbq) {
            window.fbq('track', 'PageView');
        }

        // Google Analytics PageView
        if (typeof window.gtag === 'function' && GA_ID) {
            window.gtag('event', 'page_view', {
                page_path: url,
            });
        }
    }, [pathname, searchParams, POSTHOG_KEY, GA_ID]);

    return (
        <>
            {PIXEL_ID && (
                <Script
                    id="fb-pixel"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${PIXEL_ID}');
                fbq('track', 'PageView');
              `,
                    }}
                />
            )}

            {/* Google Analytics & Ads */}
            {GA_ID && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                        strategy="afterInteractive"
                    />
                    <Script
                        id="google-analytics"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${GA_ID}', {
                                    page_path: window.location.pathname,
                                });
                            `,
                        }}
                    />
                </>
            )}
        </>
    );
}

// Utility to track events across all providers
export const trackEvent = (eventName, properties = {}) => {
    if (typeof window === 'undefined') return;

    // 1. PostHog
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.capture(eventName, properties);
    }

    // 2. Facebook Pixel mapping
    if (window.fbq) {
        switch (eventName) {
            case 'add_to_cart':
                window.fbq('track', 'AddToCart', {
                    content_ids: [properties.product_id],
                    content_name: properties.product_name,
                    value: properties.price,
                    currency: 'XOF',
                });
                break;
            case 'purchase':
                window.fbq('track', 'Purchase', {
                    value: properties.total,
                    currency: 'XOF',
                    content_ids: properties.items?.map((i) => i.id),
                });
                break;
            case 'view_product':
                window.fbq('track', 'ViewContent', {
                    content_ids: [properties.product_id],
                    content_name: properties.product_name,
                    content_category: properties.category,
                    value: properties.price,
                    currency: 'XOF',
                });
                break;
            default:
                window.fbq('trackCustom', eventName, properties);
                break;
        }
    }

    // 3. Google Analytics & Ads mapping
    if (typeof window.gtag === 'function') {
        const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
        const AW_CONVERSION_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;

        switch (eventName) {
            case 'add_to_cart':
                window.gtag('event', 'add_to_cart', {
                    currency: 'XOF',
                    value: properties.price,
                    items: [
                        {
                            item_id: properties.product_id,
                            item_name: properties.product_name,
                            price: properties.price,
                            quantity: 1
                        }
                    ]
                });
                break;
            case 'purchase':
                window.gtag('event', 'purchase', {
                    transaction_id: properties.transaction_id || `TR_${Date.now()}`,
                    value: properties.total,
                    currency: 'XOF',
                    items: properties.items?.map((i) => ({
                        item_id: i.id,
                        price: i.price,
                        quantity: i.quantity
                    })),
                    // Si on a un conversion label spécifique fourni
                    ...(AW_CONVERSION_ID ? { send_to: AW_CONVERSION_ID } : {})
                });
                break;
            case 'view_product':
                window.gtag('event', 'view_item', {
                    currency: 'XOF',
                    value: properties.price,
                    items: [
                        {
                            item_id: properties.product_id,
                            item_name: properties.product_name,
                            item_category: properties.category,
                            price: properties.price,
                        }
                    ]
                });
                break;
            default:
                window.gtag('event', eventName, properties);
                break;
        }
    }
};
