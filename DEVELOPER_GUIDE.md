# 📖 Global Air - Guide pour les Futurs Développeurs

Bienvenue sur le projet **Global Air**. Ce document sert de "carte au trésor" pour comprendre l'architecture, ce qui a été développé, et comment reprendre le flambeau.

---

## ðŸ—ï¸ Architecture Actuelle
- **Framework Front & Back** : Next.js 15 (App Router). Les actions serveur (`Server Actions`) remplacent les anciennes API traditionnelles, permettant une interaction directe et sécurisée avec la base de données.
- **Base de Données & Auth** : Supabase. Contrairement à de nombreux projets Next.js, **Prisma n'est pas utilisé**. Toutes les requêtes sont faites via le SDK direct de Supabase (`@supabase/supabase-js`).
- **State Management** : Zustand (`lib/store.js`). Utilisé pour le Panier, la Wishlist et les Adresses.
- **Styling** : Tailwind CSS 4.0.
- **PWA** : Application web progressive activée (via `@ducanh2912/next-pwa`), permettant l'installation sur mobile.

---

## ✅ Fonctionnalités Implémentées à ce jour

### 1. La Boutique (Front-end)
- **Recherche & Filtrage Temps Réel** : Moteur de recherche immédiat (debounced) avec filtres de prix et de disponibilité en stock, sans rechargement de page. Les filtres modifient l'URL pour être partageables.
- **Cross-Selling** : Composant `<RelatedProducts />` automatique en bas de chaque page produit.
- **Gestion Logistique Avancée** : Calcul dynamique des frais de livraison (Dakar = 2000F, autres = 3000F, Retrait = Gratuit).
- **Suivi de Commande** : Page `/track` publique, sécurisée par numéro de téléphone, affichant une Timeline du statut de la commande.

### 2. Back-Office (Espace Admin)
- Accessible uniquement via `/admin` (pour l'utilisateur `admin@globalairsn.com`).
- Dashboard complet : Statistiques en temps réel, top clients, alertes de stock faible.
- Modification instantanée du statut des commandes (`ORDER_PLACED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED` ➔ `CANCELLED`).

### 3. Communications et E-mails
- **Resend** intégré (`lib/email.js`) :
  - Email de confirmation avec BCC caché pour le gérant de la boutique.
  - Notifications lors des changements de statuts.
  - Incitation à laisser un avis (Review) dans l'email "Livré".
- Intégration **WhatsApp Automatisée** : Boutons "Ouvrir WhatsApp" pré-remplissant un reçu détaillé de la commande pour le client.

### 4. Sécurité & SEO
- **Sécurité Critique** : Les calculs de paniers empêchent l'injection de quantités négatives. `middleware.js` intègre un pare-feu basique (Rate Limiting en mémoire).
- **SEO Avancé** : `sitemap.js` génère les URLs de toutes les catégories. Des balises Meta dynamiques et canoniques sont gérées nativement. Un `robots.txt` protège l'espace Admin.

---

## 🚀 Prochaines Étapes pour le Développeur Suivant

Si vous reprenez ce projet, voici vos missions principales :

### 1. Configuration Cloudflare (Sécurité réseau)
- Le propriétaire devra lier son nom de domaine (`.sn` ou `.com`).
- **Votre tâche** : Déployer le site sur Vercel, et pointer le domaine via Cloudflare pour bénéficier de l'Anti-DDoS réseau gratuit (Proxy activé).

### 2. Paiement Wave et Orange Money (Priorité Absolue)
- Actuellement, seuls les paiements *Cash on Delivery (COD)* et *WhatsApp* fonctionnent.
- **Votre tâche** : Créer un compte **PayDunya** ou **FedaPay**, récupérer les clés API, et implémenter la passerelle dans `OrderSummary.jsx`. N'oubliez pas de gérer les *Webhooks* de validation de paiement en créant une Route API Next.js (`/api/webhooks/paydunya`).

### 3. Amélioration du Rate Limiting
- Le `middleware.js` actuel utilise un `Map` en mémoire, ce qui est réinitialisé par les Edge Functions de Vercel.
- **Votre tâche** : Si le trafic devient énorme, installez `@upstash/ratelimit` et liez-le à une base Redis pour un Rate Limiting distribué solide.

### 4. Row Level Security (RLS) sur Supabase
- **Vital** : Connectez-vous au dashboard Supabase et vérifiez que les tables (notamment `Order` et `Address`) ont bien des règles RLS strictes. Exemple : `auth.uid() = user_id`. C'est l'ultime rempart contre la fuite des données de commandes clients.

---

*Bon courage pour la suite du développement ! Global Air a le potentiel de devenir le leader e-commerce de l'équipement maison au Sénégal.*
