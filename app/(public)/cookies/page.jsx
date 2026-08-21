'use client';
import React from 'react';
import PageTitle from '@/components/PageTitle';
import { CookieIcon, InfoIcon, SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-white py-16 px-6">
            <div className="max-w-4xl mx-auto">
                <PageTitle heading="Gestion des Cookies" text="Dernière mise à jour : Mai 2026" />

                <div className="mt-16 space-y-12">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="prose prose-slate max-w-none"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center">
                                <CookieIcon size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 m-0 uppercase tracking-tight">
                                Pourquoi des cookies ?
                            </h2>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            Nous utilisons des cookies pour améliorer votre navigation, mémoriser
                            votre panier et comprendre comment vous utilisez notre boutique. Cela
                            nous permet de vous proposer un service toujours plus performant et
                            personnalisé.
                        </p>
                    </motion.section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                            <InfoIcon className="text-yellow-600 mb-4" size={24} />
                            <h3 className="font-black text-slate-900 text-sm mb-4 uppercase tracking-wider">
                                Essentiels
                            </h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                Ces cookies sont indispensables au fonctionnement du site (session,
                                panier, sécurité). Ils ne peuvent pas être désactivés.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                            <SettingsIcon className="text-yellow-600 mb-4" size={24} />
                            <h3 className="font-black text-slate-900 text-sm mb-4 uppercase tracking-wider">
                                Analyse
                            </h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                Ils nous aident à mesurer l&apos;audience et à identifier les
                                produits qui vous intéressent le plus.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
