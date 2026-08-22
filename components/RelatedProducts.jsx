'use client';
import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const RelatedProducts = ({ products, currentProductId }) => {
    // Filter out current product and limit to 4
    const related = products.filter((p) => p.id !== currentProductId).slice(0, 4);

    if (related.length === 0) return null;

    return (
        <div className="py-20 border-t border-[#EAE6DF]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px w-6 bg-[#D6CEBE]" />
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#8C8275]">
                            SUGGESTIONS
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#1C1B1F] tracking-tight">
                        Produits Similaires
                    </h2>
                </div>
                <p className="text-[#8C8275] font-normal text-xs sm:text-sm">
                    Dans la même catégorie
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 gap-y-8 sm:gap-y-10">
                {related.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
