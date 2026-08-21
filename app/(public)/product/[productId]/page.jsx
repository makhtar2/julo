import ProductDescription from '@/components/ProductDescription';
import ProductDetails from '@/components/ProductDetails';
import RelatedProducts from '@/components/RelatedProducts';
import { getProduct, getProducts } from '@/app/actions/product';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateStaticParams() {
    const { products } = await getProducts();
    if (!products) return [];

    return products.map((product) => ({
        productId: product.id,
    }));
}

export async function generateMetadata({ params }) {
    const { productId } = await params;
    const { product } = await getProduct(productId);

    if (!product) return { title: 'Produit non trouvé | Global Air' };

    const formattedPrice = product.price.toLocaleString('fr-SN') + ' FCFA';
    const categoryName = product.Category?.name || product.category || 'Électroménager';
    const cleanDescription = product.description
        ? product.description.substring(0, 155) + '...'
        : 'Découvrez nos produits premium chez Global Air Sénégal. Qualité et service garantis.';

    return {
        title: `${product.name} — ${formattedPrice} | Global Air Sénégal`,
        description: `Achetez ${product.name} au meilleur prix au Sénégal (${formattedPrice}). ${categoryName} premium avec livraison express à Dakar. En stock chez Global Air.`,
        openGraph: {
            title: `${product.name} — ${formattedPrice}`,
            description: `Découvrez ${product.name} sur Global Air Sénégal. Qualité premium, meilleur prix et livraison rapide au Sénégal.`,
            images: product.images?.[0] ? [product.images[0]] : ['/assets/gs_logo.jpg'],
            type: 'website',
            siteName: 'Global Air Sénégal',
            locale: 'fr_SN',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: `Prix : ${formattedPrice} — En stock chez Global Air Sénégal. Livraison partout au Sénégal.`,
            images: product.images?.[0] ? [product.images[0]] : ['/assets/gs_logo.jpg'],
        },
    };
}

export default async function ProductPage({ params }) {
    const { productId } = await params;
    const { product, error } = await getProduct(productId);
    const { products: allProducts } = await getProducts();

    if (error || !product) {
        return notFound();
    }

    const productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.description,
        sku: product.id,
        mpn: product.id,
        brand: {
            '@type': 'Brand',
            name: 'Global Air',
        },
        offers: {
            '@type': 'Offer',
            url: `https://globalairsn.com/product/${product.id}`,
            priceCurrency: 'XOF',
            price: product.price,
            priceValidUntil: '2026-12-31',
            availability: product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
            shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: {
                    '@type': 'MonetaryAmount',
                    value: 2000,
                    currency: 'XOF',
                },
                shippingDestination: {
                    '@type': 'DefinedRegion',
                    addressCountry: 'SN',
                },
            },
        },
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Accueil',
                item: 'https://globalairsn.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Boutique',
                item: 'https://globalairsn.com/shop',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: product.Category?.name || product.category || 'Général',
                item: `https://globalairsn.com/shop?category=${encodeURIComponent(product.Category?.name || product.category || 'Général')}`,
            },
            {
                '@type': 'ListItem',
                position: 4,
                name: product.name,
                item: `https://globalairsn.com/product/${product.id}`,
            },
        ],
    };

    // Filter related products by category
    const relatedProducts =
        allProducts?.filter(
            (p) =>
                (p.category === product.category || p.Category?.name === product.Category?.name) &&
                p.id !== product.id
        ) || [];

    return (
        <div className="mx-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div className="max-w-7xl mx-auto pb-20">
                {/* Breadcrumbs */}
                <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-10 mb-6 flex items-center gap-2">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors">
                        Accueil
                    </span>
                    <span className="text-slate-200">/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors">
                        Boutique
                    </span>
                    <span className="text-slate-200">/</span>
                    <span className="text-slate-900">
                        {product.Category?.name || product.category || 'Général'}
                    </span>
                </div>

                {/* Product Details */}
                <ProductDetails product={product} />

                {/* Description & Reviews */}
                <ProductDescription product={product} />

                {/* Related Products */}
                <RelatedProducts products={relatedProducts} currentProductId={product.id} />
            </div>
        </div>
    );
}
