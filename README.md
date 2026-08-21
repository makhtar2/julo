# ðŸ  Global Air - E-commerce Premium

Bienvenue sur le dépôt de **Global Air**, une plateforme e-commerce moderne dédiée à la vente d'équipements de climatisation, ventilation et électroménager au Sénégal.

## 🚀 Fonctionnalités Actuelles

### ðŸ›¡ï¸ Administration (Espace Privé)
L'administration est sécurisée par une **URL Secrète** (`/admin`) et n'est pas visible publiquement.
- **Dashboard Premium :** Vue globale avec indicateurs de croissance, revenus totaux, commandes et clients.
- **Gestion des Commandes :**
    - Suivi en temps réel des statuts (Passée, En préparation, Expédiée, Livrée).
    - **Validation WhatsApp :** Bouton intégré pour contacter directement le client via un message pré-rempli pour valider sa commande.
    - Vue détaillée (Client, Adresse de livraison, Articles).
- **Gestion du Catalogue :** Ajout, modification et suppression de produits avec gestion des stocks.
- **Analyses & Statistiques :** Graphiques de revenus et classement des produits les plus vendus.

### ðŸ‘¤ Boutique & Expérience Client
- **Navigation Fluide :** Interface responsive optimisée pour mobile et desktop.
- **Catalogue Dynamique :** Filtrage par catégories locales (Climatisation, Téléviseurs, etc.).
- **Panier d'Achat :** Gestion complète des quantités et calcul du total.
- **Système d'Authentification :** 
    - Inscription et Connexion client.
    - **Redirection Intelligente :** L'admin (`admin@globalairsn.com`) est automatiquement envoyé vers le portail secret après connexion.
- **Localisation :** Prix formatés en **FCFA** (ex: 1 500 000 FCFA) selon les normes sénégalaises.

## ðŸ› ï¸ Stack Technique
- **Framework :** Next.js 15+ (App Router)
- **Styling :** Tailwind CSS 4.0+
- **State Management :** Zustand
- **Icônes :** Lucide React
- **Base de données :** Supabase (Accès direct via Client/Server SDK)
- **Auth :** Supabase Auth avec middleware personnalisé

---

## ðŸ¤– Guide pour les Développeurs IA (Instructions de Continuité)

### 1. Vision du Projet
Ce projet a été transformé d'une marketplace multi-vendeurs vers une **boutique unique et dédiée (Global Air)**. Toute nouvelle fonctionnalité doit respecter cette architecture simplifiée.

### 2. Sécurité de l'Admin
- Ne **JAMAIS** ajouter de lien "Admin" visible dans la `Navbar` ou le `Footer` public.
- L'accès se fait uniquement par l'URL `/admin`.
- Pour toute modification du système d'auth, conserver la redirection automatique de l'email admin vers cet espace.

### 3. Standards Visuels & UX
- Utiliser des coins très arrondis (`rounded-[2.5rem]` ou `3xl`) pour les containers principaux de l'admin.
- Favoriser la police grasse (`font-black`) pour les titres et les chiffres clés pour un aspect "Premium/Pro".
- Toujours maintenir la **double vue** sur les tableaux de données : Tableau sur Desktop, Cartes (`Cards`) sur Mobile.

### 4. Localisation & Devise
- La devise est le **FCFA**. 
- Formatage obligatoire : `{montant.toLocaleString('fr-SN')} FCFA`.
- Ne pas utiliser le préfixe "FCFA 100", mais le suffixe "100 FCFA".

### 5. Intégration WhatsApp
- Le canal de communication privilégié est WhatsApp. 
- Toute validation de commande ou support doit passer par l'API `wa.me` avec des messages pré-remplis en français.

---

## 📦 Installation

1. `npm install`
2. `cp .env.example .env` (Configurez votre DATABASE_URL)
3. Configurer la base de données via le tableau de bord Supabase en utilisant les scripts fournis dans `DATABASE.md`.
4. `npm run dev`

---
*Développé avec précision pour Global Air.*
