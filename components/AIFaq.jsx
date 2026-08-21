'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

const faqData = [
    {
        question: "Quel est le meilleur climatiseur pour le climat de Dakar ?",
        answer: "Le meilleur climatiseur dépend de la taille de votre pièce. Pour le climat de Dakar, nous recommandons un modèle Inverter de 1.5 CV pour une chambre standard. Nos climatiseurs de marque Global Air sont équipés de compresseurs haute performance et d'un revêtement spécial pour résister parfaitement à l'air salin et aux chaleurs extrêmes."
    },
    {
        question: "Quels sont vos délais et frais de livraison au Sénégal ?",
        answer: "Nous assurons une livraison express en 24h à 48h partout au Sénégal. À Dakar, les frais de livraison sont fixes à 2 000 FCFA, et la livraison s'effectue généralement le jour même pour toute commande passée avant 14h. Le retrait en magasin est gratuit."
    },
    {
        question: "Global Air offre-t-il une garantie sur l'électroménager ?",
        answer: "Oui, tous les climatiseurs, téléviseurs et gros électroménager vendus chez Global Air sont couverts par une garantie officielle (généralement 6 mois minimum selon la marque). Nous assurons également un service après-vente (SAV) réactif."
    },
    {
        question: "Peut-on payer à la livraison ?",
        answer: "Absolument. Nous proposons le paiement Cash à la livraison lors de la réception de votre commande, ainsi que le paiement mobile et sécurisé via Wave."
    }
];

const AIFaq = () => {
    const [openIndex, setOpenIndex] = useState(null);

    // Génération du JSON-LD pour les moteurs de recherche IA (SGE, ChatGPT)
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
        <section className="py-16 sm:py-24 bg-slate-50 border-y border-slate-100">
            {/* Injection silencieuse du Schema.org */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-2xl mb-4">
                        <MessageCircleQuestion size={24} />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
                        Questions Fréquentes
                    </h2>
                    <p className="text-sm font-medium text-slate-500">
                        Tout ce que vous devez savoir sur nos équipements et nos services au Sénégal.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqData.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                                    isOpen ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-slate-200 hover:border-slate-300 shadow-sm'
                                }`}
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="flex w-full items-center justify-between p-5 sm:p-6 text-left"
                                >
                                    <span className={`font-bold pr-4 ${isOpen ? 'text-blue-600' : 'text-slate-800'}`}>
                                        {faq.question}
                                    </span>
                                    <div
                                        className={`shrink-0 p-1.5 rounded-full transition-transform duration-300 ${
                                            isOpen ? 'bg-blue-100 text-blue-600 rotate-180' : 'bg-slate-100 text-slate-400'
                                        }`}
                                    >
                                        <ChevronDown size={18} />
                                    </div>
                                </button>
                                
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-4 mt-2">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default AIFaq;
