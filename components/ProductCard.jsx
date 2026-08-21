'use client';
import { ShoppingCart, StarIcon, HeartIcon, ZapIcon, CreditCard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useCartStore } from '@/lib/store';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { trackEvent } from './Analytics';
import { useRouter } from 'next/navigation';

const ProductCard = ({ product, priority = false }) => {
    const addToCart = useCartStore((state) => state.addToCart);
    const toggleWishlist = useCartStore((state) => state.toggleWishlist);
    const wishlist = useCartStore((state) => state.wishlist);
    const isInWishlist = wishlist.some((item) => item.id === product.id);
    const router = useRouter();

    // Date.now() est impur : calculé une seule fois au montage (chaque produit a sa propre
    // instance grâce à key={product.id} dans les listes), pas à chaque rendu.
    const [isNew] = useState(
        () => new Date(product.createdAt) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    );
    const isOutOfStock = !product.inStock || product.stock <= 0;

    const rating =
        product.rating && product.rating.length > 0
            ? Math.round(
                  product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length
              )
            : 0;

    const handleBuyNow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        trackEvent('buy_now', {
            product_id: product.id,
            product_name: product.name,
            price: product.price,
        });
        router.push('/cart');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full"
        >
            {/* 1. IMAGE AREA - EDGE TO EDGE FOR MAX VISIBILITY */}
            <div className="relative aspect-square bg-slate-50 w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden group-hover:bg-slate-100/50 transition-colors">
                <Link
                    href={`/product/${product.id}`}
                    className={`block w-full h-full ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                >
                    <Image
                        width={400}
                        height={400}
                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                        src={product.images?.[0] || '/placeholder-image.png'}
                        alt={product.name}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority={priority}
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {isOutOfStock ? (
                        <div className="bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Épuisé
                        </div>
                    ) : (
                        <>
                            {product.mrp > product.price && (
                                <div className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                    -
                                    {Math.round(
                                        ((product.mrp - product.price) / product.mrp) * 100
                                    )}
                                    %
                                </div>
                            )}
                            {isNew && (
                                <div className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                    New
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Wishlist */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const added = toggleWishlist(product);
                        trackEvent(added ? 'add_to_wishlist' : 'remove_from_wishlist', {
                            product_id: product.id,
                            product_name: product.name,
                        });
                        toast.success(added ? 'Ajouté aux favoris' : 'Retiré des favoris');
                    }}
                    aria-label={isInWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    className={`absolute top-2 right-2 size-7 sm:size-8 bg-white/90 rounded-full flex items-center justify-center z-20 shadow-sm border ${isInWishlist ? 'text-red-500 border-red-200' : 'text-slate-400 border-slate-100 hover:text-red-500'}`}
                >
                    <HeartIcon
                        className="size-3.5 sm:size-4"
                        fill={isInWishlist ? 'currentColor' : 'none'}
                        strokeWidth={2}
                    />
                </button>

                {/* Quick Add to Cart */}
                {!isOutOfStock && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product);
                            trackEvent('add_to_cart', {
                                product_id: product.id,
                                product_name: product.name,
                                price: product.price,
                            });
                            toast.success('Ajouté au panier');
                        }}
                        className="absolute bottom-2 right-2 size-8 sm:size-10 bg-slate-900/95 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 hover:scale-110 transition-all z-20 group/cartbtn"
                        aria-label="Ajouter au panier"
                    >
                        <ShoppingCart
                            className="size-4 sm:size-[18px] group-hover/cartbtn:animate-bounce"
                            strokeWidth={2.5}
                        />
                    </button>
                )}
            </div>

            {/* 2. INFORMATION AREA */}
            <div className="flex flex-col flex-1 p-2.5 sm:p-4">
                <Link href={`/product/${product.id}`} className="block flex-1 mb-2">
                    <div className="flex items-center justify-between gap-1 mb-1">
                        <p className="text-[9px] sm:text-[10px] font-bold text-slate-700 uppercase tracking-wider truncate">
                            {product.Category?.name || product.category || 'Général'}
                        </p>
                        <div className="flex items-center gap-0.5">
                            <StarIcon size={10} className="fill-amber-400 text-amber-400" />
                            <span className="text-[9px] font-bold text-slate-700">
                                {rating > 0 ? rating : '5.0'}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-slate-900 font-bold text-[11px] sm:text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price & Action Area */}
                <div className="mt-auto pt-2 border-t border-slate-100 flex items-end justify-between gap-1 sm:gap-2">
                    <div className="flex flex-col">
                        {product.mrp > product.price && (
                            <span className="text-slate-400 text-[9px] sm:text-[10px] line-through font-medium leading-none mb-0.5">
                                {product.mrp?.toLocaleString('fr-SN')}
                            </span>
                        )}
                        <span className="text-blue-600 font-black text-xs sm:text-base leading-none tracking-tight">
                            {product.price?.toLocaleString('fr-SN')}
                            <span className="text-[8px] sm:text-[10px] ml-0.5 text-blue-600/70 font-bold">
                                FCFA
                            </span>
                        </span>
                    </div>

                    {!isOutOfStock && (
                        <button
                            onClick={handleBuyNow}
                            aria-label={`Acheter ${product.name}`}
                            className="bg-slate-900 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-md shadow-slate-900/10 shrink-0"
                        >
                            Acheter
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
