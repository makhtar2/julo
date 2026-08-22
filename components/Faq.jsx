'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';

const faqData = [
    {
        question: 'Comment passer commande sur JULO ?',
        answer: "Choisissez vos articles (smartphones, ordinateurs, accessoires), ajoutez-les au panier et validez votre commande en 1 minute. Vous pouvez également cliquer sur 'Commander sur WhatsApp' pour échanger directement avec nous.",
    },
    {
        question: 'Proposez-vous des services de sérigraphie et personnalisation ?',
        answer: 'Oui ! Nous personnalisons vos t-shirts, polos, casquettes, sacs et goodies pour particuliers et entreprises avec une impression de haute qualité.',
    },
    {
        question: 'Quels sont les délais et zones de livraison au Sénégal ?',
        answer: 'Livraison express en 24h à Dakar, Thiès et Touba. Expédition sous 48h dans toutes les autres régions du Sénégal par transporteurs partenaires agréés.',
    },
    {
        question: 'Quels sont les modes de paiement acceptés ?',
        answer: 'Paiement mobile instantané par Wave et Orange Money, ou règlement en espèces (Cash) à la livraison.',
    },
    {
        question: 'Les téléphones et ordinateurs sont-ils sous garantie ?',
        answer: "Tous nos équipements sont neufs, 100% authentiques et accompagnés d'une garantie constructeur avec service après-vente dédié.",
    },
];

const Faq = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16 sm:py-20 bg-zinc-50 border-t border-zinc-200/80">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight mb-2">
                        Questions Fréquentes
                    </h2>
                    <p className="text-sm text-zinc-500 max-w-lg mx-auto">
                        Retrouvez les réponses aux questions les plus courantes sur nos produits et
                        services.
                    </p>
                </div>

                <div className="space-y-3">
                    {faqData.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="border border-zinc-200 rounded-2xl bg-white overflow-hidden transition-all duration-200"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full py-4 px-5 text-left flex justify-between items-center gap-4 hover:bg-zinc-50 transition-colors"
                                    aria-expanded={isOpen}
                                >
                                    <span className="font-bold text-sm text-zinc-900 leading-snug">
                                        {faq.question}
                                    </span>
                                    <div
                                        className={`size-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                                            isOpen
                                                ? 'bg-zinc-950 text-white rotate-180'
                                                : 'bg-zinc-100 text-zinc-600'
                                        }`}
                                    >
                                        <ChevronDown size={15} />
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
                                            <div className="px-5 pb-5 pt-1 text-xs sm:text-sm font-normal text-zinc-600 leading-relaxed border-t border-zinc-100">
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
                    <p className="text-xs font-semibold text-zinc-500 mb-3">Une autre question ?</p>
                    <a
                        href="https://wa.me/221754469097?text=Bonjour%20Julo,%20j%27ai%20une%20question"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                        <MessageCircle size={14} className="text-amber-400" />
                        <span>Écrivez-nous sur WhatsApp</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Faq;
