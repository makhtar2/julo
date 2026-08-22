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
    const { createPublicClient } = await import('@/lib/supabase/server');
    const supabase = createPublicClient();
    const { category, search } = filters;

    try {
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

        const { data: products, error } = await query.order('createdAt', { ascending: false });

        if (error) throw error;

        // Strictly sanitize for React 19 serialization
        const sanitizedProducts = JSON.parse(JSON.stringify(products));

        return { products: sanitizedProducts };
    } catch (error) {
        console.error('Get products error:', error);
        return { error: 'Erreur lors de la récupération des produits.' };
    }
}

export async function getProduct(id) {
    const { createPublicClient } = await import('@/lib/supabase/server');
    const supabase = createPublicClient();

    try {
        const { data: product, error } = await supabase
            .from('Product')
            .select('*, Category(id, name), rating:Rating(*, user:User(id, name))')
            .eq('id', id)
            .single();

        if (error) throw error;

        // Strictly sanitize for React 19 serialization
        const sanitizedProduct = JSON.parse(JSON.stringify(product));

        return { product: sanitizedProduct };
    } catch (error) {
        console.error('Get product error:', error);
        return { error: 'Produit non trouvé.' };
    }
}

export async function getSearchSuggestions(query) {
    if (!query || query.length < 2) return { suggestions: [] };

    const { createPublicClient } = await import('@/lib/supabase/server');
    const supabase = createPublicClient();

    try {
        const { data: suggestions, error } = await supabase
            .from('Product')
            .select('id, name, images, price, Category(name)')
            .ilike('name', `%${query}%`)
            .limit(5);

        if (error) throw error;
        return { suggestions };
    } catch (error) {
        console.error('Suggestions error:', error);
        return { suggestions: [] };
    }
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
