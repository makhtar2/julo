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
                    <div className="bg-[#1C1B1F] text-white p-5 rounded-3xl shadow-2xl border border-[#33302A] backdrop-blur-xl relative overflow-hidden group">
                        {/* Background Decoration */}
                        <div className="absolute -top-10 -right-10 size-32 bg-[#C59A63]/20 rounded-full blur-3xl group-hover:bg-[#C59A63]/30 transition-all duration-700" />

                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 p-1 text-zinc-400 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-start gap-4">
                            <div className="size-12 bg-[#C59A63] rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                                <Smartphone size={24} className="text-white" />
                            </div>
                            <div className="flex-1 pr-4">
                                <h3 className="font-bold text-sm uppercase tracking-wider mb-1">
                                    Installer l&apos;Application
                                </h3>
                                <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                                    Accédez à JULO en un clic depuis votre écran d&apos;accueil.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleInstall}
                            className="w-full mt-4 bg-white text-[#1C1B1F] py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#C59A63] hover:text-white transition-all active:scale-95"
                        >
                            <Download size={14} />
                            Ajouter à l&apos;écran d&apos;accueil
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PWAInstallPrompt;
