-- ============================================================================
-- Migration : préparer la base à recevoir le catalogue high-tech JULO
-- ============================================================================
-- La base live a dérivé de supabase/julo_schema.sql : "Product" n'a ni "specs"
-- ni "slug", et "Category" n'a ni "slug" ni "image". Sans ces colonnes, seeder
-- le catalogue depuis lib/mockProducts.js perdrait les fiches techniques
-- (affichées par ProductDetails) et imposerait des URLs en UUID.
--
-- À exécuter dans le SQL Editor Supabase AVANT scripts/seed-julo-catalog.js.
-- Idempotent : réexécutable sans risque.
-- ============================================================================

ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "specs" JSONB DEFAULT '{}'::jsonb;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "guarantee" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE
    DEFAULT timezone('utc'::text, now());

ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "image" TEXT;

-- Le slug identifie un produit dans l'URL : il doit rester unique.
CREATE UNIQUE INDEX IF NOT EXISTS "Product_slug_key" ON "Product" ("slug")
    WHERE "slug" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category" ("slug")
    WHERE "slug" IS NOT NULL;
