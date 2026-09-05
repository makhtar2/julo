-- ============================================================================
-- Schéma JULO — Neon Postgres
-- ============================================================================
-- Porté depuis supabase/julo_schema.sql. Trois différences volontaires :
--
--  1. Pas d'extension "uuid-ossp" : gen_random_uuid() est natif depuis
--     Postgres 13 (Neon tourne en 18.6).
--  2. Pas de RLS ni de politiques : elles s'appuyaient sur auth.uid(), propre à
--     Supabase. L'autorisation remonte donc dans les Server Actions — voir la
--     note en fin de fichier, c'est un point de sécurité à ne pas perdre de vue.
--  3. "Product" reçoit "slug", "specs" et "guarantee" dès le départ. L'ancienne
--     base avait dérivé et n'avait ni slug ni specs, ce qui aurait fait perdre
--     les fiches techniques et imposé des URLs en UUID.
--
-- Idempotent : réexécutable sans détruire de données (aucun DROP).
-- ============================================================================

CREATE TABLE IF NOT EXISTS "User" (
    "id"        TEXT PRIMARY KEY,           -- identifiant Supabase Auth (auth.users.id)
    "name"      TEXT NOT NULL,
    "email"     TEXT UNIQUE NOT NULL,
    "image"     TEXT,
    "role"      TEXT NOT NULL DEFAULT 'USER',
    "phone"     TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Category" (
    "id"        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"      TEXT UNIQUE NOT NULL,
    "slug"      TEXT UNIQUE,
    "image"     TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Product" (
    "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "slug"        TEXT UNIQUE,
    "name"        TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mrp"         NUMERIC NOT NULL,
    "price"       NUMERIC NOT NULL,
    "images"      TEXT[] NOT NULL DEFAULT '{}',
    "categoryId"  UUID REFERENCES "Category"("id") ON DELETE SET NULL,
    "inStock"     BOOLEAN NOT NULL DEFAULT true,
    "stock"       INTEGER NOT NULL DEFAULT 10,
    "specs"       JSONB DEFAULT '{}'::jsonb,
    "guarantee"   TEXT,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Address" (
    "id"        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId"    TEXT REFERENCES "User"("id") ON DELETE CASCADE,
    "name"      TEXT NOT NULL,
    "phone"     TEXT NOT NULL,
    "street"    TEXT NOT NULL,
    "city"      TEXT NOT NULL,
    "region"    TEXT NOT NULL DEFAULT 'Dakar',
    "zone"      TEXT,
    "isDefault" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Order" (
    "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId"         TEXT REFERENCES "User"("id") ON DELETE SET NULL,
    "total"          NUMERIC NOT NULL,
    "subtotal"       NUMERIC,
    "discount"       NUMERIC DEFAULT 0,
    "deliveryFee"    NUMERIC DEFAULT 0,
    "status"         TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod"  TEXT NOT NULL DEFAULT 'COD',
    "paymentStatus"  TEXT NOT NULL DEFAULT 'UNPAID',
    "deliveryMethod" TEXT NOT NULL DEFAULT 'DELIVERY',
    "address"        JSONB NOT NULL,
    "customerInfo"   JSONB,
    "couponCode"     TEXT,
    "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id"        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderId"   UUID NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
    "productId" UUID REFERENCES "Product"("id") ON DELETE SET NULL,
    "name"      TEXT NOT NULL,
    "price"     NUMERIC NOT NULL,
    "quantity"  INTEGER NOT NULL DEFAULT 1,
    "image"     TEXT
);

-- Le schéma Supabase déclarait "Review", mais l'application n'a jamais lu que
-- "Rating" (app/actions/rating.js, product.js). C'est ce nom qui fait foi.
CREATE TABLE IF NOT EXISTS "Rating" (
    "id"        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
    "userId"    TEXT REFERENCES "User"("id") ON DELETE SET NULL,
    "rating"    INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    "review"    TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE ("productId", "userId")   -- un seul avis par client et par produit
);

-- Articles de blog. Absente de julo_schema.sql alors que app/actions/blog.js
-- et l'admin s'en servent : la table existait en base sans être documentée.
CREATE TABLE IF NOT EXISTS "Post" (
    "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title"       TEXT NOT NULL,
    "slug"        TEXT UNIQUE NOT NULL,
    "content"     TEXT NOT NULL,
    "excerpt"     TEXT,
    "image"       TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Limitation de débit (lib/rate-limit.ts), également absente du schéma d'origine.
CREATE TABLE IF NOT EXISTS "RateLimit" (
    "id"        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ip"        TEXT NOT NULL,
    "action"    TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Coupon" (
    "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "code"       TEXT UNIQUE NOT NULL,
    "discount"   NUMERIC NOT NULL,
    "minSpend"   NUMERIC DEFAULT 0,
    "isActive"   BOOLEAN DEFAULT true,
    "expiryDate" TIMESTAMPTZ,
    "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Banner" (
    "id"        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title"     TEXT NOT NULL,
    "subtitle"  TEXT,
    "image"     TEXT NOT NULL,
    "link"      TEXT DEFAULT '/shop',
    "isActive"  BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "StockNotification" (
    "id"        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
    "email"     TEXT NOT NULL,
    "notified"  BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index sur les colonnes réellement filtrées par l'application.
CREATE INDEX IF NOT EXISTS "Product_categoryId_idx"  ON "Product" ("categoryId");
CREATE INDEX IF NOT EXISTS "Product_createdAt_idx"   ON "Product" ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Order_userId_idx"        ON "Order" ("userId");
CREATE INDEX IF NOT EXISTS "Order_createdAt_idx"     ON "Order" ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx"   ON "OrderItem" ("orderId");
CREATE INDEX IF NOT EXISTS "Rating_productId_idx"    ON "Rating" ("productId");
CREATE INDEX IF NOT EXISTS "Post_slug_idx"           ON "Post" ("slug");
CREATE INDEX IF NOT EXISTS "RateLimit_lookup_idx"    ON "RateLimit" ("ip", "action", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Address_userId_idx"      ON "Address" ("userId");

-- Mouvements de stock atomiques (repris tels quels, sans SECURITY DEFINER :
-- il n'y a plus de rôle anon à contourner, l'application se connecte en owner).
CREATE OR REPLACE FUNCTION decrement_product_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE "Product"
    SET "stock"     = GREATEST(0, "stock" - p_quantity),
        "inStock"   = CASE WHEN ("stock" - p_quantity) > 0 THEN true ELSE false END,
        "updatedAt" = now()
    WHERE "id" = p_product_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_product_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE "Product"
    SET "stock"     = "stock" + p_quantity,
        "inStock"   = true,
        "updatedAt" = now()
    WHERE "id" = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ⚠️  SÉCURITÉ — À NE PAS OUBLIER
-- ============================================================================
-- Sous Supabase, la RLS empêchait un client d'aller lire les données d'un autre
-- même en cas d'oubli côté application. Ici, la connexion se fait en
-- neondb_owner : la base ne filtre plus rien. Chaque Server Action touchant
-- "Order", "Address", "Rating" ou "User" DOIT vérifier elle-même l'identité de
-- l'appelant (via supabase.auth.getUser(), qui reste en place) avant de lire ou
-- d'écrire. checkAdmin() couvre déjà le périmètre admin.
-- ============================================================================
