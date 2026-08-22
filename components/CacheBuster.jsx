'use client';
import { useEffect } from 'react';

export default function CacheBuster() {
    useEffect(() => {
        // Silently unregister any old/broken service workers without page reloads
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker
                .getRegistrations()
                .then((registrations) => {
                    for (const registration of registrations) {
                        registration.unregister();
                    }
                })
                .catch(() => {});
        }

        // Silently clean up stale caches
        if (typeof window !== 'undefined' && 'caches' in window) {
            caches
                .keys()
                .then((names) => {
                    for (const name of names) {
                        caches.delete(name);
                    }
                })
                .catch(() => {});
        }

        // Handle chunk load errors gracefully after new deployment
        const handleChunkError = (error) => {
            const msg = error?.message || error?.reason?.message || '';
            const src = error?.target?.src || '';
            const isChunkError =
                msg.includes('Loading chunk') ||
                msg.includes('ChunkLoadError') ||
                msg.includes('Failed to fetch') ||
                src.includes('/_next/static/chunks/');

            if (isChunkError) {
                const reloadCount = parseInt(sessionStorage.getItem('julo_reload_count') || '0');
                if (reloadCount < 1) {
                    sessionStorage.setItem('julo_reload_count', '1');
                    window.location.reload();
                }
            }
        };

        window.addEventListener('error', handleChunkError, true);
        window.addEventListener('unhandledrejection', (e) => handleChunkError(e.reason));

        return () => {
            window.removeEventListener('error', handleChunkError, true);
        };
    }, []);

    return null;
}
