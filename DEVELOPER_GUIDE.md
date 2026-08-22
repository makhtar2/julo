# 📖 JULO — Guide d'Architecture & Développement

Bienvenue sur le projet **JULO** (`julo.sn`). Ce document présente l'architecture complète, les choix techniques, les intégrations dédiées et les consignes pour faire évoluer la plateforme.

---

## 🏛️ 1. Identité du Projet

* **Marque :** JULO (`JULO.`)
* **Co-fondateurs :** Babacar Diop Gaye & Makhtar Wade
* **Activités :** E-commerce High-Tech (Smartphones, PC portables, Audio, Chargeurs GaN) & Studio de Sérigraphie / Infographie personnalisée au Sénégal.
* **Contact officiel :** `contact@julo.sn` | WhatsApp: `+221 75 446 90 97` | Dakar & Touba.

---

## ⚙️ 2. Stack Technique

* **Framework :** Next.js 16 (App Router avec Server Actions).
* **Base de Données & Auth :** Supabase dédié (Schéma complet dans `supabase/julo_schema.sql`).
* **Stockage Images :** Cloudinary dédié (Dossier `julo-products`).
* **State Management :** Zustand (`lib/store.js` pour Panier, Favoris, Adresses).
* **Design & Styling :** Tailwind CSS 4.0 (Warm Luxury Sand & Gold `#FAF8F5`, `#C59A63`, `#1C1B1F`).
* **Animations :** Framer Motion.
* **PWA :** Progressive Web App installable sur smartphone via `@ducanh2912/next-pwa`.
* **Emails Transactionnels :** Resend (`lib/email.js` avec templates branded Julo).

---

## 📁 3. Structure des Dossiers

* `app/(public)/` : Routes publiques (Accueil, Boutique, Fiches Produits, Panier, À Propos, Contact, Favoris, Suivi de Commande).
* `app/admin/` : Dashboard d'administration (Gestion Produits, Commandes, Catégories, Bannières, Coupons, Analytics).
* `app/actions/` : Server Actions Next.js (Opérations CRUD sécurisées avec Supabase).
* `components/` : Composants UI réutilisables.
* `lib/` : Utilitaires, clients Supabase, configuration email et gestion du panier.
* `supabase/` : Fichier `julo_schema.sql` pour l'initialisation de la base de données.

---

## 🚀 4. Initialisation d'un Nouvel Environnement

1. **Cloner et installer :**
   ```bash
   npm install
   ```

2. **Créer la base Supabase JULO :**
   * Créez un nouveau projet sur [Supabase](https://supabase.com).
   * Exécutez le script `supabase/julo_schema.sql` dans le SQL Editor.

3. **Configurer les variables d'environnement :**
   * Copiez `.env.example` vers `.env.local` et renseignez les clés Supabase, Cloudinary et Resend.

4. **Tester la base de données :**
   ```bash
   npm run setup:julo
   ```

5. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```
