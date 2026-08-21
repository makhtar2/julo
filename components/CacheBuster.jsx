'use client';
import { useEffect } from 'react';

// ─── Version de l'application ──────────────────────────────────────────────
// ⚠️ À incrémenter à chaque déploiement pour forcer le nettoyage du cache SW
const APP_VERSION = '1.0.5';

export default function CacheBuster() {
    useEffect(() => {
        // ── 1. Nettoyer le SW à chaque chargement (mode proactif) ──────────
        const clearSWCache = async () => {
            try {
                // Supprimer TOUTES les caches (Workbox, next-static, etc.)
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    await Promise.all(cacheNames.map((name) => caches.delete(name)));
                }
            } catch (e) {
                // silencieux
            }
        };

        // ── 2. Détection de version et reset complet ────────────────────────
        const lastVersion = localStorage.getItem('ks_app_version');
        const isNewVersion = lastVersion && lastVersion !== APP_VERSION;
        const urlParams = new URLSearchParams(window.location.search);
        const forceClear = urlParams.get('clearCache') === 'true';

        if (isNewVersion || forceClear) {
            console.log('[CacheBuster] Nouvelle version détectée. Nettoyage en cours…');

            localStorage.clear();
            sessionStorage.clear();
            localStorage.setItem('ks_app_version', APP_VERSION);

            // Désinscrire le Service Worker pour forcer une réinstallation propre
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then((regs) => {
                    Promise.all(regs.map((r) => r.unregister())).then(() => {
                        clearSWCache().then(() => {
                            const cleanUrl = forceClear
                                ? window.location.origin + window.location.pathname
                                : window.location.href;
                            setTimeout(() => window.location.replace(cleanUrl), 300);
                        });
                    });
                });
            } else {
                clearSWCache().then(() => setTimeout(() => window.location.reload(), 300));
            }
            return;
        }

        // Enregistrer la version actuelle si pas encore fait
        localStorage.setItem('ks_app_version', APP_VERSION);

        // ── 3. Gérer les erreurs de chunks (déploiement interrompu) ────────
        const reloadCount = parseInt(sessionStorage.getItem('ks_reload_count') || '0');

        const handleChunkError = (error) => {
            const msg = error?.message || error?.reason?.message || '';
            const src = error?.target?.src || '';
            const isChunkError =
                msg.includes('Loading chunk') ||
                msg.includes('ChunkLoadError') ||
                msg.includes('Failed to fetch') ||
                src.includes('/_next/static/chunks/');

            if (isChunkError && reloadCount < 2) {
                console.warn('[CacheBuster] Chunk introuvable — rechargement…');
                sessionStorage.setItem('ks_reload_count', (reloadCount + 1).toString());
                clearSWCache().then(() => window.location.reload());
            }
        };

        window.addEventListener('error', handleChunkError, true);
        window.addEventListener('unhandledrejection', (e) => handleChunkError(e.reason));

        // Réinitialiser le compteur de rechargements après succès
        if (reloadCount > 0) {
            sessionStorage.setItem('ks_reload_count', '0');
        }

        // ── 4. Détection de page blanche (hydration échouée) ───────────────
        const hydrationTimer = setTimeout(() => {
            const isBlankPage =
                document.body.innerHTML.length < 300 &&
                !window.location.pathname.startsWith('/admin');

            if (isBlankPage) {
                console.error('[CacheBuster] Page blanche détectée — rechargement forcé…');
                clearSWCache().then(() => window.location.reload());
            }
        }, 2500);

        return () => {
            window.removeEventListener('error', handleChunkError, true);
            clearTimeout(hydrationTimer);
        };
    }, []);

    return null;
}
