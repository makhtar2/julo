'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';

const faqData = [
    {
        question: 'Comment commander des équipements sur JULO ?',
        answer: 'Ajoutez vos articles (smartphones, ordinateurs, accessoires) au panier et finalisez votre commande en toute sécurité. Vous pouvez aussi commander instantanément sur WhatsApp.',
    },
    {
        question: 'Les produits vendus par JULO sont-ils 100% authentiques ?',
        answer: 'Absolument. Tous nos smartphones (Apple, Samsung, Tecno, Infinix, Xiaomi), ordinateurs portables et accessoires audio sont neufs, sous scellé d’origine et certifiés avec garantie constructeur.',
    },
    {
        question: 'Quels sont vos délais et zones de livraison au Sénégal ?',
        answer: 'Livraison express sous 24h à Dakar, Thiès et Touba. Expédition 48h dans toutes les autres régions du Sénégal via nos partenaires agréés.',
    },
    {
        question: 'Quels sont les modes de paiement acceptés ?',
        answer: 'Paiement mobile instantané par Wave et Orange Money, ou en espèces (Cash) à la réception de votre commande.',
    },
    {
        question: 'Tous les téléphones et ordinateurs sont-ils sous garantie ?',
        answer: 'Oui, tous nos appareils sont couverts par une garantie officielle constructeur avec service après-vente dédié.',
    },
];

const Faq = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16 sm:py-20 bg-[#F5F2EB]/60 border-t border-[#EAE6DF]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="h-px w-8 bg-[#D6CEBE]" />
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#8C8275]">
                            QUESTIONS &amp; RÉPONSES
                        </span>
                        <div className="h-px w-8 bg-[#D6CEBE]" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#1C1B1F] tracking-tight mb-2">
                        Questions Fréquentes
                    </h2>
                    <p className="text-sm text-[#8C8275] max-w-lg mx-auto">
                        Tout ce qu&apos;il faut savoir pour commander vos équipements électroniques
                        en toute sérénité.
                    </p>
                </div>

                <div className="space-y-3">
                    {faqData.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="border border-[#EAE6DF] rounded-2xl bg-white overflow-hidden transition-all duration-200 shadow-xs"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full py-4 px-5 text-left flex justify-between items-center gap-4 hover:bg-[#FAF8F5] transition-colors"
                                    aria-expanded={isOpen}
                                >
                                    <span className="font-bold text-sm text-[#1C1B1F] leading-snug">
                                        {faq.question}
                                    </span>
                                    <div
                                        className={`size-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                                            isOpen
                                                ? 'bg-[#C59A63] text-white rotate-180'
                                                : 'bg-[#F5F2EB] text-[#1C1B1F]'
                                        }`}
                                    >
                                        <ChevronDown size={14} />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="px-5 pb-5 pt-1 text-xs sm:text-sm font-normal text-[#5A564F] leading-relaxed border-t border-[#EAE6DF]/70">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* WhatsApp Help CTA */}
                <div className="mt-10 text-center">
                    <p className="text-xs font-semibold text-[#8C8275] mb-3">
                        Besoin d&apos;un conseil sur un modèle ou un devis personnalisé ?
                    </p>
                    <a
                        href="https://wa.me/221754469097?text=Bonjour%20JULO,%20j%27ai%20une%20question"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#1C1B1F] hover:bg-[#C59A63] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-md active:scale-95"
                    >
                        <MessageCircle size={14} className="text-[#C59A63]" />
                        <span>Discuter sur WhatsApp</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Faq;
