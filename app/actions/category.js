'use server';

import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { getSql } from '@/lib/db';

export async function addCategory(name) {
    try {
        await checkAdmin();
        const sql = getSql();

        const [category] = await sql`
            INSERT INTO "Category" ("name")
            VALUES (${name})
            RETURNING *
        `;

        revalidatePath('/admin/products');
        revalidatePath('/shop');
        return { success: 'Catégorie ajoutée !', category };
    } catch (error) {
        console.error('Add category error:', error);
        return { error: "Erreur lors de l'ajout de la catégorie." };
    }
}

export async function getCategories() {
    try {
        const sql = getSql();
        const categories = await sql`
            SELECT "id", "name", "slug", "image"
            FROM "Category"
            ORDER BY "name" ASC
        `;
        return { categories };
    } catch (error) {
        console.error('Get categories error:', error);
        // Volontairement vide plutôt qu'un repli sur le catalogue statique :
        // deux sources de vérité concurrentes sont ce qui a laissé le catalogue
        // Global Air s'afficher dans la boutique JULO.
        return { categories: [] };
    }
}

export async function deleteCategory(id) {
    try {
        await checkAdmin();
        const sql = getSql();

        await sql`DELETE FROM "Category" WHERE "id" = ${id}`;

        revalidatePath('/admin/products');
        revalidatePath('/shop');
        return { success: 'Catégorie supprimée.' };
    } catch (error) {
        console.error('Delete category error:', error);
        return { error: 'Erreur lors de la suppression de la catégorie.' };
    }
}
