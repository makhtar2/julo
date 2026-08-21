# 🏠 Julo (Julo Prod) — AI Project Guide (GEMINI.md)

Ce fichier est la référence absolue pour l'IA et les développeurs travaillant sur la plateforme e-commerce et studio de personnalisation de **Julo**.

## 🚀 Présentation de l'Entreprise

- **Nom de l'entreprise :** Julo (Julo Prod)
- **Co-fondateurs :** Babacar Diop Gaye & Makhtar Wade (AlmuxtaarDev)
- **Cœur de métier :**
  1. **Produits Électroniques & Digitaux :** Accessoires pour téléphones (étuis, chargeurs rapides, écouteurs, protecteurs d'écran), Téléphones / Smartphones derniers modèles, Ordinateurs portables et de bureau.
  2. **Services de Sérigraphie & Infographie :** Personnalisation textile (t-shirts, polos, casquettes), sacs, bannières, logos d'entreprises, goodies & packaging sur-mesure.
- **Engagement :** Qualité, innovation technologique et créativité visuelle, livraison rapide et sécurisée partout au Sénégal, SAV réactif.

## 🛠 Tech Stack
- **Framework :** Next.js 16+ (App Router)
- **Styling :** Tailwind CSS 4.0+
- **Base de Données & Auth :** Supabase (PostgreSQL)
- **Paiement :** Wave, Orange Money, Paiement à la livraison (COD)
- **Animations :** Framer Motion
- **Génération Reçus / Factures :** PDF intégré via `@react-pdf/renderer` & `jspdf`

## 🔑 Architecture du Projet
- `app/(public)/` : Boutique publique (`/shop`), Panier (`/cart`), Suivi de commande (`/track`), À propos (`/about`), Contact (`/contact`).
- `app/admin/` : Dashboard d'administration (Gestion des commandes, produits, bannières, coupons).
- `app/actions/` : Server actions pour Supabase (auth, produits, commandes, stock).
- `components/` : Composants UI réutilisables (Navbar, Footer, Hero, ProductCard, WhatsAppButton).
- `lib/` : Utilitaires, gestion des zones de livraison (`deliveryZones.js`), géolocalisation boutique (`storeLocation.js`).
