'use client';
import React from 'react';
import {
    Shirt,
    Sparkles,
    Layers,
    Send,
    CheckCircle2,
    MessageCircle,
    ArrowUpRight,
} from 'lucide-react';

const StudioShowcase = () => {
    const steps = [
        {
            number: '01',
            title: 'Choix du Support',
            desc: 'T-shirts 100% coton (180g - 240g), polos, casquettes, hoodies, tote bags et goodies.',
            icon: Shirt,
        },
        {
            number: '02',
            title: 'Envoi du Visuel',
            desc: 'Partagez votre logo ou fichier graphique. Notre équipe infographie vous assiste au besoin.',
            icon: Layers,
        },
        {
            number: '03',
            title: 'Validation du BAT',
            desc: 'Aperçu 3D et bon à tirer (BAT) numérique validé ensemble avant tout lancement de production.',
            icon: CheckCircle2,
        },
        {
            number: '04',
            title: 'Impression & Livraison',
            desc: 'Impression sérigraphique haute définition et livraison directe partout au Sénégal.',
            icon: Send,
        },
    ];

    const popularProducts = [
        { name: 'T-shirt Custom Premium', price: 'À partir de 4 500 F', tag: 'Best Seller' },
        { name: 'Polo Piqué Entreprise', price: 'À partir de 6 500 F', tag: 'Corporate' },
        { name: 'Hoodie Oversize Épais', price: 'À partir de 12 000 F', tag: 'Streetwear' },
        {
            name: 'Casquette Broderie / Sérigraphie',
            price: 'À partir de 3 500 F',
            tag: 'Accessoire',
        },
        { name: 'Tote Bag Coton Naturel', price: 'À partir de 2 000 F', tag: 'Éco-responsable' },
        { name: 'Pack Goodies Entreprise', price: 'Sur Devis', tag: 'Sur-mesure' },
    ];

    const handleWhatsAppQuote = (item = '') => {
        const message = item
            ? `Bonjour JULO.PROD, je souhaite commander ou avoir un devis pour : ${item}.`
            : 'Bonjour JULO.PROD, je souhaite faire une demande de devis pour des travaux de sérigraphie / personnalisation.';
        window.open(`https://wa.me/221754469097?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <section id="studio" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-blanka tracking-wider text-amber-700 mb-3">
                        <Sparkles size={13} className="text-amber-600" />
                        JULO.PROD • ATELIER SÉRIGRAPHIE
                    </div>
                    <h2 className="font-blanka text-3xl sm:text-5xl text-zinc-950 tracking-wider uppercase leading-tight">
                        PERSONNALISATION &amp; BRANDING.
                    </h2>
                    <p className="mt-2 text-zinc-600 text-sm sm:text-base font-medium max-w-xl">
                        Des impressions textiles et objets publicitaires durables, réalisés avec
                        passion et précision dans notre studio.
                    </p>
                </div>

                <button
                    onClick={() => handleWhatsAppQuote()}
                    className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl transition-all shadow-lg self-start md:self-auto"
                >
                    <MessageCircle size={16} className="text-amber-400" />
                    <span>Demande de Devis Direct</span>
                </button>
            </div>

            {/* 4-Step Process Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className="rounded-3xl bg-zinc-50 border border-zinc-200/80 p-6 flex flex-col justify-between group hover:bg-zinc-950 hover:text-white transition-all duration-300"
                    >
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="font-blanka text-2xl text-amber-500">
                                    {step.number}
                                </span>
                                <div className="size-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 group-hover:bg-zinc-800 group-hover:border-zinc-700 group-hover:text-amber-400 transition-all">
                                    <step.icon size={18} />
                                </div>
                            </div>
                            <h3 className="font-black text-base mt-6 text-zinc-900 group-hover:text-white transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-xs font-medium text-zinc-500 group-hover:text-zinc-400 mt-2 leading-relaxed transition-colors">
                                {step.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Popular Catalog Cards */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-blanka text-lg text-zinc-950 tracking-wider">
                        SUPPORTS POPULAIRES
                    </h3>
                    <span className="text-xs font-bold text-zinc-500">
                        Particuliers &amp; Entreprises
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {popularProducts.map((p, i) => (
                        <div
                            key={i}
                            onClick={() => handleWhatsAppQuote(p.name)}
                            className="cursor-pointer rounded-2xl bg-white border border-zinc-200 p-4 hover:border-amber-500 hover:shadow-lg transition-all group flex flex-col justify-between"
                        >
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-wider bg-zinc-100 group-hover:bg-amber-100 text-zinc-700 group-hover:text-amber-800 px-2 py-0.5 rounded-full inline-block mb-3 transition-colors">
                                    {p.tag}
                                </span>
                                <h4 className="font-bold text-xs text-zinc-900 group-hover:text-amber-600 transition-colors">
                                    {p.name}
                                </h4>
                            </div>
                            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                                <span className="text-[11px] font-black text-zinc-600">
                                    {p.price}
                                </span>
                                <ArrowUpRight
                                    size={14}
                                    className="text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StudioShowcase;
