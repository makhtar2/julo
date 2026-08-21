'use client';
import React from 'react';
import { useCartStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';
import { HeartIcon, ShoppingBagIcon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function WishlistPage() {
    const wishlist = useCartStore((state) => state.wishlist);

    return (
        <div className="min-h-screen bg-slate-50/50 px-4 sm:px-6 py-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Ma Liste
                        </p>
                        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                            Mes Favoris
                        </h1>
                    </div>
                    <div className="shrink-0 flex items-center gap-3 text-sm font-bold text-slate-500 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                        <HeartIcon size={18} className="text-red-500" fill="currentColor" />
                        {wishlist.length} articles sauvegardés
                    </div>
                </div>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 gap-y-10">
                        {wishlist.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-24 sm:py-32 bg-white rounded-[3rem] border border-dashed border-slate-200 px-6 text-center shadow-sm"
                    >
                        <div className="size-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8">
                            <HeartIcon size={48} strokeWidth={1} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">
                            Votre liste est vide
                        </h3>
                        <p className="text-slate-500 font-medium max-w-xs mb-10">
                            Vous n&apos;avez pas encore ajouté d&apos;articles à vos favoris.
                        </p>
                        <Link
                            href="/shop"
                            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20"
                        >
                            Découvrir la boutique
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
