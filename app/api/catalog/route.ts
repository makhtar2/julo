import { getProducts } from '@/app/actions/product';
import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
    const { products } = await getProducts();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://globalairsn.com';

    if (!products) {
        return new NextResponse('No products found', { status: 404 });
    }

    const xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Global Air Catalog</title>
    <link>${baseUrl}</link>
    <description>L'excellence pour votre foyer au Sénégal - Catalog pour Facebook/Instagram</description>
    ${products
        .map((product) => {
            const description = product.description?.replace(/<[^>]*>?/gm, '') || '';
            const availability = product.inStock && product.stock > 0 ? 'in stock' : 'out of stock';

            return `
    <item>
      <g:id>${product.id}</g:id>
      <g:title>${product.name}</g:title>
      <g:description>${description.substring(0, 499)}</g:description>
      <g:link>${baseUrl}/product/${product.id}</g:link>
      <g:image_link>${product.images?.[0] || ''}</g:image_link>
      <g:brand>Global Air</g:brand>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${product.price} XOF</g:price>
      <g:google_product_category>Home &amp; Garden</g:google_product_category>
    </item>`;
        })
        .join('')}
  </channel>
</rss>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
