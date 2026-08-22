'use client';
import { StarIcon, CheckCircle2, MessageSquare } from 'lucide-react';

const ProductDescription = ({ product }) => {
    const formatDescription = (text) => {
        if (!text) return null;

        return text.split('\n').map((line, i) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return <br key={i} />;

            if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
                return (
                    <div key={i} className="flex items-start gap-3 mb-2.5 pl-1">
                        <CheckCircle2 size={16} className="text-[#C59A63] mt-0.5 shrink-0" />
                        <span className="text-[#5A564F] leading-relaxed text-sm font-medium">
                            {trimmedLine.substring(1).trim()}
                        </span>
                    </div>
                );
            }

            if (trimmedLine.includes(':')) {
                const [key, ...valueParts] = trimmedLine.split(':');
                const value = valueParts.join(':').trim();
                return (
                    <div key={i} className="mb-3">
                        <span className="text-[#8C8275] font-extrabold text-[10px] uppercase tracking-wider block mb-0.5">
                            {key.trim()}
                        </span>
                        <span className="text-[#1C1B1F] font-bold text-sm">{value}</span>
                    </div>
                );
            }

            return (
                <p key={i} className="text-[#5A564F] leading-relaxed mb-3 text-sm font-normal">
                    {trimmedLine}
                </p>
            );
        });
    };

    return (
        <div className="mt-14 mb-20 space-y-12 max-w-4xl mx-auto">
            {/* Description Card */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EAE6DF] shadow-xs">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#EAE6DF]">
                    <div className="h-4 w-1 bg-[#C59A63] rounded-full" />
                    <h3 className="text-[#1C1B1F] font-black text-lg sm:text-xl tracking-tight">
                        Fiche Technique &amp; Spécifications
                    </h3>
                </div>
                <div>{formatDescription(product.description)}</div>
            </div>

            {/* Reviews Card */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EAE6DF] shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EAE6DF]">
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-1 bg-[#C59A63] rounded-full" />
                        <h3 className="text-[#1C1B1F] font-black text-lg sm:text-xl tracking-tight">
                            Avis Clients ({product.rating?.length || 0})
                        </h3>
                    </div>
                </div>

                <div className="space-y-4">
                    {product.rating?.length > 0 ? (
                        product.rating.map((item, index) => (
                            <div
                                key={index}
                                className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#EAE6DF] flex flex-col sm:flex-row gap-4"
                            >
                                <div className="size-10 bg-white rounded-full flex items-center justify-center text-[#C59A63] font-black text-sm border border-[#EAE6DF] uppercase shrink-0">
                                    {item.user?.name?.charAt(0) || 'J'}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h5 className="font-bold text-sm text-[#1C1B1F]">
                                                {item.user?.name || 'Client JULO'}
                                            </h5>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                {Array(5)
                                                    .fill('')
                                                    .map((_, i) => (
                                                        <StarIcon
                                                            key={i}
                                                            size={11}
                                                            className="fill-[#C59A63] text-[#C59A63]"
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-[#8C8275] bg-white px-2.5 py-0.5 rounded-full border border-[#EAE6DF]">
                                            Achat Vérifié
                                        </span>
                                    </div>
                                    <p className="text-[#5A564F] text-xs leading-relaxed">
                                        &quot;{item.review}&quot;
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-[#FAF8F5] rounded-2xl border border-[#EAE6DF]">
                            <MessageSquare size={24} className="mx-auto text-zinc-300 mb-2" />
                            <p className="text-[#8C8275] font-bold text-xs">
                                Aucun avis déposé pour le moment
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDescription;
