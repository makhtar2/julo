import { createPublicClient } from '@/lib/supabase/public';

export default async function sitemap() {
    const baseUrl = 'https://globalairsn.com';

    // Fetch all products for dynamic routes
    const supabase = createPublicClient();
    const { data: products } = await supabase.from('Product').select('id, "createdAt", price, mrp');
    const { data: categories } = await supabase.from('Category').select('name');

    const productEntries =
        products?.map((product) => ({
            url: `${baseUrl}/product/${product.id}`,
            lastModified: new Date(product.createdAt),
            changeFrequency: 'weekly',
            priority: product.mrp > product.price ? 1.0 : 0.8,
        })) || [];

    const categoryEntries =
        categories?.map((cat) => ({
            url: `${baseUrl}/shop?category=${encodeURIComponent(cat.name)}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        })) || [];

    // Static routes
    const staticRoutes = ['', '/shop', '/about', '/contact', '/wishlist', '/cart'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.7,
    }));

    return [...staticRoutes, ...categoryEntries, ...productEntries];
}
