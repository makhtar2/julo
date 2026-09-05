'use server';

import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { productSchema, updateProductSchema } from '@/lib/validations';
import { v2 as cloudinary } from 'cloudinary';
import { getSql } from '@/lib/db';
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

/**
 * Colonnes acceptées par updateProduct. La clause SET est construite
 * dynamiquement : cette liste blanche empêche qu'un champ inattendu venu du
 * formulaire admin se retrouve dans la requête.
 */
const UPDATABLE_COLUMNS = [
    'name',
    'description',
    'mrp',
    'price',
    'images',
    'categoryId',
    'stock',
    'inStock',
    'guarantee',
];

/**
 * Un produit tel que l'attend l'interface : la catégorie imbriquée sous
 * "Category" et les notes agrégées sous "rating", comme le faisaient les
 * jointures Supabase (ProductCard, ProductDetails et ShopContent lisent
 * product.Category.name et product.rating[].rating).
 */
const PRODUCT_SELECT = `
    SELECT p.*,
           CASE WHEN c."id" IS NULL THEN NULL
                ELSE json_build_object('id', c."id", 'name', c."name")
           END AS "Category",
           COALESCE(
               (SELECT json_agg(json_build_object('rating', r."rating"))
                FROM "Rating" r WHERE r."productId" = p."id"),
               '[]'::json
           ) AS "rating"
    FROM "Product" p
    LEFT JOIN "Category" c ON c."id" = p."categoryId"
`;

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

        const sql = getSql();
        const { name, description, mrp, price, images, categoryId, stock } = validation.data;
        const guarantee = productData.guarantee || '6 mois';

        const [product] = await sql`
            INSERT INTO "Product"
                ("name", "description", "mrp", "price", "images",
                 "categoryId", "stock", "guarantee", "inStock")
            VALUES (${name}, ${description}, ${mrp}, ${price}, ${images},
                    ${categoryId}, ${stock}, ${guarantee}, ${stock > 0})
            RETURNING *
        `;

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

        const payload = { ...validation.data };
        if (validation.data.stock !== undefined) {
            payload.inStock = validation.data.stock > 0;
        }

        const columns = UPDATABLE_COLUMNS.filter((c) => payload[c] !== undefined);
        if (columns.length === 0) {
            return { error: 'Aucun champ à mettre à jour.' };
        }

        const sql = getSql();
        const assignments = columns.map((c, i) => `"${c}" = $${i + 2}`).join(', ');
        const values = columns.map((c) => payload[c]);

        const rows = await sql.query(
            `UPDATE "Product" SET ${assignments}, "updatedAt" = now()
             WHERE "id" = $1 RETURNING *`,
            [id, ...values]
        );
        const updatedProduct = rows[0];

        if (!updatedProduct) {
            return { error: 'Produit introuvable.' };
        }

        // If stock became > 0, notify subscribers
        if (updatedProduct.stock > 0) {
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
    const { category, search } = filters;

    try {
        const sql = getSql();
        const conditions = [];
        const values = [];

        if (category) {
            values.push(category);
            conditions.push(`c."name" = $${values.length}`);
        }

        if (search) {
            values.push(`%${search}%`);
            conditions.push(
                `(p."name" ILIKE $${values.length} OR p."description" ILIKE $${values.length})`
            );
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const products = await sql.query(
            `${PRODUCT_SELECT} ${where} ORDER BY p."createdAt" DESC`,
            values
        );

        return { products };
    } catch (error) {
        console.error('Get products error:', error);
        return { products: [] };
    }
}

export async function getProduct(id) {
    try {
        const sql = getSql();
        const rows = await sql.query(`${PRODUCT_SELECT} WHERE p."id" = $1`, [id]);

        if (!rows.length) {
            return { error: 'Produit non trouvé.' };
        }

        return { product: rows[0] };
    } catch (error) {
        // Un identifiant qui n'est pas un UUID fait échouer la requête (22P02) :
        // c'est un produit inexistant, pas une panne.
        if (error.code !== '22P02') console.error('Get product error:', error);
        return { error: 'Produit non trouvé.' };
    }
}

export async function getSearchSuggestions(query) {
    if (!query || query.length < 2) return { suggestions: [] };

    try {
        const sql = getSql();
        const suggestions = await sql`
            SELECT p."id", p."name", p."images", p."price",
                   CASE WHEN c."id" IS NULL THEN NULL
                        ELSE json_build_object('id', c."id", 'name', c."name")
                   END AS "Category"
            FROM "Product" p
            LEFT JOIN "Category" c ON c."id" = p."categoryId"
            WHERE p."name" ILIKE ${`%${query}%`}
            ORDER BY p."name" ASC
            LIMIT 5
        `;
        return { suggestions };
    } catch (error) {
        console.error('Search suggestions error:', error);
        return { suggestions: [] };
    }
}

export async function deleteProduct(id) {
    try {
        await checkAdmin();
        const sql = getSql();

        await sql`DELETE FROM "Product" WHERE "id" = ${id}`;

        revalidatePath('/shop');
        revalidatePath('/admin/products');
        revalidatePath(`/product/${id}`);
        return { success: 'Produit supprimé !' };
    } catch (error) {
        console.error('Delete product error:', error);
        return { error: 'Erreur lors de la suppression du produit.' };
    }
}
