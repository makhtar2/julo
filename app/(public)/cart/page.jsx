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
        <div className="min-h-screen bg-[#FAF8F5] px-4 sm:px-6 pt-6 pb-44 sm:pb-16 lg:pb-16">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-10">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-black text-[#1C1B1F] tracking-tight">
                                Mon Panier
                            </h1>
                            <p className="text-xs sm:text-sm text-[#8C8275] font-medium mt-1">
                                {cart.length > 0
                                    ? `${itemCount} article${itemCount > 1 ? 's' : ''}`
                                    : 'Panier vide'}
                            </p>
                        </div>
                        <Link
                            href="/shop"
                            className="flex items-center gap-2 shrink-0 text-[10px] sm:text-xs font-bold text-[#1C1B1F] uppercase tracking-wider hover:text-[#C59A63] transition-colors bg-[#F5F2EB] border border-[#EAE6DF] px-4 py-2.5 rounded-full"
                        >
                            <ShoppingBag size={14} className="text-[#C59A63]" />
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
                                <p className="lg:hidden text-[10px] font-extrabold text-[#8C8275] uppercase tracking-[0.2em]">
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
                                                className="bg-white border border-[#EAE6DF] rounded-2xl p-4 sm:p-5 shadow-xs mb-3"
                                            >
                                                <div className="flex gap-3 sm:gap-6 items-center">
                                                    <Link
                                                        href={`/product/${item.id}`}
                                                        className="shrink-0 size-20 sm:size-24 bg-[#F5F2EB] rounded-xl flex items-center justify-center p-1 border border-[#EAE6DF] hover:border-[#C59A63] transition-all overflow-hidden"
                                                    >
                                                        <Image
                                                            src={
                                                                item.images?.[0] ||
                                                                '/placeholder-image.png'
                                                            }
                                                            className="w-full h-full object-cover rounded-lg"
                                                            alt={item.name}
                                                            width={96}
                                                            height={96}
                                                        />
                                                    </Link>

                                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                        {item.category && (
                                                            <p className="text-[9px] font-bold text-[#8C8275] uppercase tracking-wider mb-0.5">
                                                                {item.category}
                                                            </p>
                                                        )}
                                                        <Link href={`/product/${item.id}`}>
                                                            <h3 className="text-[#1C1B1F] font-bold text-xs sm:text-sm leading-snug line-clamp-2 hover:text-[#C59A63] transition-colors">
                                                                {item.name}
                                                            </h3>
                                                        </Link>
                                                        <p className="text-[#C59A63] font-extrabold text-xs sm:text-sm mt-1 hidden sm:block">
                                                            {item.price?.toLocaleString('fr-SN')}{' '}
                                                            <small className="text-[10px] text-[#8C8275]">
                                                                FCFA
                                                            </small>
                                                        </p>

                                                        {/* Mobile Actions */}
                                                        <div className="flex items-center justify-between mt-3 sm:hidden">
                                                            <div className="flex flex-col">
                                                                <span className="text-[#C59A63] font-bold text-xs">
                                                                    {lineTotal?.toLocaleString(
                                                                        'fr-SN'
                                                                    )}{' '}
                                                                    <small className="text-[9px] text-[#8C8275]">
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
                                                                    className="size-8 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                                >
                                                                    <Trash2Icon size={15} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Desktop Actions */}
                                                    <div className="hidden sm:flex items-center gap-6">
                                                        <Counter productId={item.id} />
                                                        <div className="text-right min-w-[100px]">
                                                            <p className="text-[#1C1B1F] font-black text-base">
                                                                {lineTotal?.toLocaleString('fr-SN')}{' '}
                                                                <small className="text-[10px] text-[#8C8275]">
                                                                    FCFA
                                                                </small>
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="size-9 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        >
                                                            <Trash2Icon size={18} />
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
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 sm:p-20 rounded-3xl border border-[#EAE6DF] flex flex-col items-center text-center shadow-xs"
                    >
                        <div className="size-20 sm:size-24 bg-[#F5F2EB] rounded-full flex items-center justify-center text-[#8C8275] mb-6">
                            <ShoppingCart size={36} className="text-[#C59A63]" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-[#1C1B1F] mb-2">
                            Votre panier est vide
                        </h3>
                        <p className="text-[#8C8275] font-normal mb-8 max-w-sm text-xs sm:text-sm">
                            Parcourez notre collection d&apos;équipements et nos articles de
                            sérigraphie.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1C1B1F] hover:bg-[#C59A63] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
                        >
                            <span>Voir la boutique</span>
                            <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
