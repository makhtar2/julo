'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, Bell, Sparkles, ArrowRight, Mic } from 'lucide-react';
import { useRouter } from 'next/navigation';

const mobileCategories = [
    { name: 'Tous', slug: 'all', label: 'All' },
    { name: 'AirPods & Audio', slug: 'Audio, Enceintes & Oraimo', label: 'AirPods' },
    { name: 'Ordinateurs', slug: 'Ordinateurs & PC', label: 'Laptop' },
    { name: 'Smartphones', slug: 'Smartphones & Apple', label: 'Phones' },
    { name: 'Samsung', slug: 'Samsung Galaxy', label: 'Samsung' },
    { name: 'Montres', slug: 'Montres & Wearables', label: 'Watches' },
    { name: 'Accessoires', slug: 'Accessoires & Énergie', label: 'Accessories' },
];

export default function MobileHomeHero({ selectedCategory, onSelectCategory }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activePill, setActivePill] = useState(selectedCategory || 'all');
    const router = useRouter();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleCategoryClick = (cat) => {
        setActivePill(cat.slug);
        if (onSelectCategory) {
            onSelectCategory(cat.slug);
        } else {
            if (cat.slug === 'all') {
                router.push('/shop');
            } else {
                router.push(`/shop?category=${encodeURIComponent(cat.slug)}`);
            }
        }
    };

    return (
        <div className="sm:hidden px-4 pt-3 pb-4 space-y-4">
            {/* 1. Header: "Discover" + Notification Bell */}
            <div className="flex items-center justify-between pt-1">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-[#1C1B1F]">Discover</h1>
                    <p className="text-[11px] font-semibold text-[#8C8275]">
                        Boutique officielle JULO Sénégal
                    </p>
                </div>

                <Link
                    href="/shop?sort=newest"
                    aria-label="Notifications & Nouveautés"
                    className="size-10 rounded-full bg-white border border-[#EAE6DF] shadow-xs flex items-center justify-center text-[#1C1B1F] relative active:scale-95 transition-all"
                >
                    <Bell size={18} strokeWidth={2.2} />
                    <span className="absolute top-2.5 right-2.5 size-2 bg-[#10B981] rounded-full ring-2 ring-white" />
                </Link>
            </div>

            {/* 2. Search Bar + Emerald Square Filter Button */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2.5">
                <div className="flex-1 bg-[#F4F4F6] border border-[#EAE6DF] rounded-2xl flex items-center px-3.5 py-2.5 gap-2.5 shadow-2xs focus-within:border-[#10B981] focus-within:bg-white transition-all">
                    <Search size={17} className="text-zinc-400 shrink-0" strokeWidth={2.2} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for mobile, laptop, audio..."
                        className="w-full bg-transparent outline-none text-xs font-semibold text-[#1C1B1F] placeholder:text-zinc-400 placeholder:font-normal"
                    />
                    <button
                        type="button"
                        onClick={() => router.push('/shop')}
                        className="text-zinc-400 hover:text-[#1C1B1F] transition-colors"
                        aria-label="Recherche rapide"
                    >
                        <Mic size={15} />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => router.push('/shop')}
                    aria-label="Filtrer les produits"
                    className="size-11 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white flex items-center justify-center shadow-md shadow-[#10B981]/25 active:scale-95 transition-all shrink-0"
                >
                    <SlidersHorizontal size={17} strokeWidth={2.2} />
                </button>
            </form>

            {/* 3. Clearance Sales Banner Card (Exact Screenshot Look) */}
            <Link
                href="/shop?sort=newest"
                className="block group relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] p-5 text-white shadow-lg shadow-[#10B981]/20 active:scale-[0.98] transition-all"
            >
                {/* Background decorative glowing circles */}
                <div className="absolute -right-8 -bottom-8 size-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
                <div className="absolute top-2 left-1/3 size-24 rounded-full bg-emerald-300/15 blur-lg pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="max-w-[55%]">
                        <div className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-100 mb-1">
                            <Sparkles size={11} />
                            <span>Offres Flash</span>
                        </div>
                        <h2 className="text-xl font-black text-white leading-tight tracking-tight mb-2.5">
                            Clearance <br /> Sales
                        </h2>
                        <span className="inline-flex items-center gap-1 bg-white text-[#059669] px-3.5 py-1.5 rounded-full font-black text-[11px] uppercase tracking-wider shadow-xs group-hover:bg-emerald-50 transition-all">
                            <span>Up to 50%</span>
                            <ArrowRight size={12} strokeWidth={3} />
                        </span>
                    </div>

                    <div className="relative w-36 h-28 shrink-0 flex items-center justify-center">
                        <Image
                            src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80"
                            alt="Clearance Sales"
                            width={160}
                            height={160}
                            className="object-contain w-full h-full drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </div>
            </Link>

            {/* 4. Categories Section with Horizontal Scroll */}
            <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#1C1B1F] tracking-tight">Categories</h3>
                    <Link href="/shop" className="text-xs font-bold text-[#10B981] hover:underline">
                        See all
                    </Link>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 scroll-smooth">
                    {mobileCategories.map((cat) => {
                        const isActive = activePill === cat.slug;
                        return (
                            <button
                                key={cat.slug}
                                onClick={() => handleCategoryClick(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                                    isActive
                                        ? 'bg-[#1C1B1F] text-white shadow-xs scale-100'
                                        : 'bg-white border border-[#EAE6DF] text-[#5A564F] hover:text-[#1C1B1F] hover:border-zinc-400'
                                }`}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
