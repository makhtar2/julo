'use client';
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import {
    Smartphone,
    Laptop,
    Headphones,
    Watch,
    Cable,
    LayoutGrid,
    Search,
    ChevronDown,
    SortAsc,
    SortDesc,
    Star,
    X as XIcon,
    Filter as FilterIcon,
    Package as PackageIcon,
    Zap as ZapIcon,
    ArrowRight,
    Sparkles,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const getCategoryIcon = (catName) => {
    const name = (catName || '').toLowerCase();
    if (
        name.includes('phone') ||
        name.includes('téléphone') ||
        name.includes('apple') ||
        name.includes('samsung') ||
        name.includes('mobile') ||
        name.includes('iphone')
    ) {
        return <Smartphone size={18} strokeWidth={1.5} />;
    }
    if (
        name.includes('pc') ||
        name.includes('ordinateur') ||
        name.includes('laptop') ||
        name.includes('mac')
    ) {
        return <Laptop size={18} strokeWidth={1.5} />;
    }
    if (
        name.includes('audio') ||
        name.includes('casque') ||
        name.includes('écouteur') ||
        name.includes('airpod')
    ) {
        return <Headphones size={18} strokeWidth={1.5} />;
    }
    if (
        name.includes('charge') ||
        name.includes('cable') ||
        name.includes('accessoire') ||
        name.includes('gan')
    ) {
        return <Cable size={18} strokeWidth={1.5} />;
    }
    if (
        name.includes('montre') ||
        name.includes('watch') ||
        name.includes('wearable') ||
        name.includes('bracelet') ||
        name.includes('band')
    ) {
        return <Watch size={18} strokeWidth={1.5} />;
    }
    return <LayoutGrid size={18} strokeWidth={1.5} />;
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
    const juloCategories = [
        'Smartphones & Apple',
        'Samsung Galaxy',
        'Tecno, Infinix & Itel',
        'Xiaomi & Redmi',
        'Ordinateurs & PC',
        'Audio, Enceintes & Oraimo',
        'Accessoires & Énergie',
        'Montres & Wearables',
    ];
    const categories = juloCategories;

    const sortedAndFilteredProducts = useMemo(() => {
        let result = products.filter((product) => {
            const matchesSearch = search
                ? product.name.toLowerCase().includes(search.toLowerCase()) ||
                  (product.description &&
                      product.description.toLowerCase().includes(search.toLowerCase()))
                : true;
            const catLower = categoryParam?.toLowerCase() || '';
            const productCat = (product.Category?.name || product.category || '').toLowerCase();
            const matchesCategory = categoryParam
                ? productCat === catLower ||
                  productCat.includes(catLower) ||
                  catLower.includes(productCat)
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
                    const avgA =
                        a.rating?.reduce((sum, r) => sum + r.rating, 0) / (a.rating?.length || 1) ||
                        0;
                    const avgB =
                        b.rating?.reduce((sum, r) => sum + r.rating, 0) / (b.rating?.length || 1) ||
                        0;
                    return avgB - avgA;
                });
                break;
            case 'newest':
            default:
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        return result;
    }, [products, search, categoryParam, minPriceParam, maxPriceParam, inStockParam, sortParam]);

    const selectCategory = (category) => {
        updateParams('category', category);
        setIsSidebarOpen(false);
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

    const filterPanelContent = (
        <div className="space-y-6">
            <div>
                <p className="text-[10px] font-extrabold text-[#8C8275] uppercase tracking-[0.2em] mb-3">
                    Catégories
                </p>
                <div className="space-y-1.5">
                    <button
                        type="button"
                        onClick={() => selectCategory(null)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all border text-xs font-bold ${
                            !categoryParam
                                ? 'bg-[#1C1B1F] text-white border-[#1C1B1F] shadow-sm'
                                : 'bg-[#F5F2EB] border-transparent text-[#4A4742] hover:bg-white hover:border-[#EAE6DF]'
                        }`}
                    >
                        <span>Toutes catégories</span>
                        {!categoryParam && <div className="size-1.5 bg-[#C59A63] rounded-full" />}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => selectCategory(cat)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all border text-xs font-bold ${
                                categoryParam === cat
                                    ? 'bg-[#1C1B1F] text-white border-[#1C1B1F] shadow-sm'
                                    : 'bg-[#F5F2EB] border-transparent text-[#4A4742] hover:bg-white hover:border-[#EAE6DF]'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <span
                                    className={
                                        categoryParam === cat ? 'text-[#C59A63]' : 'text-[#8C8275]'
                                    }
                                >
                                    {getCategoryIcon(cat)}
                                </span>
                                <span className="line-clamp-1 text-left">{cat}</span>
                            </div>
                            {categoryParam === cat && (
                                <div className="size-1.5 bg-[#C59A63] rounded-full shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div>
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
                        className="w-full bg-[#F5F2EB] border border-[#EAE6DF] rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#C59A63] transition-colors"
                    />
                    <span className="text-[#8C8275] shrink-0">—</span>
                    <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Max"
                        value={localMaxPrice}
                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                        className="w-full bg-[#F5F2EB] border border-[#EAE6DF] rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#C59A63] transition-colors"
                    />
                </div>
            </div>

            <div className="py-1">
                <label className="flex items-center justify-between gap-3 cursor-pointer group w-full p-3.5 bg-[#F5F2EB] rounded-2xl border border-[#EAE6DF]">
                    <span className="text-xs font-bold text-[#1C1B1F]">En stock uniquement</span>
                    <div className="relative shrink-0">
                        <input
                            type="checkbox"
                            checked={inStockParam}
                            onChange={(e) =>
                                updateParams('inStock', e.target.checked ? 'true' : null)
                            }
                            className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-zinc-300 rounded-full peer peer-checked:bg-[#C59A63] transition-colors" />
                        <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-xs" />
                    </div>
                </label>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAF8F5] pb-20">
            {/* Shop Hero Banner (Warm Luxury Dark Card) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
                <section className="relative overflow-hidden rounded-[2.5rem] bg-[#1C1B1F] text-white p-8 sm:p-12 border border-[#33302A] shadow-xl min-h-[220px] flex flex-col justify-center">
                    {/* Glowing Golden Ring Halo */}
                    <div className="absolute -right-10 -bottom-10 size-72 rounded-full border border-[#D4AF37]/30 shadow-[0_0_80px_rgba(212,175,55,0.15)] pointer-events-none" />

                    <div className="relative z-10 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C2924] border border-[#3D3A34] text-[10px] font-extrabold uppercase tracking-widest text-[#C59A63] mb-4">
                            <Sparkles size={12} />
                            CATALOGUE OFFICIEL JULO
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                            Smartphones, Ordinateurs &amp; High-Tech.
                        </h1>
                        <p className="mt-2 text-zinc-400 text-xs sm:text-sm font-normal leading-relaxed">
                            Équipements électroniques certifiés neufs avec garantie constructeur au
                            Sénégal.
                        </p>
                    </div>
                </section>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-4 sm:px-6 lg:px-8 pt-8">
                {/* Sidebar Desktop */}
                <aside className="hidden md:block w-64 shrink-0">
                    <div className="sticky top-28 space-y-6">
                        <div className="bg-white rounded-3xl p-5 border border-[#EAE6DF] shadow-xs">
                            {filterPanelContent}
                            <button
                                type="button"
                                onClick={applyPriceFilters}
                                className="w-full mt-4 py-2.5 bg-[#1C1B1F] hover:bg-[#C59A63] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-xs"
                            >
                                Filtrer par Prix
                            </button>
                        </div>

                        {/* WhatsApp Advice Promo Card */}
                        <div className="bg-gradient-to-br from-[#24221E] to-[#1C1B1F] rounded-3xl p-6 text-white border border-[#33302A] shadow-sm">
                            <span className="bg-[#C59A63] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                                Conseil VIP
                            </span>
                            <h4 className="font-bold text-base mt-3 mb-1">
                                Besoin d&apos;un Conseil ?
                            </h4>
                            <p className="text-zinc-400 text-xs font-normal mb-5 leading-relaxed">
                                Notre équipe vous guide pour choisir le smartphone ou PC adapté à
                                vos besoins.
                            </p>
                            <a
                                href="https://wa.me/221754469097?text=Bonjour%20JULO,%20je%20souhaite%20un%20conseil%20pour%20choisir%20un%20appareil"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-white text-[#1C1B1F] hover:bg-[#C59A63] hover:text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
                            >
                                <span>Discuter sur WhatsApp</span>
                                <ArrowRight size={13} />
                            </a>
                        </div>
                    </div>
                </aside>

                {/* Products Grid Area */}
                <div className="flex-1 min-w-0">
                    {/* Filter & Sort Bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
                        {/* Search Input */}
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 bg-[#F5F2EB] rounded-full p-1 transition-colors"
                                >
                                    <XIcon size={12} />
                                </button>
                            )}
                        </div>

                        {/* Mobile Filter Button */}
                        <div className="flex md:hidden gap-2">
                            <button
                                type="button"
                                onClick={() => setIsSidebarOpen(true)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#EAE6DF] rounded-full text-xs font-bold text-[#1C1B1F] shadow-xs"
                            >
                                <FilterIcon size={14} />
                                <span>
                                    Filtres {activeFilterCount > 0 && `(${activeFilterCount})`}
                                </span>
                            </button>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-2 bg-white border border-[#EAE6DF] px-4 py-2.5 rounded-full text-xs font-bold text-[#1C1B1F] shadow-xs hover:border-[#C59A63] transition-colors"
                            >
                                <span>
                                    {sortOptions.find((s) => s.value === sortParam)?.label ||
                                        'Trier par'}
                                </span>
                                <ChevronDown size={14} />
                            </button>

                            <AnimatePresence>
                                {isSortOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="absolute right-0 mt-2 w-48 bg-white border border-[#EAE6DF] rounded-2xl shadow-xl overflow-hidden p-1.5 z-50"
                                    >
                                        {sortOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => {
                                                    updateParams('sort', opt.value);
                                                    setIsSortOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                                                    sortParam === opt.value
                                                        ? 'bg-[#1C1B1F] text-white'
                                                        : 'text-zinc-700 hover:bg-[#FAF8F5]'
                                                }`}
                                            >
                                                <span>{opt.icon}</span>
                                                <span>{opt.label}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mobile Horizontal Category Pills Carousel */}
                    <div className="flex md:hidden items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4 -mx-4 px-4">
                        <button
                            type="button"
                            onClick={() => selectCategory(null)}
                            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                                !categoryParam
                                    ? 'bg-[#1C1B1F] text-white border-[#1C1B1F] shadow-xs'
                                    : 'bg-white text-[#4A4742] border-[#EAE6DF] hover:bg-[#FAF8F5]'
                            }`}
                        >
                            Tous ({products.length})
                        </button>
                        {categories.map((cat) => {
                            const isSelected = categoryParam === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => selectCategory(cat)}
                                    className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all border ${
                                        isSelected
                                            ? 'bg-[#1C1B1F] text-white border-[#1C1B1F] shadow-xs'
                                            : 'bg-white text-[#4A4742] border-[#EAE6DF] hover:bg-[#FAF8F5]'
                                    }`}
                                >
                                    <span
                                        className={isSelected ? 'text-[#C59A63]' : 'text-[#8C8275]'}
                                    >
                                        {getCategoryIcon(cat)}
                                    </span>
                                    <span>{cat}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Results Count */}
                    <div className="mb-4 flex items-center justify-between text-xs text-[#8C8275]">
                        <span>
                            <strong className="text-[#1C1B1F]">
                                {sortedAndFilteredProducts.length}
                            </strong>{' '}
                            produits trouvés
                        </span>
                        {categoryParam && (
                            <button
                                onClick={() => selectCategory(null)}
                                className="text-[#C59A63] hover:underline font-semibold flex items-center gap-1"
                            >
                                <span>Effacer le filtre ({categoryParam})</span>
                                <XIcon size={12} />
                            </button>
                        )}
                    </div>

                    {/* Products Grid */}
                    {sortedAndFilteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {sortedAndFilteredProducts.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    priority={index < 4}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE6DF] my-8">
                            <PackageIcon size={40} className="mx-auto text-zinc-300 mb-3" />
                            <h3 className="font-bold text-base text-[#1C1B1F]">
                                Aucun produit trouvé
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                                Essayez de modifier vos critères de recherche ou vos filtres.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-[200] md:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-[2.5rem] p-6 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DF] mb-6">
                                <h3 className="font-black text-lg text-[#1C1B1F]">Filtres</h3>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-1 rounded-full bg-[#F5F2EB]"
                                >
                                    <XIcon size={18} />
                                </button>
                            </div>
                            {filterPanelContent}
                            <button
                                type="button"
                                onClick={applyPriceFilters}
                                className="w-full mt-6 py-3 bg-[#1C1B1F] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md"
                            >
                                Appliquer les filtres
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
