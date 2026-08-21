'use client';
import React from 'react';
import PageTitle from '@/components/PageTitle';
import {
    FileTextIcon,
    ScaleIcon,
    GavelIcon,
    TruckIcon,
    RotateCcwIcon,
    ShieldCheckIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white py-16 px-6">
            <div className="max-w-4xl mx-auto">
                <PageTitle
                    heading="Conditions Générales de Vente"
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
                            <div className="size-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                                <FileTextIcon size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 m-0 uppercase tracking-tight">
                                Objet
                            </h2>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            Les présentes Conditions Générales de Vente (CGV) régissent les
                            relations contractuelles entre **Global Air Sénégal** et ses clients.
                            Toute commande passée sur le site **globalairsn.com** implique
                            l&apos;adhésion entière aux présentes conditions.
                        </p>
                    </motion.section>

                    {/* Pricing & Orders */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                            <ScaleIcon className="text-blue-600 mb-4" size={24} />
                            <h3 className="font-black text-slate-900 text-sm mb-4 uppercase tracking-wider">
                                Prix et Paiement
                            </h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                Les prix sont affichés en **FCFA**. Le paiement s&apos;effectue
                                généralement à la livraison (Cash on Delivery) ou via les services
                                de transfert mobile (**Wave, Orange Money**).
                            </p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                            <TruckIcon className="text-blue-600 mb-4" size={24} />
                            <h3 className="font-black text-slate-900 text-sm mb-4 uppercase tracking-wider">
                                Livraison
                            </h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                Les frais de livraison sont fixes à **2 000 FCFA pour Dakar**. Pour
                                les autres régions du Sénégal, les frais sont calculés selon la
                                destination. Le retrait en magasin est gratuit.
                            </p>
                        </div>
                    </div>

                    {/* Warranty & Returns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                            <ShieldCheckIcon className="text-blue-600 mb-4" size={24} />
                            <h3 className="font-black text-slate-900 text-sm mb-4 uppercase tracking-wider">
                                Garantie
                            </h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                Tous nos produits neufs bénéficient d&apos;une garantie constructeur
                                (généralement 6 mois à 1 an). La garantie couvre les défauts de
                                fabrication uniquement.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                            <RotateCcwIcon className="text-blue-600 mb-4" size={24} />
                            <h3 className="font-black text-slate-900 text-sm mb-4 uppercase tracking-wider">
                                Retours
                            </h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                Vous disposez de **7 jours** pour retourner un produit non utilisé
                                dans son emballage d&apos;origine. Les frais de retour sont à la
                                charge du client, sauf erreur de notre part.
                            </p>
                        </div>
                    </div>

                    {/* Disputes */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-900 text-white p-10 rounded-[3rem] border border-slate-800"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-12 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                                <GavelIcon size={24} />
                            </div>
                            <h2 className="text-xl font-black text-white m-0 uppercase tracking-tight">
                                Droit Applicable et Litiges
                            </h2>
                        </div>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Les présentes conditions sont soumises au droit sénégalais. En cas de
                            litige, et à défaut d&apos;accord amiable, le Tribunal de Commerce de
                            Dakar sera seul compétent.
                        </p>
                    </motion.section>
                </div>
            </div>
        </div>
    );
}
