/**
 * Seed du catalogue high-tech JULO dans Neon.
 *
 * Source : lib/mockProducts.js (JULO_CATEGORIES + JULO_MOCK_PRODUCTS), qui sert
 * aujourd'hui de catalogue en dur côté application.
 *
 * Les identifiants du catalogue sont des slugs ("julo-iphone-16-pro-max",
 * "cat-1") alors que Product.id et Category.id sont des UUID. On dérive donc un
 * UUID v5 déterministe du slug : rejouer le script met à jour les mêmes lignes
 * au lieu d'en créer des doublons, et les identifiants restent stables dans le
 * temps. Le slug d'origine est conservé dans la colonne "slug", ce qui permet de
 * garder des URLs lisibles.
 *
 * Prérequis : node scripts/db-apply-schema.js (crée les tables sur Neon).
 *
 * Usage :
 *   node scripts/seed-julo-catalog.js            # simulation (n'écrit rien)
 *   node scripts/seed-julo-catalog.js --apply    # écrit réellement en base
 */

import { createHash } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const APPLY = process.argv.includes('--apply');

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
    console.error('✖ DATABASE_URL est requis (vercel env pull).');
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

const sql = neon(url);

const { JULO_CATEGORIES, JULO_MOCK_PRODUCTS } = await import('../lib/mockProducts.js');

const categories = JULO_CATEGORIES.map((c) => ({
    id: uuidV5(`category:${c.slug}`),
    name: c.name,
    slug: c.slug,
}));

const categoryUuidByMockId = new Map(JULO_CATEGORIES.map((c, i) => [c.id, categories[i].id]));

const products = JULO_MOCK_PRODUCTS.map((p) => ({
    id: uuidV5(`product:${p.id}`),
    slug: p.id,
    name: p.name,
    description: p.description,
    mrp: p.mrp,
    price: p.price,
    images: p.images,
    categoryId: categoryUuidByMockId.get(p.categoryId) ?? null,
    inStock: p.inStock ?? true,
    stock: p.stock ?? 0,
    specs: p.specs ?? {},
    guarantee: p.guarantee ?? null,
    createdAt: p.createdAt,
}));

console.log(`Catégories : ${categories.length}`);
console.log(`Produits   : ${products.length}`);
console.log(`Mode       : ${APPLY ? 'ÉCRITURE RÉELLE' : 'simulation (--apply pour écrire)'}\n`);
for (const p of products.slice(0, 3)) console.log(`  ex. ${p.slug} -> ${p.id}`);
console.log(`  … et ${products.length - 3} autres\n`);

if (!APPLY) {
    console.log('Simulation terminée — aucune écriture. Relancez avec --apply.');
    process.exit(0);
}

for (const c of categories) {
    await sql.query(
        `INSERT INTO "Category" ("id", "name", "slug") VALUES ($1, $2, $3)
         ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "slug" = EXCLUDED."slug"`,
        [c.id, c.name, c.slug]
    );
}
console.log(`✓ ${categories.length} catégories à jour`);

for (const p of products) {
    await sql.query(
        `INSERT INTO "Product"
            ("id","slug","name","description","mrp","price","images","categoryId",
             "inStock","stock","specs","guarantee","createdAt","updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13, now())
         ON CONFLICT ("id") DO UPDATE SET
            "slug"        = EXCLUDED."slug",
            "name"        = EXCLUDED."name",
            "description" = EXCLUDED."description",
            "mrp"         = EXCLUDED."mrp",
            "price"       = EXCLUDED."price",
            "images"      = EXCLUDED."images",
            "categoryId"  = EXCLUDED."categoryId",
            "inStock"     = EXCLUDED."inStock",
            "stock"       = EXCLUDED."stock",
            "specs"       = EXCLUDED."specs",
            "guarantee"   = EXCLUDED."guarantee",
            "updatedAt"   = now()`,
        [
            p.id,
            p.slug,
            p.name,
            p.description,
            p.mrp,
            p.price,
            p.images,
            p.categoryId,
            p.inStock,
            p.stock,
            JSON.stringify(p.specs),
            p.guarantee,
            p.createdAt,
        ]
    );
}
console.log(`✓ ${products.length} produits à jour`);
