# 🚀 Guide de Mise en Production : Global Air

Ce guide vous accompagne pas à pas pour connecter votre base de données **Supabase** et activer l'authentification réelle.

## Étape 1 : Configuration de Supabase

1. Créez un projet sur [Supabase](https://supabase.com/).
2. Allez dans **Project Settings** > **Database**.
3. Copiez la **Connection String** (URI) :
   - Utilisez le mode **Transaction** (port 6543) pour `DATABASE_URL`.
   - Utilisez le mode **Session** (port 5432) pour `DIRECT_URL`.

## Étape 2 : Configuration du fichier `.env`

Ouvrez votre fichier `.env` à la racine du projet et mettez à jour les variables avec vos identifiants :

```env
# Database
DATABASE_URL="postgresql://postgres.[VOTRE_ID]:[VOTRE_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[VOTRE_ID]:[VOTRE_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# Auth.js
NEXTAUTH_SECRET="2ZVDqgFAWN1ib2kbLdCxR/0lMKx2HM9Rh6U3DF4Sv/Y="
NEXTAUTH_URL="http://localhost:3000"
```

## Étape 3 : Initialisation de la Base de Données

Exécutez les scripts SQL contenus dans le fichier `DATABASE.md` directement depuis l'éditeur SQL de la console Supabase pour créer les tables et les politiques de sécurité nécessaires.

## Étape 4 : Connexion à l'Admin

Une fois les tables créées, vous devez créer manuellement le compte administrateur depuis Supabase ou via l'interface d'inscription de l'application (et modifier ensuite son rôle en 'ADMIN' via Supabase).

- **Email :** `admin@globalairsn.com`
- **Mot de passe :** `admin123` (ou celui que vous avez défini)

---

## Commandes Utiles

| Action | Commande |
| :--- | :--- |
| **Lancer le serveur de développement** | `npm run dev` |
| **Construire le projet** | `npm run build` |
| **Lancer le serveur de production** | `npm run start` |

---

### ðŸ›¡ï¸ Sécurité
- Le fichier `proxy.ts` (anciennement `middleware.ts`) protège désormais automatiquement la route `/admin`.
- Seuls les utilisateurs avec le rôle `ADMIN` en base de données peuvent y accéder.
- Les mots de passe sont gérés de manière sécurisée par Supabase Auth. La table publique `User` ne contient aucun hash de mot de passe.
