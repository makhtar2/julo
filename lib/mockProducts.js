/**
 * Catalogue Mock Ultra-Réaliste pour JULO Sénégal
 * Smartphones, Ordinateurs, Accessoires & Atelier de Sérigraphie
 */

export const JULO_CATEGORIES = [
    { id: 'cat-1', name: 'Smartphones & Apple', slug: 'smartphones-apple' },
    { id: 'cat-2', name: 'Samsung Galaxy', slug: 'samsung-galaxy' },
    { id: 'cat-3', name: 'Ordinateurs & PC', slug: 'ordinateurs-pc' },
    { id: 'cat-4', name: 'Audio & Écouteurs', slug: 'audio-ecouteurs' },
    { id: 'cat-5', name: 'Accessoires & GaN', slug: 'accessoires-gan' },
    { id: 'cat-6', name: 'Sérigraphie & Textile', slug: 'serigraphie-textile' },
];

export const JULO_MOCK_PRODUCTS = [
    // 1. SMARTPHONES & APPLE
    {
        id: 'julo-iphone-16-pro-max',
        name: 'iPhone 16 Pro Max 256GB — Titane Naturel',
        description:
            'Le fleuron d’Apple avec boîtier en titane de grade 5, écran Super Retina XDR 6.9 pouces avec ProMotion 120Hz. Équipé de la surpuissante puce A18 Pro pour Apple Intelligence, d’un téléobjectif 5x 48 MP et du nouveau bouton Commande de l’appareil photo. Produit neuf sous blister avec garantie constructeur 12 mois.',
        mrp: 1150000,
        price: 995000,
        stock: 6,
        inStock: true,
        category: 'Smartphones & Apple',
        categoryId: 'cat-1',
        Category: { id: 'cat-1', name: 'Smartphones & Apple' },
        images: [
            'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=900&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Écran: '6.9" Super Retina XDR OLED 120Hz ProMotion',
            Processeur: 'Apple A18 Pro (3 nm)',
            Stockage: '256 Go NVMe',
            'Appareil Photo': 'Triple capteur 48 MP + 48 MP Ultra Wide + 12 MP Téléobjectif 5x',
            Autonomie: 'Jusqu’à 33 heures de lecture vidéo',
            Connectivité: 'USB-C 3.0 (jusqu’à 10 Gb/s), 5G, Wi-Fi 7',
            Garantie: '1 an officielle Apple + SAV JULO',
        },
        rating: [
            {
                rating: 5,
                review: 'Reçu en 2h à Almadies, sous blister scellé. Parfait !',
                user: { name: 'Mamadou Diallo' },
            },
            {
                rating: 5,
                review: 'Le titane naturel est magnifique. Service client au top.',
                user: { name: 'Aïssatou Ba' },
            },
        ],
        createdAt: '2026-08-01T10:00:00Z',
    },
    {
        id: 'julo-iphone-15-pro',
        name: 'iPhone 15 Pro 128GB — Titane Bleu',
        description:
            'Design en titane léger et robuste avec bords arrondis. Puce A17 Pro gravée en 3nm offrant des performances graphiques de niveau console de jeu. Bouton Action personnalisable, port USB-C et capteur photo principal de 48 MP.',
        mrp: 850000,
        price: 720000,
        stock: 8,
        inStock: true,
        category: 'Smartphones & Apple',
        categoryId: 'cat-1',
        Category: { id: 'cat-1', name: 'Smartphones & Apple' },
        images: [
            'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=900&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Écran: '6.1" Super Retina XDR OLED ProMotion 120Hz',
            Processeur: 'Apple A17 Pro (3 nm)',
            Stockage: '128 Go',
            Connectique: 'USB-C haute vitesse',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Excellent téléphone, livraison très soignée.',
                user: { name: 'Cheikh Ndiaye' },
            },
        ],
        createdAt: '2026-08-05T10:00:00Z',
    },
    {
        id: 'julo-iphone-14',
        name: 'iPhone 14 128GB — Minuit',
        description:
            'L’essentiel d’Apple avec la puce A15 Bionic, écran Super Retina XDR de 6.1 pouces lumineux, système à double appareil photo performant en basse lumière et mode Action pour des vidéos ultra-stables.',
        mrp: 530000,
        price: 460000,
        stock: 10,
        inStock: true,
        category: 'Smartphones & Apple',
        categoryId: 'cat-1',
        Category: { id: 'cat-1', name: 'Smartphones & Apple' },
        images: [
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Écran: '6.1" OLED Super Retina XDR',
            Processeur: 'A15 Bionic 6-core',
            Stockage: '128 Go',
            Garantie: '12 mois',
        },
        rating: [
            { rating: 5, review: 'Rapport qualité/prix imbattable.', user: { name: 'Fatou Kiné' } },
        ],
        createdAt: '2026-08-08T10:00:00Z',
    },

    // 2. SAMSUNG GALAXY
    {
        id: 'julo-samsung-s24-ultra',
        name: 'Samsung Galaxy S24 Ultra 512GB — Titanium Black',
        description:
            'L’expérience Galaxy Ultime propulsée par Galaxy AI (traduction instantanée, retouche photo générative). Châssis en titane résistant, stylet S-Pen intégré, processeur Snapdragon 8 Gen 3 for Galaxy et capteur photo révolutionnaire de 200 MP avec zoom optique 5x.',
        mrp: 980000,
        price: 890000,
        stock: 5,
        inStock: true,
        category: 'Samsung Galaxy',
        categoryId: 'cat-2',
        Category: { id: 'cat-2', name: 'Samsung Galaxy' },
        images: [
            'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Écran: '6.8" Dynamic AMOLED 2X QHD+ 120Hz Vision Booster (2600 nits)',
            Processeur: 'Snapdragon 8 Gen 3 for Galaxy (4 nm)',
            'RAM / Stockage': '12 Go LPDDR5X / 512 Go UFS 4.0',
            'Appareil Photo':
                '200 MP (f/1.7) + 50 MP (5x zoom) + 10 MP (3x zoom) + 12 MP Ultra Wide',
            Batterie: '5000 mAh avec charge ultra-rapide 45W',
            Accessoire: 'Stylet S-Pen inclus',
            Garantie: '24 mois officielle Samsung Sénégal',
        },
        rating: [
            {
                rating: 5,
                review: 'L’écran plat sans reflets et l’intelligence artificielle sont bluffants.',
                user: { name: 'Ousmane Fall' },
            },
        ],
        createdAt: '2026-08-02T10:00:00Z',
    },
    {
        id: 'julo-samsung-z-flip-6',
        name: 'Samsung Galaxy Z Flip 6 256GB — Bleu Argenté',
        description:
            'Le smartphone pliable compact et stylé par excellence. Écran externe FlexWindow 3.4", capteur photo principal de 50 MP avec ProVisual Engine, autonomie renforcée et charnière FlexHinge renforcée en aluminium Armor.',
        mrp: 890000,
        price: 750000,
        stock: 4,
        inStock: true,
        category: 'Samsung Galaxy',
        categoryId: 'cat-2',
        Category: { id: 'cat-2', name: 'Samsung Galaxy' },
        images: [
            'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            'Écran principal': '6.7" FHD+ Dynamic AMOLED 2X 120Hz',
            'Écran externe': '3.4" Super AMOLED',
            Processeur: 'Snapdragon 8 Gen 3',
            'RAM / Stockage': '12 Go / 256 Go',
            Garantie: '12 mois',
        },
        rating: [
            { rating: 5, review: 'Très compact et super élégant.', user: { name: 'Ndeye Sokhna' } },
        ],
        createdAt: '2026-08-10T10:00:00Z',
    },

    // 3. ORDINATEURS & PC
    {
        id: 'julo-macbook-pro-m3-pro',
        name: 'MacBook Pro 14" M3 Pro 18GB / 512GB SSD — Noir Sidéral',
        description:
            'La machine ultime pour les développeurs, créateurs de contenu et ingénieurs. Puce Apple M3 Pro (CPU 11 cœurs, GPU 14 cœurs), 18 Go de mémoire unifiée haute vitesse et écran Liquid Retina XDR aux contrastes infinis (1600 nits). Autonomie exceptionnelle jusqu’à 18 heures.',
        mrp: 1750000,
        price: 1590000,
        stock: 4,
        inStock: true,
        category: 'Ordinateurs & PC',
        categoryId: 'cat-3',
        Category: { id: 'cat-3', name: 'Ordinateurs & PC' },
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Écran: '14.2" Liquid Retina XDR (3024 x 1964) ProMotion 120Hz',
            Processeur: 'Apple M3 Pro (CPU 11 cœurs, GPU 14 cœurs)',
            Mémoire: '18 Go de mémoire unifiée',
            Stockage: '512 Go SSD ultra-rapide',
            Ports: '3x Thunderbolt 4 (USB-C), HDMI, Lecteur SDXC, MagSafe 3, Jack 3.5mm',
            Clavier: 'Magic Keyboard rétroéclairé français AZERTY avec Touch ID',
            Garantie: '1 an Apple International',
        },
        rating: [
            {
                rating: 5,
                review: 'Une bête de course pour le dev Next.js et le montage vidéo 4K.',
                user: { name: 'Alioune Badara' },
            },
        ],
        createdAt: '2026-08-03T10:00:00Z',
    },
    {
        id: 'julo-macbook-air-m2',
        name: 'MacBook Air 13" M2 8GB / 256GB SSD — Minuit',
        description:
            'Design ultra-fin de seulement 1.13 cm en aluminium 100% recyclé. Puce M2 rapide et silencieuse sans ventilateur, écran Liquid Retina de 13.6 pouces avec 500 nits de luminosité et caméra FaceTime HD 1080p.',
        mrp: 890000,
        price: 790000,
        stock: 7,
        inStock: true,
        category: 'Ordinateurs & PC',
        categoryId: 'cat-3',
        Category: { id: 'cat-3', name: 'Ordinateurs & PC' },
        images: [
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Écran: '13.6" Liquid Retina 2560 x 1664',
            Puce: 'Apple M2 (8 cœurs CPU / 8 cœurs GPU)',
            'Mémoire / SSD': '8 Go RAM / 256 Go SSD',
            Poids: '1.24 kg seulement',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Parfait pour mes études et mon travail nomade.',
                user: { name: 'Coumba Kane' },
            },
        ],
        createdAt: '2026-08-06T10:00:00Z',
    },
    {
        id: 'julo-hp-elitebook-840-g10',
        name: 'HP EliteBook 840 G10 Intel Core i7 16GB / 512GB SSD',
        description:
            'Ordinateur professionnel haut de gamme avec châssis métallique élégant. Processeur Intel Core i7 13th Gen, 16 Go de RAM DDR5, écran 14 pouces antireflet, clavier rétroéclairé résistant à l’eau et suite de sécurité HP Wolf Security.',
        mrp: 650000,
        price: 575000,
        stock: 6,
        inStock: true,
        category: 'Ordinateurs & PC',
        categoryId: 'cat-3',
        Category: { id: 'cat-3', name: 'Ordinateurs & PC' },
        images: [
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Processeur: 'Intel Core i7-1355U (jusqu’à 5.0 GHz Turbo)',
            Mémoire: '16 Go DDR5 5200 MHz',
            Stockage: '512 Go SSD PCIe NVMe M.2',
            Écran: '14.0" IPS Full HD (1920x1200) 400 nits',
            Sécurité: 'Lecteur d’empreintes digitales & caméra infrarouge Windows Hello',
            Garantie: '1 an',
        },
        rating: [
            {
                rating: 5,
                review: 'Solide, fluide et très autonome.',
                user: { name: 'Serigne Fallou' },
            },
        ],
        createdAt: '2026-08-07T10:00:00Z',
    },

    // 4. AUDIO & ÉCOUTEURS
    {
        id: 'julo-airpods-pro-2-usbc',
        name: 'Apple AirPods Pro (2ᵉ génération) avec boîtier MagSafe USB-C',
        description:
            'Puce H2 offrant une réduction active du bruit jusqu’à deux fois plus efficace. Audio spatial personnalisé avec suivi dynamique de la tête. Résistance à la poussière, à la transpiration et à l’eau (IP54) pour les écouteurs et le boîtier de charge.',
        mrp: 210000,
        price: 185000,
        stock: 12,
        inStock: true,
        category: 'Audio & Écouteurs',
        categoryId: 'cat-4',
        Category: { id: 'cat-4', name: 'Audio & Écouteurs' },
        images: [
            'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Puce: 'Apple H2 dans les écouteurs, puce U1 dans le boîtier',
            'Réduction du bruit': 'ANC 2x + Transparence adaptative',
            Autonomie: 'Jusqu’à 6h d’écoute (30h au total avec boîtier)',
            Recharge: 'USB-C, MagSafe, chargeur Apple Watch ou Qi',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Son exceptionnel et réduction de bruit magique.',
                user: { name: 'Mouhamed Lamine' },
            },
        ],
        createdAt: '2026-08-04T10:00:00Z',
    },
    {
        id: 'julo-sony-wh-1000xm5',
        name: 'Sony WH-1000XM5 Casque Bluetooth Sans Fil Réduction de Bruit',
        description:
            'La référence mondiale du son et de la réduction de bruit active. Équipé de 8 microphones et de 2 processeurs dédiés (V1 et QN1). Son Hi-Res Wireless via codec LDAC, confort d’écoute ultra-léger et autonomie impressionnante de 30 heures.',
        mrp: 285000,
        price: 245000,
        stock: 6,
        inStock: true,
        category: 'Audio & Écouteurs',
        categoryId: 'cat-4',
        Category: { id: 'cat-4', name: 'Audio & Écouteurs' },
        images: [
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Transducteurs: '30 mm en fibre de carbone',
            Autonomie: '30 heures avec ANC (charge rapide 3 min = 3h d’écoute)',
            Codecs: 'LDAC, AAC, SBC',
            Poids: '250 g',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Le meilleur casque du marché tout simplement.',
                user: { name: 'El Hadji Diop' },
            },
        ],
        createdAt: '2026-08-09T10:00:00Z',
    },

    // 5. ACCESSOIRES & GAN
    {
        id: 'julo-gan-charger-65w',
        name: 'Chargeur Rapide GaN 65W 3 Ports (2x USB-C + USB-A)',
        description:
            'Technologie au nitrure de gallium (GaN III) compacte et ultra-efficace. Délivre 65W Power Delivery pour recharger simultanément un MacBook Pro, un iPhone et des écouteurs sans surchauffe ni perte de puissance.',
        mrp: 35000,
        price: 25000,
        stock: 25,
        inStock: true,
        category: 'Accessoires & GaN',
        categoryId: 'cat-5',
        Category: { id: 'cat-5', name: 'Accessoires & GaN' },
        images: [
            'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            'Puissance Max': '65 Watts Power Delivery 3.0 / Quick Charge 4.0',
            Ports: '2x USB-C + 1x USB-A',
            Compatibilité: 'MacBook, Dell, iPhone, Samsung, iPad, Nintendo Switch',
            Sécurité: 'Protection contre surtensions, surchauffe et courts-circuits',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Charge mon MacBook et mon téléphone en même temps sans chauffer.',
                user: { name: 'Bassirou Sène' },
            },
        ],
        createdAt: '2026-08-11T10:00:00Z',
    },
    {
        id: 'julo-anker-maggo-powerbank',
        name: 'Batterie Externe MagSafe Anker Qi2 10 000 mAh 15W Sans Fil',
        description:
            'Batterie magnétique avec certification officielle Qi2 pour une charge sans fil ultra-rapide à 15W. Équipée d’un écran intelligent indiquant le pourcentage restant et d’un support pliable intégré pour poser votre téléphone à l’horizontale ou à la verticale.',
        mrp: 55000,
        price: 45000,
        stock: 15,
        inStock: true,
        category: 'Accessoires & GaN',
        categoryId: 'cat-5',
        Category: { id: 'cat-5', name: 'Accessoires & GaN' },
        images: [
            'https://images.unsplash.com/photo-1609592426505-d227b8755678?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Capacité: '10 000 mAh (2 charges complètes d’iPhone 16 Pro)',
            'Charge Sans Fil': '15W certifié Qi2 MagSafe',
            'Sortie Filaire': 'USB-C bidirectionnel 27W Max',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Pratique en voyage avec son écran et son pied de maintien.',
                user: { name: 'Mame Diarra' },
            },
        ],
        createdAt: '2026-08-12T10:00:00Z',
    },

    // 6. SÉRIGRAPHIE & TEXTILE JULO STUDIO
    {
        id: 'julo-tshirt-oversize-studio',
        name: 'T-Shirt Premium JULO Studio 100% Coton Peigné 240g/m²',
        description:
            'T-shirt lourd de qualité supérieure conçu par JULO Atelier. Coton peigné 240g/m² avec toucher doux, coupe oversize contemporaine, col rond renforcé et impression sérigraphique artisanale haute densité. Disponible à l’unité ou en commande personnalisée avec votre propre visuel.',
        mrp: 18000,
        price: 12000,
        stock: 40,
        inStock: true,
        category: 'Sérigraphie & Textile',
        categoryId: 'cat-6',
        Category: { id: 'cat-6', name: 'Sérigraphie & Textile' },
        images: [
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Matière: '100% Coton peigné biologique 240 g/m²',
            Coupe: 'Oversize Streetwear unisexe',
            Impression:
                'Sérigraphie textile haute définition indélébile (tenue garantie 50+ lavages)',
            'Tailles disponibles': 'S, M, L, XL, XXL',
            Origine: 'Personnalisé & Imprimé avec soin à Dakar & Touba',
        },
        rating: [
            {
                rating: 5,
                review: 'Le tissu est lourd et épais, la sérigraphie ne bouge pas au lavage !',
                user: { name: 'Djibril Cissé' },
            },
            {
                rating: 5,
                review: 'Très belle coupe oversize. J’ai commandé 3 coloris.',
                user: { name: 'Khady Niane' },
            },
        ],
        createdAt: '2026-08-01T12:00:00Z',
    },
    {
        id: 'julo-hoodie-custom-atelier',
        name: 'Hoodie Custom JULO Atelier — Personnalisation Sur-Mesure',
        description:
            'Sweat à capuche molletonné ultra-confortable 350g/m² avec intérieur brossé polaire. Personnalisation intégrale pour votre marque, votre entreprise ou votre projet personnel (logo coeur, grand dos, manches). Devis et simulation 3D express sur WhatsApp.',
        mrp: 30000,
        price: 22000,
        stock: 30,
        inStock: true,
        category: 'Sérigraphie & Textile',
        categoryId: 'cat-6',
        Category: { id: 'cat-6', name: 'Sérigraphie & Textile' },
        images: [
            'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Matière: '80% Coton peigné / 20% Polyester recyclé 350 g/m²',
            Finition: 'Poche kangourou, œillets métalliques et cordons épais ton sur ton',
            Personnalisation: 'Sérigraphie jusqu’à 6 couleurs ou Broderie directe',
            'Commande min': 'Disponible dès 1 pièce jusqu’à 1000+ pièces',
        },
        rating: [
            {
                rating: 5,
                review: 'Nous avons fait faire les sweats pour notre promo d’école, rendu parfait !',
                user: { name: 'Pape Ibrahima' },
            },
        ],
        createdAt: '2026-08-02T12:00:00Z',
    },
    {
        id: 'julo-pack-10-polos-corporate',
        name: 'Pack 10 Polos Corporate Entreprise Sérigraphiés / Brodés',
        description:
            'Pack professionnel pour équiper vos équipes, salons et événements corporate. Polos en piqué de coton 220g/m² avec col tricoté et patte 3 boutons. Personnalisation de votre logo d’entreprise sur le cœur et dans le dos.',
        mrp: 130000,
        price: 95000,
        stock: 15,
        inStock: true,
        category: 'Sérigraphie & Textile',
        categoryId: 'cat-6',
        Category: { id: 'cat-6', name: 'Sérigraphie & Textile' },
        images: [
            'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Quantité: 'Pack de 10 Polos (tailles panachables du S au 3XL)',
            Matière: 'Piqué de coton peigné 220 g/m²',
            Personnalisation: 'Logo brodé ou sérigraphié inclus',
            'Délai de fabrication': '48h à 72h avec livraison partout au Sénégal',
        },
        rating: [
            {
                rating: 5,
                review: 'Excellente finition pour notre agence de com.',
                user: { name: 'Moussa Gueye' },
            },
        ],
        createdAt: '2026-08-03T12:00:00Z',
    },
    {
        id: 'julo-totebag-canvas',
        name: 'Tote Bag Canvas Épais 100% Coton Personnalisé JULO',
        description:
            'Sac en toile canvas 300g/m² avec longues anses renforcées de 70 cm. Idéal pour goodies d’entreprises, boutiques de mode ou cadeaux clients. Sérigraphie haute résistance 1 ou 2 couleurs.',
        mrp: 8000,
        price: 5000,
        stock: 50,
        inStock: true,
        category: 'Sérigraphie & Textile',
        categoryId: 'cat-6',
        Category: { id: 'cat-6', name: 'Sérigraphie & Textile' },
        images: [
            'https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Dimensions: '38 x 42 cm avec soufflet de 10 cm',
            Toile: '100% Coton Canvas brut 300 g/m²',
            Capacité: '15 Litres (supporte jusqu’à 12 kg)',
        },
        rating: [
            {
                rating: 5,
                review: 'Toile très solide et impression impeccable.',
                user: { name: 'Awa Diagne' },
            },
        ],
        createdAt: '2026-08-04T12:00:00Z',
    },
];
