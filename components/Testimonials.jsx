'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'Moussa Diop',
        role: 'Client vérifié',
        content:
            'Service impeccable ! J’ai commandé un iPhone 16 Pro scellé chez JULO le matin, il a été livré l’après-midi même à Mermoz avec facture et garantie. Qualité exceptionnelle.',
        rating: 5,
        location: 'Dakar',
    },
    {
        id: 2,
        name: 'Aminata Sow',
        role: 'Fondatrice de Marque',
        content:
            'JULO est devenu notre partenaire de confiance pour la personnalisation textile de nos t-shirts et goodies. Sérigraphie nette et finitions soignées.',
        rating: 5,
        location: 'Saint-Louis',
    },
    {
        id: 3,
        name: 'Abdoulaye Ndiaye',
        role: 'Développeur & Entrepreneur',
        content:
            'MacBook Pro M3 commandé et reçu en parfait état à Thiès. Matériel 100% original, prix transparents en FCFA et service client très professionnel.',
        rating: 5,
        location: 'Thiès',
    },
];

const getInitials = (name) =>
    name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase();

const Testimonials = () => {
    return (
        <section className="py-20 bg-[#FAF8F5] border-t border-[#EAE6DF] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="h-px w-8 bg-[#D6CEBE]" />
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#8C8275]">
                            AVIS &amp; RETOURS D&apos;EXPÉRIENCE
                        </span>
                        <div className="h-px w-8 bg-[#D6CEBE]" />
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-[#1C1B1F] tracking-tight">
                        L&apos;expérience <span className="text-[#C59A63]">JULO</span>
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="relative bg-white rounded-3xl p-8 border border-[#EAE6DF] shadow-xs flex flex-col justify-between"
                        >
                            <Quote className="absolute top-6 right-6 text-[#EAE6DF] size-10" />

                            <div className="relative z-10">
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={13}
                                            fill="#C59A63"
                                            className="text-[#C59A63]"
                                        />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-[#5A564F] text-xs sm:text-sm font-normal leading-relaxed mb-6 italic">
                                    &quot;{testimonial.content}&quot;
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center gap-3.5 pt-4 border-t border-[#EAE6DF]">
                                <div className="flex items-center justify-center size-10 rounded-full bg-[#1C1B1F] text-white font-bold text-xs shrink-0">
                                    {getInitials(testimonial.name)}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <h4 className="font-bold text-[#1C1B1F] text-xs truncate">
                                            {testimonial.name}
                                        </h4>
                                        <CheckCircle2
                                            size={12}
                                            className="text-[#C59A63] shrink-0"
                                        />
                                    </div>
                                    <p className="text-[10px] font-semibold text-[#8C8275]">
                                        {testimonial.location} — {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
