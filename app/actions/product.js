'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { productSchema, updateProductSchema } from '@/lib/validations';
import { v2 as cloudinary } from 'cloudinary';
import { processStockNotifications } from './stock';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadProductImage(file) {
    try {
        await checkAdmin();

        // Security check: File type and size validation
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (!file.type.startsWith('image/')) {
            return { error: 'Seules les images sont autorisées.' };
        }
        if (file.size > MAX_SIZE) {
            return { error: "L'image est trop volumineuse (max 5 Mo)." };
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(base64Image, {
            folder: 'julo-products',
        });

        return { success: true, url: result.secure_url };
    } catch (error) {
        console.error('Upload error:', error);
        return { error: "Erreur lors de l'upload sur Cloudinary." };
    }
}

export async function addProduct(productData) {
    try {
        await checkAdmin();

        // Validate input
        const validation = productSchema.safeParse({
            ...productData,
            mrp: Number(productData.mrp),
            price: Number(productData.price),
            stock: Number(productData.stock),
        });

        if (!validation.success) {
            return { error: validation.error.issues[0].message };
        }

        const supabaseAdmin = await createAdminClient();
        const { name, description, mrp, price, images, categoryId, stock } = validation.data;
        const guarantee = productData.guarantee || '6 mois';

        const { data: product, error } = await supabaseAdmin
            .from('Product')
            .insert([
                {
                    name,
                    description,
                    mrp,
                    price,
                    images,
                    categoryId,
                    stock,
                    guarantee,
                    inStock: stock > 0,
                },
            ])
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/shop');
        revalidatePath('/admin/products');
        revalidatePath(`/product/${product.id}`);
        return { success: 'Produit ajouté !', product };
    } catch (error) {
        console.error('Add product error:', error);
        return { error: error.message || "Erreur lors de l'ajout du produit." };
    }
}

export async function updateProduct(id, productData) {
    try {
        await checkAdmin();

        // Validate input (partial: only the fields actually sent are checked)
        const validation = updateProductSchema.safeParse({
            ...productData,
            mrp: productData.mrp !== undefined ? Number(productData.mrp) : undefined,
            price: productData.price !== undefined ? Number(productData.price) : undefined,
            stock: productData.stock !== undefined ? Number(productData.stock) : undefined,
        });

        if (!validation.success) {
            return { error: validation.error.issues[0].message };
        }

        const supabaseAdmin = await createAdminClient();
        const updatePayload = { ...validation.data };
        if (validation.data.stock !== undefined) {
            updatePayload.inStock = validation.data.stock > 0;
        }

        const { data: updatedProduct, error } = await supabaseAdmin
            .from('Product')
            .update(updatePayload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // If stock became > 0, notify subscribers
        if (updatedProduct && updatedProduct.stock > 0) {
            await processStockNotifications(updatedProduct);
        }

        revalidatePath('/shop');
        revalidatePath('/admin/products');
        revalidatePath(`/product/${id}`);
        return { success: 'Produit mis à jour !' };
    } catch (error) {
        console.error('Update product error:', error);
        return { error: error.message || 'Erreur lors de la mise à jour.' };
    }
}

export async function getProducts(filters = {}) {
    const { JULO_MOCK_PRODUCTS } = await import('@/lib/mockProducts');
    const { createPublicClient } = await import('@/lib/supabase/server');
    const { category, search } = filters;

    try {
        const supabase = createPublicClient();
        let query = supabase.from('Product').select('*, Category(id, name), rating:Rating(rating)');

        if (category) {
            const { data: catData } = await supabase
                .from('Category')
                .select('id')
                .eq('name', category)
                .single();

            if (catData) {
                query = query.eq('categoryId', catData.id);
            }
        }

        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        const { data: dbProducts, error } = await query.order('createdAt', { ascending: false });

        // Filter out legacy products if connected to an external old database
        const juloDbProducts = (dbProducts || []).filter((p) => {
            const catName = (p.Category?.name || p.category || '').toLowerCase();
            const pName = (p.name || '').toLowerCase();
            const isOldGlobalAir =
                catName.includes('ventilateur') ||
                catName.includes('climatiseur') ||
                catName.includes('fontaine') ||
                catName.includes('bouilloire') ||
                catName.includes('valise') ||
                catName.includes('woofer') ||
                catName.includes('téléviseur') ||
                pName.includes('ventilateur') ||
                pName.includes('climatiseur') ||
                pName.includes('fontaine') ||
                pName.includes('bouilloire') ||
                pName.includes('valise') ||
                pName.includes('woofer') ||
                pName.includes('téléviseur smart');
            return !isOldGlobalAir;
        });

        if (!error && juloDbProducts.length > 0) {
            return { products: JSON.parse(JSON.stringify(juloDbProducts)) };
        }

        // Return JULO's full multi-brand Senegalese catalog
        let filteredMock = [...JULO_MOCK_PRODUCTS];
        if (category) {
            const catLower = category.toLowerCase();
            filteredMock = filteredMock.filter((p) => {
                const pCat = (p.Category?.name || p.category || '').toLowerCase();
                return pCat.includes(catLower) || catLower.includes(pCat);
            });
        }
        if (search) {
            const sLower = search.toLowerCase();
            filteredMock = filteredMock.filter(
                (p) =>
                    p.name.toLowerCase().includes(sLower) ||
                    (p.description && p.description.toLowerCase().includes(sLower))
            );
        }

        return { products: filteredMock };
    } catch {
        let filteredMock = [...JULO_MOCK_PRODUCTS];
        if (category) {
            const catLower = category.toLowerCase();
            filteredMock = filteredMock.filter((p) => {
                const pCat = (p.Category?.name || p.category || '').toLowerCase();
                return pCat.includes(catLower) || catLower.includes(pCat);
            });
        }
        if (search) {
            const sLower = search.toLowerCase();
            filteredMock = filteredMock.filter(
                (p) =>
                    p.name.toLowerCase().includes(sLower) ||
                    (p.description && p.description.toLowerCase().includes(sLower))
            );
        }
        return { products: filteredMock };
    }
}

export async function getProduct(id) {
    const { JULO_MOCK_PRODUCTS } = await import('@/lib/mockProducts');
    const { createPublicClient } = await import('@/lib/supabase/server');

    // 1. Direct lookup in JULO's real catalog
    const mockProduct = JULO_MOCK_PRODUCTS.find((p) => p.id === id);
    if (mockProduct) {
        return { product: mockProduct };
    }

    try {
        const supabase = createPublicClient();
        const { data: product, error } = await supabase
            .from('Product')
            .select('*, Category(id, name), rating:Rating(*, user:User(id, name))')
            .eq('id', id)
            .single();

        if (!error && product) {
            const catName = (product.Category?.name || product.category || '').toLowerCase();
            const pName = (product.name || '').toLowerCase();
            const isOldGlobalAir =
                catName.includes('ventilateur') ||
                catName.includes('climatiseur') ||
                catName.includes('fontaine') ||
                catName.includes('bouilloire') ||
                catName.includes('valise') ||
                catName.includes('woofer') ||
                catName.includes('téléviseur');

            if (!isOldGlobalAir) {
                return { product: JSON.parse(JSON.stringify(product)) };
            }
        }

        return { error: 'Produit non trouvé.' };
    } catch {
        return { error: 'Produit non trouvé.' };
    }
}

export async function getSearchSuggestions(query) {
    if (!query || query.length < 2) return { suggestions: [] };

    const { JULO_MOCK_PRODUCTS } = await import('@/lib/mockProducts');
    const qLower = query.toLowerCase();

    const mockSuggestions = JULO_MOCK_PRODUCTS.filter((p) => p.name.toLowerCase().includes(qLower))
        .slice(0, 5)
        .map((p) => ({
            id: p.id,
            name: p.name,
            images: p.images,
            price: p.price,
            Category: p.Category,
        }));

    return { suggestions: mockSuggestions };
}

export async function deleteProduct(id) {
    try {
        await checkAdmin();
        const supabaseAdmin = await createAdminClient();

        const { error } = await supabaseAdmin.from('Product').delete().eq('id', id);

        if (error) throw error;

        revalidatePath('/shop');
        revalidatePath('/admin/products');
        revalidatePath(`/product/${id}`);
        return { success: 'Produit supprimé !' };
    } catch (error) {
        return { error: 'Erreur lors de la suppression du produit.' };
    }
}
