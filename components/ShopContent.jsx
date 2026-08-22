'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import {
    Search,
    ChevronDown,
    SortAsc,
    SortDesc,
    Star,
    X as XIcon,
    SlidersHorizontal,
    Package as PackageIcon,
    Zap as ZapIcon,
    Check,
    ArrowRight,
    Sparkles,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Category definitions with emoji icons ─── */
const JULO_CATEGORIES = [
    {
        slug: 'Smartphones & Apple',
        label: 'Smartphones',
        emoji: '📱',
        color: 'bg-blue-50 border-blue-100',
    },
    {
        slug: 'Samsung Galaxy',
        label: 'Samsung',
        emoji: '🌐',
        color: 'bg-indigo-50 border-indigo-100',
    },
    {
        slug: 'Tecno, Infinix & Itel',
        label: 'Tecno & Infinix',
        emoji: '🤖',
        color: 'bg-orange-50 border-orange-100',
    },
    {
        slug: 'Xiaomi & Redmi',
        label: 'Xiaomi',
        emoji: '🔶',
        color: 'bg-amber-50 border-amber-100',
    },
    {
        slug: 'Ordinateurs & PC',
        label: 'PC & MacBook',
        emoji: '💻',
        color: 'bg-slate-50 border-slate-100',
    },
    {
        slug: 'Audio, Enceintes & Oraimo',
        label: 'Audio & AirPods',
        emoji: '🎧',
        color: 'bg-purple-50 border-purple-100',
    },
    {
        slug: 'Montres & Wearables',
        label: 'Montres',
        emoji: '⌚',
        color: 'bg-rose-50 border-rose-100',
    },
    {
        slug: 'Accessoires & Énergie',
        label: 'Accessoires',
        emoji: '🔌',
        color: 'bg-green-50 border-green-100',
    },
];

/* ─── Price presets ─── */
const PRICE_PRESETS = [
    { label: 'Moins de 50 000', min: '', max: '50000' },
    { label: '50 000 – 150 000', min: '50000', max: '150000' },
    { label: '150 000 – 300 000', min: '150000', max: '300000' },
    { label: '300 000 – 500 000', min: '300000', max: '500000' },
    { label: 'Plus de 500 000', min: '500000', max: '' },
];

const SORT_OPTIONS = [
    { label: 'Nouveautés', value: 'newest', renderIcon: () => <ZapIcon size={14} /> },
    { label: 'Prix croissant', value: 'price_asc', renderIcon: () => <SortAsc size={14} /> },
    { label: 'Prix décroissant', value: 'price_desc', renderIcon: () => <SortDesc size={14} /> },
    { label: 'Mieux notés', value: 'rating', renderIcon: () => <Star size={14} /> },
];

export default function ShopContent({ initialProducts }) {
    const searchParams = useSearchParams();
    const search = searchParams.get('search');
    const categoryParam = searchParams.get('category');
    const sortParam = searchParams.get('sort') || 'newest';
    const router = useRouter();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [localSearch, setLocalSearch] = useState(search || '');
    const [localMinPrice, setLocalMinPrice] = useState(searchParams.get('minPrice') || '');
    const [localMaxPrice, setLocalMaxPrice] = useState(searchParams.get('maxPrice') || '');

    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const inStockParam = searchParams.get('inStock') === 'true';

    const updateParams = useCallback(
        (key, value) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) params.set(key, value);
            else params.delete(key);
            router.push('/shop?' + params.toString(), { scroll: false });
        },
        [router, searchParams]
    );

    useEffect(() => {
        if (localSearch !== (search || '')) {
            const t = setTimeout(() => updateParams('search', localSearch), 350);
            return () => clearTimeout(t);
        }
    }, [localSearch, search, updateParams]);

    useEffect(() => {
        if (!isFilterOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => {
            if (e.key === 'Escape') setIsFilterOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [isFilterOpen]);

    const products = useMemo(() => initialProducts || [], [initialProducts]);

    const filteredProducts = useMemo(() => {
        let result = products.filter((p) => {
            const matchSearch = search
                ? p.name.toLowerCase().includes(search.toLowerCase()) ||
                  (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
                : true;

            const catLower = categoryParam?.toLowerCase() || '';
            const pCat = (p.Category?.name || p.category || '').toLowerCase();
            const pBrand = (p.brand || '').toLowerCase();
            const pName = (p.name || '').toLowerCase();
            const matchCategory = categoryParam
                ? pCat === catLower ||
                  pCat.includes(catLower) ||
                  catLower.includes(pCat) ||
                  (pBrand && catLower.includes(pBrand)) ||
                  (pBrand && pCat.includes(pBrand)) ||
                  catLower.split(/[ ,&]+/).some((t) => t && (pName.includes(t) || pCat.includes(t)))
                : true;

            const matchMin = minPriceParam ? p.price >= Number(minPriceParam) : true;
            const matchMax = maxPriceParam ? p.price <= Number(maxPriceParam) : true;
            const matchStock = inStockParam ? p.stock > 0 : true;
            return matchSearch && matchCategory && matchMin && matchMax && matchStock;
        });

        switch (sortParam) {
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => {
                    const avgA =
                        a.rating?.reduce((s, r) => s + r.rating, 0) / (a.rating?.length || 1) || 0;
                    const avgB =
                        b.rating?.reduce((s, r) => s + r.rating, 0) / (b.rating?.length || 1) || 0;
                    return avgB - avgA;
                });
                break;
            default:
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return result;
    }, [products, search, categoryParam, minPriceParam, maxPriceParam, inStockParam, sortParam]);

    const selectCategory = (cat) => {
        updateParams('category', cat);
        setIsFilterOpen(false);
    };

    const applyPriceFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (localMinPrice) params.set('minPrice', localMinPrice);
        else params.delete('minPrice');
        if (localMaxPrice) params.set('maxPrice', localMaxPrice);
        else params.delete('maxPrice');
        router.push('/shop?' + params.toString(), { scroll: false });
        setIsFilterOpen(false);
    };

    const clearAllFilters = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        router.push('/shop?' + params.toString(), { scroll: false });
        setLocalMinPrice('');
        setLocalMaxPrice('');
        setIsFilterOpen(false);
    };

    const advancedFilterCount = [minPriceParam, maxPriceParam, inStockParam].filter(Boolean).length;
    const activeCategoryDef = JULO_CATEGORIES.find((c) => c.slug === categoryParam);
    const currentSort = SORT_OPTIONS.find((s) => s.value === sortParam);

    /* ─── Desktop Sidebar ─── */
    const DesktopSidebar = () => (
        <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-28 space-y-5">
                <div className="bg-white rounded-3xl p-5 border border-[#EAE6DF] shadow-xs">
                    <p className="text-[10px] font-extrabold text-[#8C8275] uppercase tracking-[0.2em] mb-3">
                        Catégories
                    </p>
                    <div className="space-y-1.5">
                        <button
                            type="button"
                            onClick={() => selectCategory(null)}
                            className={
                                'w-full flex items-center justify-between p-2.5 rounded-xl transition-all border text-xs font-bold ' +
                                (!categoryParam
                                    ? 'bg-[#1C1B1F] text-white border-[#1C1B1F]'
                                    : 'bg-[#F5F2EB] border-transparent text-[#4A4742] hover:bg-white hover:border-[#EAE6DF]')
                            }
                        >
                            <span>Toutes catégories</span>
                            {!categoryParam && (
                                <div className="size-1.5 bg-[#10B981] rounded-full" />
                            )}
                        </button>
                        {JULO_CATEGORIES.map((cat) => (
                            <button
                                key={cat.slug}
                                type="button"
                                onClick={() => selectCategory(cat.slug)}
                                className={
                                    'w-full flex items-center justify-between p-2.5 rounded-xl transition-all border text-xs font-bold ' +
                                    (categoryParam === cat.slug
                                        ? 'bg-[#1C1B1F] text-white border-[#1C1B1F]'
                                        : 'bg-[#F5F2EB] border-transparent text-[#4A4742] hover:bg-white hover:border-[#EAE6DF]')
                                }
                            >
                                <div className="flex items-center gap-2.5">
                                    <span>{cat.emoji}</span>
                                    <span className="line-clamp-1 text-left">{cat.label}</span>
                                </div>
                                {categoryParam === cat.slug && (
                                    <div className="size-1.5 bg-[#10B981] rounded-full shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-5 pt-5 border-t border-[#EAE6DF]">
                        <p className="text-[10px] font-extrabold text-[#8C8275] uppercase tracking-[0.2em] mb-3">
                            Prix (FCFA)
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="number"
                                inputMode="numeric"
                                placeholder="Min"
                                value={localMinPrice}
                                onChange={(e) => setLocalMinPrice(e.target.value)}
                                className="w-full bg-[#F5F2EB] border border-[#EAE6DF] rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#10B981] transition-colors"
                            />
                            <span className="text-[#8C8275] shrink-0">—</span>
                            <input
                                type="number"
                                inputMode="numeric"
                                placeholder="Max"
                                value={localMaxPrice}
                                onChange={(e) => setLocalMaxPrice(e.target.value)}
                                className="w-full bg-[#F5F2EB] border border-[#EAE6DF] rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#10B981] transition-colors"
                            />
                        </div>
                        <label className="flex items-center justify-between gap-3 cursor-pointer p-3 bg-[#F5F2EB] rounded-xl border border-[#EAE6DF] mb-4">
                            <span className="text-xs font-bold text-[#1C1B1F]">
                                En stock uniquement
                            </span>
                            <div className="relative shrink-0">
                                <input
                                    type="checkbox"
                                    checked={inStockParam}
                                    onChange={(e) =>
                                        updateParams('inStock', e.target.checked ? 'true' : null)
                                    }
                                    className="sr-only peer"
                                />
                                <div className="w-10 h-5 bg-zinc-300 rounded-full peer peer-checked:bg-[#10B981] transition-colors" />
                                <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-xs" />
                            </div>
                        </label>
                        <button
                            type="button"
                            onClick={applyPriceFilters}
                            className="w-full py-2.5 bg-[#1C1B1F] hover:bg-[#10B981] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-xs"
                        >
                            Appliquer
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#24221E] to-[#1C1B1F] rounded-3xl p-6 text-white border border-[#33302A]">
                    <span className="bg-[#10B981] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        Conseil VIP
                    </span>
                    <h4 className="font-bold text-base mt-3 mb-1">Besoin d&apos;un Conseil ?</h4>
                    <p className="text-zinc-400 text-xs mb-5 leading-relaxed">
                        Notre équipe vous guide pour choisir le smartphone ou PC adapté à vos
                        besoins.
                    </p>
                    <a
                        href="https://wa.me/221754469097?text=Bonjour%20JULO,%20je%20souhaite%20un%20conseil%20pour%20choisir%20un%20appareil"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-white text-[#1C1B1F] hover:bg-[#10B981] hover:text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all"
                    >
                        <span>Discuter sur WhatsApp</span>
                        <ArrowRight size={13} />
                    </a>
                </div>
            </div>
        </aside>
    );

    return (
        <div className="min-h-screen bg-[#FAF8F5] pb-24 sm:pb-8">
            {/* ── Hero (desktop only) ── */}
            <div className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <section className="relative overflow-hidden rounded-[2.5rem] bg-[#1C1B1F] text-white p-10 sm:p-12 border border-[#33302A] shadow-xl min-h-[200px] flex flex-col justify-center">
                    <div className="absolute -right-10 -bottom-10 size-72 rounded-full border border-[#D4AF37]/30 shadow-[0_0_80px_rgba(212,175,55,0.15)] pointer-events-none" />
                    <div className="relative z-10 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C2924] border border-[#3D3A34] text-[10px] font-extrabold uppercase tracking-widest text-[#C59A63] mb-4">
                            <Sparkles size={12} /> CATALOGUE OFFICIEL JULO
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                            Smartphones, Ordinateurs &amp; High-Tech.
                        </h1>
                        <p className="mt-2 text-zinc-400 text-xs sm:text-sm leading-relaxed">
                            Équipements électroniques certifiés neufs avec garantie constructeur au
                            Sénégal.
                        </p>
                    </div>
                </section>
            </div>

            {/* ══════════════════════════════════════════════════
                MOBILE STICKY HEADER
            ══════════════════════════════════════════════════ */}
            <div className="md:hidden sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE6DF] px-4 pt-3 pb-3 space-y-2.5">
                {/* Search */}
                <div className="relative">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                    <input
                        type="text"
                        placeholder="iPhone, Samsung, MacBook, AirPods..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="w-full bg-white border border-[#EAE6DF] rounded-2xl pl-10 pr-10 py-2.5 text-xs font-medium text-[#1C1B1F] placeholder:text-zinc-400 focus:outline-none focus:border-[#10B981] shadow-xs transition-all"
                    />
                    {localSearch && (
                        <button
                            type="button"
                            onClick={() => setLocalSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 bg-[#F5F2EB] rounded-full p-1"
                        >
                            <XIcon size={11} />
                        </button>
                    )}
                </div>

                {/* Category chips */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-0.5">
                    <button
                        type="button"
                        onClick={() => selectCategory(null)}
                        className={
                            'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ' +
                            (!categoryParam
                                ? 'bg-[#1C1B1F] text-white border-[#1C1B1F]'
                                : 'bg-white text-[#4A4742] border-[#EAE6DF]')
                        }
                    >
                        Tous
                    </button>
                    {JULO_CATEGORIES.map((cat) => {
                        const active = categoryParam === cat.slug;
                        return (
                            <button
                                key={cat.slug}
                                type="button"
                                onClick={() => selectCategory(active ? null : cat.slug)}
                                className={
                                    'shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ' +
                                    (active
                                        ? 'bg-[#1C1B1F] text-white border-[#1C1B1F]'
                                        : 'bg-white text-[#4A4742] border-[#EAE6DF]')
                                }
                            >
                                <span>{cat.emoji}</span>
                                <span>{cat.label}</span>
                                {active && <XIcon size={10} className="ml-0.5 opacity-60" />}
                            </button>
                        );
                    })}
                </div>

                {/* Count + Sort + Filter */}
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#8C8275] font-medium">
                        <strong className="text-[#1C1B1F]">{filteredProducts.length}</strong>{' '}
                        produits
                        {activeCategoryDef && (
                            <span className="text-[#10B981]">
                                {' '}
                                · {activeCategoryDef.emoji} {activeCategoryDef.label}
                            </span>
                        )}
                    </span>
                    <div className="flex items-center gap-1.5">
                        {/* Sort */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className={
                                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ' +
                                    (sortParam !== 'newest'
                                        ? 'bg-[#1C1B1F] text-white border-[#1C1B1F]'
                                        : 'bg-white text-[#4A4742] border-[#EAE6DF]')
                                }
                            >
                                {currentSort?.renderIcon?.()}
                                <span className="hidden xs:inline">{currentSort?.label}</span>
                                <ChevronDown
                                    size={11}
                                    className={
                                        'transition-transform ' + (isSortOpen ? 'rotate-180' : '')
                                    }
                                />
                            </button>
                            <AnimatePresence>
                                {isSortOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsSortOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#EAE6DF] rounded-2xl shadow-xl p-1.5 z-50"
                                        >
                                            {SORT_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => {
                                                        updateParams('sort', opt.value);
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={
                                                        'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ' +
                                                        (sortParam === opt.value
                                                            ? 'bg-[#1C1B1F] text-white'
                                                            : 'text-zinc-700 hover:bg-[#FAF8F5]')
                                                    }
                                                >
                                                    {opt.renderIcon()}
                                                    <span className="flex-1 text-left">
                                                        {opt.label}
                                                    </span>
                                                    {sortParam === opt.value && <Check size={12} />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Advanced Filters */}
                        <button
                            type="button"
                            onClick={() => setIsFilterOpen(true)}
                            className={
                                'relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ' +
                                (advancedFilterCount > 0
                                    ? 'bg-[#10B981] text-white border-[#10B981]'
                                    : 'bg-white text-[#4A4742] border-[#EAE6DF]')
                            }
                        >
                            <SlidersHorizontal size={12} />
                            <span>Filtres</span>
                            {advancedFilterCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 size-4 bg-[#1C1B1F] text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                                    {advancedFilterCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                DESKTOP: Search + Sort bar
            ══════════════════════════════════════════════════ */}
            <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                        />
                        <input
                            type="text"
                            placeholder="Rechercher un modèle, iPhone, Samsung, MacBook..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="w-full bg-white border border-[#EAE6DF] rounded-full pl-10 pr-10 py-2.5 text-xs font-medium text-[#1C1B1F] placeholder:text-zinc-400 focus:outline-none focus:border-[#10B981] shadow-xs transition-all"
                        />
                        {localSearch && (
                            <button
                                type="button"
                                onClick={() => setLocalSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 bg-[#F5F2EB] rounded-full p-1"
                            >
                                <XIcon size={12} />
                            </button>
                        )}
                    </div>
                    <div className="relative shrink-0">
                        <button
                            type="button"
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-2 bg-white border border-[#EAE6DF] px-4 py-2.5 rounded-full text-xs font-bold text-[#1C1B1F] shadow-xs hover:border-[#10B981] transition-colors"
                        >
                            <span>{currentSort?.label || 'Trier par'}</span>
                            <ChevronDown size={14} />
                        </button>
                        <AnimatePresence>
                            {isSortOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsSortOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="absolute right-0 mt-2 w-48 bg-white border border-[#EAE6DF] rounded-2xl shadow-xl p-1.5 z-50"
                                    >
                                        {SORT_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => {
                                                    updateParams('sort', opt.value);
                                                    setIsSortOpen(false);
                                                }}
                                                className={
                                                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ' +
                                                    (sortParam === opt.value
                                                        ? 'bg-[#1C1B1F] text-white'
                                                        : 'text-zinc-700 hover:bg-[#FAF8F5]')
                                                }
                                            >
                                                {opt.renderIcon()}
                                                <span>{opt.label}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                MAIN CONTENT
            ══════════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-4 sm:px-6 lg:px-8 pt-4 md:pt-8">
                <DesktopSidebar />

                <div className="flex-1 min-w-0">
                    {/* Desktop result count */}
                    <div className="hidden md:flex items-center justify-between mb-4 text-xs text-[#8C8275]">
                        <span>
                            <strong className="text-[#1C1B1F]">{filteredProducts.length}</strong>{' '}
                            produit{filteredProducts.length !== 1 ? 's' : ''} trouvé
                            {filteredProducts.length !== 1 ? 's' : ''}
                            {categoryParam && (
                                <span className="text-[#10B981] font-semibold">
                                    {' '}
                                    · {activeCategoryDef?.emoji}{' '}
                                    {activeCategoryDef?.label || categoryParam}
                                </span>
                            )}
                        </span>
                        {(categoryParam || minPriceParam || maxPriceParam || inStockParam) && (
                            <button
                                onClick={clearAllFilters}
                                className="text-[#10B981] hover:underline font-semibold flex items-center gap-1"
                            >
                                <XIcon size={12} />
                                Effacer les filtres
                            </button>
                        )}
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                            {filteredProducts.map((product, i) => (
                                <ProductCard key={product.id} product={product} priority={i < 4} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE6DF] my-4 sm:my-8">
                            <PackageIcon size={40} className="mx-auto text-zinc-300 mb-3" />
                            <h3 className="font-bold text-base text-[#1C1B1F]">
                                Aucun produit trouvé
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                                Essayez de modifier vos critères de recherche ou vos filtres.
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="mt-4 px-5 py-2 bg-[#10B981] text-white rounded-full text-xs font-bold"
                            >
                                Voir tous les produits
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                MOBILE ADVANCED FILTER BOTTOM SHEET
            ══════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isFilterOpen && (
                    <div className="fixed inset-0 z-[200] md:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="absolute bottom-0 left-0 right-0 max-h-[92vh] bg-white rounded-t-[2rem] overflow-hidden flex flex-col"
                        >
                            {/* Sheet header */}
                            <div className="flex-shrink-0 px-5 pt-4 pb-4 border-b border-[#EAE6DF]">
                                <div className="w-10 h-1 bg-[#E0DDD6] rounded-full mx-auto mb-4" />
                                <div className="flex items-center justify-between">
                                    <h3 className="font-black text-lg text-[#1C1B1F]">
                                        Filtres avancés
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        {(minPriceParam || maxPriceParam || inStockParam) && (
                                            <button
                                                onClick={clearAllFilters}
                                                className="text-xs font-bold text-[#10B981]"
                                            >
                                                Tout effacer
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setIsFilterOpen(false)}
                                            className="size-8 rounded-full bg-[#F5F2EB] flex items-center justify-center"
                                        >
                                            <XIcon size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable body */}
                            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
                                {/* Category grid */}
                                <div>
                                    <p className="text-[10px] font-extrabold text-[#8C8275] uppercase tracking-[0.2em] mb-3">
                                        Catégorie de produit
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => selectCategory(null)}
                                            className={
                                                'flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all ' +
                                                (!categoryParam
                                                    ? 'border-[#1C1B1F] bg-[#1C1B1F] text-white'
                                                    : 'border-[#EAE6DF] bg-[#F5F2EB] text-[#4A4742]')
                                            }
                                        >
                                            <span className="text-xl">🛍️</span>
                                            <div className="text-left">
                                                <p className="text-xs font-bold leading-tight">
                                                    Toutes
                                                </p>
                                                <p className="text-[9px] opacity-60">
                                                    {products.length} produits
                                                </p>
                                            </div>
                                            {!categoryParam && (
                                                <Check
                                                    size={14}
                                                    className="ml-auto text-[#10B981] shrink-0"
                                                />
                                            )}
                                        </button>
                                        {JULO_CATEGORIES.map((cat) => {
                                            const active = categoryParam === cat.slug;
                                            const count = products.filter((p) => {
                                                const pCat = (
                                                    p.Category?.name ||
                                                    p.category ||
                                                    ''
                                                ).toLowerCase();
                                                const catLow = cat.slug.toLowerCase();
                                                const pBrand = (p.brand || '').toLowerCase();
                                                return (
                                                    pCat === catLow ||
                                                    pCat.includes(catLow) ||
                                                    catLow.includes(pCat) ||
                                                    (pBrand && catLow.includes(pBrand)) ||
                                                    catLow
                                                        .split(/[ ,&]+/)
                                                        .some((t) => t && pCat.includes(t))
                                                );
                                            }).length;
                                            return (
                                                <button
                                                    key={cat.slug}
                                                    type="button"
                                                    onClick={() =>
                                                        selectCategory(active ? null : cat.slug)
                                                    }
                                                    className={
                                                        'flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all ' +
                                                        (active
                                                            ? 'border-[#1C1B1F] bg-[#1C1B1F] text-white'
                                                            : 'border-transparent ' +
                                                              cat.color +
                                                              ' text-[#1C1B1F]')
                                                    }
                                                >
                                                    <span className="text-xl shrink-0">
                                                        {cat.emoji}
                                                    </span>
                                                    <div className="text-left min-w-0">
                                                        <p className="text-xs font-bold leading-tight truncate">
                                                            {cat.label}
                                                        </p>
                                                        <p
                                                            className={
                                                                'text-[9px] ' +
                                                                (active
                                                                    ? 'text-zinc-300'
                                                                    : 'text-[#8C8275]')
                                                            }
                                                        >
                                                            {count} produits
                                                        </p>
                                                    </div>
                                                    {active && (
                                                        <Check
                                                            size={14}
                                                            className="ml-auto text-[#10B981] shrink-0"
                                                        />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Price presets */}
                                <div>
                                    <p className="text-[10px] font-extrabold text-[#8C8275] uppercase tracking-[0.2em] mb-3">
                                        Budget
                                    </p>
                                    <div className="space-y-2">
                                        {PRICE_PRESETS.map((preset) => {
                                            const isActive =
                                                minPriceParam === preset.min &&
                                                maxPriceParam === preset.max;
                                            return (
                                                <button
                                                    key={preset.label}
                                                    type="button"
                                                    onClick={() => {
                                                        const params = new URLSearchParams(
                                                            searchParams.toString()
                                                        );
                                                        if (preset.min)
                                                            params.set('minPrice', preset.min);
                                                        else params.delete('minPrice');
                                                        if (preset.max)
                                                            params.set('maxPrice', preset.max);
                                                        else params.delete('maxPrice');
                                                        setLocalMinPrice(preset.min);
                                                        setLocalMaxPrice(preset.max);
                                                        router.push('/shop?' + params.toString(), {
                                                            scroll: false,
                                                        });
                                                    }}
                                                    className={
                                                        'w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all text-sm font-semibold ' +
                                                        (isActive
                                                            ? 'bg-[#10B981] text-white border-[#10B981]'
                                                            : 'bg-[#F5F2EB] text-[#1C1B1F] border-transparent hover:border-[#10B981]/40')
                                                    }
                                                >
                                                    <span>{preset.label} FCFA</span>
                                                    {isActive && <Check size={15} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Custom price */}
                                <div>
                                    <p className="text-[10px] font-extrabold text-[#8C8275] uppercase tracking-[0.2em] mb-3">
                                        Prix personnalisé (FCFA)
                                    </p>
                                    <div className="flex items-end gap-3">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-[#8C8275] mb-1 block">
                                                MIN
                                            </label>
                                            <input
                                                type="number"
                                                inputMode="numeric"
                                                placeholder="0"
                                                value={localMinPrice}
                                                onChange={(e) => setLocalMinPrice(e.target.value)}
                                                className="w-full bg-[#F5F2EB] border border-[#EAE6DF] rounded-xl px-3 py-3 text-sm font-bold focus:outline-none focus:border-[#10B981] transition-colors"
                                            />
                                        </div>
                                        <div className="text-[#8C8275] pb-3 font-bold text-lg">
                                            —
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-[#8C8275] mb-1 block">
                                                MAX
                                            </label>
                                            <input
                                                type="number"
                                                inputMode="numeric"
                                                placeholder="∞"
                                                value={localMaxPrice}
                                                onChange={(e) => setLocalMaxPrice(e.target.value)}
                                                className="w-full bg-[#F5F2EB] border border-[#EAE6DF] rounded-xl px-3 py-3 text-sm font-bold focus:outline-none focus:border-[#10B981] transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Stock */}
                                <label className="flex items-center justify-between gap-3 cursor-pointer p-4 bg-[#F5F2EB] rounded-2xl border border-[#EAE6DF]">
                                    <div>
                                        <p className="text-sm font-bold text-[#1C1B1F]">
                                            En stock uniquement
                                        </p>
                                        <p className="text-xs text-[#8C8275] mt-0.5">
                                            Afficher les produits disponibles
                                        </p>
                                    </div>
                                    <div className="relative shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={inStockParam}
                                            onChange={(e) =>
                                                updateParams(
                                                    'inStock',
                                                    e.target.checked ? 'true' : null
                                                )
                                            }
                                            className="sr-only peer"
                                        />
                                        <div className="w-12 h-6 bg-zinc-300 rounded-full peer peer-checked:bg-[#10B981] transition-colors" />
                                        <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform peer-checked:translate-x-6 shadow-xs" />
                                    </div>
                                </label>
                            </div>

                            {/* Sticky footer */}
                            <div className="flex-shrink-0 px-5 py-4 border-t border-[#EAE6DF] bg-white flex gap-3">
                                <button
                                    type="button"
                                    onClick={clearAllFilters}
                                    className="flex-1 py-3.5 border-2 border-[#EAE6DF] rounded-full font-bold text-sm text-[#4A4742] active:scale-95 transition-all"
                                >
                                    Réinitialiser
                                </button>
                                <button
                                    type="button"
                                    onClick={applyPriceFilters}
                                    className="flex-[2] py-3.5 bg-[#1C1B1F] hover:bg-[#10B981] text-white rounded-full font-bold text-sm transition-all active:scale-95 shadow-md"
                                >
                                    Voir {filteredProducts.length} résultat
                                    {filteredProducts.length !== 1 ? 's' : ''}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
