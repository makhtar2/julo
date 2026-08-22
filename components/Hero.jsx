'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Smartphone,
    Laptop,
    Headphones,
    Sparkles,
    Palette,
    Shirt,
    ArrowRight,
    ShieldCheck,
    Truck,
    MessageCircle,
} from 'lucide-react';
import CategoriesMarquee from './CategoriesMarquee';

const Hero = ({ initialCategories = [] }) => {
    const [activeTab, setActiveTab] = useState('store'); // 'store' | 'prod'

    const storeCategories = [
        {
            name: 'Accessoires Téléphone',
            icon: Headphones,
            count: 'Étuis, Câbles, Magsafe',
            href: '/shop?category=accessoires',
        },
        {
            name: 'Smartphones & Mobiles',
            icon: Smartphone,
            count: 'iPhone, Samsung, Xiaomi',
            href: '/shop?category=telephones',
        },
        {
            name: 'Ordinateurs & PC',
            icon: Laptop,
            count: 'MacBook, Dell, HP, ThinkPad',
            href: '/shop?category=ordinateurs',
        },
    ];

    const prodServices = [
        {
            name: 'Sérigraphie Textile',
            icon: Shirt,
            desc: 'T-shirts, Polos, Hoodies, Casquettes',
            badge: 'Atelier Local',
        },
        {
            name: 'Branding & Goodies',
            icon: Palette,
            desc: 'Tote bags, Sacs, Bannières, Mugs',
            badge: 'Sur-mesure',
        },
        {
            name: 'Packs Entreprises',
            icon: Sparkles,
            desc: 'Identités visuelles, packaging pro',
            badge: 'Devis Rapide',
        },
    ];

    const handleWhatsAppQuote = () => {
        const message =
            'Bonjour JULO.PROD, je souhaite obtenir un devis pour des travaux de sérigraphie / personnalisation.';
        window.open(`https://wa.me/221754469097?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl mx-auto">
            {/* Top Brand Banner & Universe Switcher */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-4">
                        <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                        Dakar • Touba • Expédition Partout au Sénégal
                    </div>
                    <h1 className="font-blanka text-4xl sm:text-6xl lg:text-7xl text-zinc-950 tracking-wider uppercase leading-tight">
                        JU<span className="text-amber-500">LO</span>.
                    </h1>
                    <p className="mt-2 text-zinc-600 text-sm sm:text-base font-medium max-w-xl">
                        L&apos;écosystème unifié :{' '}
                        <strong className="text-zinc-900">Équipements High-Tech</strong> &amp;{' '}
                        <strong className="text-zinc-900">Atelier de Sérigraphie / Branding</strong>
                        .
                    </p>
                </div>

                {/* Switcher Tab */}
                <div className="flex items-center p-1.5 bg-zinc-100 rounded-2xl border border-zinc-200 self-start md:self-auto">
                    <button
                        onClick={() => setActiveTab('store')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                            activeTab === 'store'
                                ? 'bg-zinc-950 text-white font-blanka shadow-md tracking-wider'
                                : 'text-zinc-600 hover:text-zinc-950 font-bold'
                        }`}
                    >
                        <Smartphone
                            size={15}
                            className={activeTab === 'store' ? 'text-amber-400' : ''}
                        />
                        <span>julo.store</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('prod')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                            activeTab === 'prod'
                                ? 'bg-amber-500 text-zinc-950 font-blanka shadow-md tracking-wider'
                                : 'text-zinc-600 hover:text-zinc-950 font-bold'
                        }`}
                    >
                        <Shirt size={15} className={activeTab === 'prod' ? 'text-zinc-950' : ''} />
                        <span>julo.prod</span>
                    </button>
                </div>
            </div>

            {/* Dynamic Interactive Hero Display */}
            <div className="mt-8">
                <AnimatePresence mode="wait">
                    {activeTab === 'store' ? (
                        <motion.div
                            key="store-hero"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                        >
                            {/* Main Store Banner */}
                            <div className="lg:col-span-8 rounded-[2.5rem] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white p-8 sm:p-12 relative overflow-hidden border border-zinc-800 shadow-2xl flex flex-col justify-between min-h-[420px]">
                                {/* Decorative Minimalist Pattern */}
                                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute -bottom-10 -right-10 font-blanka text-[140px] text-zinc-800/20 select-none pointer-events-none leading-none">
                                    GEAR
                                </div>

                                <div className="relative z-10">
                                    <span className="font-blanka text-xs text-amber-400 tracking-widest uppercase px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 inline-block mb-4">
                                        julo.store
                                    </span>
                                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-lg leading-tight">
                                        Smartphones, PC &amp; Accessoires haute performance.
                                    </h2>
                                    <p className="mt-4 text-zinc-400 text-sm sm:text-base max-w-md">
                                        Sélection rigoureuse des meilleurs équipements neufs et
                                        certifiés avec livraison express au Sénégal.
                                    </p>
                                </div>

                                <div className="relative z-10 mt-8 flex flex-wrap items-center gap-4">
                                    <Link
                                        href="/shop"
                                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider px-6 py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/20"
                                    >
                                        <span>Explorer la Boutique</span>
                                        <ArrowRight size={16} />
                                    </Link>
                                    <div className="flex items-center gap-4 text-xs font-bold text-zinc-300">
                                        <span className="flex items-center gap-1.5">
                                            <ShieldCheck size={16} className="text-amber-400" />{' '}
                                            Garantie 100%
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Truck size={16} className="text-amber-400" />{' '}
                                            Expédition 24h
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Store Quick Categories Side Cards */}
                            <div className="lg:col-span-4 flex flex-col gap-4">
                                {storeCategories.map((cat, idx) => (
                                    <Link
                                        key={idx}
                                        href={cat.href}
                                        className="flex-1 rounded-[2rem] bg-zinc-50 hover:bg-zinc-100 p-6 border border-zinc-200/80 transition-all group flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 group-hover:scale-105 group-hover:bg-zinc-950 group-hover:text-white transition-all shadow-sm">
                                                <cat.icon size={22} />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-sm text-zinc-900 group-hover:text-amber-600 transition-colors">
                                                    {cat.name}
                                                </h3>
                                                <p className="text-[11px] font-medium text-zinc-500 mt-0.5">
                                                    {cat.count}
                                                </p>
                                            </div>
                                        </div>
                                        <ArrowRight
                                            size={16}
                                            className="text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="prod-hero"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                        >
                            {/* Main Studio Banner */}
                            <div className="lg:col-span-8 rounded-[2.5rem] bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-zinc-950 p-8 sm:p-12 relative overflow-hidden border border-amber-400 shadow-2xl flex flex-col justify-between min-h-[420px]">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute -bottom-10 -right-10 font-blanka text-[140px] text-zinc-950/10 select-none pointer-events-none leading-none">
                                    PROD
                                </div>

                                <div className="relative z-10">
                                    <span className="font-blanka text-xs text-zinc-950 tracking-widest uppercase px-3 py-1 rounded-full bg-zinc-950/10 border border-zinc-950/20 inline-block mb-4">
                                        julo.prod
                                    </span>
                                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 max-w-lg leading-tight">
                                        Atelier de Sérigraphie &amp; Personnalisation Textile.
                                    </h2>
                                    <p className="mt-4 text-zinc-900 font-semibold text-sm sm:text-base max-w-md">
                                        Donnez vie à vos designs sur t-shirts, polos, casquettes,
                                        sacs et bannières avec une qualité d&apos;impression
                                        artisanale et professionnelle.
                                    </p>
                                </div>

                                <div className="relative z-10 mt-8 flex flex-wrap items-center gap-4">
                                    <button
                                        onClick={handleWhatsAppQuote}
                                        className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider px-6 py-4 rounded-2xl transition-all shadow-xl"
                                    >
                                        <MessageCircle size={16} className="text-amber-400" />
                                        <span>Demander un Devis WhatsApp</span>
                                    </button>
                                    <a
                                        href="#studio"
                                        className="inline-flex items-center gap-2 bg-white/30 hover:bg-white/50 text-zinc-950 font-bold text-xs uppercase tracking-wider px-5 py-4 rounded-2xl transition-all backdrop-blur-sm"
                                    >
                                        <span>Découvrir l&apos;Atelier</span>
                                    </a>
                                </div>
                            </div>

                            {/* Prod Quick Services Side Cards */}
                            <div className="lg:col-span-4 flex flex-col gap-4">
                                {prodServices.map((srv, idx) => (
                                    <div
                                        key={idx}
                                        className="flex-1 rounded-[2rem] bg-zinc-50 hover:bg-zinc-100 p-6 border border-zinc-200/80 transition-all group flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-all shadow-sm">
                                                <srv.icon size={22} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-black text-sm text-zinc-900">
                                                        {srv.name}
                                                    </h3>
                                                    <span className="text-[9px] font-black uppercase tracking-wider bg-zinc-200 text-zinc-800 px-1.5 py-0.5 rounded">
                                                        {srv.badge}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] font-medium text-zinc-500 mt-0.5">
                                                    {srv.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Sub-Category Marquee */}
            {initialCategories.length > 0 && (
                <div className="mt-8">
                    <CategoriesMarquee categories={initialCategories} />
                </div>
            )}
        </div>
    );
};

export default Hero;
