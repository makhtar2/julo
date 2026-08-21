'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, X, Download } from 'lucide-react';

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Empêche le navigateur d'afficher l'invite par défaut
            e.preventDefault();
            // Stocke l'événement pour l'utiliser plus tard
            setDeferredPrompt(e);

            // On attend 5 secondes avant de montrer notre propre bannière (moins intrusif)
            const timer = setTimeout(() => {
                // Vérifier si l'utilisateur n'a pas déjà fermé la bannière dans cette session
                const isClosed = sessionStorage.getItem('pwa_prompt_closed');
                if (!isClosed) {
                    setIsVisible(true);
                }
            }, 5000);

            return () => clearTimeout(timer);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Montre l'invite native
        deferredPrompt.prompt();

        // Attend le choix de l'utilisateur
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the PWA install');
        }

        // On nettoie
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleClose = () => {
        setIsVisible(false);
        // On ne montre plus la bannière pour cette session
        sessionStorage.setItem('pwa_prompt_closed', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-24 left-4 right-4 z-[90] sm:left-auto sm:right-6 sm:w-80"
                >
                    <div className="bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl border border-white/10 backdrop-blur-xl bg-slate-900/95 relative overflow-hidden group">
                        {/* Background Decoration */}
                        <div className="absolute -top-10 -right-10 size-32 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-all duration-700" />

                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-start gap-4">
                            <div className="size-12 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
                                <Smartphone size={24} className="text-white" />
                            </div>
                            <div className="flex-1 pr-4">
                                <h3 className="font-black text-sm uppercase tracking-tight mb-1">
                                    Installer l&apos;App
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                                    Accédez à Global Air en un clic depuis votre écran
                                    d&apos;accueil.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleInstall}
                            className="w-full mt-4 bg-white text-slate-900 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 hover:text-white transition-all active:scale-95"
                        >
                            <Download size={14} />
                            Ajouter maintenant
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PWAInstallPrompt;
