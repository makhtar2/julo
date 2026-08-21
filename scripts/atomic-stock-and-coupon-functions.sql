-- ════════════════════════════════════════════════════════════════════════════
-- Fonctions atomiques : décrément de stock & incrément d'usage de coupon
--
-- Pourquoi : app/actions/order.ts faisait un SELECT stock puis un UPDATE
-- séparés. Deux commandes simultanées sur le dernier exemplaire d'un
-- produit pouvaient donc TOUTES LES DEUX réussir (survente), et un coupon
-- pouvait dépasser sa usageLimit sous forte concurrence.
--
-- Ce script est SANS DANGER à exécuter sur une base existante : il ne
-- touche à aucune table, aucune donnée. CREATE OR REPLACE = idempotent,
-- peut être relancé sans risque.
--
-- Instructions : Supabase Dashboard → SQL Editor → coller → Exécuter.
-- ════════════════════════════════════════════════════════════════════════════

-- ── Décrément atomique du stock ──
-- p_quantity positif décrémente (achat) ; négatif recrédite (annulation).
-- Ne renvoie AUCUNE ligne si le stock est insuffisant au moment exact de
-- l'exécution : l'appelant doit traiter un résultat vide comme un échec
-- de réservation (commande concurrente qui a pris le dernier stock).
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

-- ── Incrément atomique de l'usage d'un coupon ──
-- Ne renvoie AUCUNE ligne si usageLimit est déjà atteinte.
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
