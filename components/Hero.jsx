'use client';
import React from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    Play,
    ShieldCheck,
    RotateCcw,
    Truck,
    Lock,
    Smartphone,
    Laptop,
    Headphones,
    Cable,
    Shirt,
} from 'lucide-react';

const Hero = ({ initialCategories = [] }) => {
    const handleWhatsAppShowcase = () => {
        const msg = 'Bonjour JULO, je souhaite découvrir vos nouveautés et commander.';
        window.open(`https://wa.me/221754469097?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const categoriesList = [
        {
            title: 'iPhone & Apple',
            subtitle: 'Découvrir',
            href: '/shop?category=telephones',
            fallbackIcon: Smartphone,
        },
        {
            title: 'Samsung Galaxy',
            subtitle: 'Découvrir',
            href: '/shop?category=telephones',
            fallbackIcon: Smartphone,
        },
        {
            title: 'Ordinateurs & PC',
            subtitle: 'Découvrir',
            href: '/shop?category=ordinateurs',
            fallbackIcon: Laptop,
        },
        {
            title: 'Audio & Écouteurs',
            subtitle: 'Découvrir',
            href: '/shop?category=accessoires',
            fallbackIcon: Headphones,
        },
        {
            title: 'Accessoires & GaN',
            subtitle: 'Découvrir',
            href: '/shop?category=accessoires',
            fallbackIcon: Cable,
        },
        {
            title: 'Sérigraphie & Textile',
            subtitle: 'Découvrir',
            href: '/shop?category=serigraphie',
            fallbackIcon: Shirt,
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16">
            {/* Top Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[500px]">
                {/* Left Column: Typography & CTAs */}
                <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
                    {/* Small Subtitle Header with fine lines */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#8C8275]">
                            TECHNOLOGIE PREMIUM. STYLE DE VIE.
                        </span>
                        <div className="h-px w-12 bg-[#D6CEBE]" />
                    </div>

                    {/* Headline with golden script signature */}
                    <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black text-[#1C1B1F] tracking-tight leading-[1.08]">
                        Équipez Votre <br className="hidden sm:inline" />
                        Quotidien{' '}
                        <span className="font-script text-[#C59A63] text-5xl sm:text-7xl font-normal italic inline-block ml-1">
                            Tech.
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="mt-5 text-[#5A564F] text-sm sm:text-base font-normal leading-relaxed max-w-lg">
                        Produits 100% originaux. Grandes marques internationales. Des choix
                        intelligents pour sublimer votre quotidien au Sénégal.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-3 bg-[#C59A63] hover:bg-[#B4874F] text-white px-8 py-4 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C59A63]/25 active:scale-95"
                        >
                            <span>VOIR LA BOUTIQUE</span>
                            <ArrowRight size={16} />
                        </Link>

                        <button
                            onClick={handleWhatsAppShowcase}
                            className="inline-flex items-center gap-3 text-[#1C1B1F] hover:text-[#C59A63] transition-colors group py-2"
                        >
                            <div className="size-11 rounded-full bg-white border border-[#EAE6DF] shadow-sm flex items-center justify-center text-[#1C1B1F] group-hover:scale-105 group-hover:border-[#C59A63] transition-all">
                                <Play size={14} className="fill-[#1C1B1F] ml-0.5" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold leading-tight">Découvrir Julo</p>
                                <p className="text-[10px] text-zinc-400 font-medium">
                                    WhatsApp Direct
                                </p>
                            </div>
                        </button>
                    </div>

                    {/* 4 Feature Badges in Row */}
                    <div className="mt-12 pt-8 border-t border-[#EAE6DF] grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-full border border-[#D6CEBE] flex items-center justify-center text-[#8C8275] shrink-0">
                                <ShieldCheck size={15} />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-[#1C1B1F] leading-tight">
                                    100% Authentique
                                </p>
                                <p className="text-[9px] text-[#8C8275]">Certifié Neuf</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-full border border-[#D6CEBE] flex items-center justify-center text-[#8C8275] shrink-0">
                                <RotateCcw size={15} />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-[#1C1B1F] leading-tight">
                                    Garantie &amp; SAV
                                </p>
                                <p className="text-[9px] text-[#8C8275]">Assistance Pro</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-full border border-[#D6CEBE] flex items-center justify-center text-[#8C8275] shrink-0">
                                <Truck size={15} />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-[#1C1B1F] leading-tight">
                                    Livraison 24h
                                </p>
                                <p className="text-[9px] text-[#8C8275]">Dakar &amp; Régions</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-full border border-[#D6CEBE] flex items-center justify-center text-[#8C8275] shrink-0">
                                <Lock size={15} />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-[#1C1B1F] leading-tight">
                                    Paiement Sûr
                                </p>
                                <p className="text-[9px] text-[#8C8275]">Wave / OM / Cash</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Visual Showcase Podium with Glowing Golden Ring */}
                <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center">
                    {/* Glowing Golden Ring Halo */}
                    <div className="absolute size-72 sm:size-96 rounded-full border-[2.5px] border-[#D4AF37]/35 shadow-[0_0_80px_rgba(212,175,55,0.15)] pointer-events-none" />

                    {/* Podium Platform Card */}
                    <div className="relative z-10 w-full max-w-lg bg-gradient-to-b from-white/90 to-[#FAF8F5]/90 backdrop-blur-md rounded-[2.5rem] p-6 sm:p-8 border border-[#EAE6DF] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden">
                        {/* Device Grid Showcase */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Device 1: iPhone Pro */}
                            <div className="bg-[#F5F2EB] rounded-2xl p-4 flex flex-col items-center justify-between aspect-square border border-[#EAE6DF]/70 hover:scale-102 transition-transform">
                                <div className="text-right w-full">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C8275]">
                                        Apple
                                    </span>
                                </div>
                                <div className="size-24 sm:size-28 flex items-center justify-center text-[#1C1B1F]">
                                    <Smartphone
                                        size={54}
                                        strokeWidth={1.2}
                                        className="text-[#C59A63]"
                                    />
                                </div>
                                <p className="text-xs font-bold text-[#1C1B1F]">iPhone 16 Pro</p>
                            </div>

                            {/* Device 2: Samsung Galaxy */}
                            <div className="bg-[#F5F2EB] rounded-2xl p-4 flex flex-col items-center justify-between aspect-square border border-[#EAE6DF]/70 hover:scale-102 transition-transform">
                                <div className="text-right w-full">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C8275]">
                                        Samsung
                                    </span>
                                </div>
                                <div className="size-24 sm:size-28 flex items-center justify-center text-[#1C1B1F]">
                                    <Smartphone
                                        size={54}
                                        strokeWidth={1.2}
                                        className="text-[#1C1B1F]"
                                    />
                                </div>
                                <p className="text-xs font-bold text-[#1C1B1F]">S24 Ultra</p>
                            </div>

                            {/* Device 3: Laptop */}
                            <div className="bg-[#F5F2EB] rounded-2xl p-4 flex flex-col items-center justify-between aspect-square border border-[#EAE6DF]/70 hover:scale-102 transition-transform">
                                <div className="text-right w-full">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C8275]">
                                        PC &amp; Mac
                                    </span>
                                </div>
                                <div className="size-24 sm:size-28 flex items-center justify-center text-[#1C1B1F]">
                                    <Laptop
                                        size={54}
                                        strokeWidth={1.2}
                                        className="text-[#1C1B1F]"
                                    />
                                </div>
                                <p className="text-xs font-bold text-[#1C1B1F]">HP / MacBook</p>
                            </div>

                            {/* Device 4: Audio & Earbuds */}
                            <div className="bg-[#F5F2EB] rounded-2xl p-4 flex flex-col items-center justify-between aspect-square border border-[#EAE6DF]/70 hover:scale-102 transition-transform">
                                <div className="text-right w-full">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C8275]">
                                        Audio Pro
                                    </span>
                                </div>
                                <div className="size-24 sm:size-28 flex items-center justify-center text-[#1C1B1F]">
                                    <Headphones
                                        size={54}
                                        strokeWidth={1.2}
                                        className="text-[#C59A63]"
                                    />
                                </div>
                                <p className="text-xs font-bold text-[#1C1B1F]">
                                    Casques &amp; AirPods
                                </p>
                            </div>
                        </div>

                        {/* Floating Podium Badge */}
                        <div className="mt-4 pt-4 border-t border-[#EAE6DF] flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#1C1B1F]">
                                Collection Officielle JULO 2026
                            </span>
                            <span className="text-[10px] font-bold text-[#C59A63]">
                                Disponible à Dakar
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* "Shop By Category" Section */}
            <div className="mt-20 pt-10 border-t border-[#EAE6DF]">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#1C1B1F] tracking-tight">
                        Parcourir par Catégorie
                    </h2>
                    <Link
                        href="/shop"
                        className="text-xs font-bold text-[#1C1B1F] hover:text-[#C59A63] transition-colors underline underline-offset-4"
                    >
                        Voir Toutes les Catégories
                    </Link>
                </div>

                {/* 6 Clean White Cards in Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categoriesList.map((cat, idx) => {
                        const Icon = cat.fallbackIcon;
                        return (
                            <Link
                                key={idx}
                                href={cat.href}
                                className="group bg-white rounded-2xl p-4 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 hover:border-[#C59A63] transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="bg-[#F5F2EB] rounded-xl aspect-square flex items-center justify-center mb-4 group-hover:bg-[#FAF8F5] transition-colors p-4">
                                    <Icon
                                        size={38}
                                        strokeWidth={1.3}
                                        className="text-[#1C1B1F] group-hover:text-[#C59A63] group-hover:scale-110 transition-all duration-300"
                                    />
                                </div>

                                <div>
                                    <h3 className="font-bold text-xs sm:text-sm text-[#1C1B1F] group-hover:text-[#C59A63] transition-colors">
                                        {cat.title}
                                    </h3>
                                    <p className="text-[11px] font-medium text-zinc-400 mt-1 flex items-center gap-1">
                                        <span>{cat.subtitle}</span>
                                        <ArrowRight
                                            size={11}
                                            className="group-hover:translate-x-1 transition-transform"
                                        />
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Hero;
