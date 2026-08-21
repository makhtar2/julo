'use client';
import { assets } from '@/assets/assets';
import { ChevronRightIcon, Loader2Icon, ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import CategoriesMarquee from './CategoriesMarquee';
import { getCategories } from '@/app/actions/category';
import { getActiveBanners } from '@/app/actions/banner';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = ({ initialCategories = [], initialBanners = [] }) => {
    const router = useRouter();
    const [categories, setCategories] = useState(initialCategories);
    const [banners, setBanners] = useState(initialBanners);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        // Only fetch if initial data is missing (client-side navigation or fallback)
        if (initialCategories.length === 0 && initialBanners.length === 0) {
            const fetchData = async () => {
                setLoading(true);
                const [{ categories: catData }, { banners: banData }] = await Promise.all([
                    getCategories(),
                    getActiveBanners(),
                ]);
                if (catData) setCategories(catData.map((c) => c.name));
                if (banData) setBanners(banData);
                setLoading(false);
            };
            fetchData();
        }
    }, [initialCategories, initialBanners]);

    const fallbackSlides = [
        {
            subtitle: 'JULO PROD',
            title: 'Technologie & Créativité sur-mesure.',
            description:
                'Smartphones, Ordinateurs, Accessoires Téléphone et Services d’Infographie & Sérigraphie personnalisés au Sénégal.',
            link: '/shop',
            image: assets.hero_model_img,
            imageClassName: 'object-cover opacity-60',
        },
        {
            subtitle: 'High-Tech & Mobilité',
            title: 'Les meilleurs smartphones & PC.',
            description:
                'Découvrez notre sélection d’accessoires, téléphones et ordinateurs portables haute performance.',
            link: '/shop?category=telephones',
            image: '/assets/young Senegalese man relaxing.png',
            imageClassName: 'object-cover opacity-65',
        },
        {
            subtitle: 'Sérigraphie & Branding',
            title: 'Personnalisez vos textiles et supports.',
            description:
                'Atelier d’impression sérigraphique et création graphique : t-shirts, sacs, bannières, logos et packaging.',
            link: '/shop?category=serigraphie',
            image: '/assets/young Senegalese man relaxing.png',
            imageClassName: 'object-cover opacity-65',
        },
    ];

    const heroSlides = banners.length > 0 ? banners : fallbackSlides;
    const mainBanner = heroSlides[activeIndex] || heroSlides[0];
    const sideBanner1 = banners[1];
    const sideBanner2 = banners[2];

    useEffect(() => {
        if (loading || heroSlides.length <= 1) return;

        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % heroSlides.length);
        }, 6000); // 6 seconds for each slide

        return () => clearInterval(interval);
    }, [loading, heroSlides.length]);

    return (
        <div className="px-4 sm:px-6">
            <div className="flex flex-col xl:flex-row gap-5 sm:gap-6 max-w-7xl mx-auto my-6 sm:my-8">
                <div className="relative flex-1 flex flex-col bg-blue-200 rounded-[2rem] sm:rounded-[3rem] min-h-[440px] sm:min-h-[500px] xl:min-h-[600px] group overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={mainBanner?.id || mainBanner?.title || activeIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                        >
                            {mainBanner?.image && (
                                <Image
                                    src={mainBanner.image}
                                    alt={mainBanner.title || 'Bannière Global Air'}
                                    fill
                                    priority
                                    fetchPriority="high"
                                    loading="eager"
                                    sizes="(min-width: 1280px) 65vw, 100vw"
                                    className={`${mainBanner.imageClassName || 'object-cover opacity-60'} group-hover:scale-105 transition-transform duration-[2000ms]`}
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-blue-200/90 to-transparent sm:via-blue-200/70" />
                        </motion.div>
                    </AnimatePresence>

                    {mainBanner?.foregroundImage && (
                        <motion.div
                            key={`foreground-${activeIndex}`}
                            initial={false}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="pointer-events-none absolute bottom-0 right-0 z-[5] hidden h-[88%] w-[50%] sm:block"
                        >
                            <Image
                                src={mainBanner.foregroundImage}
                                alt=""
                                fill
                                priority
                                sizes="(min-width: 1280px) 32vw, 45vw"
                                className="object-contain object-right-bottom"
                            />
                        </motion.div>
                    )}

                    <div className="p-8 sm:p-16 z-10 relative h-full flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 bg-white/50 text-blue-900 pr-4 p-1 rounded-full text-[10px] sm:text-xs backdrop-blur-md w-fit font-bold mb-4">
                            <span className="bg-blue-600 px-3 py-1 rounded-full text-white text-[9px] font-black uppercase">
                                {mainBanner?.subtitle || 'GLOBAL AIR'}
                            </span>
                            <span className="line-clamp-1">
                                Livraison express partout au Sénégal
                            </span>
                        </div>

                        <motion.h1
                            key={`title-${activeIndex}`}
                            initial={false}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl sm:text-6xl leading-[1.1] font-black text-slate-900 max-w-xs sm:max-w-lg tracking-tight"
                        >
                            {mainBanner?.title || "L'excellence pour votre foyer."}
                        </motion.h1>

                        <motion.p
                            key={`desc-${activeIndex}`}
                            initial={false}
                            animate={{ opacity: 1 }}
                            className="text-slate-900 font-bold mt-4 max-w-[280px] sm:max-w-sm text-xs sm:text-lg leading-relaxed"
                        >
                            {mainBanner?.description ||
                                'Votre partenaire de confiance pour des équipements de qualité.'}
                        </motion.p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push(mainBanner?.link || '/shop')}
                            className="w-fit bg-slate-900 text-white text-xs sm:text-sm py-4 px-8 sm:px-10 mt-8 sm:mt-10 rounded-2xl font-black shadow-2xl shadow-slate-900/30 hover:bg-black transition-all uppercase tracking-widest"
                        >
                            {mainBanner?.title ? "Découvrir l'offre" : 'Catalogue Complet'}
                        </motion.button>
                    </div>

                    {/* Simple Progress Bar */}
                    {heroSlides.length > 1 && (
                        <div className="absolute bottom-0 left-0 h-1.5 bg-blue-600/30 w-full z-20">
                            <motion.div
                                key={activeIndex}
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 6, ease: 'linear' }}
                                className="h-full bg-blue-600"
                            />
                        </div>
                    )}
                </div>

                {/* Side Banners (Simplified) */}
                <div className="flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm">
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 min-h-[180px] sm:min-h-0"
                    >
                        <Link
                            href={sideBanner1?.link || '/shop?category=Climatisation'}
                            className="relative flex items-center w-full h-full bg-slate-900 rounded-[2rem] p-8 group overflow-hidden"
                        >
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={
                                        sideBanner1?.image ||
                                        '/assets/young Senegalese man relaxing.png'
                                    }
                                    alt="Confort"
                                    fill
                                    priority
                                    loading="eager"
                                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                                    className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                            </div>

                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">
                                    {sideBanner1?.subtitle || 'Fraîcheur'}
                                </p>
                                <p className="text-3xl font-black text-white tracking-tighter leading-none mb-4">
                                    {sideBanner1?.title || 'Confort Premium'}
                                </p>
                                <div className="flex items-center gap-2 font-black text-white uppercase text-[10px] tracking-widest bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-sm group-hover:bg-blue-600 transition-colors">
                                    Voir <ArrowRightIcon size={14} />
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 min-h-[180px] sm:min-h-0"
                    >
                        <Link
                            href={sideBanner2?.link || '/shop?category=Ventilateurs'}
                            className="relative flex items-center w-full h-full bg-blue-900 rounded-[2rem] p-8 group overflow-hidden"
                        >
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={
                                        sideBanner2?.image ||
                                        '/assets/Extreme close-up of a West African person’s face.png'
                                    }
                                    alt="Flash"
                                    fill
                                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                                    className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/80 to-transparent" />
                            </div>

                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">
                                    {sideBanner2?.subtitle || 'Offre Flash'}
                                </p>
                                <p className="text-3xl font-black text-white tracking-tighter leading-none mb-4">
                                    {sideBanner2?.title || 'Ventes Été'}
                                </p>
                                <div className="flex items-center gap-2 font-black text-white uppercase text-[10px] tracking-widest bg-blue-600/50 w-fit px-4 py-2 rounded-xl backdrop-blur-sm group-hover:bg-white group-hover:text-blue-900 transition-colors">
                                    Profiter <ArrowRightIcon size={14} />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </div>
            <CategoriesMarquee categories={categories} />
        </div>
    );
};

export default Hero;
