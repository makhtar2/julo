# 🗄️ Script de Peuplement Supabase (Seed Data - LOCAL)

Copiez et collez ce code dans le **SQL Editor** de votre tableau de bord Supabase. 
**Note :** Ce script utilise les images que nous venons de copier dans votre dossier `/public`.

```sql
-- 1. NETTOYAGE COMPLET
TRUNCATE TABLE "OrderItem" CASCADE;
TRUNCATE TABLE "Rating" CASCADE;
TRUNCATE TABLE "StockNotification" CASCADE;
TRUNCATE TABLE "Product" CASCADE;
TRUNCATE TABLE "Category" CASCADE;

-- 2. CRÉATION DES CATÉGORIES
INSERT INTO "Category" (id, name) VALUES 
(gen_random_uuid(), 'Climatisation'),
(gen_random_uuid(), 'Ventilateurs'),
(gen_random_uuid(), 'Téléviseurs'),
(gen_random_uuid(), 'Bouilloires'),
(gen_random_uuid(), 'Valises');

-- 3. INSERTION DES PRODUITS (Chemins locaux /public)
DO $$
DECLARE
    cat_clim UUID;
    cat_vent UUID;
    cat_tv UUID;
    cat_bouil UUID;
    cat_val UUID;
BEGIN
    SELECT id INTO cat_clim FROM "Category" WHERE name = 'Climatisation';
    SELECT id INTO cat_vent FROM "Category" WHERE name = 'Ventilateurs';
    SELECT id INTO cat_tv FROM "Category" WHERE name = 'Téléviseurs';
    SELECT id INTO cat_bouil FROM "Category" WHERE name = 'Bouilloires';
    SELECT id INTO cat_val FROM "Category" WHERE name = 'Valises';

    -- --- VENTILATEURS ---
    INSERT INTO "Product" (name, description, mrp, price, images, "categoryId", "inStock", "stock") VALUES 
    ('Ventilateur GE 1030', 'Ventilateur performant modèle GE 1030.', 35000, 31000, ARRAY['/hero_product_img2.png'], cat_vent, true, 20),
    ('Ventilateur GE 760', 'Ventilateur modèle GE 760.', 28000, 24000, ARRAY['/2.png'], cat_vent, true, 15),
    ('Carton de 4 Ventilateurs', 'Lot de 4 ventilateurs.', 30000, 25000, ARRAY['/3.png'], cat_vent, true, 10);

    -- --- CLIMATISATION ---
    INSERT INTO "Product" (name, description, mrp, price, images, "categoryId", "inStock", "stock") VALUES 
    ('Climatiseur 1.5 CV Solo', 'Fraîcheur garantie.', 180000, 160000, ARRAY['/hero_product_img1.png'], cat_clim, true, 5);

    -- --- TÉLÉVISEURS ---
    INSERT INTO "Product" (name, description, mrp, price, images, "categoryId", "inStock", "stock") VALUES 
    ('Smart TV 32 Pouces', 'Smart TV compacte.', 60000, 50000, ARRAY['/11.png'], cat_tv, true, 12),
    ('Smart TV 55 Pouces 4K', 'Immersion totale.', 180000, 165000, ARRAY['/15.png'], cat_tv, true, 7),
    ('Smart TV 75 Pouces Premium', 'L''excellence visuelle.', 450000, 400000, ARRAY['/tv75.png'], cat_tv, true, 3);

    -- --- BOUILLOIRES ---
    INSERT INTO "Product" (name, description, mrp, price, images, "categoryId", "inStock", "stock") VALUES 
    ('Bouilloire Classique 1.8L', 'Rapide et sécurisée.', 10000, 8000, ARRAY['/21.png'], cat_bouil, true, 30);

    -- --- VALISES ---
    INSERT INTO "Product" (name, description, mrp, price, images, "categoryId", "inStock", "stock") VALUES 
    ('Série 16 Valises Famille', 'Ensemble complet.', 160000, 140000, ARRAY['/25.png'], cat_val, true, 2),
    ('Set 3 Valises Premium', 'Finition luxe.', 75000, 60000, ARRAY['/31.png'], cat_val, true, 10);

END $$;
