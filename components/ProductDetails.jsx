'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    StarIcon,
    TagIcon,
    Truck,
    RotateCcw,
    ShieldCheck,
    ShoppingBag,
    BellRing,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Counter from './Counter';
import { subscribeToStockNotification } from '@/app/actions/stock';
import { toast } from 'react-hot-toast';
import { trackEvent } from './Analytics';

const WhatsAppIcon = ({ size = 20, className = '' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width={size}
        height={size}
        className={className}
    >
        <path d="M12.004 2c-5.51 0-9.993 4.483-9.993 9.993 0 1.763.457 3.42 1.257 4.874L2 22l5.282-1.385c1.41.77 3.012 1.205 4.718 1.205 5.51 0 9.996-4.486 9.996-9.996 0-5.51-4.486-9.993-9.996-9.993zm5.665 14.248c-.244.688-1.21 1.249-1.666 1.291-.454.041-.9-.082-2.88-.867-2.535-1.004-4.133-3.583-4.26-3.753-.127-.17-.936-1.244-.936-2.373 0-1.129.573-1.684.806-1.917.234-.234.509-.297.68-.297.17 0 .34.002.488.01.15.007.34-.056.531.403.19.46.658 1.61.716 1.726.059.117.098.254.02.411-.078.156-.118.254-.235.39-.116.136-.245.304-.35.408-.117.117-.24.244-.103.48.137.234.608 1.004 1.301 1.62.89.794 1.64 1.04 1.874 1.157.234.117.371.098.51-.059.137-.156.59-.688.749-.92.158-.234.318-.196.53-.117.214.078 1.354.638 1.587.755.234.117.39.176.447.273.056.097.056.559-.188 1.247z" />
    </svg>
);

const ProductDetails = ({ product }) => {
    const productId = product.id;
    const cart = useCartStore((state) => state.cart);
    const addToCart = useCartStore((state) => state.addToCart);
    const router = useRouter();
    const isInCart = cart.find((item) => item.id === productId);
    const [mainImage, setMainImage] = useState(product.images?.[0] || '/placeholder-image.png');
    const [showSticky, setShowSticky] = useState(false);
    const [notifEmail, setNotifEmail] = useState('');
    const [submittingNotif, setSubmittingNotif] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowSticky(window.scrollY > 600);
        };
        window.addEventListener('scroll', handleScroll);

        // Track Product View
        trackEvent('view_product', {
            product_id: product.id,
            product_name: product.name,
            price: product.price,
            category: product.Category?.name || product.category,
        });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [product]);

    const handleBuyNow = () => {
        if (!isInCart) {
            addToCart(product);
        }
        router.push('/cart');
    };

    const handleWhatsAppOrder = () => {
        const phoneNumber = '221777832798';
        const productLink = `${window.location.origin}/product/${product.id}`;
        let message = `*🏠 GLOBAL AIR - DEMANDE D'ARTICLE*\n`;
        message += `------------------------------------------\n`;
        message += `📦 *Article :* *${product.name}*\n`;
        message += `💰 *Prix :* ${product.price.toLocaleString('fr-SN')} FCFA\n`;
        message += `🔗 *Lien :* ${productLink}\n`;
        message += `------------------------------------------\n\n`;
        message += `Je souhaiterais avoir plus d'informations ou commander cet article. Est-il disponible ?`;

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleStockNotif = async (e) => {
        e.preventDefault();
        if (!notifEmail) return;
        setSubmittingNotif(true);
        const res = await subscribeToStockNotification({ productId, email: notifEmail });
        if (res.success) {
            toast.success(res.success);
            setNotifEmail('');
        } else {
            toast.error(res.error);
        }
        setSubmittingNotif(false);
    };

    const averageRating =
        product.rating && product.rating.length > 0
            ? Math.round(
                  product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length
              )
            : 0;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 mt-6">
                {/* Image Gallery */}
                <div className="flex flex-col gap-6 lg:w-[55%]">
                    <div className="relative aspect-square bg-white rounded-[2.5rem] p-8 sm:p-12 border border-slate-100 overflow-hidden">
                        <motion.div
                            key={mainImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full"
                        >
                            <Image
                                src={mainImage}
                                alt={product.name}
                                width={800}
                                height={800}
                                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                                priority
                            />
                        </motion.div>

                        {product.mrp > product.price && (
                            <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md text-red-600 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl border border-red-100">
                                -{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                                OFF
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {product.images?.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setMainImage(image)}
                                className={`bg-white flex items-center justify-center shrink-0 size-20 sm:size-28 rounded-2xl border-2 transition-all duration-300 ${mainImage === image ? 'border-blue-600 shadow-lg shadow-blue-600/10 scale-95' : 'border-slate-100 hover:border-slate-300'}`}
                            >
                                <Image
                                    src={image}
                                    className="object-contain p-2"
                                    alt=""
                                    width={100}
                                    height={100}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                    <div className="mb-4">
                        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-[1] mb-6">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1.5">
                                <div className="flex">
                                    {Array(5)
                                        .fill('')
                                        .map((_, index) => (
                                            <StarIcon
                                                key={index}
                                                size={16}
                                                className="text-transparent"
                                                fill={
                                                    averageRating >= index + 1
                                                        ? '#FFB800'
                                                        : '#E2E8F0'
                                                }
                                            />
                                        ))}
                                </div>
                                <p className="text-sm font-black text-slate-900">
                                    {averageRating.toFixed(1)}
                                </p>
                            </div>
                            <div className="h-4 w-px bg-slate-200" />
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                {product.rating?.length || 0} Avis
                            </p>
                            <div className="h-4 w-px bg-slate-200" />
                            <p
                                className={`text-xs font-black uppercase tracking-widest ${product.inStock ? 'text-blue-600' : 'text-red-500'}`}
                            >
                                {product.inStock ? 'En Stock' : 'Rupture'}
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100 mb-6">
                        <div className="flex items-baseline gap-4">
                            <p className="text-4xl sm:text-5xl font-black text-blue-600 tracking-tighter">
                                {product.price?.toLocaleString('fr-SN')}{' '}
                                <small className="text-sm font-bold">FCFA</small>
                            </p>
                            {product.mrp > product.price && (
                                <p className="text-xl text-slate-300 line-through font-bold">
                                    {product.mrp?.toLocaleString('fr-SN')} FCFA
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-auto space-y-3">
                        {product.inStock ? (
                            <>
                                {/* Ligne 1 : Panier + WhatsApp côte à côte — desktop ET mobile */}
                                <div className="grid grid-cols-2 gap-3">
                                    {!isInCart ? (
                                        <motion.button
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => {
                                                addToCart(product);
                                                trackEvent('add_to_cart', {
                                                    product_id: product.id,
                                                    product_name: product.name,
                                                    price: product.price,
                                                });
                                                toast.success('Ajouté au panier !');
                                            }}
                                            className="bg-slate-900 text-white py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-black shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group"
                                        >
                                            <ShoppingBag
                                                size={18}
                                                className="group-hover:scale-110 transition-transform"
                                            />
                                            Panier
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => router.push('/cart')}
                                            className="bg-blue-600 text-white py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            <ShoppingBag size={18} />
                                            Voir panier
                                        </motion.button>
                                    )}
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleWhatsAppOrder}
                                        className="bg-[#25D366] text-white py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-[#128C7E] shadow-xl shadow-[#25D366]/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <WhatsAppIcon size={18} />
                                        WhatsApp
                                    </motion.button>
                                </div>
                                {/* Ligne 2 : Acheter maintenant pleine largeur */}
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleBuyNow}
                                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.15em] hover:bg-blue-700 shadow-2xl shadow-blue-600/25 transition-all flex items-center justify-center gap-3"
                                >
                                    Acheter maintenant →
                                </motion.button>
                            </>
                        ) : (
                            <div className="flex-1 bg-slate-900 rounded-2xl p-6 text-white">
                                <div className="flex items-center gap-3 mb-4">
                                    <BellRing size={20} className="text-blue-500" />
                                    <p className="font-black text-xs uppercase tracking-widest">
                                        Alerte de Stock
                                    </p>
                                </div>
                                <p className="text-xs text-slate-400 font-medium mb-4">
                                    Cet article est actuellement épuisé. Soyez le premier prévenu
                                    dès son retour !
                                </p>
                                <form onSubmit={handleStockNotif} className="flex gap-2">
                                    <input
                                        required
                                        type="email"
                                        placeholder="Votre email..."
                                        value={notifEmail}
                                        onChange={(e) => setNotifEmail(e.target.value)}
                                        className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-blue-500 transition-all"
                                    />
                                    <button
                                        disabled={submittingNotif}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                                    >
                                        M&apos;avertir
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Sticky — Panier + WhatsApp côte à côte */}
            <AnimatePresence>
                {showSticky && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-3 sm:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.08)]"
                    >
                        {/* Prix */}
                        <div className="flex items-baseline justify-between mb-3">
                            <p className="text-xl font-black text-slate-900 leading-none">
                                {product.price?.toLocaleString('fr-SN')}{' '}
                                <small className="text-[10px] font-bold text-slate-400">FCFA</small>
                            </p>
                            <p
                                className={`text-[10px] font-black uppercase tracking-widest ${product.inStock ? 'text-blue-600' : 'text-red-500'}`}
                            >
                                {product.inStock ? '● En Stock' : '● Rupture'}
                            </p>
                        </div>
                        {product.inStock ? (
                            /* Panier + WhatsApp sur la même ligne */
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() =>
                                        !isInCart ? addToCart(product) : router.push('/cart')
                                    }
                                    className="bg-slate-900 text-white py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                                >
                                    <ShoppingBag size={15} />
                                    {!isInCart ? 'Ajouter' : 'Voir panier'}
                                </button>
                                <button
                                    onClick={handleWhatsAppOrder}
                                    className="bg-[#25D366] text-white py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-1.5 active:scale-95 transition-all hover:bg-[#128C7E]"
                                >
                                    <WhatsAppIcon size={15} />
                                    WhatsApp
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
                                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                            >
                                M&apos;AVERTIR
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetails;
