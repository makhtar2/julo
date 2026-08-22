'use client';
import Counter from '@/components/Counter';
import OrderSummary from '@/components/OrderSummary';
import {
    Trash2Icon,
    ShoppingCart,
    ArrowRight,
    ShoppingBag,
    ArrowLeft,
    Bell,
    X,
} from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import { useHasMounted } from '@/lib/useHasMounted';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Cart() {
    const cart = useCartStore((state) => state.cart);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const totalPrice = useCartStore((state) => state.getTotalPrice());
    const itemCount = useCartStore((state) =>
        state.cart.reduce((acc, item) => acc + item.quantity, 0)
    );
    const mounted = useHasMounted();
    const router = useRouter();

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#FAF8F5] px-4 sm:px-6 pt-3 sm:pt-6 pb-48 sm:pb-16 lg:pb-16">
            <div className="max-w-7xl mx-auto">
                {/* Mobile Header Matching Screen 3 ("My Cart") */}
                <div className="sm:hidden flex items-center justify-between mb-4 pt-1">
                    <button
                        onClick={() => router.back()}
                        aria-label="Retour"
                        className="size-10 rounded-full bg-white border border-[#EAE6DF] shadow-xs flex items-center justify-center text-[#1C1B1F] active:scale-95 transition-all"
                    >
                        <ArrowLeft size={18} strokeWidth={2.2} />
                    </button>

                    <h1 className="text-base font-black text-[#1C1B1F] tracking-tight">My Cart</h1>

                    <Link
                        href="/shop?sort=newest"
                        aria-label="Notifications"
                        className="size-10 rounded-full bg-white border border-[#EAE6DF] shadow-xs flex items-center justify-center text-[#1C1B1F] relative active:scale-95 transition-all"
                    >
                        <Bell size={18} strokeWidth={2.2} />
                        <span className="absolute top-2.5 right-2.5 size-2 bg-[#10B981] rounded-full ring-2 ring-white" />
                    </Link>
                </div>

                {/* Desktop Header */}
                <div className="hidden sm:block mb-6 sm:mb-10">
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
                            className="flex items-center gap-2 shrink-0 text-[10px] sm:text-xs font-bold text-[#1C1B1F] uppercase tracking-wider hover:text-[#10B981] transition-colors bg-white border border-[#EAE6DF] px-4 py-2.5 rounded-full shadow-xs"
                        >
                            <ShoppingBag size={14} className="text-[#10B981]" />
                            <span>Continuer mes achats</span>
                        </Link>
                    </div>
                </div>

                {cart.length > 0 ? (
                    <>
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 xl:gap-16">
                            {/* Articles List */}
                            <div className="flex-1 space-y-3">
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
                                                className="bg-white border border-[#EAE6DF] rounded-2xl p-3 sm:p-5 shadow-xs mb-3 relative"
                                            >
                                                {/* Mobile Card Layout (Exact Mockup Look) */}
                                                <div className="flex gap-3 items-center">
                                                    {/* Left: Square Thumbnail */}
                                                    <Link
                                                        href={`/product/${item.id}`}
                                                        className="shrink-0 size-20 sm:size-24 bg-[#F4F4F6] sm:bg-[#F5F2EB] rounded-2xl flex items-center justify-center p-2 border border-[#EAE6DF] hover:border-[#10B981] transition-all overflow-hidden"
                                                    >
                                                        <Image
                                                            src={
                                                                item.images?.[0] ||
                                                                '/placeholder-image.png'
                                                            }
                                                            className="w-full h-full object-contain rounded-lg"
                                                            alt={item.name}
                                                            width={96}
                                                            height={96}
                                                        />
                                                    </Link>

                                                    {/* Middle: Details */}
                                                    <div className="flex-1 min-w-0 pr-6 sm:pr-0">
                                                        <Link href={`/product/${item.id}`}>
                                                            <h3 className="text-[#1C1B1F] font-bold text-xs sm:text-sm leading-snug line-clamp-1 hover:text-[#10B981] transition-colors">
                                                                {item.name}
                                                            </h3>
                                                        </Link>
                                                        <p className="text-[10px] font-medium text-zinc-400 mt-0.5">
                                                            {item.Category?.name ||
                                                                item.category ||
                                                                'High-Tech'}
                                                        </p>
                                                        <p className="text-[#1C1B1F] font-black text-xs sm:text-sm mt-1">
                                                            {item.price?.toLocaleString('fr-SN')}{' '}
                                                            <small className="text-[9px] text-[#8C8275] font-bold">
                                                                FCFA
                                                            </small>
                                                        </p>

                                                        {/* Mobile Bottom Row: Stepper */}
                                                        <div className="flex items-center justify-between mt-2 sm:hidden">
                                                            <div className="scale-90 origin-left">
                                                                <Counter productId={item.id} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Top Right: Delete Cross (Mobile & Desktop) */}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.id)}
                                                        aria-label="Supprimer"
                                                        className="absolute top-3 right-3 text-zinc-300 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <X size={16} strokeWidth={2.2} />
                                                    </button>

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

                            {/* Summary & Checkout */}
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
                            <ShoppingCart size={36} className="text-[#10B981]" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-[#1C1B1F] mb-2">
                            Votre panier est vide
                        </h3>
                        <p className="text-[#8C8275] font-normal mb-8 max-w-sm text-xs sm:text-sm">
                            Parcourez notre catalogue et profitez de nos offres exclusives.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1C1B1F] hover:bg-[#10B981] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
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
