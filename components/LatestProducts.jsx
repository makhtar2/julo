'use client';
import React from 'react';
import Title from './Title';
import ProductCard from './ProductCard';

const LatestProducts = ({ products }) => {
    const displayQuantity = 4;

    // Handle cases where products might be undefined or empty
    const latestProducts = products
        ? products
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, displayQuantity)
        : [];

    return (
        <section className="px-4 sm:px-6 py-10 sm:py-16 md:py-20 max-w-7xl mx-auto overflow-hidden">
            <Title
                title="Dernières Nouveautés"
                description={`Découvrez nos derniers produits ajoutés à la boutique.`}
                href="/shop"
            />
            <div className="mt-6 sm:mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 gap-y-6 sm:gap-y-10">
                {latestProducts.length > 0 ? (
                    latestProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} priority={index < 2} />
                    ))
                ) : (
                    <p className="text-center text-slate-500 py-10 col-span-full">
                        Aucun produit récent disponible.
                    </p>
                )}
            </div>
        </section>
    );
};

export default LatestProducts;
