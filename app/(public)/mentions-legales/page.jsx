'use client';
import React from 'react';
import PageTitle from '@/components/PageTitle';
import { InfoIcon, MapPinIcon, GlobeIcon, ServerIcon, UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MentionsLegalesPage() {
    return (
        <div className="min-h-screen bg-white py-16 px-6">
            <div className="max-w-4xl mx-auto">
                <PageTitle
                    heading="Mentions Légales"
                    text="Informations légales obligatoires concernant Global Air Sénégal"
                />

                <div className="mt-16 space-y-12">
                    {/* Éditeur du site */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="prose prose-slate max-w-none"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <UserIcon size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 m-0 uppercase tracking-tight">
                                Éditeur du site
                            </h2>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                            <p className="text-slate-700 font-bold mb-2">Global Air Sénégal</p>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed">
                                Représentée par : Saliou Niang
                                <br />
                                Siège social : Avenue Cheikh Anta Diop, Dakar, Sénégal
                                <br />
                                Email : contact@globalairsn.com
                                <br />
                                Téléphone : +221 77 783 27 98
                            </p>
                        </div>
                    </motion.section>

                    {/* Hébergement */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="prose prose-slate max-w-none"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                                <ServerIcon size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 m-0 uppercase tracking-tight">
                                Hébergement
                            </h2>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                            <p className="text-slate-700 font-bold mb-2">Vercel Inc.</p>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed">
                                440 N Barranca Ave #4133
                                <br />
                                Covina, CA 91723
                                <br />
                                États-Unis
                                <br />
                                Site web : https://vercel.com
                            </p>
                        </div>
                    </motion.section>

                    {/* Propriété Intellectuelle */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="prose prose-slate max-w-none"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
                                <GlobeIcon size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 m-0 uppercase tracking-tight">
                                Propriété Intellectuelle
                            </h2>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            L&apos;ensemble de ce site relève de la législation internationale sur
                            le droit d&apos;auteur et la propriété intellectuelle. Tous les droits
                            de reproduction sont réservés, y compris pour les documents
                            téléchargeables et les représentations iconographiques et
                            photographiques. La reproduction de tout ou partie de ce site sur un
                            support électronique quel qu&apos;il soit est formellement interdite
                            sauf autorisation expresse du directeur de la publication.
                        </p>
                    </motion.section>
                </div>
            </div>
        </div>
    );
}
