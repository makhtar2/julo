import { Suspense } from 'react';
import { getProducts } from '@/app/actions/product';
import { getCategories } from '@/app/actions/category';
import ShopContent from '@/components/ShopContent';

export const revalidate = 3600;

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const category = params?.category;
    const baseUrl = 'https://julo.sn';

    if (category) {
        return {
            title: `${category} au Sénégal — Boutique JULO`,
            description: `Achetez vos ${category} au Sénégal chez JULO. Produits 100% originaux certifiés avec garantie. Livraison rapide à Dakar, Thiès et Touba.`,
            alternates: {
                canonical: `${baseUrl}/shop?category=${encodeURIComponent(category)}`,
            },
            openGraph: {
                title: `${category} Premium au Sénégal | JULO`,
                description: `Découvrez la sélection ${category} chez JULO. Livraison express partout au Sénégal.`,
                images: ['/assets/julo_logo_transparent.png'],
            },
        };
    }

    return {
        title: 'Boutique High-Tech & Smartphones au Sénégal | JULO',
        description:
            'Découvrez le catalogue officiel JULO : Smartphones Apple, Samsung, Tecno, Xiaomi, MacBook, PC portables, montres connectées et accessoires certifiés. Livraison express au Sénégal.',
        alternates: {
            canonical: `${baseUrl}/shop`,
        },
        openGraph: {
            title: 'JULO Sénégal — Boutique High-Tech Officielle',
            description:
                'Équipez votre quotidien avec les meilleurs smartphones, ordinateurs et accessoires certifiés au Sénégal.',
            images: ['/assets/julo_logo_transparent.png'],
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
