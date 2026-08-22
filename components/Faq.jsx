'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

const faqData = [
    {
        question: 'Comment commander des équipements sur julo.store ?',
        answer: "Il vous suffit de sélectionner vos articles (smartphones, ordinateurs, accessoires), de les ajouter au panier et de valider votre commande en 1 minute. Vous pouvez également cliquer sur 'Acheter sur WhatsApp' pour échanger directement avec notre équipe.",
    },
    {
        question: 'Comment fonctionne la personnalisation / sérigraphie sur julo.prod ?',
        answer: "Pour les t-shirts, polos, casquettes, sacs ou goodies d'entreprise, vous pouvez nous envoyer votre visuel directement par WhatsApp ou via le formulaire. Nous établissons un devis rapide, réalisons un Bon à Tirer (BAT) numérique pour validation avant le lancement de l'impression dans notre atelier.",
    },
    {
        question: 'Quels sont les délais et tarifs de livraison au Sénégal ?',
        answer: "Nous assurons une livraison rapide en 24h sur Dakar, Thiès et Touba. Pour les autres régions du Sénégal, l'expédition s'effectue sous 48h via des transporteurs partenaires agréés. Le retrait gratuit est également disponible sur nos points partenaires.",
    },
    {
        question: 'Quels modes de paiement acceptez-vous ?',
        answer: 'Nous acceptons les paiements mobiles instantanés Wave, Orange Money, ainsi que le paiement en espèces (Cash) à la livraison lors de la réception de votre colis.',
    },
    {
        question: "Les produits électroniques bénéficient-ils d'une garantie ?",
        answer: 'Absolument. Tous les smartphones, ordinateurs et accessoires vendus sur julo.store sont 100% authentiques, certifiés neufs et couverts par une garantie avec service après-vente réactif.',
    },
];

const Faq = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqData.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16 sm:py-24 bg-zinc-50 border-t border-zinc-200/80">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-blanka tracking-wider text-zinc-700 mb-3">
                        <HelpCircle size={13} className="text-amber-500" />
                        JULO HELP CENTER
                    </div>
                    <h2 className="font-blanka text-3xl sm:text-4xl font-black text-zinc-950 tracking-wider uppercase mb-3">
                        QUESTIONS FRÉQUENTES.
                    </h2>
                    <p className="text-sm font-medium text-zinc-600 max-w-lg mx-auto">
                        Tout ce que vous devez savoir sur nos livraisons, garanties et
                        l&apos;atelier de sérigraphie.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqData.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="border border-zinc-200/80 rounded-2xl bg-white overflow-hidden transition-all duration-200"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full py-5 px-6 text-left flex justify-between items-center gap-4 hover:bg-zinc-50/80 transition-colors"
                                    aria-expanded={isOpen}
                                >
                                    <span className="font-bold text-sm sm:text-base text-zinc-900 leading-snug">
                                        {faq.question}
                                    </span>
                                    <div
                                        className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                                            isOpen
                                                ? 'bg-amber-500 text-zinc-950 rotate-180'
                                                : 'bg-zinc-100 text-zinc-600'
                                        }`}
                                    >
                                        <ChevronDown size={16} />
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
                                            <div className="px-6 pb-6 pt-1 text-xs sm:text-sm font-medium text-zinc-600 leading-relaxed border-t border-zinc-100">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* Direct Help CTA */}
                <div className="mt-12 text-center">
                    <p className="text-xs font-bold text-zinc-500 mb-3">
                        Vous avez un projet spécifique ou une question sur-mesure ?
                    </p>
                    <a
                        href="https://wa.me/221754469097?text=Bonjour%20Julo,%20j%27ai%20une%20question"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm"
                    >
                        <MessageCircle size={15} className="text-amber-400" />
                        <span>Discuter sur WhatsApp</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Faq;
