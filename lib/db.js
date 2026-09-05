import { neon } from '@neondatabase/serverless';

/**
 * Client Neon (Postgres) pour les données JULO.
 *
 * Initialisation paresseuse volontaire : `neon()` lève si DATABASE_URL est
 * absent, et Next.js évalue le code de module au build. Un client créé au
 * niveau du module ferait donc échouer `next build` tant que la variable n'est
 * pas configurée (premier déploiement, CI sans secrets…).
 *
 * Pas de Proxy autour du client : certaines bibliothèques inspectent l'objet et
 * un Proxy casse ces vérifications de façon silencieuse.
 *
 * L'authentification reste sur Supabase (lib/supabase/*) : Neon ne fournit que
 * les données.
 */
let client = null;

export function getSql() {
    if (!client) {
        const url = process.env.DATABASE_URL;
        if (!url) {
            throw new Error(
                'DATABASE_URL est absent. Lancez `vercel env pull` pour récupérer ' +
                    'les variables de la base Neon.'
            );
        }
        client = neon(url);
    }
    return client;
}
