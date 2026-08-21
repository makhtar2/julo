import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
    try {
        const supabase = createAdminClient();

        // Récupérer uniquement les produits publiés/en stock
        const { data: products, error } = await supabase
            .from('Product')
            .select(`
                *,
                Category:categoryId (
                    name
                )
            `)
            .eq('inStock', true);

        if (error) throw error;

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://globalairsn.com';

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
    <channel>
        <title>Global Air Sénégal</title>
        <link>${baseUrl}</link>
        <description>Catalogue des produits Global Air</description>
`;

        products.forEach(product => {
            const productUrl = `${baseUrl}/product/${product.id}`;
            const imageLink = product.images?.[0] || '';
            const price = product.price ? `${product.price} XOF` : '';
            const availability = product.stock > 0 ? 'in_stock' : 'out_of_stock';
            
            // Supabase renvoie les relations souvent dans un array ou un object selon la contrainte
            // Ici Category est lié par un foreign key simple, donc ça devrait être un object
            const categoryName = product.Category?.name || 'Général';
            
            // Échapper les caractères spéciaux XML
            const escapeXml = (unsafe) => {
                if (!unsafe) return '';
                return unsafe.toString().replace(/[<>&'"]/g, function (c) {
                    switch (c) {
                        case '<': return '&lt;';
                        case '>': return '&gt;';
                        case '&': return '&amp;';
                        case '\'': return '&apos;';
                        case '"': return '&quot;';
                        default: return c;
                    }
                });
            };

            xml += `
        <item>
            <g:id>${escapeXml(product.id)}</g:id>
            <g:title>${escapeXml(product.name)}</g:title>
            <g:description>${escapeXml(product.description || product.name)}</g:description>
            <g:link>${escapeXml(productUrl)}</g:link>
            <g:image_link>${escapeXml(imageLink)}</g:image_link>
            <g:brand>Global Air</g:brand>
            <g:condition>new</g:condition>
            <g:availability>${escapeXml(availability)}</g:availability>
            <g:price>${escapeXml(price)}</g:price>
            <g:product_type>${escapeXml(categoryName)}</g:product_type>
        </item>`;
        });

        xml += `
    </channel>
</rss>`;

        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate',
            },
        });

    } catch (error) {
        console.error('Error generating product feed:', error);
        return new NextResponse('Error generating feed', { status: 500 });
    }
}
