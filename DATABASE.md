-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║               JULO — SCHÉMA COMPLET DE LA BASE DE DONNÉES              ║
-- ║                                                                        ║
-- ║  Version       : 1.0 (Août 2026)                                       ║
-- ║  Co-fondateurs : Babacar Diop Gaye & Makhtar Wade                      ║
-- ║  Stack         : Supabase (PostgreSQL 15+)                             ║
-- ║                                                                        ║
-- ║  ⚠️  CE SCRIPT CRÉE TOUTES LES TABLES POUR JULO (E-commerce + Studio)  ║
-- ╚══════════════════════════════════════════════════════════════════════════╝


-- ════════════════════════════════════════════════════════════════════════════
-- 0. NETTOYAGE COMPLET (tables métier uniquement, pas auth.users)
-- ════════════════════════════════════════════════════════════════════════════

-- Supprimer les policies de storage en premier
DROP POLICY IF EXISTS "storage_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_policy" ON storage.objects;

-- Supprimer les tables dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS "RateLimit" CASCADE;
DROP TABLE IF EXISTS "Post" CASCADE;
DROP TABLE IF EXISTS "StockNotification" CASCADE;
DROP TABLE IF EXISTS "Banner" CASCADE;
DROP TABLE IF EXISTS "Rating" CASCADE;
DROP TABLE IF EXISTS "OrderItem" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "Address" CASCADE;
DROP TABLE IF EXISTS "Coupon" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Supprimer les fonctions existantes
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_rate_limits() CASCADE;
DROP FUNCTION IF EXISTS public.decrement_stock(uuid, integer) CASCADE;
DROP FUNCTION IF EXISTS public.increment_coupon_usage(uuid) CASCADE;

-- Extension nécessaire
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ════════════════════════════════════════════════════════════════════════════
-- 1. TABLE : User
-- ════════════════════════════════════════════════════════════════════════════
-- Profils liés aux utilisateurs Supabase Auth.
-- Le trigger `on_auth_user_created` synchronise automatiquement.

CREATE TABLE "User" (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    phone       TEXT,
    role        TEXT DEFAULT 'USER',   -- 'USER' | 'ADMIN'
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE "User" IS 'Profils utilisateurs synchronisés avec Supabase Auth';
COMMENT ON COLUMN "User".role IS 'Rôle : USER (client) ou ADMIN (gestionnaire)';

-- ── Trigger de synchronisation Auth â†’ User ──
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."User" (id, name, email, phone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    new.raw_user_meta_data->>'phone',
    'USER'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer l'ancien trigger s'il existe, puis recréer
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ════════════════════════════════════════════════════════════════════════════
-- 2. TABLE : Category
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE "Category" (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE "Category" IS 'Catégories de produits (Climatisation, Solaire, Électroménager, etc.)';


-- ════════════════════════════════════════════════════════════════════════════
-- 3. TABLE : Product
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE "Product" (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         TEXT NOT NULL,
    description  TEXT,
    mrp          NUMERIC(12, 2) NOT NULL,                -- Prix barré (prix initial)
    price        NUMERIC(12, 2) NOT NULL,                -- Prix de vente actuel
    images       TEXT[] DEFAULT '{}',                     -- URLs Cloudinary
    "categoryId" UUID REFERENCES "Category"(id) ON DELETE SET NULL,
    "inStock"    BOOLEAN DEFAULT TRUE,
    stock        INTEGER DEFAULT 10,
    guarantee    TEXT DEFAULT '6 mois',                   -- Durée de la garantie
    "createdAt"  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE "Product" IS 'Catalogue de produits Global Air';
COMMENT ON COLUMN "Product".mrp IS 'Manufacturer Recommended Price (prix barré)';
COMMENT ON COLUMN "Product".guarantee IS 'Durée de garantie affichée sur la facture';
COMMENT ON COLUMN "Product".images IS 'URLs des images (Cloudinary ou Supabase Storage)';

-- ── Décrément atomique du stock (empêche la survente en cas de commandes concurrentes) ──
-- p_quantity positif décrémente (achat) ; négatif recrédite (annulation).
-- Ne renvoie AUCUNE ligne si le stock est insuffisant au moment exact de l'exécution :
-- l'appelant doit traiter un résultat vide comme un échec de réservation.
CREATE OR REPLACE FUNCTION public.decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS TABLE(id UUID, stock INTEGER, "inStock" BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  UPDATE "Product"
  SET stock = "Product".stock - p_quantity,
      "inStock" = ("Product".stock - p_quantity) > 0
  WHERE "Product".id = p_product_id
    AND "Product".stock >= p_quantity
  RETURNING "Product".id, "Product".stock, "Product"."inStock";
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ════════════════════════════════════════════════════════════════════════════
-- 4. TABLE : Address
-- ════════════════════════════════════════════════════════════════════════════
-- userId est NULLABLE pour supporter le Guest Checkout.

CREATE TABLE "Address" (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId"    UUID REFERENCES "User"(id) ON DELETE CASCADE,  -- NULL = invité
    name        TEXT NOT NULL,
    email       TEXT NOT NULL DEFAULT '',
    phone       TEXT NOT NULL,
    street      TEXT NOT NULL,                           -- Quartier / Rue
    city        TEXT NOT NULL,                            -- Ville
    state       TEXT NOT NULL,                            -- Région
    zip         TEXT,
    country     TEXT DEFAULT 'Sénégal',
    latitude    NUMERIC(10, 8),
    longitude   NUMERIC(11, 8),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE "Address" IS 'Adresses de livraison (utilisateurs connectés et invités)';
COMMENT ON COLUMN "Address"."userId" IS 'NULL pour les commandes invité (Guest Checkout)';


-- ════════════════════════════════════════════════════════════════════════════
-- 5. TABLE : Coupon
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE "Coupon" (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code               TEXT UNIQUE NOT NULL,              -- Code promo (ex: BIENVENUE10)
    type               TEXT NOT NULL DEFAULT 'FIXED',     -- 'PERCENTAGE' | 'FIXED'
    value              NUMERIC(12, 2) NOT NULL,           -- Montant ou pourcentage
    "minOrderAmount"   NUMERIC(12, 2) DEFAULT 0,          -- Montant minimum de commande
    "maxDiscountAmount" NUMERIC(12, 2),                   -- Plafond de réduction (PERCENTAGE)
    "expirationDate"   TIMESTAMP WITH TIME ZONE,          -- NULL = pas d'expiration
    "usageLimit"       INTEGER DEFAULT 100,
    "usedCount"        INTEGER DEFAULT 0,
    "isActive"         BOOLEAN DEFAULT TRUE,
    "createdAt"        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE "Coupon" IS 'Codes promo gérés depuis le panneau Admin';

-- ── Incrément atomique de l'usage d'un coupon (empêche de dépasser usageLimit en cas de commandes concurrentes) ──
-- Ne renvoie AUCUNE ligne si la limite est déjà atteinte au moment exact de l'exécution.
CREATE OR REPLACE FUNCTION public.increment_coupon_usage(p_coupon_id UUID)
RETURNS TABLE(id UUID, "usedCount" INTEGER) AS $$
BEGIN
  RETURN QUERY
  UPDATE "Coupon"
  SET "usedCount" = "Coupon"."usedCount" + 1
  WHERE "Coupon".id = p_coupon_id
    AND "Coupon"."usedCount" < "Coupon"."usageLimit"
  RETURNING "Coupon".id, "Coupon"."usedCount";
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ════════════════════════════════════════════════════════════════════════════
-- 6. TABLE : Order
-- ════════════════════════════════════════════════════════════════════════════
-- userId est NULLABLE pour le Guest Checkout.
-- deliveryFee et deliveryMethod ajoutés pour le suivi complet.

CREATE TABLE "Order" (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId"         UUID REFERENCES "User"(id) ON DELETE SET NULL,  -- NULL = invité
    "addressId"      UUID REFERENCES "Address"(id) ON DELETE SET NULL,
    "couponId"       UUID REFERENCES "Coupon"(id) ON DELETE SET NULL,
    "discountAmount" NUMERIC(12, 2) DEFAULT 0,
    "deliveryFee"    NUMERIC(12, 2) DEFAULT 0,           -- Frais de livraison
    "deliveryMethod" TEXT DEFAULT 'DELIVERY',             -- 'DELIVERY' | 'PICKUP'
    total            NUMERIC(12, 2) NOT NULL,
    status           TEXT DEFAULT 'ORDER_PLACED',
        -- Statuts possibles :
        -- ORDER_PLACED  â†’ Nouvelle commande
        -- CONFIRMED     â†’ Validée par l'admin (COD)
        -- PAID          â†’ Payée (Wave/OM/Transfer)
        -- PROCESSING    â†’ En préparation
        -- SHIPPED       â†’ En livraison
        -- DELIVERED     â†’ Livrée
        -- CANCELLED     â†’ Annulée
    "paymentMethod"  TEXT DEFAULT 'COD',
        -- Méthodes :
        -- COD       â†’ Cash à la livraison
        -- TRANSFER  â†’ Transfert Wave/OM (preuve requise)
        -- WHATSAPP  â†’ Commande via WhatsApp
        -- WAVE      â†’ Paiement Wave direct (futur)
        -- OM        â†’ Paiement Orange Money direct (futur)
    "transferProof"  TEXT,                                -- URL Cloudinary de la capture
    "createdAt"      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE "Order" IS 'Commandes clients (connectés et invités)';
COMMENT ON COLUMN "Order"."userId" IS 'NULL pour les commandes invité (Guest Checkout)';
COMMENT ON COLUMN "Order"."transferProof" IS 'Capture d''écran du transfert Wave/OM (URL Cloudinary)';
COMMENT ON COLUMN "Order"."deliveryFee" IS 'Dakar: 2000 FCFA, Hors Dakar: à déterminer, Retrait: 0';
COMMENT ON COLUMN "Order"."deliveryMethod" IS 'DELIVERY = livraison, PICKUP = retrait en magasin';


-- ════════════════════════════════════════════════════════════════════════════
-- 7. TABLE : OrderItem
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE "OrderItem" (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderId"   UUID REFERENCES "Order"(id) ON DELETE CASCADE,
    "productId" UUID REFERENCES "Product"(id) ON DELETE CASCADE,
    quantity    INTEGER NOT NULL DEFAULT 1,
    price       NUMERIC(12, 2) NOT NULL,                 -- Prix unitaire au moment de la commande
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE "OrderItem" IS 'Articles individuels d''une commande';
COMMENT ON COLUMN "OrderItem".price IS 'Prix unitaire figé au moment de la commande';


-- ════════════════════════════════════════════════════════════════════════════
-- 8. TABLE : Rating
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE "Rating" (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId"    UUID REFERENCES "User"(id) ON DELETE CASCADE,
    "productId" UUID REFERENCES "Product"(id) ON DELETE CASCADE,
    rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review      TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("userId", "productId")                        -- Un avis par produit par utilisateur
);

COMMENT ON TABLE "Rating" IS 'Avis et notes des clients sur les produits';


-- ════════════════════════════════════════════════════════════════════════════
-- 9. TABLE : Banner
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE "Banner" (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT,
    subtitle    TEXT,
    description TEXT,
    image       TEXT NOT NULL,                            -- URL Cloudinary
    link        TEXT,                                     -- Lien de redirection au clic
    "isActive"  BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE "Banner" IS 'Bannières promotionnelles affichées sur la page d''accueil';


-- ════════════════════════════════════════════════════════════════════════════
-- 10. TABLE : StockNotification
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE "StockNotification" (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "productId" UUID REFERENCES "Product"(id) ON DELETE CASCADE,
    email       TEXT NOT NULL,
    "isSent"    BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("productId", email)
);

COMMENT ON TABLE "StockNotification" IS 'Alertes email pour les produits en rupture de stock';


-- ════════════════════════════════════════════════════════════════════════════
-- 11. TABLE : Post (Blog)
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE "Post" (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         TEXT NOT NULL,
    slug          TEXT UNIQUE NOT NULL,
    content       TEXT NOT NULL,
    image         TEXT,                                   -- URL image de couverture
    excerpt       TEXT,                                   -- Résumé pour les listes
    "isPublished" BOOLEAN DEFAULT TRUE,
    "createdAt"   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE "Post" IS 'Articles de blog pour le SEO et l''engagement client';


-- ════════════════════════════════════════════════════════════════════════════
-- 12. TABLE : RateLimit (Anti-spam)
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE "RateLimit" (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip          TEXT NOT NULL,
    action      TEXT NOT NULL,                            -- 'place_order' | 'track_order'
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE "RateLimit" IS 'Protection anti-spam : limite les requêtes par IP';

-- ── Auto-nettoyage des anciennes entrées (> 2 heures) ──
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public."RateLimit"
  WHERE "createdAt" < NOW() - INTERVAL '2 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ⚠️ Pour activer le nettoyage automatique, créez un Cron Job dans Supabase :
--   Dashboard â†’ Database â†’ Extensions â†’ pg_cron (activer)
--   Puis exécutez :
--     SELECT cron.schedule('cleanup-rate-limits', '0 */2 * * *', 'SELECT public.cleanup_rate_limits()');


-- ════════════════════════════════════════════════════════════════════════════
-- 13. ROW LEVEL SECURITY (RLS)
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Address" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Rating" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Banner" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StockNotification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Coupon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RateLimit" ENABLE ROW LEVEL SECURITY;

-- ── Fonction utilitaire : vérifier si l'utilisateur est admin ──
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ════════════════════════════════════════════════════════════════════════════
-- 14. POLICIES RLS
-- ════════════════════════════════════════════════════════════════════════════

-- ─── User ───────────────────────────────────────────────────────────────────
CREATE POLICY "user_select_own" ON "User"
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "user_admin_all" ON "User"
  FOR ALL TO authenticated USING (public.is_admin());

-- ─── Category (lecture publique) ────────────────────────────────────────────
CREATE POLICY "category_select_public" ON "Category"
  FOR SELECT USING (true);
CREATE POLICY "category_admin_all" ON "Category"
  FOR ALL TO authenticated USING (public.is_admin());

-- ─── Product (lecture publique) ─────────────────────────────────────────────
CREATE POLICY "product_select_public" ON "Product"
  FOR SELECT USING (true);
CREATE POLICY "product_admin_all" ON "Product"
  FOR ALL TO authenticated USING (public.is_admin());

-- ─── Order ──────────────────────────────────────────────────────────────────
-- Les utilisateurs connectés voient leurs propres commandes
CREATE POLICY "order_select_own" ON "Order"
  FOR SELECT USING (auth.uid() = "userId");
-- Les utilisateurs connectés créent des commandes à leur nom
CREATE POLICY "order_insert_own" ON "Order"
  FOR INSERT WITH CHECK (auth.uid() = "userId");
-- L'admin a accès total (incluant les commandes invité)
CREATE POLICY "order_admin_all" ON "Order"
  FOR ALL TO authenticated USING (public.is_admin());

-- ─── OrderItem ──────────────────────────────────────────────────────────────
CREATE POLICY "order_item_select_own" ON "OrderItem"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "Order" WHERE id = "orderId" AND "userId" = auth.uid())
  );
CREATE POLICY "order_item_insert_own" ON "OrderItem"
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM "Order" WHERE id = "orderId" AND "userId" = auth.uid())
  );
CREATE POLICY "order_item_admin_all" ON "OrderItem"
  FOR ALL TO authenticated USING (public.is_admin());

-- ─── Address ────────────────────────────────────────────────────────────────
CREATE POLICY "address_select_own" ON "Address"
  FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "address_insert_own" ON "Address"
  FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "address_update_own" ON "Address"
  FOR UPDATE USING (auth.uid() = "userId");
CREATE POLICY "address_admin_all" ON "Address"
  FOR ALL TO authenticated USING (public.is_admin());

-- ─── Rating (lecture publique, écriture authentifiée) ────────────────────────
CREATE POLICY "rating_select_public" ON "Rating"
  FOR SELECT USING (true);
CREATE POLICY "rating_insert_own" ON "Rating"
  FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "rating_admin_all" ON "Rating"
  FOR ALL TO authenticated USING (public.is_admin());

-- ─── Banner (lecture publique) ──────────────────────────────────────────────
CREATE POLICY "banner_select_public" ON "Banner"
  FOR SELECT USING (true);
CREATE POLICY "banner_admin_all" ON "Banner"
  FOR ALL TO authenticated USING (public.is_admin());

-- ─── StockNotification ─────────────────────────────────────────────────────
CREATE POLICY "stock_notif_insert_public" ON "StockNotification"
  FOR INSERT WITH CHECK (true);
CREATE POLICY "stock_notif_admin_all" ON "StockNotification"
  FOR ALL TO authenticated USING (public.is_admin());

-- ─── Post (lecture publique) ────────────────────────────────────────────────
CREATE POLICY "post_select_public" ON "Post"
  FOR SELECT USING (true);
CREATE POLICY "post_admin_all" ON "Post"
  FOR ALL TO authenticated USING (public.is_admin());

-- ─── Coupon (lecture publique pour validation côté client) ───────────────────
CREATE POLICY "coupon_select_public" ON "Coupon"
  FOR SELECT USING (true);
CREATE POLICY "coupon_admin_all" ON "Coupon"
  FOR ALL TO authenticated USING (public.is_admin());

-- ─── RateLimit ──────────────────────────────────────────────────────────────
-- Note : Les opérations RateLimit passent par createAdminClient (service_role)
-- Cette policy est pour la gestion admin via le dashboard
CREATE POLICY "ratelimit_admin_all" ON "RateLimit"
  FOR ALL TO authenticated USING (public.is_admin());


-- ════════════════════════════════════════════════════════════════════════════
-- 15. INDEX DE PERFORMANCE
-- ════════════════════════════════════════════════════════════════════════════

-- Recherche rapide par catégorie
CREATE INDEX idx_product_category ON "Product"("categoryId");

-- Recherche des commandes par utilisateur
CREATE INDEX idx_order_user ON "Order"("userId");

-- Recherche des commandes par statut (pour le dashboard admin)
CREATE INDEX idx_order_status ON "Order"(status);

-- Recherche des commandes par date (pour les rapports)
CREATE INDEX idx_order_created ON "Order"("createdAt" DESC);

-- Recherche utilisateur par email (login, admin lookup)
CREATE INDEX idx_user_email ON "User"(email);

-- Recherche coupon par code (validation rapide)
CREATE INDEX idx_coupon_code ON "Coupon"(code);

-- Anti-spam : recherche rapide par IP + action
CREATE INDEX idx_ratelimit_ip_action ON "RateLimit"(ip, action);

-- Auto-cleanup du rate limiter : index sur la date
CREATE INDEX idx_ratelimit_created ON "RateLimit"("createdAt");

-- Notifications de stock : recherche par produit
CREATE INDEX idx_stock_notif_product ON "StockNotification"("productId");

-- OrderItem par commande
CREATE INDEX idx_orderitem_order ON "OrderItem"("orderId");

-- Rating par produit
CREATE INDEX idx_rating_product ON "Rating"("productId");


-- ════════════════════════════════════════════════════════════════════════════
-- 16. STORAGE (Supabase Storage)
-- ════════════════════════════════════════════════════════════════════════════

-- Créer le bucket si nécessaire (via Dashboard ou API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Lecture publique des images
CREATE POLICY "storage_select_public" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'product-images');

-- Gestion admin des images
CREATE POLICY "storage_admin_all" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');


-- ════════════════════════════════════════════════════════════════════════════
-- 17. REALTIME (Notifications temps réel pour l'admin)
-- ════════════════════════════════════════════════════════════════════════════

-- Activer le realtime sur la table Order pour que l'admin
-- reçoive les nouvelles commandes en temps réel.
-- À exécuter dans Supabase Dashboard â†’ Database â†’ Publications :
--
--   ALTER PUBLICATION supabase_realtime ADD TABLE "Order";
--


-- ════════════════════════════════════════════════════════════════════════════
-- 18. NOTES IMPORTANTES
-- ════════════════════════════════════════════════════════════════════════════
--
-- âš¡ GUEST CHECKOUT :
--    Les commandes invité (sans compte) passent par `createAdminClient`
--    dans le code (service_role key) et contournent les RLS.
--    â†’ userId = NULL dans Order et Address pour ces commandes.
--
-- ðŸ”„ APRÈS EXÉCUTION DE CE SCRIPT :
--    1. Vérifiez que auth.users n'a PAS été supprimé
--    2. Le trigger on_auth_user_created re-synchronisera les nouveaux comptes
--    3. Si vos utilisateurs existants n'apparaissent plus dans "User",
--       exécutez ce script pour les re-synchroniser :
--
--       INSERT INTO public."User" (id, name, email, role)
--       SELECT
--         id,
--         COALESCE(raw_user_meta_data->>'full_name', ''),
--         email,
--         CASE WHEN email = 'admin@globalairsn.com' THEN 'ADMIN' ELSE 'USER' END
--       FROM auth.users
--       ON CONFLICT (id) DO NOTHING;
--
-- 📦 CLOUDINARY :
--    Les images produits sont stockées sur Cloudinary (dossier globalair-products).
--    Les preuves de transfert sur Cloudinary (dossier globalair-transfer-proofs).
--    Configuration via variables d'environnement :
--      - CLOUDINARY_CLOUD_NAME
--      - CLOUDINARY_API_KEY
--      - CLOUDINARY_API_SECRET
--
-- ðŸ” SUPABASE REALTIME :
--    Pour que l'admin reçoive les nouvelles commandes en temps réel,
--    activez la publication Realtime pour la table "Order" :
--      ALTER PUBLICATION supabase_realtime ADD TABLE "Order";
--
-- ════════════════════════════════════════════════════════════════════════════
-- 10. SEED INITIAL DES CATÉGORIES JULO
-- ════════════════════════════════════════════════════════════════════════════
INSERT INTO "Category" (name) VALUES 
('Accessoires Téléphone'),
('Smartphones & Téléphones'),
('Ordinateurs & PC'),
('Sérigraphie & Textiles'),
('Infographie & Branding')
ON CONFLICT (name) DO NOTHING;
