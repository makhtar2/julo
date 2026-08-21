'use client';
import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const RelatedProducts = ({ products, currentProductId }) => {
    // Filter out current product and limit to 4
    const related = products.filter((p) => p.id !== currentProductId).slice(0, 4);

    if (related.length === 0) return null;

    return (
        <div className="py-20 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
                <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">
                        Suggestions
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        Produits Similaires
                    </h2>
                </div>
                <p className="text-slate-400 font-bold text-sm">Basé sur vos préférences</p>
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
