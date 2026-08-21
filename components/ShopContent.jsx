'use client';
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import {
    Fan,
    AirVent,
    Tv,
    Coffee,
    Luggage,
    PlugZap,
    LayoutGrid,
    Search,
    ChevronDown,
    ListFilter,
    SortAsc,
    SortDesc,
    Star,
    X as XIcon,
    Filter as FilterIcon,
    Package as PackageIcon,
    Zap as ZapIcon,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const categoryIcons = {
    Ventilateurs: <Fan size={24} strokeWidth={1.5} />,
    Climatisation: <AirVent size={24} strokeWidth={1.5} />,
    Téléviseurs: <Tv size={24} strokeWidth={1.5} />,
    Bouilloires: <Coffee size={24} strokeWidth={1.5} />,
    Valises: <Luggage size={24} strokeWidth={1.5} />,
    Accessoires: <PlugZap size={24} strokeWidth={1.5} />,
    default: <LayoutGrid size={24} strokeWidth={1.5} />,
};

const sortOptions = [
    { label: 'Nouveautés', value: 'newest', icon: <ZapIcon size={14} /> },
    { label: 'Prix croissant', value: 'price_asc', icon: <SortAsc size={14} /> },
    { label: 'Prix décroissant', value: 'price_desc', icon: <SortDesc size={14} /> },
    { label: 'Mieux notés', value: 'rating', icon: <Star size={14} /> },
];

export default function ShopContent({ initialProducts, initialCategories }) {
    const searchParams = useSearchParams();
    const search = searchParams.get('search');
    const categoryParam = searchParams.get('category');
    const sortParam = searchParams.get('sort') || 'newest';
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            router.push(`/shop?${params.toString()}`, { scroll: false });
        },
        [router, searchParams]
    );

    useEffect(() => {
        // Only update param if it's different to avoid loops
        if (localSearch !== (search || '')) {
            const timer = setTimeout(() => {
                updateParams('search', localSearch);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [localSearch, search, updateParams]);

    useEffect(() => {
        if (!isSidebarOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => {
            if (e.key === 'Escape') setIsSidebarOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [isSidebarOpen]);

    const products = useMemo(() => initialProducts || [], [initialProducts]);
    const categories = initialCategories?.map((c) => c.name) || [];

    const sortedAndFilteredProducts = useMemo(() => {
        let result = products.filter((product) => {
            const matchesSearch = search
                ? product.name.toLowerCase().includes(search.toLowerCase()) ||
                  (product.description &&
                      product.description.toLowerCase().includes(search.toLowerCase()))
                : true;
            const matchesCategory = categoryParam
                ? product.category === categoryParam || product.Category?.name === categoryParam
                : true;
            const matchesMinPrice = minPriceParam ? product.price >= Number(minPriceParam) : true;
            const matchesMaxPrice = maxPriceParam ? product.price <= Number(maxPriceParam) : true;
            const matchesStock = inStockParam ? product.stock > 0 : true;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesMinPrice &&
                matchesMaxPrice &&
                matchesStock
            );
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
                    const rA =
                        a.rating?.reduce((acc, c) => acc + c.rating, 0) / (a.rating?.length || 1) ||
                        0;
                    const rB =
                        b.rating?.reduce((acc, c) => acc + c.rating, 0) / (b.rating?.length || 1) ||
                        0;
                    return rB - rA;
                });
                break;
            case 'newest':
            default:
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return result;
    }, [products, search, categoryParam, sortParam, minPriceParam, maxPriceParam, inStockParam]);

    const removeFilter = (key) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(key);
        if (key === 'search') setLocalSearch('');
        if (key === 'minPrice') setLocalMinPrice('');
        if (key === 'maxPrice') setLocalMaxPrice('');
        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    const clearAllFilters = () => {
        setLocalSearch('');
        setLocalMinPrice('');
        setLocalMaxPrice('');
        router.push('/shop', { scroll: false });
    };

    const activeSort = sortOptions.find((opt) => opt.value === sortParam) || sortOptions[0];

    const selectCategory = (name) => {
        updateParams('category', name || null);
    };

    const activeFilterCount = [minPriceParam, maxPriceParam, inStockParam, categoryParam].filter(
        Boolean
    ).length;

    const applyPriceFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (localMinPrice) params.set('minPrice', localMinPrice);
        else params.delete('minPrice');
        if (localMaxPrice) params.set('maxPrice', localMaxPrice);
        else params.delete('maxPrice');
        router.push(`/shop?${params.toString()}`, { scroll: false });
        setIsSidebarOpen(false);
    };

    const clearPriceAndStockFilters = () => {
        setLocalMinPrice('');
        setLocalMaxPrice('');
        const params = new URLSearchParams(searchParams.toString());
        params.delete('minPrice');
        params.delete('maxPrice');
        params.delete('inStock');
        params.delete('category');
        router.push(`/shop?${params.toString()}`, { scroll: false });
        setIsSidebarOpen(false);
    };

    const openFilters = () => {
        setIsSortOpen(false);
        setLocalMinPrice(minPriceParam || '');
        setLocalMaxPrice(maxPriceParam || '');
        setIsSidebarOpen(true);
    };

    const filterPanelContent = (
        <div className="space-y-6">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                    Catégorie
                </p>
                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={() => selectCategory(null)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${
                            !categoryParam
                                ? 'bg-blue-50/50 border-blue-200 text-blue-600 shadow-sm'
                                : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100 hover:border-slate-200'
                        }`}
                    >
                        <span className="text-xs font-bold">Toutes catégories</span>
                        {!categoryParam && <div className="size-2 bg-blue-600 rounded-full" />}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => selectCategory(cat)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${
                                categoryParam === cat
                                    ? 'bg-blue-50/50 border-blue-200 text-blue-600 shadow-sm'
                                    : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100 hover:border-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-1.5 rounded-full ${categoryParam === cat ? 'bg-blue-100/50' : 'bg-white shadow-sm'}`}
                                >
                                    {React.cloneElement(
                                        categoryIcons[cat] || categoryIcons.default,
                                        {
                                            size: 16,
                                            className:
                                                categoryParam === cat
                                                    ? 'text-blue-600'
                                                    : 'text-slate-400',
                                        }
                                    )}
                                </div>
                                <span className="text-xs font-bold line-clamp-1 text-left">
                                    {cat}
                                </span>
                            </div>
                            {categoryParam === cat && (
                                <div className="size-2 bg-blue-600 rounded-full shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                    Prix (FCFA)
                </p>
                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Min"
                        value={localMinPrice}
                        onChange={(e) => setLocalMinPrice(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-sm font-bold focus:outline-none focus:border-blue-400 transition-colors"
                    />
                    <span className="text-slate-400 shrink-0">—</span>
                    <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Max"
                        value={localMaxPrice}
                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-sm font-bold focus:outline-none focus:border-blue-400 transition-colors"
                    />
                </div>
            </div>

            <div className="py-1">
                <label className="flex items-center justify-between gap-3 cursor-pointer group w-full p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
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
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-colors border border-slate-300 peer-checked:border-blue-600" />
                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
                    </div>
                </label>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-12">
                <section className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-slate-900 min-h-[140px] sm:min-h-[300px] border border-slate-800 shadow-2xl shadow-slate-200/70">
                    <Image
                        src="/assets/A handsome Senegalese man in a modern Dakar office-studio, leaning back in a stylish chair with a look of pure satisfaction. On the wall behind him, a sleek Global Air.png"
                        alt="Boutique Global Air"
                        fill
                        priority
                        sizes="(min-width: 1280px) 1200px, 100vw"
                        className="object-cover object-center opacity-55"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/20" />

                    <div className="relative z-10 flex min-h-[140px] sm:min-h-[300px] flex-col justify-center p-4 sm:p-10 lg:p-12 max-w-2xl">
                        <div className="mb-2 sm:mb-5 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-blue-600 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white sm:py-1.5">
                                Boutique
                            </span>
                            <span className="hidden sm:inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-blue-100 backdrop-blur-md">
                                Livraison rapide
                            </span>
                            <span className="hidden sm:inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-blue-100 backdrop-blur-md">
                                Support WhatsApp
                            </span>
                        </div>

                        <h1 className="max-w-xl text-2xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                            <span className="sm:hidden">Équipez votre maison.</span>
                            <span className="hidden sm:inline">
                                Tout pour équiper votre maison.
                            </span>
                        </h1>
                        <p className="hidden sm:block mt-4 max-w-lg text-sm sm:text-base font-semibold leading-relaxed text-slate-200">
                            Climatisation, électroménager et confort maison au Sénégal, avec des
                            prix clairs en FCFA.
                        </p>
                        <button
                            type="button"
                            onClick={() => updateParams('sort', 'newest')}
                            className="hidden sm:block mt-7 w-fit rounded-2xl bg-white px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-xl shadow-black/20 transition-all hover:bg-blue-600 hover:text-white"
                        >
                            Voir les offres
                        </button>
                    </div>
                </section>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 lg:gap-12 px-4 sm:px-6 py-5 sm:py-12">
                {/* Sidebar desktop */}
                <aside className="hidden md:block w-72 shrink-0">
                    <div className="sticky top-28 space-y-6">
                        <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm">
                            {filterPanelContent}
                            <button
                                type="button"
                                onClick={applyPriceFilters}
                                className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
                            >
                                Appliquer le prix
                            </button>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group border border-slate-800">
                            <div className="relative z-10">
                                <div className="bg-blue-600 w-fit px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest mb-4">
                                    Offre Limitée
                                </div>
                                <h4 className="font-black text-2xl mb-2 tracking-tight">
                                    Pack Confort
                                </h4>
                                <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">
                                    Équipez votre maison pour l&apos;été et économisez jusqu&apos;à
                                    25%.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => updateParams('category', 'Climatisation')}
                                    className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-black/20"
                                >
                                    Découvrir l&apos;offre
                                </button>
                            </div>
                            <AirVent className="absolute -bottom-6 -right-6 size-32 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <div className="mb-4 sm:mb-6">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1 sm:mb-2">
                            Découvrir
                        </p>
                        <h2 className="text-2xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                            {categoryParam || 'Boutique'}
                        </h2>
                    </div>

                    {/* Sticky: search, filtres/tri, catégories */}
                    <div className="sticky top-16 sm:top-20 z-[140] -mx-4 px-4 sm:mx-0 sm:px-0 py-3 mb-4 bg-slate-50/95 backdrop-blur-md border-b border-slate-200/50 space-y-3">
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="relative flex-1 min-w-0">
                                <Search
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    value={localSearch}
                                    onChange={(e) => setLocalSearch(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl sm:rounded-2xl pl-10 pr-10 py-3 sm:py-3.5 font-bold text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all"
                                />
                                {localSearch && (
                                    <button
                                        type="button"
                                        onClick={() => setLocalSearch('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1 transition-colors"
                                    >
                                        <XIcon size={14} />
                                    </button>
                                )}
                            </div>

                            <div className="flex md:hidden gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={openFilters}
                                    aria-expanded={isSidebarOpen}
                                    aria-controls="shop-filters-sheet"
                                    className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border shadow-sm transition-all ${
                                        isSidebarOpen || activeFilterCount > 0
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-blue-600/20'
                                            : 'bg-white text-slate-900 border-slate-200'
                                    }`}
                                >
                                    <FilterIcon size={16} />
                                    Filtres
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-white text-blue-600 text-[9px] font-black border-2 border-blue-600">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSidebarOpen(false);
                                        setIsSortOpen(!isSortOpen);
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border shadow-sm min-w-0 transition-all ${
                                        isSortOpen
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white text-slate-900 border-slate-200'
                                    }`}
                                >
                                    <span className="truncate">{activeSort.label}</span>
                                    <ChevronDown
                                        size={14}
                                        className={`shrink-0 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                            </div>

                            <div className="hidden md:block relative shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 font-bold text-xs text-slate-700 hover:border-blue-600 transition-all shadow-sm min-w-[180px] h-full"
                                >
                                    {activeSort.icon}
                                    <span className="flex-1 text-left">{activeSort.label}</span>
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {isSortOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-full min-w-[200px] bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden"
                                        >
                                            {sortOptions.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => {
                                                        updateParams('sort', opt.value);
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-5 py-3 text-left font-bold text-xs transition-colors ${sortParam === opt.value ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                    {opt.icon} {opt.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <AnimatePresence>
                            {isSortOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    className="md:hidden bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                                >
                                    {sortOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => {
                                                updateParams('sort', opt.value);
                                                setIsSortOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-5 py-3.5 text-left font-bold text-sm ${sortParam === opt.value ? 'bg-blue-50 text-blue-600' : 'text-slate-600 active:bg-slate-50'}`}
                                        >
                                            {opt.icon} {opt.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Active Filter Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">
                            <PackageIcon size={14} /> {sortedAndFilteredProducts.length} articles
                        </div>
                        {(search || minPriceParam || maxPriceParam || inStockParam) && (
                            <>
                                <div className="h-4 w-px bg-slate-200 mx-2 hidden sm:block" />
                                {search && (
                                    <button
                                        onClick={() => removeFilter('search')}
                                        className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:border-red-200 hover:text-red-500 transition-all group"
                                    >
                                        Recherche: {search}{' '}
                                        <XIcon
                                            size={12}
                                            className="text-slate-300 group-hover:text-red-500"
                                        />
                                    </button>
                                )}
                                {(minPriceParam || maxPriceParam) && (
                                    <button
                                        onClick={() => {
                                            removeFilter('minPrice');
                                            removeFilter('maxPrice');
                                        }}
                                        className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:border-red-200 hover:text-red-500 transition-all group"
                                    >
                                        Prix: {minPriceParam || '0'} - {maxPriceParam || 'Max'}{' '}
                                        <XIcon
                                            size={12}
                                            className="text-slate-300 group-hover:text-red-500"
                                        />
                                    </button>
                                )}
                                {inStockParam && (
                                    <button
                                        onClick={() => removeFilter('inStock')}
                                        className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:border-red-200 hover:text-red-500 transition-all group"
                                    >
                                        En stock{' '}
                                        <XIcon
                                            size={12}
                                            className="text-slate-300 group-hover:text-red-500"
                                        />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={clearAllFilters}
                                    className="text-[10px] font-black text-red-500 hover:underline uppercase tracking-widest ml-2"
                                >
                                    Tout effacer
                                </button>
                            </>
                        )}
                    </div>

                    {/* Product Grid */}
                    <AnimatePresence mode="wait">
                        {sortedAndFilteredProducts.length > 0 ? (
                            <motion.div
                                key={categoryParam + sortParam + search}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-8 gap-y-6 sm:gap-y-16"
                            >
                                {sortedAndFilteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id || product.name}
                                        product={product}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 px-6 text-center shadow-sm"
                            >
                                <div className="size-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-8 border border-slate-100 shadow-inner">
                                    <Search size={48} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">
                                    Aucun résultat
                                </h3>
                                <p className="text-slate-500 font-medium max-w-xs mb-10">
                                    Nous n&apos;avons pas trouvé d&apos;articles correspondant à
                                    votre recherche.
                                </p>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
                                >
                                    Réinitialiser les filtres
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Panneau filtres mobile (bottom sheet) */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.button
                            type="button"
                            key="filters-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            aria-label="Fermer les filtres"
                            onClick={() => setIsSidebarOpen(false)}
                            className="md:hidden fixed inset-0 z-[200] bg-slate-900/55 backdrop-blur-sm border-0 cursor-default"
                        />
                        <motion.div
                            id="shop-filters-sheet"
                            key="filters-sheet"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="shop-filters-title"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                            className="md:hidden fixed inset-x-0 bottom-0 z-[210] bg-white rounded-t-[2rem] shadow-[0_-24px_80px_-20px_rgba(15,23,42,0.35)] max-h-[min(88vh,640px)] flex flex-col"
                        >
                            <div className="flex justify-center pt-3 pb-1 shrink-0">
                                <div className="w-10 h-1 rounded-full bg-slate-200" aria-hidden />
                            </div>

                            <div className="flex items-center justify-between px-5 py-2 border-b border-slate-100 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                        <ListFilter size={20} />
                                    </div>
                                    <h2
                                        id="shop-filters-title"
                                        className="text-xl font-black text-slate-900 tracking-tight"
                                    >
                                        Filtres
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="size-10 flex items-center justify-center bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"
                                    aria-label="Fermer"
                                >
                                    <XIcon size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-6">
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    Affinez par prix et disponibilité. Les catégories se choisissent
                                    dans la barre au-dessus des produits.
                                </p>
                                {filterPanelContent}
                            </div>

                            <div className="shrink-0 p-4 pb-6 border-t border-slate-100 bg-white space-y-2">
                                <button
                                    type="button"
                                    onClick={applyPriceFilters}
                                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-600/25 active:scale-[0.98] transition-all"
                                >
                                    Appliquer les filtres
                                </button>
                                {activeFilterCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={clearPriceAndStockFilters}
                                        className="w-full py-3 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        Réinitialiser prix et stock
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
