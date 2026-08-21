import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Erreur: Variables Supabase manquantes.');
    process.exit(1);
}

const generateSlug = (text) => {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

const posts = [
    {
        title: 'Climatiseur Inverter vs Classique : Lequel choisir pour réduire sa facture Senelec ?',
        excerpt: 'Vous hésitez entre un climatiseur Inverter et un modèle classique ? Découvrez pourquoi la technologie Inverter est devenue la norme à Dakar pour économiser sur l\'électricité.',
        content: `L'achat d'un climatiseur est indispensable pour faire face aux fortes chaleurs au Sénégal, mais la facture d'électricité à la fin du mois peut vite devenir un problème. C'est là qu'intervient le choix entre un modèle classique et un modèle "Inverter".

### Comment fonctionne un climatiseur classique ?
Le compresseur d'un climatiseur classique fonctionne selon un cycle "Tout ou Rien". Il s'allume à pleine puissance jusqu'à atteindre la température demandée, puis s'éteint complètement. Lorsqu'il fait chaud à nouveau, il se rallume avec un pic de consommation électrique. Ces redémarrages constants fatiguent l'appareil et font grimper votre facture Senelec.

### La magie de la technologie Inverter
Un climatiseur Inverter, en revanche, ne s'éteint jamais vraiment. Une fois la température atteinte, le compresseur ralentit sa vitesse pour maintenir le froid en continu. Il n'y a pas de pics de tension.

**Les vrais avantages pour vous :**
- **Jusqu'à 40% d'économie d'énergie** sur votre facture bimestrielle.
- **Un refroidissement plus doux et silencieux**, idéal pour les chambres à coucher la nuit.
- **Une meilleure durabilité** face aux petites variations de courant.

### Notre conseil
Si vous utilisez votre climatiseur plus de 3 heures par jour (ou pour dormir toute la nuit), investissez dans nos modèles Inverter de marque Global Air. Conçus spécifiquement pour le réseau électrique sénégalais, ils sont robustes, économiques et vous rentabiliserez votre achat en quelques mois grâce aux économies d'électricité !`,
        image: 'https://res.cloudinary.com/dwyx119t1/image/upload/v1724285114/climatiseur-inverter_qxw8ze.jpg',
        isPublished: true,
    },
    {
        title: 'Comment protéger son électroménager des variations de tension au Sénégal ?',
        excerpt: 'La chaleur, la poussière et les petites variations de courant mettent vos appareils à rude épreuve. Voici les gestes indispensables pour protéger vos investissements.',
        content: `Acheter un bon climatiseur ou une belle Smart TV est un investissement important. Pourtant, sans quelques précautions de base, la durée de vie de ces appareils peut être drastiquement réduite par notre environnement local (poussière, humidité, variations de courant).

Voici nos règles d'or pour garder votre électroménager fonctionnel pendant des années :

### 1. Le stabilisateur est votre meilleur ami
C'est la règle numéro un au Sénégal. Ne branchez jamais un téléviseur coûteux ou un gros appareil directement sur une prise murale sans protection. Les micro-coupures et les retours de tension soudains peuvent griller la carte mère de votre appareil instantanément.
**Astuce :** Choisissez un régulateur de tension (ou stabilisateur) adapté à la puissance de votre appareil.

### 2. Attention à l'emplacement
La chaleur étouffante de Dakar n'aide pas les moteurs à se refroidir. 
- Laissez toujours un espace suffisant autour de vos appareils pour laisser l'air chaud s'échapper.
- Ne placez jamais d'équipements électroniques sous une tôle exposée en plein soleil.

### 3. La lutte contre la poussière
L'Harmattan dépose une fine pellicule de poussière partout. Sur les téléviseurs, passez un chiffon en microfibre sec une fois par semaine. Pour les climatiseurs, nettoyez les filtres à l'eau claire toutes les deux semaines : un filtre bouché par le sable fait forcer le moteur, réduit le froid et augmente votre consommation électrique.

Chez Global Air, tous nos produits sont sélectionnés pour leur résistance aux climats chauds, mais un bon entretien reste la clé de leur longévité !`,
        image: 'https://res.cloudinary.com/dwyx119t1/image/upload/v1724285114/protection-electromenager_qxw8ze.jpg',
        isPublished: true,
    },
    {
        title: 'Comment bien choisir sa Smart TV pour le salon ?',
        excerpt: "Taille d'écran, résolution 4K, compatibilité... Découvrez nos conseils pour transformer votre salon en véritable salle de cinéma avec Global Air.",
        content: `Le téléviseur est souvent le point central du salon familial au Sénégal. Avec l'arrivée des nouvelles Smart TV de notre gamme Global Air, il est facile de se perdre parmi les caractéristiques techniques. Voici comment faire le bon choix.

### 1. La taille compte, mais le recul aussi !
Beaucoup pensent que plus l'écran est grand, mieux c'est. Cependant, si votre salon est étroit, un écran immense vous fatiguera les yeux. 
- **Pour 2 mètres de recul :** Une Smart TV de 43 à 50 pouces est parfaite.
- **Pour plus de 3 mètres :** Vous pouvez opter pour nos magnifiques écrans 55, 65 voire 75 pouces pour une vraie sensation de cinéma !

### 2. La résolution : Pourquoi la 4K est désormais incontournable ?
Aujourd'hui, la plupart des contenus (sur Netflix, YouTube, ou les grands matchs de football) sont disponibles en très haute définition. Les téléviseurs Global Air offrent une résolution 4K (Ultra HD), qui affiche quatre fois plus de détails qu'un écran classique. L'image est si nette que vous aurez l'impression d'être sur le terrain.

### 3. Les fonctions "Smart"
Assurez-vous que le téléviseur possède un système d'exploitation fluide pour naviguer facilement entre YouTube, Netflix, et le navigateur web. Nos Smart TV Global Air intègrent un processeur rapide et un décodeur intégré, vous évitant d'acheter des boîtiers supplémentaires encombrants.

Prêt à faire évoluer votre salon ? Découvrez notre gamme complète de téléviseurs dans la section Boutique !`,
        image: 'https://res.cloudinary.com/dwyx119t1/image/upload/v1724285114/smart-tv_qxw8ze.jpg',
        isPublished: true,
    }
];

async function seed() {
    console.log("Début de l'insertion des articles de blog...");
    
    const headers = {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    };

    for (const post of posts) {
        const slug = generateSlug(post.title);
        
        // Vérifier
        const getRes = await fetch(`${supabaseUrl}/rest/v1/Post?slug=eq.${slug}&select=id`, { headers });
        const existing = await getRes.json();
            
        if (existing && existing.length > 0) {
            console.log(`[UPDATE] L'article "${post.title}" existe déjà. Mise à jour en cours...`);
            const updateRes = await fetch(`${supabaseUrl}/rest/v1/Post?slug=eq.${slug}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ ...post })
            });
            if (!updateRes.ok) {
                console.log(`Erreur lors de la mise à jour de "${post.title}"`);
            } else {
                console.log(`[SUCCESS] Article "${post.title}" mis à jour.`);
            }
            continue;
        }

        const insertRes = await fetch(`${supabaseUrl}/rest/v1/Post`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ ...post, slug })
        });

        if (!insertRes.ok) {
            const error = await insertRes.json();
            console.log(`Erreur lors de l'insertion de "${post.title}":`, error);
        } else {
            console.log(`[SUCCESS] Article "${post.title}" inséré.`);
        }
    }
    
    console.log('Terminé ! Vous pouvez vérifier sur /blog');
}

seed();
