const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;

// Load environment variables from .env.local
function loadEnv() {
    const envPath = path.join(__dirname, '../.env.local');
    if (!fs.existsSync(envPath)) {
        console.error('âŒ Fichier .env.local introuvable à :', envPath);
        process.exit(1);
    }
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let val = match[2].trim();
            if (
                (val.startsWith('"') && val.endsWith('"')) ||
                (val.startsWith("'") && val.endsWith("'"))
            ) {
                val = val.substring(1, val.length - 1);
            }
            process.env[key] = val;
        }
    });
    console.log("✅ Variables d'environnement chargées depuis .env.local");
}

loadEnv();

const DRY_RUN = process.env.DRY_RUN !== 'false';
console.log(
    `â„¹ï¸ Mode de fonctionnement : ${DRY_RUN ? 'ðŸ”¬ SIMULATION (DRY RUN - aucune modification en base)' : '🚀 MIGRATION RÉELLE (WRITE MODE)'}`
);

// Initialize Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("âŒ Clés Supabase manquantes dans les variables d'environnement.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

// Initialize Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
) {
    console.error("âŒ Identifiants Cloudinary manquants dans les variables d'environnement.");
    process.exit(1);
}

const backupFile = path.join(__dirname, '../migration-backup.json');

// Helper to determine if a URL is already hosted on Cloudinary
function isCloudinaryUrl(url) {
    return typeof url === 'string' && url.includes('res.cloudinary.com');
}

// Upload a single image to Cloudinary (either local path or remote URL)
async function uploadToCloudinary(imageSource, folder = 'globalair-products') {
    if (!imageSource) return null;
    if (isCloudinaryUrl(imageSource)) {
        console.log(`   â­ï¸ Déjà sur Cloudinary : ${imageSource}`);
        return imageSource;
    }

    try {
        let uploadContent = '';

        // Case 1: Local assets (e.g. /hero_product_img1.png or /assets/wa_product_1.jpeg)
        if (imageSource.startsWith('/')) {
            let localPath = path.join(__dirname, '../public', imageSource);

            // Try fallback options if file is not found immediately
            if (!fs.existsSync(localPath)) {
                const altPath = path.join(
                    __dirname,
                    '../public/assets',
                    imageSource.replace(/^\/(assets\/)?/, '')
                );
                if (fs.existsSync(altPath)) {
                    localPath = altPath;
                } else {
                    console.warn(`   ⚠️ï¸ Fichier local introuvable : ${localPath} ni ${altPath}`);
                    return null;
                }
            }

            const fileBuffer = fs.readFileSync(localPath);
            const ext = path.extname(localPath).toLowerCase().slice(1) || 'png';
            const mimeType =
                ext === 'jpg' ? 'image/jpeg' : ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
            uploadContent = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
            console.log(
                `   ðŸ“‚ Lecture du fichier local : ${localPath} (${(fileBuffer.length / 1024).toFixed(1)} KB)`
            );
        }
        // Case 2: Supabase Storage or other remote URLs
        else if (imageSource.startsWith('http')) {
            console.log(`   ðŸŒ Téléchargement de l'image distante : ${imageSource}`);
            const response = await fetch(imageSource);
            if (!response.ok) {
                console.error(
                    `   âŒ Échec du téléchargement HTTP (${response.status}) pour : ${imageSource}`
                );
                return null;
            }
            const buffer = Buffer.from(await response.arrayBuffer());
            const mimeType = response.headers.get('content-type') || 'image/jpeg';
            uploadContent = `data:${mimeType};base64,${buffer.toString('base64')}`;
        } else {
            console.warn(`   ⚠️ï¸ Format d'image source non supporté : ${imageSource}`);
            return null;
        }

        // Upload to Cloudinary
        if (DRY_RUN) {
            console.log(
                `   ðŸ”¬ [SIMULATION] Uploaderait vers Cloudinary dans le dossier '${folder}'`
            );
            return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v123456789/simulation_${path.basename(imageSource)}`;
        } else {
            const result = await cloudinary.uploader.upload(uploadContent, {
                folder: folder,
            });
            console.log(`   âœ¨ Téléversé sur Cloudinary avec succès ! URL : ${result.secure_url}`);
            return result.secure_url;
        }
    } catch (error) {
        console.error(`   âŒ Erreur d'upload vers Cloudinary pour ${imageSource} :`, error.message);
        return null;
    }
}

async function runMigration() {
    console.log('ðŸ Démarrage de la migration des images...');

    // Backup data first
    const backupData = {
        products: [],
        banners: [],
        posts: [],
        timestamp: new Date().toISOString(),
    };

    // 1. PRODUCTS MIGRATION
    console.log('\n📦 --- 1. MIGRATION DES PRODUITS ---');
    const { data: products, error: prodError } = await supabase
        .from('Product')
        .select('id, name, images');

    if (prodError) {
        console.error('âŒ Erreur de récupération des produits :', prodError);
        return;
    }

    console.log(`Total produits récupérés : ${products.length}`);
    backupData.products = JSON.parse(JSON.stringify(products));

    let migratedProductsCount = 0;
    for (let product of products) {
        console.log(`\nProd [${product.name}] (ID: ${product.id})`);
        const currentImages = product.images || [];
        const newImages = [];
        let hasChanges = false;

        for (let img of currentImages) {
            if (!isCloudinaryUrl(img)) {
                console.log(` ðŸ”„ Image à migrer : "${img}"`);
                const cloudinaryUrl = await uploadToCloudinary(img, 'globalair-products');
                if (cloudinaryUrl) {
                    newImages.push(cloudinaryUrl);
                    hasChanges = true;
                } else {
                    // Conserve original image URL if upload failed
                    newImages.push(img);
                }
            } else {
                newImages.push(img);
            }
        }

        if (hasChanges) {
            if (!DRY_RUN) {
                const { error: updateError } = await supabase
                    .from('Product')
                    .update({ images: newImages })
                    .eq('id', product.id);

                if (updateError) {
                    console.error(
                        ` âŒ Erreur lors de la mise à jour en base pour le produit ${product.name} :`,
                        updateError
                    );
                } else {
                    console.log(` ✅ Produit mis à jour avec succès en base de données.`);
                    migratedProductsCount++;
                }
            } else {
                console.log(
                    ` ðŸ”¬ [SIMULATION] Enregistrerait la nouvelle liste d'images :`,
                    newImages
                );
                migratedProductsCount++;
            }
        } else {
            console.log(` â­ï¸ Aucune modification nécessaire pour ce produit.`);
        }
    }

    // 2. BANNERS MIGRATION
    console.log('\nðŸŽ --- 2. MIGRATION DES BANNIÈRES ---');
    const { data: banners, error: bannerError } = await supabase
        .from('Banner')
        .select('id, title, image');

    if (bannerError) {
        console.error('âŒ Erreur de récupération des bannières :', bannerError);
    } else {
        console.log(`Total bannières récupérées : ${banners.length}`);
        backupData.banners = JSON.parse(JSON.stringify(banners));

        let migratedBannersCount = 0;
        for (let banner of banners) {
            console.log(`\nBannière [${banner.title || 'Sans titre'}] (ID: ${banner.id})`);
            const currentImage = banner.image;

            if (currentImage && !isCloudinaryUrl(currentImage)) {
                console.log(` ðŸ”„ Image de bannière à migrer : "${currentImage}"`);
                const cloudinaryUrl = await uploadToCloudinary(currentImage, 'globalair-banners');

                if (cloudinaryUrl) {
                    if (!DRY_RUN) {
                        const { error: updateError } = await supabase
                            .from('Banner')
                            .update({ image: cloudinaryUrl })
                            .eq('id', banner.id);

                        if (updateError) {
                            console.error(
                                ` âŒ Erreur de mise à jour de la bannière :`,
                                updateError
                            );
                        } else {
                            console.log(` ✅ Bannière mise à jour avec succès.`);
                            migratedBannersCount++;
                        }
                    } else {
                        console.log(
                            ` ðŸ”¬ [SIMULATION] Enregistrerait la nouvelle URL d'image : "${cloudinaryUrl}"`
                        );
                        migratedBannersCount++;
                    }
                }
            } else {
                console.log(` â­ï¸ Déjà sur Cloudinary ou vide.`);
            }
        }
        console.log(`\n Bannières migrées : ${migratedBannersCount}/${banners.length}`);
    }

    // 3. BLOG POSTS MIGRATION
    console.log('\nâœï¸ --- 3. MIGRATION DES ARTICLES DE BLOG ---');
    const { data: posts, error: postError } = await supabase
        .from('Post')
        .select('id, title, image');

    if (postError) {
        console.error('âŒ Erreur de récupération des articles de blog :', postError);
    } else {
        console.log(`Total articles récupérés : ${posts.length}`);
        backupData.posts = JSON.parse(JSON.stringify(posts));

        let migratedPostsCount = 0;
        for (let post of posts) {
            console.log(`\nArticle [${post.title}] (ID: ${post.id})`);
            const currentImage = post.image;

            if (currentImage && !isCloudinaryUrl(currentImage)) {
                console.log(` ðŸ”„ Image de l'article à migrer : "${currentImage}"`);
                const cloudinaryUrl = await uploadToCloudinary(currentImage, 'globalair-blog');

                if (cloudinaryUrl) {
                    if (!DRY_RUN) {
                        const { error: updateError } = await supabase
                            .from('Post')
                            .update({ image: cloudinaryUrl })
                            .eq('id', post.id);

                        if (updateError) {
                            console.error(` âŒ Erreur de mise à jour de l'article :`, updateError);
                        } else {
                            console.log(` ✅ Article de blog mis à jour avec succès.`);
                            migratedPostsCount++;
                        }
                    } else {
                        console.log(
                            ` ðŸ”¬ [SIMULATION] Enregistrerait la nouvelle URL d'image : "${cloudinaryUrl}"`
                        );
                        migratedPostsCount++;
                    }
                }
            } else {
                console.log(` â­ï¸ Déjà sur Cloudinary ou vide.`);
            }
        }
        console.log(`\n Articles de blog migrés : ${migratedPostsCount}/${posts.length}`);
    }

    // Write backup file if not exists
    if (!fs.existsSync(backupFile)) {
        fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 4), 'utf8');
        console.log(
            `\nðŸ’¾ Sauvegarde des données initiales générée avec succès dans : ${backupFile}`
        );
    } else {
        console.log(`\nâ„¹ï¸ Fichier de sauvegarde déjà existant à : ${backupFile} (non réécrit)`);
    }

    console.log(`\nðŸ FIN DE LA MIGRATION !`);
    console.log(`📊 Produits mis à jour : ${migratedProductsCount}/${products.length}`);
}

runMigration();
