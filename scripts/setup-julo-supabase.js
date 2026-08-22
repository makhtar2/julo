/**
 * Script d'initialisation et de vérification pour la base Supabase dédiée à JULO.
 * Usage: node scripts/setup-julo-supabase.js
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error(
        '❌ Erreur: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local'
    );
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function setupJulo() {
    console.log('🚀 Vérification de la connexion au projet Supabase JULO :', supabaseUrl);

    try {
        const { data: categories, error: catError } = await supabaseAdmin
            .from('Category')
            .select('*');
        if (catError) {
            console.error(
                '❌ Impossible de lire la table Category. Avez-vous exécuté supabase/julo_schema.sql ?',
                catError.message
            );
            return;
        }

        console.log(`✅ Connexion réussie ! ${categories.length} catégories trouvées.`);

        const { data: products, error: prodError } = await supabaseAdmin
            .from('Product')
            .select('id, name, price');
        if (prodError) {
            console.error('❌ Erreur de lecture des produits :', prodError.message);
            return;
        }

        console.log(`✅ ${products.length} produits trouvés dans le catalogue JULO.`);
        console.log('🎉 Votre base de données dédiée à JULO est prête et opérationnelle !');
    } catch (e) {
        console.error('❌ Erreur inattendue :', e);
    }
}

setupJulo();
