'use client';
import React from 'react';
import Title from './Title';
import ProductCard from './ProductCard';

const BestSelling = ({ products }) => {
    const displayQuantity = 8;

    // Safely handle products data, default to empty array if undefined
    const safeProducts = products || [];
    // Sort products by rating (descending) and slice them
    const sortedAndSlicedProducts = safeProducts
        .slice()
        .sort((a, b) => (b.rating?.length || 0) - (a.rating?.length || 0))
        .slice(0, displayQuantity);

    return (
        <section className="px-4 sm:px-6 py-24 max-w-7xl mx-auto overflow-hidden">
            <Title
                title="Meilleures Ventes"
                description={`Les équipements et articles les plus demandés chez JULO.`}
                href="/shop"
            />
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-8 gap-y-8 sm:gap-y-14">
                {sortedAndSlicedProducts.length > 0 ? (
                    sortedAndSlicedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="text-center text-slate-500 py-10 col-span-full">
                        Aucune meilleure vente disponible.
                    </p>
                )}
            </div>
        </section>
    );
};

export default BestSelling;
