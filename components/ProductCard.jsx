'use client';
import { ShoppingCart, StarIcon, HeartIcon } from 'lucide-react';
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
            transition={{ duration: 0.3 }}
            className="group relative flex flex-col bg-white border border-[#EAE6DF] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#C59A63] transition-all duration-300 h-full"
        >
            {/* 1. Image Showcase Area */}
            <div className="relative aspect-square bg-[#F5F2EB] w-full flex items-center justify-center p-3 sm:p-5 overflow-hidden group-hover:bg-[#FAF8F5] transition-colors">
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
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {isOutOfStock ? (
                        <div className="bg-[#1C1B1F] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Épuisé
                        </div>
                    ) : (
                        <>
                            {product.mrp > product.price && (
                                <div className="bg-[#C59A63] text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                    -
                                    {Math.round(
                                        ((product.mrp - product.price) / product.mrp) * 100
                                    )}
                                    %
                                </div>
                            )}
                            {isNew && (
                                <div className="bg-[#1C1B1F] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    NOUVEAU
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Wishlist Button */}
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
                    className={`absolute top-3 right-3 size-8 bg-white rounded-full flex items-center justify-center z-20 shadow-sm border border-[#EAE6DF] ${
                        isInWishlist
                            ? 'text-red-500 border-red-200'
                            : 'text-zinc-400 hover:text-red-500'
                    } transition-colors`}
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
                        className="absolute bottom-3 right-3 size-9 bg-white text-[#1C1B1F] border border-[#EAE6DF] rounded-full flex items-center justify-center shadow-md hover:bg-[#C59A63] hover:text-white hover:border-[#C59A63] hover:scale-105 transition-all z-20"
                        aria-label="Ajouter au panier"
                    >
                        <ShoppingCart className="size-4" strokeWidth={2} />
                    </button>
                )}
            </div>

            {/* 2. Information Area */}
            <div className="flex flex-col flex-1 p-4">
                <Link href={`/product/${product.id}`} className="block flex-1 mb-2">
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                        <p className="text-[10px] font-bold text-[#8C8275] uppercase tracking-wider truncate">
                            {product.Category?.name || product.category || 'JULO'}
                        </p>
                        <div className="flex items-center gap-0.5">
                            <StarIcon size={11} className="fill-[#C59A63] text-[#C59A63]" />
                            <span className="text-[10px] font-bold text-[#1C1B1F]">
                                {rating > 0 ? rating : '5.0'}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-[#1C1B1F] font-bold text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-[#C59A63] transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price & Action Area */}
                <div className="mt-auto pt-3 border-t border-[#EAE6DF] flex items-end justify-between gap-2">
                    <div className="flex flex-col">
                        {product.mrp > product.price && (
                            <span className="text-zinc-400 text-[10px] line-through font-medium leading-none mb-1">
                                {product.mrp?.toLocaleString('fr-SN')} F
                            </span>
                        )}
                        <span className="text-[#1C1B1F] font-black text-sm sm:text-base leading-none tracking-tight">
                            {product.price?.toLocaleString('fr-SN')}
                            <span className="text-[10px] ml-1 text-[#8C8275] font-bold">FCFA</span>
                        </span>
                    </div>

                    {!isOutOfStock && (
                        <button
                            onClick={handleBuyNow}
                            aria-label={`Acheter ${product.name}`}
                            className="bg-[#1C1B1F] hover:bg-[#C59A63] text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 shadow-xs shrink-0"
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
