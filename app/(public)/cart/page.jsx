'use client';
import Counter from '@/components/Counter';
import OrderSummary from '@/components/OrderSummary';
import { Trash2Icon, ShoppingCart, ArrowRight, ShoppingBag } from 'lucide-react';

import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import { useHasMounted } from '@/lib/useHasMounted';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Cart() {
    const cart = useCartStore((state) => state.cart);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const totalPrice = useCartStore((state) => state.getTotalPrice());
    const itemCount = useCartStore((state) =>
        state.cart.reduce((acc, item) => acc + item.quantity, 0)
    );
    const mounted = useHasMounted();

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-slate-50/30 px-4 sm:px-6 pt-4 pb-44 sm:pb-16 lg:pb-16">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-4 sm:mb-10">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                Mon panier
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                                {cart.length > 0
                                    ? `${itemCount} article${itemCount > 1 ? 's' : ''}`
                                    : 'Panier vide'}
                            </p>
                        </div>
                        <Link
                            href="/shop"
                            className="flex items-center gap-2 shrink-0 text-[10px] sm:text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors bg-blue-50 px-3 py-2 rounded-xl"
                        >
                            <ShoppingBag size={14} />
                            <span className="hidden sm:inline">Continuer mes achats</span>
                            <span className="sm:hidden">+ Ajouter</span>
                        </Link>
                    </div>
                </div>

                {cart.length > 0 ? (
                    <>
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 xl:gap-16">
                            {/* Articles */}
                            <div className="flex-1 space-y-3">
                                <p className="lg:hidden text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    Vos articles
                                </p>

                                <AnimatePresence mode="popLayout">
                                    {cart.map((item) => {
                                        const lineTotal = item.price * item.quantity;
                                        return (
                                            <motion.article
                                                layout
                                                key={item.id}
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -40, scale: 0.96 }}
                                                transition={{ duration: 0.25 }}
                                                className="bg-white border-b border-slate-100 py-5 first:pt-0 last:border-0"
                                            >
                                                <div className="flex gap-3 sm:gap-6 items-center">
                                                    <Link
                                                        href={`/product/${item.id}`}
                                                        className="shrink-0 size-20 sm:size-24 bg-slate-50 rounded-xl flex items-center justify-center p-2 border border-slate-100 hover:scale-105 transition-transform"
                                                    >
                                                        <Image
                                                            src={item.images[0]}
                                                            className="w-full h-auto object-contain"
                                                            alt={item.name}
                                                            width={80}
                                                            height={80}
                                                        />
                                                    </Link>

                                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                        {item.category && (
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">
                                                                {item.category}
                                                            </p>
                                                        )}
                                                        <Link href={`/product/${item.id}`}>
                                                            <h3 className="text-slate-900 font-bold text-sm sm:text-base leading-snug line-clamp-2 hover:text-blue-600 transition-colors">
                                                                {item.name}
                                                            </h3>
                                                        </Link>
                                                        <p className="text-blue-600 font-black text-sm mt-1 hidden sm:block">
                                                            {item.price.toLocaleString('fr-SN')}{' '}
                                                            <small className="text-[10px]">
                                                                FCFA
                                                            </small>
                                                        </p>

                                                        {/* Mobile Actions */}
                                                        <div className="flex items-center justify-between mt-3 sm:hidden">
                                                            <div className="flex flex-col">
                                                                <span className="text-blue-600 font-black text-sm">
                                                                    {lineTotal.toLocaleString(
                                                                        'fr-SN'
                                                                    )}{' '}
                                                                    <small className="text-[9px]">
                                                                        FCFA
                                                                    </small>
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <Counter productId={item.id} />
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeFromCart(item.id)
                                                                    }
                                                                    className="size-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                                >
                                                                    <Trash2Icon size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Desktop Actions */}
                                                    <div className="hidden sm:flex items-center gap-6">
                                                        <Counter productId={item.id} />
                                                        <div className="text-right min-w-[100px]">
                                                            <p className="text-slate-900 font-black text-lg">
                                                                {lineTotal.toLocaleString('fr-SN')}{' '}
                                                                <small className="text-[10px]">
                                                                    FCFA
                                                                </small>
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="size-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        >
                                                            <Trash2Icon size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.article>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>

                            {/* Checkout */}
                            <div className="lg:w-[400px] shrink-0">
                                <div className="lg:sticky lg:top-24">
                                    <OrderSummary totalPrice={totalPrice} items={cart} />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 sm:p-24 rounded-2xl sm:rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center text-center shadow-sm"
                    >
                        <div className="size-20 sm:size-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 relative">
                            <ShoppingCart size={40} />
                            <motion.div
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -top-1 -right-1 size-5 bg-red-400 rounded-full border-4 border-white"
                            />
                        </div>
                        <h3 className="text-xl sm:text-3xl font-black text-slate-900 mb-2 sm:mb-4">
                            Votre panier est vide
                        </h3>
                        <p className="text-slate-500 font-medium mb-8 max-w-sm text-sm">
                            Parcourez la boutique et ajoutez vos équipements en un clic.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-blue-600/25 hover:bg-blue-700 active:scale-[0.98] transition-all"
                        >
                            Voir la boutique
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
