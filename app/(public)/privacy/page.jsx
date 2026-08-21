'use client';
import React from 'react';
import PageTitle from '@/components/PageTitle';
import { ShieldCheckIcon, LockIcon, EyeIcon, DatabaseIcon, UserCheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white py-16 px-6">
            <div className="max-w-4xl mx-auto">
                <PageTitle
                    heading="Politique de Confidentialité"
                    text="Dernière mise à jour : Mai 2026"
                />

                <div className="mt-16 space-y-16">
                    {/* Intro */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="prose prose-slate max-w-none"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <ShieldCheckIcon size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 m-0 uppercase tracking-tight">
                                Engagement de Confidentialité
                            </h2>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            Chez Global Air Sénégal, la protection de vos données personnelles est
                            au cœur de notre relation de confiance. Conformément à la loi n° 2008-12
                            du 25 janvier 2008 portant sur la Protection des Données à Caractère
                            Personnel au Sénégal, nous nous engageons à assurer le plus haut niveau
                            de protection de vos données.
                        </p>
                    </motion.section>

                    {/* Collection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                            <DatabaseIcon className="text-blue-600 mb-4" size={24} />
                            <h3 className="font-black text-slate-900 text-sm mb-4 uppercase tracking-wider">
                                Données Collectées
                            </h3>
                            <ul className="text-slate-500 text-sm font-medium space-y-2 list-disc pl-4">
                                <li>Nom et Prénom</li>
                                <li>Numéro de téléphone (pour livraison et WhatsApp)</li>
                                <li>Adresse de livraison au Sénégal</li>
                                <li>Historique des commandes</li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                            <UserCheckIcon className="text-blue-600 mb-4" size={24} />
                            <h3 className="font-black text-slate-900 text-sm mb-4 uppercase tracking-wider">
                                Utilisation
                            </h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                Vos données servent exclusivement au traitement de vos commandes, à
                                la gestion du SAV via WhatsApp, et à l&apos;amélioration de nos
                                services. Nous ne revendons jamais vos données.
                            </p>
                        </div>
                    </div>

                    {/* Rights */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                                <EyeIcon size={24} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 m-0 uppercase tracking-tight">
                                Vos Droits (CDP Sénégal)
                            </h2>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed mb-6">
                            Vous disposez d&apos;un droit d&apos;accès, de rectification,
                            d&apos;opposition et de suppression des informations vous concernant.
                            Pour exercer ces droits, vous pouvez nous contacter directement.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
                                Droit d&apos;Accès
                            </div>
                            <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
                                Rectification
                            </div>
                            <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
                                Suppression
                            </div>
                        </div>
                    </motion.section>

                    {/* Footer / Contact */}
                    <div className="bg-slate-900 text-white p-12 rounded-[3rem] text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 size-64 bg-blue-600/10 rounded-full blur-3xl" />
                        <h3 className="text-2xl font-black mb-6 relative z-10">
                            Une question sur vos données ?
                        </h3>
                        <p className="text-slate-400 font-medium mb-8 max-w-lg mx-auto relative z-10">
                            Notre équipe est disponible pour répondre à vos préoccupations
                            concernant la confidentialité.
                        </p>
                        <a
                            href="mailto:privacy@globalairsn.com"
                            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all relative z-10"
                        >
                            privacy@globalairsn.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
