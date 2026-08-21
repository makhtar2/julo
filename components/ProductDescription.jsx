'use client';
import { StarIcon, CheckCircle2, MessageSquare } from 'lucide-react';

const ProductDescription = ({ product }) => {
    // Helper to format description text (detect bullets and key-value pairs)
    const formatDescription = (text) => {
        if (!text) return null;

        return text.split('\n').map((line, i) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return <br key={i} />;

            // Detect bullet points
            if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
                return (
                    <div key={i} className="flex items-start gap-3 mb-3 pl-2">
                        <CheckCircle2 size={16} className="text-blue-600 mt-1 shrink-0" />
                        <span className="text-slate-600 leading-relaxed font-medium">
                            {trimmedLine.substring(1).trim()}
                        </span>
                    </div>
                );
            }

            // Detect key-value pairs (e.g. "Couleur: Noir")
            if (trimmedLine.includes(':')) {
                const [key, ...valueParts] = trimmedLine.split(':');
                const value = valueParts.join(':').trim();
                return (
                    <div key={i} className="mb-4">
                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest block mb-1">
                            {key.trim()}
                        </span>
                        <span className="text-slate-900 font-bold text-sm">{value}</span>
                    </div>
                );
            }

            return (
                <p key={i} className="text-slate-600 leading-relaxed mb-4 text-base font-medium">
                    {trimmedLine}
                </p>
            );
        });
    };

    return (
        <div className="mt-16 sm:mt-24 mb-20 space-y-16">
            {/* Description Area */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-slate-100 shadow-sm">
                    <h4 className="text-slate-900 font-black text-xl mb-8 flex items-center gap-3">
                        À propos de ce produit
                        <div className="h-px bg-slate-100 flex-1" />
                    </h4>
                    <div className="prose prose-slate max-w-none">
                        {formatDescription(product.description)}
                    </div>
                </div>
            </div>

            {/* Reviews Area */}
            <div className="max-w-4xl mx-auto">
                <h4 className="text-slate-900 font-black text-xl mb-8 flex items-center gap-3 px-4 sm:px-0">
                    Avis Clients ({product.rating?.length || 0})
                    <div className="h-px bg-slate-200 flex-1" />
                </h4>

                <div className="space-y-6">
                    {product.rating?.length > 0 ? (
                        product.rating.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6"
                            >
                                <div className="flex sm:flex-col items-center gap-4 sm:gap-2 shrink-0">
                                    <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl border border-slate-100 uppercase">
                                        {item.user?.name?.charAt(0) || 'C'}
                                    </div>
                                    <div className="flex sm:justify-center">
                                        {Array(5)
                                            .fill('')
                                            .map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    size={12}
                                                    className="text-transparent"
                                                    fill={
                                                        item.rating >= i + 1 ? '#FFB800' : '#F1F5F9'
                                                    }
                                                />
                                            ))}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h5 className="font-black text-slate-900">
                                                {item.user?.name || 'Client Global Air'}
                                            </h5>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                {item.createdAt
                                                    ? new Date(item.createdAt).toLocaleDateString(
                                                          'fr-FR',
                                                          {
                                                              day: 'numeric',
                                                              month: 'long',
                                                              year: 'numeric',
                                                          }
                                                      )
                                                    : 'Achat Vérifié'}
                                            </p>
                                        </div>
                                        <div className="bg-green-50 text-green-600 text-[9px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-widest">
                                            Vérifié
                                        </div>
                                    </div>
                                    <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
                                        &quot;{item.review}&quot;
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                            <MessageSquare size={32} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                                Aucun avis pour le moment
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDescription;
