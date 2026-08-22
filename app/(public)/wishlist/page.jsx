'use client';
import React from 'react';
import { useCartStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';
import { HeartIcon, ArrowLeft, Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function WishlistPage() {
    const wishlist = useCartStore((state) => state.wishlist);
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#FAF8F5] px-4 sm:px-6 lg:px-8 py-4 sm:py-10 pb-28 sm:pb-16">
            <div className="max-w-7xl mx-auto">
                {/* Desktop Header */}
                <div className="hidden sm:flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-px w-8 bg-[#D6CEBE]" />
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#8C8275]">
                                MES SÉLECTIONS
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-[#1C1B1F] tracking-tight">
                            Mes Favoris
                        </h1>
                    </div>
                    <div className="shrink-0 flex items-center gap-3 text-xs font-bold text-[#1C1B1F] bg-white px-5 py-3 rounded-full border border-[#EAE6DF] shadow-xs">
                        <HeartIcon size={16} className="text-red-500" fill="currentColor" />
                        <span>
                            {wishlist.length} article{wishlist.length > 1 ? 's' : ''} sauvegardé
                            {wishlist.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* 2-Column Grid (Exact Mockup Layout) */}
                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                        {wishlist.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-[#EAE6DF] px-6 text-center shadow-xs"
                    >
                        <div className="size-20 bg-[#FAF8F5] rounded-full flex items-center justify-center text-zinc-300 mb-6">
                            <HeartIcon size={36} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-[#1C1B1F] mb-2">
                            Votre liste de favoris est vide
                        </h3>
                        <p className="text-[#8C8275] font-normal text-xs sm:text-sm max-w-xs mb-8">
                            Explorez nos smartphones, ordinateurs et accessoires pour ajouter vos
                            coups de cœur.
                        </p>
                        <Link
                            href="/shop"
                            className="px-8 py-3.5 bg-[#1C1B1F] hover:bg-[#10B981] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
                        >
                            Découvrir la Boutique
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
