-- ==============================================================================
-- 🚀 JULO - SCHÉMA SQL COMPLET POUR NOUVELLE BASE DE DONNÉES SUPABASE DÉDIÉE
-- ==============================================================================
-- Ce fichier permet de créer l'intégralité de la base de données pour JULO
-- (Smartphones, Ordinateurs, Accessoires & Atelier de Sérigraphie).
-- Exécutez ce script dans l'éditeur SQL de votre nouveau projet Supabase JULO.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SUPPRESSION PROPRE DES TABLES (SI EXISTANTES)
DROP TABLE IF EXISTS "StockNotification" CASCADE;
DROP TABLE IF EXISTS "Review" CASCADE;
DROP TABLE IF EXISTS "OrderItem" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "Coupon" CASCADE;
DROP TABLE IF EXISTS "Banner" CASCADE;
DROP TABLE IF EXISTS "Address" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- 3. TABLE DES UTILISATEURS
CREATE TABLE "User" (
    "id" TEXT PRIMARY KEY, -- Lié à auth.users.id
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER', -- 'USER' ou 'ADMIN'
    "phone" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLE DES CATÉGORIES
CREATE TABLE "Category" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT UNIQUE NOT NULL,
    "slug" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLE DES PRODUITS
CREATE TABLE "Product" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mrp" NUMERIC NOT NULL,
    "price" NUMERIC NOT NULL,
    "images" TEXT[] NOT NULL DEFAULT '{}',
    "categoryId" UUID REFERENCES "Category"("id") ON DELETE SET NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "stock" INTEGER NOT NULL DEFAULT 10,
    "specs" JSONB DEFAULT '{}'::jsonb,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLE DES ADRESSES DE LIVRAISON
CREATE TABLE "Address" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" TEXT REFERENCES "User"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'Dakar',
    "zone" TEXT,
    "isDefault" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLE DES COMMANDES
CREATE TABLE "Order" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
    "total" NUMERIC NOT NULL,
    "subtotal" NUMERIC,
    "discount" NUMERIC DEFAULT 0,
    "deliveryFee" NUMERIC DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'
    "paymentMethod" TEXT NOT NULL DEFAULT 'COD', -- 'COD', 'WAVE', 'ORANGE_MONEY'
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID', -- 'UNPAID', 'PAID'
    "deliveryMethod" TEXT NOT NULL DEFAULT 'DELIVERY', -- 'DELIVERY', 'PICKUP'
    "address" JSONB NOT NULL,
    "customerInfo" JSONB,
    "couponCode" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABLE DES ARTICLES DE COMMANDE
CREATE TABLE "OrderItem" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "orderId" UUID NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
    "productId" UUID REFERENCES "Product"("id") ON DELETE SET NULL,
    "name" TEXT NOT NULL,
    "price" NUMERIC NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "image" TEXT
);

-- 9. TABLE DES AVIS CLIENTS
CREATE TABLE "Review" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "productId" UUID NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
    "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
    "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    "review" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. TABLE DES CODES PROMO
CREATE TABLE "Coupon" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "code" TEXT UNIQUE NOT NULL,
    "discount" NUMERIC NOT NULL, -- Réduction en FCFA
    "minSpend" NUMERIC DEFAULT 0,
    "isActive" BOOLEAN DEFAULT true,
    "expiryDate" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. TABLE DES BANNIÈRES
CREATE TABLE "Banner" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "image" TEXT NOT NULL,
    "link" TEXT DEFAULT '/shop',
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. TABLE DES NOTIFICATIONS DE RETOUR EN STOCK
CREATE TABLE "StockNotification" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "productId" UUID NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
    "email" TEXT NOT NULL,
    "notified" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ⚡ FONCTIONS ATOMIQUES POUR LE STOCK
-- ==============================================================================

CREATE OR REPLACE FUNCTION decrement_product_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE "Product"
    SET 
        "stock" = GREATEST(0, "stock" - p_quantity),
        "inStock" = CASE WHEN ("stock" - p_quantity) > 0 THEN true ELSE false END,
        "updatedAt" = timezone('utc'::text, now())
    WHERE "id" = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_product_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE "Product"
    SET 
        "stock" = "stock" + p_quantity,
        "inStock" = true,
        "updatedAt" = timezone('utc'::text, now())
    WHERE "id" = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 🛡️ POLITIQUES DE SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Address" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Coupon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Banner" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StockNotification" ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les produits, catégories, bannières, avis
CREATE POLICY "Public categories read" ON "Category" FOR SELECT USING (true);
CREATE POLICY "Public products read" ON "Product" FOR SELECT USING (true);
CREATE POLICY "Public banners read" ON "Banner" FOR SELECT USING (true);
CREATE POLICY "Public reviews read" ON "Review" FOR SELECT USING (true);
CREATE POLICY "Public coupons read" ON "Coupon" FOR SELECT USING (true);

-- Utilisateurs : lecture et modification de son propre profil
CREATE POLICY "Users can view own profile" ON "User" FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON "User" FOR SELECT USING (auth.uid() = id);

-- Commandes : insertion publique pour commande express & lecture de ses propres commandes
CREATE POLICY "Enable insert for orders" ON "Order" FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own orders" ON "Order" FOR SELECT USING (auth.uid() = "userId" OR "userId" IS NULL);
CREATE POLICY "Enable insert for order items" ON "OrderItem" FOR INSERT WITH CHECK (true);
CREATE POLICY "Public order items read" ON "OrderItem" FOR SELECT USING (true);

-- ==============================================================================
-- 💎 DONNÉES INITIALES DU CATALOGUE JULO (SEEDING)
-- ==============================================================================

-- 1. Catégories JULO
INSERT INTO "Category" ("id", "name", "slug") VALUES
    ('11111111-1111-1111-1111-111111111111', 'Smartphones & Apple', 'smartphones-apple'),
    ('22222222-2222-2222-2222-222222222222', 'Samsung Galaxy', 'samsung-galaxy'),
    ('33333333-3333-3333-3333-333333333333', 'Ordinateurs & PC', 'ordinateurs-pc'),
    ('44444444-4444-4444-4444-444444444444', 'Audio & Écouteurs', 'audio-ecouteurs'),
    ('55555555-5555-5555-5555-555555555555', 'Accessoires & GaN', 'accessoires-gan'),
    ('66666666-6666-6666-6666-666666666666', 'Sérigraphie & Textile', 'serigraphie-textile')
ON CONFLICT ("name") DO NOTHING;

-- 2. Produits Phares JULO
INSERT INTO "Product" ("name", "description", "mrp", "price", "categoryId", "stock", "inStock", "images") VALUES
    ('iPhone 16 Pro Max 256GB - Titane Naturel', 'Puce A18 Pro, écran Super Retina XDR 6.9 pouces, bouton Commande de l''appareil photo, autonomie record. Neuf scellé sous garantie officielle Apple.', 1150000, 995000, '11111111-1111-1111-1111-111111111111', 5, true, ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80']),
    ('Samsung Galaxy S24 Ultra 512GB - Titanium Black', 'Galaxy AI intégrée, processeur Snapdragon 8 Gen 3, capteur photo 200 MP avec zoom optique 5x et S-Pen inclus. Garantie constructeur 24 mois.', 980000, 890000, '22222222-2222-2222-2222-222222222222', 4, true, ARRAY['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80']),
    ('MacBook Pro 14" M3 Pro 18GB / 512GB - Noir Sidéral', 'Puce Apple M3 Pro, écran Liquid Retina XDR exceptionnel, autonomie jusqu''à 18 heures. Parfait pour développeurs, créateurs et professionnels exigeants.', 1750000, 1590000, '33333333-3333-3333-3333-333333333333', 3, true, ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80']),
    ('HP EliteBook 840 G10 Intel Core i7 16GB / 512GB SSD', 'Châssis premium ultra-fin en aluminium, écran 14" IPS Full HD antireflet, clavier rétroéclairé résistant aux éclaboussures et lecteur d''empreinte.', 650000, 575000, '33333333-3333-3333-3333-333333333333', 6, true, ARRAY['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80']),
    ('AirPods Pro (2ᵉ génération) avec boîtier MagSafe USB-C', 'Réduction active du bruit jusqu''à 2x plus performante, mode Transparence adaptative, Audio spatial personnalisé avec suivi dynamique de la tête.', 210000, 185000, '44444444-4444-4444-4444-444444444444', 12, true, ARRAY['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80']),
    ('Chargeur Rapide GaN 65W 3 Ports (2x USB-C + USB-A)', 'Technologie au nitrure de gallium (GaN), charge ultra-rapide pour MacBook, iPhone, Samsung et PC portables en simultané sans surchauffe.', 35000, 25000, '55555555-5555-5555-5555-555555555555', 20, true, ARRAY['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80']),
    ('T-Shirt Premium JULO Studio 100% Coton Sérigraphié', 'Coton peigné 240g/m², coupe oversize moderne, impression sérigraphique haute définition indélébile. Idéal pour commandes individuelles ou personnalisations de groupe.', 18000, 12000, '66666666-6666-6666-6666-666666666666', 30, true, ARRAY['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80']),
    ('Hoodie Custom JULO Atelier — Personnalisation Sur-Mesure', 'Sweat à capuche molletonné épais 350g/m², intérieur brossé doux, personnalisation avec votre logo, texte ou illustration. Devis instantané pour séries d''entreprise.', 30000, 22000, '66666666-6666-6666-6666-666666666666', 25, true, ARRAY['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80'])
ON CONFLICT DO NOTHING;

-- 3. Code Promo de Bienvenue
INSERT INTO "Coupon" ("code", "discount", "minSpend", "isActive") VALUES
    ('BIENVENUEJULO', 5000, 50000, true),
    ('JULO2026', 10000, 150000, true)
ON CONFLICT ("code") DO NOTHING;
