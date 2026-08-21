'use client';
import React from 'react';
import Link from 'next/link';
import { MoveLeftIcon, ClockIcon, HammerIcon, RocketIcon, BellIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComingSoon() {
    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 relative overflow-hidden bg-white">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-slate-900 rounded-full blur-[100px]" />
            </div>

            <div className="text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="size-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-100"
                >
                    <ClockIcon size={40} className="animate-pulse" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight"
                >
                    Page en <br />
                    <span className="text-blue-600">Préparation</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto font-medium mt-6 leading-relaxed"
                >
                    Nous peaufinons les derniers détails pour vous offrir une expérience
                    d&apos;achat premium. Cette page sera disponible dans quelques jours !
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
                >
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black hover:bg-black transition-all shadow-2xl shadow-slate-900/20 active:scale-95 group"
                    >
                        <MoveLeftIcon
                            size={20}
                            className="group-hover:-translate-x-2 transition-transform"
                        />
                        RETOUR À L&apos;ACCUEIL
                    </Link>
                    <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 px-10 py-5 rounded-2xl font-black hover:bg-slate-50 transition-all active:scale-95">
                        <BellIcon size={20} />
                        M&apos;AVERTIR
                    </button>
                </motion.div>

                {/* Features List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left max-w-4xl mx-auto"
                >
                    <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                        <HammerIcon className="text-blue-600 mb-4" size={24} />
                        <h3 className="font-black text-slate-900 text-sm mb-2 uppercase tracking-wider">
                            Construction
                        </h3>
                        <p className="text-slate-500 text-xs font-bold leading-relaxed">
                            Design raffiné et interface intuitive en cours de finalisation.
                        </p>
                    </div>
                    <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                        <RocketIcon className="text-blue-600 mb-4" size={24} />
                        <h3 className="font-black text-slate-900 text-sm mb-2 uppercase tracking-wider">
                            Performance
                        </h3>
                        <p className="text-slate-500 text-xs font-bold leading-relaxed">
                            Optimisation maximale pour une rapidité fulgurante sur mobile.
                        </p>
                    </div>
                    <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                        <ClockIcon className="text-blue-600 mb-4" size={24} />
                        <h3 className="font-black text-slate-900 text-sm mb-2 uppercase tracking-wider">
                            Disponibilité
                        </h3>
                        <p className="text-slate-500 text-xs font-bold leading-relaxed">
                            Lancement prévu très prochainement. Restez connectés !
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
