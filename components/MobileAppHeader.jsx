'use client';
import React from 'react';
import { ArrowLeft, ShoppingCart, Heart, Share2, Search } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store';
import { useHasMounted } from '@/lib/useHasMounted';
import toast from 'react-hot-toast';

export default function MobileAppHeader({ title: customTitle, onSearchClick }) {
    const router = useRouter();
    const pathname = usePathname();
    const mounted = useHasMounted();
    const cart = useCartStore((state) => state.cart);
    const wishlist = useCartStore((state) => state.wishlist);

    const cartCount = Array.isArray(cart)
        ? cart.reduce((acc, item) => acc + (item.quantity || 1), 0)
        : 0;
    const wishlistCount = wishlist?.length || 0;

    // Determine screen title
    const getScreenTitle = () => {
        if (customTitle) return customTitle;
        if (pathname === '/shop') return 'Boutique';
        if (pathname === '/cart') return 'Mon Panier';
        if (pathname === '/wishlist') return 'Mes Favoris';
        if (pathname === '/profile') return 'Mon Compte';
        if (pathname === '/orders') return 'Mes Commandes';
        if (pathname === '/track') return 'Suivi de Commande';
        if (pathname === '/about') return 'À Propos de JULO';
        if (pathname === '/contact') return 'Contact & Support';
        if (pathname === '/login') return 'Connexion';
        if (pathname?.startsWith('/product/')) return 'Détails du Produit';
        if (pathname?.startsWith('/order-confirmed/')) return 'Confirmation';
        return 'JULO';
    };

    const handleBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    const handleShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: document.title || 'JULO Sénégal',
                    url: window.location.href,
                });
            } catch {
                // User cancelled share
            }
        } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Lien copié dans le presse-papier !');
        }
    };

    const isProductPage = pathname?.startsWith('/product/');
    const isCartPage = pathname === '/cart';
    const isWishlistPage = pathname === '/wishlist';

    return (
        <header className="sm:hidden sticky top-0 z-[120] bg-white/95 backdrop-blur-md border-b border-[#EAE6DF] px-4 py-2.5 flex items-center justify-between shadow-xs">
            {/* Native Back Button */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleBack}
                aria-label="Retour"
                className="size-9 rounded-full bg-[#F5F2EB] border border-[#EAE6DF] flex items-center justify-center text-[#1C1B1F] active:bg-[#EAE6DF] transition-colors shrink-0"
            >
                <ArrowLeft size={18} strokeWidth={2.4} />
            </motion.button>

            {/* Screen Title */}
            <h1 className="text-sm font-black text-[#1C1B1F] tracking-tight truncate max-w-[200px] text-center px-2">
                {getScreenTitle()}
            </h1>

            {/* Right Native Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
                {isProductPage ? (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleShare}
                        aria-label="Partager ce produit"
                        className="size-9 rounded-full bg-[#F5F2EB] border border-[#EAE6DF] flex items-center justify-center text-[#1C1B1F] active:bg-[#EAE6DF] transition-colors"
                    >
                        <Share2 size={16} strokeWidth={2.2} />
                    </motion.button>
                ) : isCartPage ? (
                    <Link
                        href="/wishlist"
                        aria-label="Mes Favoris"
                        className="relative size-9 rounded-full bg-[#F5F2EB] border border-[#EAE6DF] flex items-center justify-center text-[#1C1B1F] active:scale-95 transition-all"
                    >
                        <Heart size={16} strokeWidth={2.2} />
                        {mounted && wishlistCount > 0 && (
                            <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>
                ) : isWishlistPage ? (
                    <Link
                        href="/cart"
                        aria-label="Mon Panier"
                        className="relative size-9 rounded-full bg-[#F5F2EB] border border-[#EAE6DF] flex items-center justify-center text-[#1C1B1F] active:scale-95 transition-all"
                    >
                        <ShoppingCart size={16} strokeWidth={2.2} />
                        {mounted && cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 size-4 bg-[#10B981] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                ) : (
                    <Link
                        href="/cart"
                        aria-label="Mon Panier"
                        className="relative size-9 rounded-full bg-[#F5F2EB] border border-[#EAE6DF] flex items-center justify-center text-[#1C1B1F] active:scale-95 transition-all"
                    >
                        <ShoppingCart size={16} strokeWidth={2.2} />
                        {mounted && cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 size-4 bg-[#10B981] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                )}
            </div>
        </header>
    );
}
