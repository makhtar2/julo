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
            'Service impeccable ! J’ai commandé un climatiseur Global Air le matin, il a été livré et installé l’après-midi même à Mermoz. Qualité exceptionnelle.',
        rating: 5,
        location: 'Dakar',
    },
    {
        id: 2,
        name: 'Aminata Sow',
        role: 'Cliente fidèle',
        content:
            'Global Air est devenu ma référence pour l’électroménager. Le paiement à la livraison me rassure énormément et le SAV est très réactif sur WhatsApp.',
        rating: 5,
        location: 'Saint-Louis',
    },
    {
        id: 3,
        name: 'Abdoulaye Ndiaye',
        role: 'Entrepreneur',
        content:
            'Très satisfait de mes achats pour mon bureau. Des produits premium à des prix justes. La livraison hors Dakar est bien gérée.',
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
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-4"
                    >
                        <Star size={12} fill="currentColor" />
                        Ils nous font confiance
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight"
                    >
                        L&apos;expérience <span className="text-blue-600">Global Air</span>
                    </motion.h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="relative bg-slate-50 rounded-[2.5rem] p-8 sm:p-10 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group"
                        >
                            <Quote className="absolute top-8 right-8 text-slate-200 size-12 group-hover:text-blue-100 transition-colors" />

                            <div className="relative z-10">
                                {/* Stars */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            fill="#FFB800"
                                            className="text-transparent"
                                        />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-slate-600 font-medium leading-relaxed mb-8 italic">
                                    &quot;{testimonial.content}&quot;
                                </p>

                                {/* Footer */}
                                <div className="flex items-center gap-4 pt-6 border-t border-slate-200/60">
                                    <div className="flex items-center justify-center size-12 rounded-2xl bg-blue-600 text-white font-black text-sm shrink-0">
                                        {getInitials(testimonial.name)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="font-black text-slate-900 text-sm truncate">
                                                {testimonial.name}
                                            </h4>
                                            <CheckCircle2
                                                size={12}
                                                className="text-blue-500 shrink-0"
                                            />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {testimonial.location} — {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Social Proof Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 flex flex-wrap justify-center gap-8 sm:gap-16 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                >
                    <div className="text-center">
                        <p className="text-2xl font-black text-slate-900">98%</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Clients Satisfaits
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-slate-900">24h</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Délai de Livraison
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-slate-900">7/7</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Support WhatsApp
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;
