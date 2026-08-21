import { Suspense } from 'react';
import { getProducts } from '@/app/actions/product';
import { getCategories } from '@/app/actions/category';
import ShopContent from '@/components/ShopContent';

export const revalidate = 3600;

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const category = params?.category;
    const baseUrl = 'https://globalairsn.com';

    if (category) {
        return {
            title: `${category} au Sénégal — Meilleur Prix | Global Air`,
            description: `Achetez votre ${category} au Sénégal chez Global Air. Large choix, livraison express à Dakar et garantie officielle. Équipez votre maison dès aujourd'hui.`,
            alternates: {
                canonical: `${baseUrl}/shop?category=${encodeURIComponent(category)}`,
            },
            openGraph: {
                title: `${category} Premium au Sénégal | Global Air`,
                description: `Les meilleurs modèles de ${category} sont chez Global Air. Livraison rapide partout au Sénégal.`,
                images: ['/assets/gs_logo.jpg'],
            },
        };
    }

    return {
        title: 'Boutique Électroménager au Sénégal | Global Air',
        description:
            'Découvrez le plus grand choix de climatiseurs et électroménager au Sénégal. Livraison express 24h/48h. Meilleur rapport qualité/prix.',
        alternates: {
            canonical: `${baseUrl}/shop`,
        },
        openGraph: {
            title: 'Global Air Sénégal — Boutique Officielle',
            description: 'Équipez votre maison avec le meilleur de la technologie au Sénégal.',
            images: ['/assets/gs_logo.jpg'],
        },
    };
}

export default async function Shop() {
    const [{ products }, { categories }] = await Promise.all([getProducts(), getCategories()]);

    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    Chargement de la boutique...
                </div>
            }
        >
            <ShopContent initialProducts={products} initialCategories={categories} />
        </Suspense>
    );
}
