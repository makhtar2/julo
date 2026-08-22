'use client';
import React from 'react';
import Link from 'next/link';
import {
    ArrowRightIcon,
    BadgeCheckIcon,
    HeadphonesIcon,
    HomeIcon,
    ShieldCheckIcon,
    TruckIcon,
    Sparkles,
} from 'lucide-react';

const stats = [
    { value: '100%', label: 'Produits Originaux' },
    { value: '24h/48h', label: 'Livraison au Sénégal' },
    { value: 'Dakar & Touba', label: 'Points de Service' },
];

export default function AboutPage() {
    return (
        <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Card */}
                <section className="relative overflow-hidden rounded-[2.5rem] bg-[#1C1B1F] text-white p-8 sm:p-14 lg:p-16 border border-[#33302A] shadow-xl">
                    <div className="absolute -right-10 -bottom-10 size-80 rounded-full border border-[#D4AF37]/30 shadow-[0_0_80px_rgba(212,175,55,0.15)] pointer-events-none" />

                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C2924] border border-[#3D3A34] text-[10px] font-extrabold uppercase tracking-widest text-[#C59A63] mb-6">
                            <Sparkles size={12} />
                            NOTRE HISTOIRE
                        </div>

                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                            À Propos de JULO.
                        </h1>
                        <p className="mt-4 text-zinc-400 text-sm sm:text-base font-normal leading-relaxed">
                            Votre destination de référence pour des équipements électroniques
                            authentiques et des travaux de sérigraphie &amp; infographie de haute
                            précision au Sénégal.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 bg-[#C59A63] hover:bg-[#B4874F] text-white px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                            >
                                <span>Explorer la Boutique</span>
                                <ArrowRightIcon size={15} />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider border border-white/10 transition-all active:scale-95"
                            >
                                <span>Nous Contacter</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Stats Row */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 -mt-8 relative z-20 px-4 sm:px-6">
                    {stats.map((item) => (
                        <div
                            key={item.label}
                            className="bg-white rounded-2xl border border-[#EAE6DF] p-6 shadow-sm flex flex-col items-center sm:items-start text-center sm:text-left"
                        >
                            <p className="text-2xl sm:text-3xl font-black text-[#1C1B1F] tracking-tight">
                                {item.value}
                            </p>
                            <p className="text-[10px] font-extrabold text-[#8C8275] uppercase tracking-wider mt-1">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </section>

                {/* Story Section */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-16 sm:mt-20">
                    <div className="lg:col-span-7">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-px w-8 bg-[#D6CEBE]" />
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#8C8275]">
                                QUI SOMMES-NOUS ?
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-[#1C1B1F] tracking-tight leading-tight">
                            L&apos;alliance entre technologie &amp; design sur-mesure.
                        </h2>
                        <div className="mt-6 space-y-4 text-[#5A564F] text-sm leading-relaxed font-normal">
                            <p>
                                Co-fondée par{' '}
                                <strong className="text-[#1C1B1F]">Babacar Diop Gaye</strong> et{' '}
                                <strong className="text-[#1C1B1F]">Makhtar Wade</strong>,{' '}
                                <strong className="text-[#1C1B1F]">Julo</strong> est née d&apos;une
                                ambition claire : offrir au Sénégal un accès direct à des
                                équipements high-tech 100% originaux, tout en développant un atelier
                                de sérigraphie et d&apos;infographie créatif pour valoriser
                                l&apos;image des entreprises et des particuliers.
                            </p>
                            <p>
                                Notre catalogue regroupe les plus grandes marques de smartphones,
                                ordinateurs portables et accessoires de charge rapide.
                            </p>
                            <p>
                                En parallèle, notre studio graphique et notre atelier
                                d&apos;impression textile réalisent la personnalisation de t-shirts,
                                polos, hoodies, casquettes et goodies avec une exigence de finition
                                irréprochable.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-3xl p-8 border border-[#EAE6DF] shadow-xs">
                            <div className="size-12 rounded-2xl bg-[#F5F2EB] flex items-center justify-center text-[#C59A63] mb-6">
                                <HomeIcon size={24} />
                            </div>
                            <h3 className="text-xl font-black text-[#1C1B1F] tracking-tight mb-3">
                                Notre Engagement
                            </h3>
                            <p className="text-xs text-[#5A564F] leading-relaxed mb-6 font-normal">
                                Chez Julo, la confiance de nos clients est notre priorité absolue.
                                Nous sélectionnons chaque produit avec rigueur et assurons un
                                accompagnement après-vente réactif.
                            </p>
                            <div className="rounded-2xl bg-[#FAF8F5] p-4 border border-[#EAE6DF]">
                                <p className="text-[11px] font-bold text-[#8C8275]">
                                    Co-fondateurs :
                                </p>
                                <p className="text-xs font-bold text-[#1C1B1F] mt-0.5">
                                    Babacar Diop Gaye &amp; Makhtar Wade
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom Trust Cards */}
                <section className="mt-14 mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="rounded-3xl bg-[#1C1B1F] text-white p-8 border border-[#33302A]">
                        <TruckIcon className="text-[#C59A63]" size={32} />
                        <h3 className="mt-6 text-xl font-black tracking-tight">
                            Livraison Express au Sénégal
                        </h3>
                        <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-normal">
                            Expédition sous 24h à Dakar, Thiès et Touba, et 48h partout dans les
                            régions avec suivi en temps réel.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-white border border-[#EAE6DF] p-8 shadow-xs">
                        <HeadphonesIcon className="text-[#C59A63]" size={32} />
                        <h3 className="mt-6 text-xl font-black tracking-tight text-[#1C1B1F]">
                            Service Client Dédié
                        </h3>
                        <p className="mt-2 text-xs text-[#5A564F] leading-relaxed font-normal">
                            Une équipe à votre écoute sur WhatsApp au +221 75 446 90 97 pour
                            répondre à toutes vos questions.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
