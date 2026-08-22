'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Smartphone,
    Laptop,
    Headphones,
    Palette,
    ArrowRight,
    ShieldCheck,
    Truck,
    MessageCircle,
} from 'lucide-react';
import CategoriesMarquee from './CategoriesMarquee';
import { assets } from '@/assets/assets';

const Hero = ({ initialCategories = [] }) => {
    const categories = [
        { name: 'Smartphones & Téléphones', icon: Smartphone, href: '/shop?category=telephones' },
        { name: 'Ordinateurs & PC', icon: Laptop, href: '/shop?category=ordinateurs' },
        { name: 'Accessoires High-Tech', icon: Headphones, href: '/shop?category=accessoires' },
        { name: 'Sérigraphie & Goodies', icon: Palette, href: '/shop?category=serigraphie' },
    ];

    const handleWhatsAppOrder = () => {
        const message =
            'Bonjour JULO, je souhaite commander un produit ou avoir des renseignements.';
        window.open(`https://wa.me/221754469097?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
            {/* Main Hero Card */}
            <div className="rounded-[2.5rem] bg-zinc-950 text-white p-8 sm:p-14 lg:p-16 border border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
                {/* Subtle Ambient Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-300 mb-6">
                        <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                        Livraison Express à Dakar, Thiès, Touba & Partout au Sénégal
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                        Smartphones, Ordinateurs &amp; Accessoires de Qualité.
                    </h1>

                    <p className="mt-5 text-zinc-400 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
                        Votre boutique de référence au Sénégal pour des équipements neufs garantis
                        et vos impressions sérigraphiques sur-mesure.
                    </p>
                </div>

                {/* Actions & Value Props */}
                <div className="relative z-10 mt-10 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
                        >
                            <span>Voir la Boutique</span>
                            <ArrowRight size={15} />
                        </Link>
                        <button
                            onClick={handleWhatsAppOrder}
                            className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl border border-zinc-700 transition-all active:scale-95"
                        >
                            <MessageCircle size={15} className="text-amber-400" />
                            <span>Commander sur WhatsApp</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-5 text-xs font-semibold text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck size={16} className="text-amber-400" /> 100% Neuf &amp;
                            Garanti
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Truck size={16} className="text-amber-400" /> Expédition 24h
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Categories Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {categories.map((cat, idx) => (
                    <Link
                        key={idx}
                        href={cat.href}
                        className="rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 p-4 transition-all duration-200 flex items-center gap-3 group"
                    >
                        <div className="size-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 group-hover:scale-105 group-hover:bg-zinc-950 group-hover:text-white transition-all shadow-sm shrink-0">
                            <cat.icon size={18} />
                        </div>
                        <span className="font-bold text-xs text-zinc-900 group-hover:text-amber-600 transition-colors">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Marquee Categories */}
            {initialCategories.length > 0 && (
                <div className="mt-8">
                    <CategoriesMarquee categories={initialCategories} />
                </div>
            )}
        </div>
    );
};

export default Hero;
