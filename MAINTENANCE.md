# Guide de Maintenance & Sécurité - Global Air

Ce document regroupe les recommandations pour garantir la pérennité et la robustesse de la plateforme.

## 1. Sauvegardes (Backups)
Le projet utilise **Supabase**, qui gère nativement la sécurité des données.
- **Backups Automatiques** : Supabase effectue des sauvegardes quotidiennes de votre base de données.
- **PITR (Point-in-Time Recovery)** : Pour une sécurité maximale (restaurer la base à la seconde près), il est recommandé d'activer l'option PITR dans le tableau de bord Supabase (Section *Database > Backups*).
- **Export Manuel** : Vous pouvez exporter vos données au format SQL ou CSV via l'interface Supabase à tout moment.

## 2. Tests de Montée en Charge (Load Testing)
Pour vérifier que le site reste rapide avec des milliers d'utilisateurs simultanés, nous recommandons l'utilisation de **K6** ou **Artillery**.
- **Outil conseillé** : [K6](https://k6.io/) (Open source et puissant).
- **Simulation** : Créer un script simulant le parcours utilisateur (Accueil -> Boutique -> Panier).
- **Next.js & Edge** : Grâce à l'utilisation des Server Components et du Cache de Next.js, le site est déjà optimisé pour supporter une forte charge.

## 3. Sécurité des Données
- **RLS (Row Level Security)** : Toutes les tables de la base de données ont des politiques RLS activées (voir `DATABASE.md`). Seuls les utilisateurs autorisés peuvent accéder à leurs propres données (adresses, commandes).
- **Secret Management** : Toutes les clés API (Supabase, Cloudinary) sont stockées dans les variables d'environnement (`.env`) et ne sont jamais exposées côté client (sauf les clés `NEXT_PUBLIC_*` prévues à cet effet).

## 4. Surveillance (Monitoring)
- **Vercel Analytics** : Déjà intégré pour suivre les performances réelles des utilisateurs (WebVitals).
- **Supabase Logs** : Consultez l'onglet *Logs* dans Supabase pour surveiller les erreurs de base de données ou d'authentification.
