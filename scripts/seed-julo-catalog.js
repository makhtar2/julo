/**
 * Seed du catalogue high-tech JULO dans Supabase.
 *
 * Source : lib/mockProducts.js (JULO_CATEGORIES + JULO_MOCK_PRODUCTS), qui sert
 * aujourd'hui de catalogue en dur. Ce script le pousse en base pour que la
 * boutique lise enfin de vraies lignes.
 *
 * Les identifiants du mock sont des slugs ("julo-iphone-16-pro-max", "cat-1")
 * alors que Product.id et Category.id sont des UUID. On dérive donc un UUID v5
 * déterministe du slug : rejouer le script met à jour les mêmes lignes au lieu
 * d'en créer des doublons, et les URLs produit restent stables dans le temps.
 *
 * Prérequis : exécuter supabase/migrations/20260905_julo_catalog.sql (colonnes
 * "specs" et "slug"), sans quoi les fiches techniques seraient perdues.
 *
 * Usage :
 *   node scripts/seed-julo-catalog.js            # simulation (n'écrit rien)
 *   node scripts/seed-julo-catalog.js --apply    # écrit réellement en base
 */

import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const APPLY = process.argv.includes('--apply');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('✖ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis.');
    process.exit(1);
}

/** Namespace UUID dédié au catalogue JULO (constant : ne jamais le changer). */
const NAMESPACE = '9f8b1c42-5d3e-4a17-9b06-2c7e5f0a8d31';

/** UUID v5 (SHA-1) — déterministe : même slug, même UUID, à chaque exécution. */
function uuidV5(name, namespace = NAMESPACE) {
    const nsBytes = Buffer.from(namespace.replace(/-/g, ''), 'hex');
    const hash = createHash('sha1').update(Buffer.concat([nsBytes, Buffer.from(name, 'utf8')]));
    const bytes = hash.digest().subarray(0, 16);
    bytes[6] = (bytes[6] & 0x0f) | 0x50; // version 5
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variante RFC 4122
    const hex = bytes.toString('hex');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function main() {
    const { JULO_CATEGORIES, JULO_MOCK_PRODUCTS } = await import('../lib/mockProducts.js');
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
        auth: { persistSession: false },
    });

    // Les colonnes réellement présentes : la base a dérivé du fichier de schéma,
    // on n'envoie donc que ce qu'elle sait accepter.
    const { data: sample, error: probeError } = await supabase.from('Product').select('*').limit(1);
    if (probeError) {
        console.error('✖ Lecture de Product impossible :', probeError.message);
        process.exit(1);
    }
    const columns = new Set(Object.keys(sample?.[0] ?? {}));
    for (const required of ['specs', 'slug']) {
        if (!columns.has(required)) {
            console.error(
                `✖ Colonne "${required}" absente. Exécutez d'abord ` +
                    'supabase/migrations/20260905_julo_catalog.sql dans le SQL Editor Supabase.'
            );
            process.exit(1);
        }
    }

    const only = (row) => Object.fromEntries(Object.entries(row).filter(([k]) => columns.has(k)));

    const categories = JULO_CATEGORIES.map((c) => ({
        id: uuidV5(`category:${c.slug}`),
        name: c.name,
        slug: c.slug,
    }));

    const categoryIdBySlug = new Map(JULO_CATEGORIES.map((c, i) => [c.id, categories[i].id]));

    const products = JULO_MOCK_PRODUCTS.map((p) =>
        only({
            id: uuidV5(`product:${p.id}`),
            slug: p.id,
            name: p.name,
            description: p.description,
            mrp: p.mrp,
            price: p.price,
            images: p.images,
            categoryId: categoryIdBySlug.get(p.categoryId) ?? null,
            inStock: p.inStock ?? true,
            stock: p.stock ?? 0,
            specs: p.specs ?? {},
            guarantee: p.guarantee ?? null,
            createdAt: p.createdAt,
        })
    );

    console.log(`Cible      : ${SUPABASE_URL}`);
    console.log(`Catégories : ${categories.length}`);
    console.log(`Produits   : ${products.length}`);
    console.log(`Colonnes   : ${[...columns].join(', ')}`);
    console.log(`Mode       : ${APPLY ? 'ÉCRITURE RÉELLE' : 'simulation (--apply pour écrire)'}\n`);

    for (const p of products.slice(0, 3)) {
        console.log(`  ex. ${p.slug} -> ${p.id}`);
    }
    console.log(`  … et ${products.length - 3} autres\n`);

    if (!APPLY) {
        console.log('Simulation terminée — aucune écriture. Relancez avec --apply.');
        return;
    }

    const { error: catError } = await supabase
        .from('Category')
        .upsert(categories.map(only), { onConflict: 'id' });
    if (catError) {
        console.error('✖ Upsert Category :', catError.message);
        process.exit(1);
    }
    console.log(`✓ ${categories.length} catégories à jour`);

    const { error: prodError } = await supabase
        .from('Product')
        .upsert(products, { onConflict: 'id' });
    if (prodError) {
        console.error('✖ Upsert Product :', prodError.message);
        process.exit(1);
    }
    console.log(`✓ ${products.length} produits à jour`);
    console.log('\nCatalogue seedé. Les anciens produits Global Air sont laissés intacts :');
    console.log('isJuloProduct() (lib/mockProducts.js) les écarte déjà de la boutique.');
}

main().catch((e) => {
    console.error('✖', e.message);
    process.exit(1);
});
