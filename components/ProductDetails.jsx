'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    StarIcon,
    Truck,
    RotateCcw,
    ShieldCheck,
    ShoppingBag,
    BellRing,
    ArrowRight,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { subscribeToStockNotification } from '@/app/actions/stock';
import { toast } from 'react-hot-toast';
import { trackEvent } from './Analytics';

const WhatsAppIcon = ({ size = 18, className = '' }) => (
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
        const phoneNumber = '221754469097';
        const productLink = `${window.location.origin}/product/${product.id}`;
        let message = `*📦 JULO - COMMANDE PRODUIT*\n`;
        message += `------------------------------------------\n`;
        message += `⚡ *Article :* *${product.name}*\n`;
        message += `💰 *Prix :* ${product.price?.toLocaleString('fr-SN')} FCFA\n`;
        message += `🔗 *Lien :* ${productLink}\n`;
        message += `------------------------------------------\n\n`;
        message += `Bonjour JULO, je souhaite commander cet article ou avoir des détails sur la livraison.`;

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
                  product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length
              )
            : 5;

    return (
        <div className="mb-16">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                {/* 1. Image Gallery */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="relative aspect-square bg-[#F5F2EB] rounded-3xl p-6 sm:p-10 flex items-center justify-center border border-[#EAE6DF] overflow-hidden group">
                        <motion.div
                            key={mainImage}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25 }}
                            className="w-full h-full flex items-center justify-center"
                        >
                            <Image
                                src={mainImage}
                                alt={product.name}
                                width={700}
                                height={700}
                                className="w-full h-full object-cover rounded-2xl drop-shadow-sm"
                                priority
                            />
                        </motion.div>

                        {product.mrp > product.price && (
                            <div className="absolute top-6 left-6 bg-[#C59A63] text-white px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider shadow-md">
                                -{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMainImage(image)}
                                    className={`bg-white shrink-0 size-20 sm:size-24 rounded-2xl border-2 transition-all p-1.5 flex items-center justify-center overflow-hidden ${
                                        mainImage === image
                                            ? 'border-[#C59A63] shadow-md scale-95'
                                            : 'border-[#EAE6DF] hover:border-zinc-300'
                                    }`}
                                >
                                    <Image
                                        src={image}
                                        className="object-cover w-full h-full rounded-xl"
                                        alt=""
                                        width={80}
                                        height={80}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Product Info Area */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EB] border border-[#EAE6DF] text-[10px] font-extrabold uppercase tracking-widest text-[#8C8275] mb-4">
                            {product.Category?.name || product.category || 'JULO COLLECTION'}
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-black text-[#1C1B1F] tracking-tight leading-tight mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 text-xs font-bold mb-6">
                            <div className="flex items-center gap-1">
                                <div className="flex">
                                    {Array(5)
                                        .fill('')
                                        .map((_, index) => (
                                            <StarIcon
                                                key={index}
                                                size={15}
                                                className="fill-[#C59A63] text-[#C59A63]"
                                            />
                                        ))}
                                </div>
                                <span className="text-[#1C1B1F] ml-1">{averageRating}.0</span>
                            </div>
                            <span className="text-[#D6CEBE]">•</span>
                            <span className="text-[#8C8275]">
                                {product.rating?.length || 0} Avis
                            </span>
                            <span className="text-[#D6CEBE]">•</span>
                            <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                    product.inStock
                                        ? 'bg-[#F5F2EB] text-[#1C1B1F] border border-[#EAE6DF]'
                                        : 'bg-red-50 text-red-600 border border-red-200'
                                }`}
                            >
                                {product.inStock ? 'En Stock' : 'Rupture'}
                            </span>
                        </div>

                        {/* Price Card */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE6DF] shadow-xs mb-8">
                            <div className="flex items-baseline gap-4">
                                <p className="text-3xl sm:text-5xl font-black text-[#1C1B1F] tracking-tight">
                                    {product.price?.toLocaleString('fr-SN')}{' '}
                                    <span className="text-base sm:text-xl font-bold text-[#8C8275]">
                                        FCFA
                                    </span>
                                </p>
                                {product.mrp > product.price && (
                                    <p className="text-base sm:text-lg text-zinc-400 line-through font-medium">
                                        {product.mrp?.toLocaleString('fr-SN')} FCFA
                                    </p>
                                )}
                            </div>
                            <p className="text-xs text-[#8C8275] mt-2 font-normal">
                                Prix garanti avec TVA et facture officielle disponible.
                            </p>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-3 pt-4 border-t border-[#EAE6DF]">
                        {product.inStock ? (
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    {!isInCart ? (
                                        <button
                                            onClick={() => {
                                                addToCart(product);
                                                trackEvent('add_to_cart', {
                                                    product_id: product.id,
                                                    product_name: product.name,
                                                    price: product.price,
                                                });
                                                toast.success('Ajouté au panier !');
                                            }}
                                            className="bg-[#1C1B1F] hover:bg-[#C59A63] text-white py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                                        >
                                            <ShoppingBag size={16} />
                                            <span>Ajouter au Panier</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => router.push('/cart')}
                                            className="bg-[#C59A63] text-white py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                                        >
                                            <ShoppingBag size={16} />
                                            <span>Voir le Panier</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={handleWhatsAppOrder}
                                        className="bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                                    >
                                        <WhatsAppIcon size={16} />
                                        <span>Commander WhatsApp</span>
                                    </button>
                                </div>

                                <button
                                    onClick={handleBuyNow}
                                    className="w-full bg-[#C59A63] hover:bg-[#B4874F] text-white py-4 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-[#C59A63]/25 active:scale-95"
                                >
                                    <span>Acheter Immédiatement</span>
                                    <ArrowRight size={16} />
                                </button>
                            </>
                        ) : (
                            <div className="bg-white rounded-3xl p-6 border border-[#EAE6DF] text-center">
                                <div className="size-10 rounded-full bg-[#FAF8F5] flex items-center justify-center mx-auto mb-3 text-[#C59A63]">
                                    <BellRing size={20} />
                                </div>
                                <h3 className="font-bold text-sm text-[#1C1B1F]">
                                    Produit Momentanément Épuisé
                                </h3>
                                <p className="text-xs text-[#8C8275] mt-1 mb-4">
                                    Laissez votre email pour être prévenu dès le prochain
                                    réapprovisionnement.
                                </p>
                                <form
                                    onSubmit={handleStockNotif}
                                    className="flex gap-2 max-w-md mx-auto"
                                >
                                    <input
                                        required
                                        type="email"
                                        placeholder="Votre adresse email..."
                                        value={notifEmail}
                                        onChange={(e) => setNotifEmail(e.target.value)}
                                        className="flex-1 bg-[#F5F2EB] border border-[#EAE6DF] rounded-full px-4 py-2.5 text-xs text-[#1C1B1F] outline-none focus:border-[#C59A63]"
                                    />
                                    <button
                                        disabled={submittingNotif}
                                        className="bg-[#1C1B1F] text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                                    >
                                        Avertir
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 pt-6 text-center text-xs text-[#8C8275] border-t border-[#EAE6DF]/70">
                            <div className="flex flex-col items-center gap-1.5">
                                <ShieldCheck size={20} className="text-[#C59A63]" />
                                <span className="text-[10px] font-bold text-[#1C1B1F]">
                                    100% Original
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5">
                                <Truck size={20} className="text-[#C59A63]" />
                                <span className="text-[10px] font-bold text-[#1C1B1F]">
                                    Livraison 24h
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5">
                                <RotateCcw size={20} className="text-[#C59A63]" />
                                <span className="text-[10px] font-bold text-[#1C1B1F]">
                                    Garantie &amp; SAV
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Action Bar */}
            <AnimatePresence>
                {showSticky && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-t border-[#EAE6DF] px-4 py-3 sm:hidden shadow-lg"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-base font-black text-[#1C1B1F] leading-none">
                                    {product.price?.toLocaleString('fr-SN')}{' '}
                                    <small className="text-[10px] text-[#8C8275] font-bold">
                                        FCFA
                                    </small>
                                </p>
                                <p className="text-[9px] font-bold text-[#C59A63] mt-0.5">
                                    {product.inStock ? '● En Stock' : '● Rupture'}
                                </p>
                            </div>

                            {product.inStock && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            !isInCart ? addToCart(product) : router.push('/cart')
                                        }
                                        className="bg-[#1C1B1F] text-white px-4 py-2.5 rounded-full font-bold text-[11px] uppercase tracking-wider"
                                    >
                                        {!isInCart ? 'Panier' : 'Voir Panier'}
                                    </button>
                                    <button
                                        onClick={handleWhatsAppOrder}
                                        className="bg-[#25D366] text-white px-3 py-2.5 rounded-full font-bold text-[11px]"
                                    >
                                        <WhatsAppIcon size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetails;
