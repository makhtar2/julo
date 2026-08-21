'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowRightIcon,
    BadgeCheckIcon,
    HeadphonesIcon,
    HomeIcon,
    MapPinIcon,
    ShieldCheckIcon,
    TruckIcon,
} from 'lucide-react';

const values = [
    {
        title: 'Innovation & Technologie',
        text: 'Produits électroniques authentiques et performants (Smartphones, Ordinateurs, Accessoires).',
        icon: <ShieldCheckIcon size={22} />,
    },
    {
        title: 'Créativité & Sérigraphie',
        text: 'Personnalisation sur-mesure de vos supports : t-shirts, sacs, bannières et identités visuelles.',
        icon: <BadgeCheckIcon size={22} />,
    },
    {
        title: 'Service & SAV Dédié',
        text: 'Une équipe locale disponible à votre écoute pour vous conseiller et assurer votre satisfaction.',
        icon: <HeadphonesIcon size={22} />,
    },
];

const stats = [
    { value: '100%', label: 'Qualité Garantie' },
    { value: '24h/48h', label: 'Livraison Sénégal' },
    { value: 'Touba & Dakar', label: 'Service Local' },
];

export default function AboutPage() {
    return (
        <div className="px-4 sm:px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'AboutPage',
                        mainEntity: {
                            '@type': 'Organization',
                            name: 'Julo',
                            url: 'https://julo.sn',
                            description:
                                'Julo est votre destination complète pour l’achat de produits électroniques et services de sérigraphie/infographie personnalisés.',
                            address: {
                                '@type': 'PostalAddress',
                                addressLocality: 'Dakar',
                                addressCountry: 'SN',
                            },
                        },
                    }),
                }}
            />
            <div className="max-w-7xl mx-auto py-8 sm:py-12">
                <section className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-slate-900 min-h-[520px] border border-slate-800 shadow-2xl shadow-slate-200/70">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />

                    <div className="relative z-10 flex min-h-[520px] flex-col justify-center p-6 sm:p-12 lg:p-16 max-w-3xl">
                        <div className="mb-6 flex w-fit items-center gap-2 rounded-full bg-white/10 p-1 pr-4 text-amber-300 backdrop-blur-md">
                            <span className="rounded-full bg-amber-500 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-950">
                                JULO
                            </span>
                            <span className="text-xs font-black uppercase tracking-widest">
                                Technologie & Créativité
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white">
                            À Propos de Julo
                        </h1>
                        <p className="mt-6 max-w-2xl text-sm sm:text-lg font-semibold leading-relaxed text-slate-200">
                            Votre destination complète pour l’achat de produits électroniques de
                            qualité et pour les services de sérigraphie et d’infographie sur-mesure
                            au Sénégal.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/shop"
                                className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-2xl shadow-amber-500/20 transition-all hover:bg-amber-400"
                            >
                                Explorer nos Produits <ArrowRightIcon size={16} />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-white/10 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white hover:text-slate-950"
                            >
                                Commander une Personnalisation
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 -mt-10 relative z-20 px-4 sm:px-8">
                    {stats.map((item) => (
                        <div
                            key={item.label}
                            className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-xl shadow-slate-200/50"
                        >
                            <p className="text-3xl font-black text-slate-900 tracking-tight">
                                {item.value}
                            </p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-16 sm:mt-24">
                    <div className="lg:col-span-7">
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4">
                            Qui sommes-nous ?
                        </p>
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            L&apos;alliance parfaite entre technologie et créativité.
                        </h2>
                        <div className="mt-8 space-y-5 text-slate-600 font-medium leading-relaxed">
                            <p>
                                Co-fondée par{' '}
                                <strong className="text-slate-900">Babacar Diop Gaye</strong> et{' '}
                                <strong className="text-slate-900">Makhtar Wade</strong>,{' '}
                                <span className="font-black text-amber-600">Julo</span> est née
                                d&apos;une ambition commune : démocratiser l&apos;accès aux
                                équipements technologiques fiables tout en offrant un pôle de
                                création visuelle et de sérigraphie de haute précision.
                            </p>
                            <p>
                                Nous proposons une vaste gamme de produits allant des accessoires
                                pour téléphones (étuis, chargeurs rapides, écouteurs, protecteurs
                                d&apos;écran) aux derniers modèles de smartphones et ordinateurs
                                portables adaptés aux professionnels comme aux étudiants.
                            </p>
                            <p>
                                En parallèle, notre atelier d&apos;infographie et de sérigraphie
                                prend en charge la personnalisation complète de vos t-shirts, polos,
                                sacs, bannières et identités visuelles d&apos;entreprises.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 text-white shadow-2xl border border-slate-800">
                            <HomeIcon size={36} className="text-amber-400" />
                            <h3 className="mt-8 text-3xl font-black tracking-tight leading-none text-white">
                                Notre Engagement Qualité
                            </h3>
                            <p className="mt-5 text-sm font-semibold leading-relaxed text-slate-300">
                                Chez Julo, nous nous engageons à fournir des produits électroniques
                                de la plus haute qualité et des services de personnalisation
                                exceptionnels. Nous combinons l&apos;innovation technologique avec
                                la créativité visuelle pour surpasser vos attentes.
                            </p>
                            <div className="mt-8 rounded-3xl bg-white/10 p-5 backdrop-blur-md">
                                <p className="text-sm font-black leading-relaxed text-amber-300">
                                    Co-fondateurs : Babacar Diop Gaye & Makhtar Wade
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-16 sm:mt-24">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                        <div>
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-3">
                                Nos Services & Produits
                            </p>
                            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                                Ce que nous proposons.
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-7 shadow-xl shadow-slate-200/40">
                            <h3 className="text-lg font-black text-slate-900 mb-2">
                                Accessoires Téléphone
                            </h3>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                Étuis, chargeurs haute vitesse, écouteurs sans fil, protecteurs
                                d&apos;écran renforcés.
                            </p>
                        </div>
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-7 shadow-xl shadow-slate-200/40">
                            <h3 className="text-lg font-black text-slate-900 mb-2">
                                Smartphones & Mobiles
                            </h3>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                Derniers modèles de smartphones garantis et sélectionnés parmi les
                                meilleures marques.
                            </p>
                        </div>
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-7 shadow-xl shadow-slate-200/40">
                            <h3 className="text-lg font-black text-slate-900 mb-2">
                                Ordinateurs & PC
                            </h3>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                Ordinateurs portables et de bureau pour étudiants, professionnels et
                                créatifs.
                            </p>
                        </div>
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-7 shadow-xl shadow-slate-200/40">
                            <h3 className="text-lg font-black text-slate-900 mb-2">
                                Sérigraphie & Infographie
                            </h3>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                Personnalisation textile (t-shirts, polos), sacs, bannières, logos
                                et chartes graphiques.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-16 sm:mt-24 mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-[2.5rem] bg-slate-900 p-8 sm:p-10 text-white overflow-hidden relative border border-slate-800">
                        <TruckIcon className="text-amber-400" size={36} />
                        <h2 className="mt-8 text-3xl font-black tracking-tight">
                            Livraison Rapide et Sécurisée
                        </h2>
                        <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-300">
                            Profitez de notre service de livraison rapide et sécurisée, garantissant
                            que vos produits personnalisés et électroniques vous parviennent en
                            parfait état dans les délais convenus.
                        </p>
                    </div>
                    <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 sm:p-10 shadow-xl shadow-slate-200/40">
                        <HeadphonesIcon className="text-amber-600" size={36} />
                        <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-900">
                            Service Après-Vente Réactif
                        </h2>
                        <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-500">
                            Notre équipe d&apos;assistance est disponible pour répondre à toutes vos
                            questions. Que ce soit pour des produits électroniques ou des commandes
                            de personnalisation, nous garantissons votre entière satisfaction.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
