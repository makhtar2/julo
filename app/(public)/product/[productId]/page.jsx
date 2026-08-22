import ProductDescription from '@/components/ProductDescription';
import ProductDetails from '@/components/ProductDetails';
import RelatedProducts from '@/components/RelatedProducts';
import { getProduct, getProducts } from '@/app/actions/product';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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

    if (!product) return { title: 'Produit non trouvé | Julo' };

    const formattedPrice = product.price?.toLocaleString('fr-SN') + ' FCFA';
    const categoryName = product.Category?.name || product.category || 'High-Tech';
    const cleanDescription = product.description
        ? product.description.substring(0, 155) + '...'
        : 'Découvrez ce produit premium chez Julo Sénégal. Authenticité et livraison rapide garanties.';

    return {
        title: `${product.name} — ${formattedPrice} | Julo Sénégal`,
        description: `Achetez ${product.name} au meilleur prix (${formattedPrice}) chez Julo Sénégal. Livraison 24h à Dakar, Thiès, Touba.`,
        openGraph: {
            title: `${product.name} — ${formattedPrice}`,
            description: `Découvrez ${product.name} chez Julo Sénégal. Produits 100% originaux.`,
            images: product.images?.[0]
                ? [product.images[0]]
                : ['/assets/julo_logo_transparent.png'],
            type: 'website',
            siteName: 'Julo Sénégal',
            locale: 'fr_SN',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: `Prix : ${formattedPrice} — En stock chez Julo Sénégal.`,
            images: product.images?.[0]
                ? [product.images[0]]
                : ['/assets/julo_logo_transparent.png'],
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
            name: 'Julo',
        },
        offers: {
            '@type': 'Offer',
            url: `https://julo.sn/product/${product.id}`,
            priceCurrency: 'XOF',
            price: product.price,
            priceValidUntil: '2026-12-31',
            availability: product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
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
                item: 'https://julo.sn',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Boutique',
                item: 'https://julo.sn/shop',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: product.Category?.name || product.category || 'Général',
                item: `https://julo.sn/shop?category=${encodeURIComponent(product.Category?.name || product.category || 'Général')}`,
            },
            {
                '@type': 'ListItem',
                position: 4,
                name: product.name,
                item: `https://julo.sn/product/${product.id}`,
            },
        ],
    };

    const relatedProducts =
        allProducts?.filter(
            (p) =>
                (p.category === product.category || p.Category?.name === product.Category?.name) &&
                p.id !== product.id
        ) || [];

    return (
        <div className="bg-[#FAF8F5] min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-20">
                {/* Breadcrumbs */}
                <div className="text-[#8C8275] font-semibold text-xs mb-8 flex items-center gap-2">
                    <Link href="/" className="hover:text-[#1C1B1F] transition-colors">
                        Accueil
                    </Link>
                    <span className="text-[#D6CEBE]">/</span>
                    <Link href="/shop" className="hover:text-[#1C1B1F] transition-colors">
                        Boutique
                    </Link>
                    <span className="text-[#D6CEBE]">/</span>
                    <span className="text-[#1C1B1F] font-bold truncate max-w-xs sm:max-w-md">
                        {product.name}
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
