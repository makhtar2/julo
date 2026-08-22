-- ==============================================================================
-- 🚀 JULO - SCHÉMA SQL COMPLET POUR NOUVELLE BASE DE DONNÉES SUPABASE DÉDIÉE
-- ==============================================================================
-- Catalogue multi-marques adapté au Sénégal : Apple, Samsung, Tecno, Infinix,
-- Itel, Xiaomi, Oraimo, JBL, HP, Lenovo, Asus & Montres Connectées JULO.

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
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
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
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
    "deliveryMethod" TEXT NOT NULL DEFAULT 'DELIVERY',
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
    "discount" NUMERIC NOT NULL,
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

CREATE POLICY "Public categories read" ON "Category" FOR SELECT USING (true);
CREATE POLICY "Public products read" ON "Product" FOR SELECT USING (true);
CREATE POLICY "Public banners read" ON "Banner" FOR SELECT USING (true);
CREATE POLICY "Public reviews read" ON "Review" FOR SELECT USING (true);
CREATE POLICY "Public coupons read" ON "Coupon" FOR SELECT USING (true);

CREATE POLICY "Users can view own profile" ON "User" FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON "User" FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for orders" ON "Order" FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own orders" ON "Order" FOR SELECT USING (auth.uid() = "userId" OR "userId" IS NULL);
CREATE POLICY "Enable insert for order items" ON "OrderItem" FOR INSERT WITH CHECK (true);
CREATE POLICY "Public order items read" ON "OrderItem" FOR SELECT USING (true);

-- ==============================================================================
-- 💎 DONNÉES INITIALES DU CATALOGUE JULO SÉNÉGAL (SEEDING)
-- ==============================================================================

-- 1. Les 8 Catégories Officielles JULO
INSERT INTO "Category" ("id", "name", "slug") VALUES
    ('11111111-1111-1111-1111-111111111111', 'Smartphones & Apple', 'smartphones-apple'),
    ('22222222-2222-2222-2222-222222222222', 'Samsung Galaxy', 'samsung-galaxy'),
    ('33333333-3333-3333-3333-333333333333', 'Tecno, Infinix & Itel', 'tecno-infinix-itel'),
    ('44444444-4444-4444-4444-444444444444', 'Xiaomi & Redmi', 'xiaomi-redmi'),
    ('55555555-5555-5555-5555-555555555555', 'Ordinateurs & PC', 'ordinateurs-pc'),
    ('66666666-6666-6666-6666-666666666666', 'Audio, Enceintes & Oraimo', 'audio-enceintes-oraimo'),
    ('77777777-7777-7777-7777-777777777777', 'Accessoires & Énergie', 'accessoires-energie'),
    ('88888888-8888-8888-8888-888888888888', 'Montres & Wearables', 'montres-wearables')
ON CONFLICT ("name") DO NOTHING;

-- 2. Produits Phares par Marque et par Budget
INSERT INTO "Product" ("name", "description", "mrp", "price", "categoryId", "stock", "inStock", "images") VALUES
    ('iPhone 16 Pro Max 256GB — Titane Naturel', 'Puce A18 Pro, écran Super Retina XDR 6.9 pouces, bouton Commande de l''appareil photo, autonomie record.', 1150000, 995000, '11111111-1111-1111-1111-111111111111', 6, true, ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&auto=format&fit=crop&q=80']),
    ('Samsung Galaxy S24 Ultra 512GB — Titanium Black', 'Galaxy AI intégrée, Snapdragon 8 Gen 3, capteur 200 MP, zoom 5x et S-Pen inclus.', 980000, 890000, '22222222-2222-2222-2222-222222222222', 5, true, ARRAY['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&auto=format&fit=crop&q=80']),
    ('Samsung Galaxy A55 5G 256GB / 8GB RAM', 'Châssis métallique en aluminium, écran Super AMOLED 120Hz, triple capteur 50 MP OIS.', 295000, 260000, '22222222-2222-2222-2222-222222222222', 14, true, ARRAY['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&auto=format&fit=crop&q=80']),
    ('Tecno Camon 30 Pro 5G 512GB / 12GB RAM', 'Capteur Sony IMX890 50 MP OIS, Dimensity 8200 Ultimate 5G, écran 144Hz et charge 70W.', 280000, 245000, '33333333-3333-3333-3333-333333333333', 10, true, ARRAY['https://images.unsplash.com/photo-1567581935884-3349723552ca?w=900&auto=format&fit=crop&q=80']),
    ('Infinix Note 40 Pro 256GB / 8GB RAM', 'Charge rapide filaire 70W + charge sans fil MagCharge 20W, écran AMOLED 120Hz incurvé, son JBL.', 200000, 175000, '33333333-3333-3333-3333-333333333333', 12, true, ARRAY['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&auto=format&fit=crop&q=80']),
    ('Itel S24 256GB / 8GB RAM — Caméra 108 MP', 'Dos changeant de couleur au soleil, capteur ISOCELL 108 MP, écran 90Hz et batterie 5000 mAh.', 100000, 85000, '33333333-3333-3333-3333-333333333333', 22, true, ARRAY['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&auto=format&fit=crop&q=80']),
    ('Itel A70 128GB / 4GB RAM — Grand Écran 6.6"', 'Mémoire 128 Go, Dynamic Bar, double caméra IA et batterie 5000 mAh.', 65000, 55000, '33333333-3333-3333-3333-333333333333', 30, true, ARRAY['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&auto=format&fit=crop&q=80']),
    ('Itel Super Guru 4G — Téléphone à Touches Ultra-Durable', '4G VoLTE Double SIM, radio FM sans fil, torche puissante et autonomie de 10 jours.', 23000, 18000, '33333333-3333-3333-3333-333333333333', 40, true, ARRAY['https://images.unsplash.com/photo-1567581935884-3349723552ca?w=900&auto=format&fit=crop&q=80']),
    ('Xiaomi Redmi Note 13 Pro+ 5G 512GB / 12GB RAM', 'Capteur 200 MP OIS, écran incurvé AMOLED 1.5K 120Hz, étanchéité IP68 et charge 120W.', 320000, 285000, '44444444-4444-4444-4444-444444444444', 8, true, ARRAY['https://images.unsplash.com/photo-1567581935884-3349723552ca?w=900&auto=format&fit=crop&q=80']),
    ('MacBook Pro 14" M3 Pro 18GB / 512GB — Noir Sidéral', 'Puce Apple M3 Pro, écran Liquid Retina XDR, clavier Magic Keyboard AZERTY français.', 1750000, 1590000, '55555555-5555-5555-5555-555555555555', 4, true, ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80']),
    ('HP EliteBook 840 G10 Intel Core i7 16GB / 512GB SSD', 'Châssis aluminium ultra-fin, écran 14" IPS antireflet, clavier rétroéclairé et lecteur d''empreinte.', 650000, 575000, '55555555-5555-5555-5555-555555555555', 6, true, ARRAY['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&auto=format&fit=crop&q=80']),
    ('Oraimo FreePods 4 Écouteurs Sans Fil ANC & HavyBass', 'Réduction active du bruit, basses percutantes, autonomie 35h et application Oraimo Sound.', 32000, 25000, '66666666-6666-6666-6666-666666666666', 35, true, ARRAY['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=900&auto=format&fit=crop&q=80']),
    ('JBL Flip 6 Enceinte Bluetooth Étanche IP67', 'Son JBL Original Pro puissant, 12h d''autonomie et résistance totale à l''eau et poussière.', 98000, 85000, '66666666-6666-6666-6666-666666666666', 10, true, ARRAY['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&auto=format&fit=crop&q=80']),
    ('Batterie Externe Oraimo Toast 20 000 mAh 22.5W', 'Recharge 4 à 5 fois un smartphone, charge rapide 22.5W Type-C et torche LED intégrée.', 25000, 18000, '77777777-7777-7777-7777-777777777777', 45, true, ARRAY['https://images.unsplash.com/photo-1609592426505-d227b8755678?w=900&auto=format&fit=crop&q=80']),
    ('Kit Ring Light 18 Pouces avec Trépied Professionnel 2m10', 'Indispensable pour vidéos TikTok/Instagram, 3 supports téléphones et télécommande sans fil.', 45000, 35000, '77777777-7777-7777-7777-777777777777', 20, true, ARRAY['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&auto=format&fit=crop&q=80']),
    ('Apple Watch Series 9 GPS 45mm Boîtier Aluminium Minuit', 'Puce S9 SiP, geste Double Tap, capteurs ECG et oxygène sanguin SpO2.', 290000, 255000, '88888888-8888-8888-8888-888888888888', 8, true, ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80']),
    ('Samsung Galaxy Watch 6 Classic 47mm Lunette Tournante', 'Boîtier en acier inoxydable, analyse corporelle BIA, suivi santé avancé.', 230000, 195000, '88888888-8888-8888-8888-888888888888', 10, true, ARRAY['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&auto=format&fit=crop&q=80']),
    ('Oraimo Watch 4 Plus Écran HD 2.01" & Appels Bluetooth', 'Grand écran tactile HD 2.01 pouces, appels sans fil et 7 jours d''autonomie.', 30000, 22000, '88888888-8888-8888-8888-888888888888', 35, true, ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80'])
ON CONFLICT DO NOTHING;

-- 3. Codes Promo JULO Sénégal
INSERT INTO "Coupon" ("code", "discount", "minSpend", "isActive") VALUES
    ('BIENVENUEJULO', 5000, 50000, true),
    ('JULO2026', 10000, 150000, true),
    ('DAKARPROMO', 3000, 30000, true)
ON CONFLICT ("code") DO NOTHING;
