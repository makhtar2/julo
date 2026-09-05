/**
 * Catalogue JULO Sénégal — Données Ultra-Réalistes Adaptées au Marché Sénégalais
 * Marques : Apple, Samsung, Tecno, Infinix, Itel, Xiaomi, Oraimo, Anker, JBL, HP, Dell, Lenovo, Asus
 * & Atelier Sérigraphie / Goodies JULO Studio (Dakar & Touba).
 */

export const JULO_CATEGORIES = [
    { id: 'cat-1', name: 'Smartphones & Apple', slug: 'smartphones-apple' },
    { id: 'cat-2', name: 'Samsung Galaxy', slug: 'samsung-galaxy' },
    { id: 'cat-3', name: 'Tecno, Infinix & Itel', slug: 'tecno-infinix-itel' },
    { id: 'cat-4', name: 'Xiaomi & Redmi', slug: 'xiaomi-redmi' },
    { id: 'cat-5', name: 'Ordinateurs & PC', slug: 'ordinateurs-pc' },
    { id: 'cat-6', name: 'Audio, Enceintes & Oraimo', slug: 'audio-enceintes-oraimo' },
    { id: 'cat-7', name: 'Accessoires & Énergie', slug: 'accessoires-energie' },
    { id: 'cat-8', name: 'Montres & Wearables', slug: 'montres-wearables' },
];

export const JULO_MOCK_PRODUCTS = [
    // ==========================================
    // 1. SMARTPHONES & APPLE
    // ==========================================
    {
        id: 'julo-iphone-16-pro-max',
        name: 'iPhone 16 Pro Max 256GB — Titane Naturel',
        description:
            'Le fleuron d’Apple avec boîtier en titane de grade 5, écran Super Retina XDR 6.9 pouces avec ProMotion 120Hz. Puce A18 Pro conçue pour Apple Intelligence, téléobjectif 5x 48 MP et nouveau bouton Commande de l’appareil photo. Neuf sous blister avec garantie constructeur 12 mois.',
        mrp: 1150000,
        price: 995000,
        stock: 6,
        inStock: true,
        category: 'Smartphones & Apple',
        categoryId: 'cat-1',
        Category: { id: 'cat-1', name: 'Smartphones & Apple' },
        images: [
            'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Écran: '6.9" Super Retina XDR OLED 120Hz ProMotion',
            Processeur: 'Apple A18 Pro (3 nm)',
            Stockage: '256 Go NVMe',
            'Appareil Photo': '48 MP Fusion + 48 MP Ultra Wide + 12 MP Téléobjectif 5x',
            Autonomie: 'Jusqu’à 33 heures de lecture vidéo',
            Garantie: '1 an officielle Apple + SAV JULO Dakar',
        },
        rating: [
            {
                rating: 5,
                review: 'Livré en 2h à Almadies, neuf scellé. Top service !',
                user: { name: 'Mamadou Diallo' },
            },
            {
                rating: 5,
                review: 'Le titane naturel est incroyable.',
                user: { name: 'Aïssatou Ba' },
            },
        ],
        createdAt: '2026-08-01T10:00:00Z',
    },
    {
        id: 'julo-iphone-15-pro',
        name: 'iPhone 15 Pro 128GB — Titane Bleu',
        description:
            'Châssis en titane ultra-léger avec bords profilés, puce A17 Pro gravée en 3nm, bouton Action personnalisable, connecteur USB-C haute vitesse et capteur photo principal 48 MP avec mode portrait nouvelle génération.',
        mrp: 850000,
        price: 720000,
        stock: 8,
        inStock: true,
        category: 'Smartphones & Apple',
        categoryId: 'cat-1',
        Category: { id: 'cat-1', name: 'Smartphones & Apple' },
        images: [
            'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Écran: '6.1" Super Retina XDR OLED 120Hz',
            Processeur: 'Apple A17 Pro',
            Stockage: '128 Go',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Très satisfait, commande reçue à Mermoz.',
                user: { name: 'Cheikh Ndiaye' },
            },
        ],
        createdAt: '2026-08-05T10:00:00Z',
    },
    {
        id: 'julo-iphone-13',
        name: 'iPhone 13 128GB — Bleu Nuit',
        description:
            'Le best-seller Apple au Sénégal : double appareil photo diagonal 12 MP avec mode Cinématique, puce A15 Bionic ultra-rapide, écran Super Retina XDR 6.1" lumineux et excellente autonomie.',
        mrp: 420000,
        price: 360000,
        stock: 12,
        inStock: true,
        category: 'Smartphones & Apple',
        categoryId: 'cat-1',
        Category: { id: 'cat-1', name: 'Smartphones & Apple' },
        images: [
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Écran: '6.1" OLED Super Retina XDR',
            Processeur: 'A15 Bionic',
            Stockage: '128 Go',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Excellent rapport qualité prix à Dakar.',
                user: { name: 'Fatou Kiné' },
            },
        ],
        createdAt: '2026-08-08T10:00:00Z',
    },

    // ==========================================
    // 2. SAMSUNG GALAXY
    // ==========================================
    {
        id: 'julo-samsung-s24-ultra',
        name: 'Samsung Galaxy S24 Ultra 512GB — Titanium Black',
        description:
            'L’expérience Galaxy Ultime avec Galaxy AI intégrée (traduction instantanée des appels, retouche photo intelligente). Cadre en titane résistant, stylet S-Pen inclus, processeur Snapdragon 8 Gen 3 for Galaxy et capteur photo 200 MP.',
        mrp: 980000,
        price: 890000,
        stock: 5,
        inStock: true,
        category: 'Samsung Galaxy',
        categoryId: 'cat-2',
        Category: { id: 'cat-2', name: 'Samsung Galaxy' },
        images: [
            'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Écran: '6.8" Dynamic AMOLED 2X QHD+ 120Hz (2600 nits)',
            Processeur: 'Snapdragon 8 Gen 3 for Galaxy',
            'RAM / Stockage': '12 Go / 512 Go',
            'Appareil Photo': '200 MP + 50 MP (5x) + 10 MP (3x) + 12 MP',
            Batterie: '5000 mAh charge 45W',
            Garantie: '24 mois officielle Samsung Sénégal',
        },
        rating: [
            {
                rating: 5,
                review: 'Le S-Pen et la batterie sont incroyables.',
                user: { name: 'Ousmane Fall' },
            },
        ],
        createdAt: '2026-08-02T10:00:00Z',
    },
    {
        id: 'julo-samsung-a55-5g',
        name: 'Samsung Galaxy A55 5G 256GB / 8GB RAM — Awesome Iceblue',
        description:
            'Le smartphone milieu de gamme premium le plus populaire au Sénégal. Châssis métallique en aluminium, dos en verre Gorilla Glass Victus+, écran Super AMOLED 120Hz 6.6", triple capteur 50 MP avec stabilisation OIS et batterie 5000 mAh.',
        mrp: 295000,
        price: 260000,
        stock: 14,
        inStock: true,
        category: 'Samsung Galaxy',
        categoryId: 'cat-2',
        Category: { id: 'cat-2', name: 'Samsung Galaxy' },
        images: ['/product-placeholder.png'],
        specs: {
            Écran: '6.6" Super AMOLED FHD+ 120Hz',
            Processeur: 'Exynos 1480 avec GPU AMD RDNA',
            'RAM / Stockage': '8 Go / 256 Go (extensible microSD)',
            Batterie: '5000 mAh (2 jours d’autonomie)',
            Étanchéité: 'IP67 résistant à l’eau et poussière',
            Garantie: '24 mois Samsung Sénégal',
        },
        rating: [
            {
                rating: 5,
                review: 'Superbe téléphone avec finition métal.',
                user: { name: 'Ibrahima Sarr' },
            },
        ],
        createdAt: '2026-08-10T10:00:00Z',
    },
    {
        id: 'julo-samsung-a15-128gb',
        name: 'Samsung Galaxy A15 128GB / 6GB RAM — Bleu Nuit',
        description:
            'Écran Super AMOLED 90Hz éclatant de 6.5 pouces avec technologie Vision Booster, triple caméra 50 MP, processeur octa-core fluide et batterie 5000 mAh avec charge 25W.',
        mrp: 130000,
        price: 110000,
        stock: 20,
        inStock: true,
        category: 'Samsung Galaxy',
        categoryId: 'cat-2',
        Category: { id: 'cat-2', name: 'Samsung Galaxy' },
        images: ['/product-placeholder.png'],
        specs: {
            Écran: '6.5" Super AMOLED 90Hz FHD+',
            'RAM / Stockage': '6 Go / 128 Go',
            'Appareil Photo': '50 MP + 5 MP + 2 MP',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Très bon prix pour un écran AMOLED Samsung.',
                user: { name: 'Mame Diarra' },
            },
        ],
        createdAt: '2026-08-11T10:00:00Z',
    },
    {
        id: 'julo-samsung-a05s-64gb',
        name: 'Samsung Galaxy A05s 64GB / 4GB RAM — Noir',
        description:
            'Grand écran 6.7 pouces FHD+ 90Hz, processeur Qualcomm Snapdragon 680 rapide, triple capteur photo 50 MP, prise jack 3.5mm et batterie 5000 mAh.',
        mrp: 90000,
        price: 75000,
        stock: 25,
        inStock: true,
        category: 'Samsung Galaxy',
        categoryId: 'cat-2',
        Category: { id: 'cat-2', name: 'Samsung Galaxy' },
        images: ['/product-placeholder.png'],
        specs: {
            Écran: '6.7" PLS LCD FHD+ 90Hz',
            Processeur: 'Qualcomm Snapdragon 680',
            'RAM / Stockage': '4 Go / 64 Go',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Idéal pour le quotidien à petit prix.',
                user: { name: 'Abdoulaye Guèye' },
            },
        ],
        createdAt: '2026-08-12T10:00:00Z',
    },

    // ==========================================
    // 3. TECNO, INFINIX & ITEL (LES PLUS POPULAIRES AU SÉNÉGAL)
    // ==========================================
    {
        id: 'julo-tecno-camon-30-pro-5g',
        name: 'Tecno Camon 30 Pro 5G 512GB / 12GB RAM (+12GB Virtuels) — Noir Galaxie',
        description:
            'Monstre de photographie et de puissance : capteur Sony IMX890 50 MP avec stabilisation OIS, caméra selfie 50 MP autofocus avec flash double ton, processeur MediaTek Dimensity 8200 Ultimate 5G, écran AMOLED 144Hz 6.78" et charge ultra-rapide 70W.',
        mrp: 280000,
        price: 245000,
        stock: 10,
        inStock: true,
        category: 'Tecno, Infinix & Itel',
        categoryId: 'cat-3',
        Category: { id: 'cat-3', name: 'Tecno, Infinix & Itel' },
        images: [
            'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Écran: '6.78" AMOLED 1.5K 144Hz',
            Processeur: 'MediaTek Dimensity 8200 Ultimate (4 nm)',
            'RAM / Stockage': '12 Go (+12 Go Fusion) / 512 Go',
            Photo: '50 MP Sony IMX890 OIS + 50 MP Ultra Large + 2 MP Profondeur | Selfie 50 MP',
            Batterie: '5000 mAh avec charge 70W (0 à 100% en 45 min)',
            Audio: 'Haut-parleurs stéréo Dolby Atmos',
            Garantie: '13 mois officielle Carlcare Sénégal',
        },
        rating: [
            {
                rating: 5,
                review: 'La qualité des photos de nuit est exceptionnelle !',
                user: { name: 'Mor Talla' },
            },
            {
                rating: 5,
                review: '512 Go de stockage à ce prix, c’est imbattable.',
                user: { name: 'Saliou Diouf' },
            },
        ],
        createdAt: '2026-08-03T10:00:00Z',
    },
    {
        id: 'julo-tecno-spark-20-pro-plus',
        name: 'Tecno Spark 20 Pro+ 256GB / 8GB RAM (+8GB Fusion) — Vert Cuir Magique',
        description:
            'Design incurvé d’une finesse remarquable avec dos en cuir végan écologique. Écran incurvé AMOLED 120Hz 6.78", capteur principal 108 MP ultra-clair, processeur Helio G99 Ultimate et batterie 5000 mAh avec charge 33W.',
        mrp: 155000,
        price: 135000,
        stock: 18,
        inStock: true,
        category: 'Tecno, Infinix & Itel',
        categoryId: 'cat-3',
        Category: { id: 'cat-3', name: 'Tecno, Infinix & Itel' },
        images: ['/product-placeholder.png'],
        specs: {
            Écran: '6.78" AMOLED Incurvé 120Hz Gorilla Glass 5',
            Processeur: 'MediaTek Helio G99 Ultimate 6nm',
            'RAM / Stockage': '8 Go (+8 Go) / 256 Go',
            Caméra: '108 MP Ultra Sensing + 32 MP Selfie avec Flash',
            Garantie: '13 mois Carlcare Sénégal',
        },
        rating: [
            {
                rating: 5,
                review: 'L’écran incurvé donne un look très luxueux.',
                user: { name: 'Ndeye Fatou' },
            },
        ],
        createdAt: '2026-08-04T10:00:00Z',
    },
    {
        id: 'julo-infinix-note-40-pro',
        name: 'Infinix Note 40 Pro 256GB / 8GB RAM — Vintage Green',
        description:
            'Technologie All-Round FastCharge 2.0 avec charge filaire 70W et charge sans fil magnétique MagCharge 20W (chargeur sans fil inclus). Écran incurvé AMOLED 120Hz, capteur photo 108 MP OIS avec zoom 3x sans perte et halo lumineux intelligent Active Halo.',
        mrp: 200000,
        price: 175000,
        stock: 12,
        inStock: true,
        category: 'Tecno, Infinix & Itel',
        categoryId: 'cat-3',
        Category: { id: 'cat-3', name: 'Tecno, Infinix & Itel' },
        images: ['/product-placeholder.png'],
        specs: {
            Écran: '6.78" 3D Curved AMOLED 120Hz (1300 nits)',
            Processeur: 'MediaTek Helio G99 Ultimate',
            'RAM / Stockage': '8 Go (+8 Go) / 256 Go',
            Charge: '70W filaire + 20W MagCharge sans fil',
            Son: 'Double haut-parleur stéréo réglé par JBL',
            Garantie: '13 mois Carlcare Sénégal',
        },
        rating: [
            {
                rating: 5,
                review: 'Le son JBL et la charge magnétique sont parfaits.',
                user: { name: 'Pape Demba' },
            },
        ],
        createdAt: '2026-08-06T10:00:00Z',
    },
    {
        id: 'julo-infinix-hot-40-pro',
        name: 'Infinix Hot 40 Pro 256GB / 8GB RAM — Horizon Gold',
        description:
            'Conçu pour le gaming et la fluidité avec moteur XBOOST, écran 120Hz FHD+ 6.78" avec Magic Ring interactive, caméra 108 MP avec mode nuit super-nuit et batterie 5000 mAh 33W Fast Charge.',
        mrp: 135000,
        price: 115000,
        stock: 15,
        inStock: true,
        category: 'Tecno, Infinix & Itel',
        categoryId: 'cat-3',
        Category: { id: 'cat-3', name: 'Tecno, Infinix & Itel' },
        images: ['/product-placeholder.png'],
        specs: {
            Écran: '6.78" FHD+ 120Hz Magic Ring',
            'RAM / Stockage': '8 Go / 256 Go',
            'Appareil Photo': '108 MP Triple Caméra',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Très bon pour Free Fire et TikTok.',
                user: { name: 'Babacar Ndao' },
            },
        ],
        createdAt: '2026-08-07T10:00:00Z',
    },
    {
        id: 'julo-itel-s24-256gb',
        name: 'Itel S24 256GB / 8GB RAM (+8GB Virtuels) — Blanc Miroir',
        description:
            'La révolution itel : capteur photo ISOCELL 108 MP dans un smartphone ultra-accessible. Dos à changement de couleur sous les rayons UV du soleil, écran 90Hz Punch-Hole 6.6", processeur Helio G91 et batterie 5000 mAh avec charge 18W.',
        mrp: 100000,
        price: 85000,
        stock: 22,
        inStock: true,
        category: 'Tecno, Infinix & Itel',
        categoryId: 'cat-3',
        Category: { id: 'cat-3', name: 'Tecno, Infinix & Itel' },
        images: ['/product-placeholder.png'],
        specs: {
            Écran: '6.6" HD+ 90Hz Punch-hole avec Dynamic Bar',
            Processeur: 'MediaTek Helio G91',
            'RAM / Stockage': '8 Go (+8 Go) / 256 Go',
            Caméra: '108 MP Ultra Clear avec Zoom 3x',
            Garantie: '12 mois Carlcare',
        },
        rating: [
            {
                rating: 5,
                review: '108 MP et 256 Go à moins de 90.000 F, bravo itel !',
                user: { name: 'Aminata Touré' },
            },
        ],
        createdAt: '2026-08-08T10:00:00Z',
    },
    {
        id: 'julo-itel-a70-128gb',
        name: 'Itel A70 128GB / 4GB RAM (+8GB Fusion) — Noir Brillant',
        description:
            'Le smartphone le plus vendu pour les budgets malins au Sénégal. Grand écran 6.6 pouces avec barre dynamique interactive, mémoire généreuse de 128 Go, double caméra IA 13 MP, lecteur d’empreintes latéral et batterie géante 5000 mAh.',
        mrp: 65000,
        price: 55000,
        stock: 30,
        inStock: true,
        category: 'Tecno, Infinix & Itel',
        categoryId: 'cat-3',
        Category: { id: 'cat-3', name: 'Tecno, Infinix & Itel' },
        images: ['/product-placeholder.png'],
        specs: {
            Écran: '6.6" Big Screen Dynamic Bar',
            'RAM / Stockage': '4 Go / 128 Go (support carte SD jusqu’à 2 To)',
            Batterie: '5000 mAh Type-C',
            Sécurité: 'Lecteur d’empreintes + Reconnaissance faciale',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Acheté pour ma mère, très simple et super autonomie.',
                user: { name: 'Moussa Seck' },
            },
        ],
        createdAt: '2026-08-09T10:00:00Z',
    },
    {
        id: 'julo-itel-super-guru-4g',
        name: 'Itel Super Guru 4G — Téléphone à Touches Ultra-Durable',
        description:
            'Le roi de la batterie et de la robustesse. Connectivité 4G VoLTE pour des appels d’une clarté cristalline, radio FM sans fil sans écouteurs, lampe torche puissante, haut-parleur puissant et batterie 2000 mAh durant jusqu’à 10 jours en veille.',
        mrp: 23000,
        price: 18000,
        stock: 40,
        inStock: true,
        category: 'Tecno, Infinix & Itel',
        categoryId: 'cat-3',
        Category: { id: 'cat-3', name: 'Tecno, Infinix & Itel' },
        images: ['/product-placeholder.png'],
        specs: {
            Connectivité: '4G VoLTE Double SIM',
            Écran: '2.4" Écran Couleur QVGA',
            Batterie: '2000 mAh (autonomie 10 jours)',
            Fonctions: 'Radio FM sans fil, Torche LED, Lecteur MP3/MP4, Bluetooth',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Indestructible, parfait comme second téléphone pour Orange Money et Wave.',
                user: { name: 'Lamine Cissé' },
            },
        ],
        createdAt: '2026-08-10T10:00:00Z',
    },

    // ==========================================
    // 4. XIAOMI & REDMI
    // ==========================================
    {
        id: 'julo-redmi-note-13-pro-plus-5g',
        name: 'Xiaomi Redmi Note 13 Pro+ 5G 512GB / 12GB RAM — Noir Minuit',
        description:
            'Le haut de gamme Redmi : capteur photo 200 MP avec stabilisation optique OIS, écran incurvé AMOLED 1.5K 120Hz Gorilla Glass Victus, certification IP68 étanche à l’eau et charge fulgurante 120W HyperCharge (100% en 19 minutes).',
        mrp: 320000,
        price: 285000,
        stock: 8,
        inStock: true,
        category: 'Xiaomi & Redmi',
        categoryId: 'cat-4',
        Category: { id: 'cat-4', name: 'Xiaomi & Redmi' },
        images: [
            'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Écran: '6.67" Curved AMOLED 1.5K 120Hz (1800 nits) Dolby Vision',
            Processeur: 'MediaTek Dimensity 7200-Ultra (4 nm)',
            'RAM / Stockage': '12 Go LPDDR5 / 512 Go UFS 3.1',
            Charge: '120W HyperCharge (chargeur 120W inclus)',
            Étanchéité: 'IP68 certifié résistant à l’eau et poussière',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'La charge 120W change la vie, 19 minutes chrono !',
                user: { name: 'Modou Lo' },
            },
        ],
        createdAt: '2026-08-04T10:00:00Z',
    },
    {
        id: 'julo-redmi-13c-128gb',
        name: 'Xiaomi Redmi 13C 128GB / 6GB RAM — Bleu Trèfle',
        description:
            'Écran fluide 90Hz de 6.74 pouces avec protection oculaire TÜV, processeur octa-core MediaTek Helio G85, triple caméra IA 50 MP, design fin 8.09 mm et batterie 5000 mAh avec charge rapide 18W.',
        mrp: 90000,
        price: 75000,
        stock: 20,
        inStock: true,
        category: 'Xiaomi & Redmi',
        categoryId: 'cat-4',
        Category: { id: 'cat-4', name: 'Xiaomi & Redmi' },
        images: ['/product-placeholder.png'],
        specs: {
            Écran: '6.74" 90Hz HD+ Corning Gorilla Glass',
            Processeur: 'MediaTek Helio G85',
            'RAM / Stockage': '6 Go / 128 Go',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Très fluide pour WhatsApp, YouTube et Facebook.',
                user: { name: 'Khady Diop' },
            },
        ],
        createdAt: '2026-08-05T10:00:00Z',
    },

    // ==========================================
    // 5. ORDINATEURS & PC PORTABLES
    // ==========================================
    {
        id: 'julo-macbook-pro-m3-pro',
        name: 'MacBook Pro 14" M3 Pro 18GB / 512GB SSD — Noir Sidéral',
        description:
            'La machine de référence pour les développeurs, créateurs et monteurs vidéo à Dakar. Puce Apple M3 Pro (CPU 11 cœurs, GPU 14 cœurs), 18 Go de mémoire unifiée haute vitesse et écran Liquid Retina XDR aux contrastes infinis (1600 nits). Autonomie record jusqu’à 18 heures.',
        mrp: 1750000,
        price: 1590000,
        stock: 4,
        inStock: true,
        category: 'Ordinateurs & PC',
        categoryId: 'cat-5',
        Category: { id: 'cat-5', name: 'Ordinateurs & PC' },
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Écran: '14.2" Liquid Retina XDR (3024 x 1964) ProMotion 120Hz',
            Processeur: 'Apple M3 Pro (CPU 11 cœurs, GPU 14 cœurs)',
            'Mémoire / SSD': '18 Go RAM / 512 Go SSD',
            Clavier: 'Magic Keyboard AZERTY français rétroéclairé avec Touch ID',
            Garantie: '1 an Apple International',
        },
        rating: [
            {
                rating: 5,
                review: 'Indispensable pour coder en React/Next.js sans aucun ralentissement.',
                user: { name: 'Alioune Badara' },
            },
        ],
        createdAt: '2026-08-01T10:00:00Z',
    },
    {
        id: 'julo-macbook-air-m2',
        name: 'MacBook Air 13" M2 8GB / 256GB SSD — Minuit',
        description:
            'Châssis ultra-fin en aluminium 1.24 kg, écran Liquid Retina 13.6", autonomie de 18 heures sans aucun bruit de ventilateur et caméra FaceTime HD 1080p.',
        mrp: 890000,
        price: 790000,
        stock: 7,
        inStock: true,
        category: 'Ordinateurs & PC',
        categoryId: 'cat-5',
        Category: { id: 'cat-5', name: 'Ordinateurs & PC' },
        images: [
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Écran: '13.6" Liquid Retina (2560 x 1664)',
            Puce: 'Apple M2 8-core CPU / 8-core GPU',
            'Mémoire / SSD': '8 Go RAM / 256 Go SSD',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Parfait pour le travail et les études.',
                user: { name: 'Coumba Kane' },
            },
        ],
        createdAt: '2026-08-02T10:00:00Z',
    },
    {
        id: 'julo-hp-elitebook-840-g10',
        name: 'HP EliteBook 840 G10 Intel Core i7 16GB / 512GB SSD — Argent',
        description:
            'PC professionnel haut de gamme avec boîtier en aluminium brossé ultra-résistant. Processeur Intel Core i7 13th Gen, 16 Go de RAM DDR5, écran 14" IPS antireflet et lecteur d’empreintes digitales.',
        mrp: 650000,
        price: 575000,
        stock: 6,
        inStock: true,
        category: 'Ordinateurs & PC',
        categoryId: 'cat-5',
        Category: { id: 'cat-5', name: 'Ordinateurs & PC' },
        images: [
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Processeur: 'Intel Core i7-1355U (10 cœurs jusqu’à 5.0 GHz)',
            'Mémoire / SSD': '16 Go DDR5 / 512 Go SSD PCIe NVMe',
            Écran: '14.0" IPS Full HD (1920x1200) 400 nits',
            Garantie: '1 an',
        },
        rating: [
            {
                rating: 5,
                review: 'Qualité HP EliteBook au rendez-vous.',
                user: { name: 'Serigne Fallou' },
            },
        ],
        createdAt: '2026-08-03T10:00:00Z',
    },
    {
        id: 'julo-lenovo-thinkpad-t14s',
        name: 'Lenovo ThinkPad T14s Gen 4 Intel Core i5 16GB / 512GB SSD',
        description:
            'La légendaire robustesse militaire ThinkPad (norme MIL-STD-810H). Clavier ergonomique primé, autonomie marathon, écran 14" IPS WUXGA et connectique complète (Thunderbolt 4, HDMI, USB-A).',
        mrp: 540000,
        price: 480000,
        stock: 8,
        inStock: true,
        category: 'Ordinateurs & PC',
        categoryId: 'cat-5',
        Category: { id: 'cat-5', name: 'Ordinateurs & PC' },
        images: ['/product-placeholder.png'],
        specs: {
            Processeur: 'Intel Core i5-1335U vPro',
            'RAM / SSD': '16 Go LPDDR5x / 512 Go SSD M.2',
            Sécurité: 'TrackPoint, lecteur d’empreinte et cache caméra ThinkShutter',
            Garantie: '1 an',
        },
        rating: [
            {
                rating: 5,
                review: 'Le meilleur clavier pour taper des rapports et du code.',
                user: { name: 'Abdou Aziz' },
            },
        ],
        createdAt: '2026-08-04T10:00:00Z',
    },
    {
        id: 'julo-asus-tuf-gaming-a15',
        name: 'Asus TUF Gaming A15 AMD Ryzen 7 / RTX 4060 16GB / 1TB SSD',
        description:
            'Pour les gamers, architectes 3D et créateurs multimédia. Processeur AMD Ryzen 7 7735HS, carte graphique dédiée NVIDIA GeForce RTX 4060 8GB GDDR6, écran 15.6" 144Hz FHD et refroidissement anti-poussière.',
        mrp: 890000,
        price: 790000,
        stock: 4,
        inStock: true,
        category: 'Ordinateurs & PC',
        categoryId: 'cat-5',
        Category: { id: 'cat-5', name: 'Ordinateurs & PC' },
        images: [
            'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Processeur: 'AMD Ryzen 7 7735HS (8 cœurs / 16 threads)',
            'Carte Graphique': 'NVIDIA GeForce RTX 4060 8 Go GDDR6 (140W TGP)',
            'RAM / SSD': '16 Go DDR5 4800MHz / 1 To SSD NVMe',
            Écran: '15.6" IPS 144Hz 100% sRGB G-Sync',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Fait tourner GTA V, FIFA 24 et Premiere Pro sans broncher.',
                user: { name: 'Ousseynou Diakhaté' },
            },
        ],
        createdAt: '2026-08-05T10:00:00Z',
    },

    // ==========================================
    // 6. AUDIO, ENCEINTES & ORAIMO
    // ==========================================
    {
        id: 'julo-oraimo-freepods-4',
        name: 'Oraimo FreePods 4 Écouteurs Sans Fil ANC & Basses Lourdes',
        description:
            'Les écouteurs sans fil les plus populaires au Sénégal : Réduction active du bruit (ANC), technologie HavyBass pour des basses percutantes, 35.5 heures d’autonomie totale, application Oraimo Sound pour personnaliser l’égaliseur et étanchéité IPX5.',
        mrp: 32000,
        price: 25000,
        stock: 35,
        inStock: true,
        category: 'Audio, Enceintes & Oraimo',
        categoryId: 'cat-6',
        Category: { id: 'cat-6', name: 'Audio, Enceintes & Oraimo' },
        images: ['/product-placeholder.png'],
        specs: {
            Autonomie: '8.5h d’écoute continue + 27h avec boîtier de charge',
            'Réduction du bruit': 'ANC jusqu’à 30 dB + 4 micros antibruit d’appel',
            Connectivité: 'Bluetooth 5.2 avec mode jeu à faible latence',
            Garantie: '12 mois officielle Oraimo Sénégal',
        },
        rating: [
            {
                rating: 5,
                review: 'Son très puissant, les basses sont bien lourdes comme on aime.',
                user: { name: 'Moussa Diop' },
            },
            {
                rating: 5,
                review: 'Batterie increvable pour le prix.',
                user: { name: 'Seydou Kane' },
            },
        ],
        createdAt: '2026-08-01T10:00:00Z',
    },
    {
        id: 'julo-oraimo-boompop-2',
        name: 'Oraimo BoomPop 2 Casque Bluetooth Sans Fil Basses Électrisantes',
        description:
            'Casque circum-auriculaire pliable ultra-confortable avec arceau rembourré. Autonomie monstre de 60 heures d’écoute, haut-parleurs 40 mm avec algorithme HavyBass et prise d’appel mains-libres HD.',
        mrp: 28000,
        price: 22000,
        stock: 25,
        inStock: true,
        category: 'Audio, Enceintes & Oraimo',
        categoryId: 'cat-6',
        Category: { id: 'cat-6', name: 'Audio, Enceintes & Oraimo' },
        images: ['/product-placeholder.png'],
        specs: {
            Autonomie: '60 heures de musique non-stop (charge rapide Type-C)',
            'Haut-parleurs': '40 mm Bass Boost Drivers',
            Connectique: 'Bluetooth 5.3 + Câble Jack 3.5mm inclus',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Très confortable pour les longs trajets et le sport.',
                user: { name: 'Mariama Ba' },
            },
        ],
        createdAt: '2026-08-02T10:00:00Z',
    },
    {
        id: 'julo-jbl-flip-6',
        name: 'JBL Flip 6 Enceinte Portable Bluetooth Étanche IP67 — Noir',
        description:
            'Le son JBL Original Pro puissant et limpide dans un format compact. Système de haut-parleurs à 2 voies (woofer pour les basses et tweeter séparé pour les aigus), 12 heures d’autonomie et résistance totale à l’eau et à la poussière IP67.',
        mrp: 98000,
        price: 85000,
        stock: 10,
        inStock: true,
        category: 'Audio, Enceintes & Oraimo',
        categoryId: 'cat-6',
        Category: { id: 'cat-6', name: 'Audio, Enceintes & Oraimo' },
        images: [
            'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Puissance: '30 Watts RMS (20W Woofer + 10W Tweeter)',
            Autonomie: '12 heures de lecture continue',
            Étanchéité: 'IP67 étanche à l’eau et la poussière (idéal plage & piscine)',
            Fonction: 'PartyBoost pour coupler plusieurs enceintes JBL',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Idéal pour animer les après-midis à la plage de Ngor.',
                user: { name: 'Assane Gueye' },
            },
        ],
        createdAt: '2026-08-03T10:00:00Z',
    },
    {
        id: 'julo-airpods-pro-2-usbc',
        name: 'Apple AirPods Pro (2ᵉ génération) avec boîtier MagSafe USB-C',
        description:
            'Puce H2 offrant une réduction active du bruit 2x plus efficace, mode Transparence adaptative et Audio spatial personnalisé avec suivi dynamique de la tête.',
        mrp: 210000,
        price: 185000,
        stock: 12,
        inStock: true,
        category: 'Audio, Enceintes & Oraimo',
        categoryId: 'cat-6',
        Category: { id: 'cat-6', name: 'Audio, Enceintes & Oraimo' },
        images: [
            'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Puce: 'Apple H2 + U1 dans le boîtier',
            Autonomie: '30 heures avec boîtier MagSafe USB-C',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'La référence absolue sur iPhone.',
                user: { name: 'Mouhamed Lamine' },
            },
        ],
        createdAt: '2026-08-04T10:00:00Z',
    },
    {
        id: 'julo-sony-wh-1000xm5',
        name: 'Sony WH-1000XM5 Casque Bluetooth Sans Fil Réduction de Bruit — Noir',
        description:
            'Le roi mondial du silence et de la haute fidélité audio avec 8 microphones et 2 processeurs dédiés (V1 et QN1). Codec LDAC Hi-Res Wireless et 30 heures d’autonomie.',
        mrp: 285000,
        price: 245000,
        stock: 6,
        inStock: true,
        category: 'Audio, Enceintes & Oraimo',
        categoryId: 'cat-6',
        Category: { id: 'cat-6', name: 'Audio, Enceintes & Oraimo' },
        images: [
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Autonomie: '30 heures avec ANC activé',
            Son: 'Hi-Res Audio LDAC',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Silence absolu même dans les bruits de circulation à Dakar.',
                user: { name: 'El Hadji Diop' },
            },
        ],
        createdAt: '2026-08-05T10:00:00Z',
    },

    // ==========================================
    // 7. ACCESSOIRES, GAN & ÉNERGIE
    // ==========================================
    {
        id: 'julo-gan-charger-65w',
        name: 'Chargeur Rapide GaN 65W 3 Ports (2x USB-C + USB-A)',
        description:
            'Technologie au nitrure de gallium (GaN III) compacte et ultra-efficace. Délivre 65W Power Delivery pour recharger simultanément un MacBook Pro, un iPhone, un Samsung ou un Tecno sans surchauffe.',
        mrp: 35000,
        price: 25000,
        stock: 30,
        inStock: true,
        category: 'Accessoires & Énergie',
        categoryId: 'cat-7',
        Category: { id: 'cat-7', name: 'Accessoires & Énergie' },
        images: [
            'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Puissance: '65W Power Delivery 3.0 / Quick Charge 4+',
            Ports: '2x USB-C + 1x USB-A',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Charge mon PC et mes deux téléphones en même temps.',
                user: { name: 'Bassirou Sène' },
            },
        ],
        createdAt: '2026-08-01T10:00:00Z',
    },
    {
        id: 'julo-oraimo-powerbank-20000',
        name: 'Batterie Externe Oraimo Toast 20 000 mAh 22.5W Fast Charge',
        description:
            'La batterie externe incontournable au Sénégal : capacité géante de 20 000 mAh permettant de recharger 4 à 5 fois un smartphone, technologie AniFast 22.5W compatible iPhone, Samsung et Tecno, torche LED intégrée et affichage LED du niveau.',
        mrp: 25000,
        price: 18000,
        stock: 45,
        inStock: true,
        category: 'Accessoires & Énergie',
        categoryId: 'cat-7',
        Category: { id: 'cat-7', name: 'Accessoires & Énergie' },
        images: ['/product-placeholder.png'],
        specs: {
            Capacité: '20 000 mAh (74 Wh)',
            Sortie: '22.5W Max Type-C bidirectionnel + 2x USB-A',
            Sécurité: 'Multi-protection contre surtensions et décharges',
            Garantie: '12 mois Oraimo',
        },
        rating: [
            {
                rating: 5,
                review: 'Essentielle en cas de coupure de courant ou de voyage en région.',
                user: { name: 'Doudou Ndiaye' },
            },
        ],
        createdAt: '2026-08-02T10:00:00Z',
    },
    {
        id: 'julo-anker-maggo-powerbank',
        name: 'Batterie MagSafe Anker Qi2 10 000 mAh 15W Sans Fil avec Écran LCD',
        description:
            'Batterie magnétique officielle Qi2 15W avec écran numérique indiquant le temps restant et béquille pliable pour poser votre iPhone sur votre bureau.',
        mrp: 55000,
        price: 45000,
        stock: 15,
        inStock: true,
        category: 'Accessoires & Énergie',
        categoryId: 'cat-7',
        Category: { id: 'cat-7', name: 'Accessoires & Énergie' },
        images: ['/product-placeholder.png'],
        specs: {
            Capacité: '10 000 mAh',
            'Charge sans fil': '15W certifié Qi2',
            Garantie: '12 mois',
        },
        rating: [
            { rating: 5, review: 'Super produit haut de gamme.', user: { name: 'Mame Diarra' } },
        ],
        createdAt: '2026-08-03T10:00:00Z',
    },
    {
        id: 'julo-ringlight-18-pouces',
        name: 'Kit Ring Light 18 Pouces (45 cm) avec Trépied Professionnel 2m10',
        description:
            'Le kit indispensable pour les créateurs de contenu, influenceurs, coiffeurs, maquilleurs et vendeurs en direct TikTok/Instagram à Dakar. Diamètre 45 cm, réglage de température de couleur (3200K - 5600K), télécommande sans fil et 3 supports smartphones orientables.',
        mrp: 45000,
        price: 35000,
        stock: 20,
        inStock: true,
        category: 'Accessoires & Énergie',
        categoryId: 'cat-7',
        Category: { id: 'cat-7', name: 'Accessoires & Énergie' },
        images: ['/product-placeholder.png'],
        specs: {
            Diamètre: '18 pouces (45 cm) LED 55W',
            Trépied: 'Hauteur réglable de 70 cm à 2m10',
            Accessoires: 'Télécommande sans fil, sac de transport, 3 supports téléphones',
            Garantie: '6 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Éclairage parfait pour mes vidéos TikTok et mes lives.',
                user: { name: 'Awa Mbaye' },
            },
        ],
        createdAt: '2026-08-04T10:00:00Z',
    },
    {
        id: 'julo-cable-3en1-renforce',
        name: 'Câble de Charge Rapide 3-en-1 Tressé Renforcé (Type-C + Lightning + Micro-USB)',
        description:
            'Un seul câble pour recharger tous vos appareils : iPhone, Samsung, Tecno et petits accessoires. Nylon tressé militaire anti-nœud avec embouts en alliage d’aluminium résistants aux torsions répétées.',
        mrp: 10000,
        price: 6000,
        stock: 60,
        inStock: true,
        category: 'Accessoires & Énergie',
        categoryId: 'cat-7',
        Category: { id: 'cat-7', name: 'Accessoires & Énergie' },
        images: ['/product-placeholder.png'],
        specs: {
            Connecteurs: '1x USB-A vers 1x USB-C + 1x Lightning + 1x Micro-USB',
            Longueur: '1.2 mètre',
            Courant: '3.5A Fast Charging',
        },
        rating: [
            {
                rating: 5,
                review: 'Très pratique dans la voiture et à la maison.',
                user: { name: 'Omar Sylla' },
            },
        ],
        createdAt: '2026-08-05T10:00:00Z',
    },

    // ==========================================
    // 8. MONTRES CONNECTÉES & WEARABLES
    // ==========================================
    {
        id: 'julo-apple-watch-series-9',
        name: 'Apple Watch Series 9 GPS 45mm Boîtier Aluminium Minuit',
        description:
            'La montre connectée la plus puissante avec puce S9 SiP, écran bord à bord Retina toujours activé éclatant (2000 nits), geste Toucher deux fois (Double Tap) sans toucher l’écran, capteurs de santé avancés (ECG, taux d’oxygène SpO2, suivi du sommeil) et détection des accidents.',
        mrp: 290000,
        price: 255000,
        stock: 8,
        inStock: true,
        category: 'Montres & Wearables',
        categoryId: 'cat-8',
        Category: { id: 'cat-8', name: 'Montres & Wearables' },
        images: [
            'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Boîtier: '45 mm Aluminium Minuit avec bracelet Sport',
            Puce: 'Apple S9 SiP avec Neural Engine 4 cœurs',
            Fonctions: 'ECG, SpO2, Double Tap, Siri embarqué ultra-rapide',
            Autonomie: '18h en usage standard / 36h en mode économie',
            Garantie: '12 mois Apple',
        },
        rating: [
            {
                rating: 5,
                review: 'Magnifique montre, le double tap est super pratique.',
                user: { name: 'Ibrahima Fall' },
            },
        ],
        createdAt: '2026-08-01T12:00:00Z',
    },
    {
        id: 'julo-samsung-galaxy-watch-6',
        name: 'Samsung Galaxy Watch 6 Classic 47mm Lunette Tournante — Noir',
        description:
            'Design intemporel en acier inoxydable avec la fameuse lunette tournante physique. Écran Super AMOLED Sapphire Crystal, analyse détaillée de la composition corporelle BIA (masse musculaire, graisse), suivi avancé du sommeil et suivi d’entraînements.',
        mrp: 230000,
        price: 195000,
        stock: 10,
        inStock: true,
        category: 'Montres & Wearables',
        categoryId: 'cat-8',
        Category: { id: 'cat-8', name: 'Montres & Wearables' },
        images: ['/product-placeholder.png'],
        specs: {
            Écran: '1.5" Super AMOLED 480x480 Always-On Display',
            Matériaux: 'Acier inoxydable + Verre Cristal de Saphir résistant aux rayures',
            Capteurs: 'Capteur Samsung BioActive (Fréquence cardiaque + ECG + BIA)',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Parfaite avec mon Galaxy S24 Ultra. Lunette tournante très fluide.',
                user: { name: 'Cheikh Sarr' },
            },
        ],
        createdAt: '2026-08-02T12:00:00Z',
    },
    {
        id: 'julo-oraimo-watch-4-plus',
        name: 'Oraimo Watch 4 Plus Écran HD 2.01" & Appels Bluetooth Clairs',
        description:
            'La montre connectée la plus accessible et complète : grand écran tactile HD de 2.01 pouces très lumineux, microphone et haut-parleur intégrés pour répondre à vos appels directement depuis votre poignet, 100+ modes sportifs, suivi de santé 24/7 et 7 jours d’autonomie.',
        mrp: 30000,
        price: 22000,
        stock: 35,
        inStock: true,
        category: 'Montres & Wearables',
        categoryId: 'cat-8',
        Category: { id: 'cat-8', name: 'Montres & Wearables' },
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80',
        ],
        specs: {
            Écran: '2.01" TFT HD 240x282 pixels',
            Appels: 'Appels Bluetooth sans fil avec réduction du bruit ambiant',
            Autonomie: 'Jusqu’à 7 jours d’utilisation continue',
            Étanchéité: 'IP68 résistant à la sueur et la pluie',
            Garantie: '12 mois Oraimo Sénégal',
        },
        rating: [
            {
                rating: 5,
                review: 'On entend super bien les appels au téléphone. Rapport qualité/prix imbattable.',
                user: { name: 'Fatou Bintou' },
            },
        ],
        createdAt: '2026-08-03T12:00:00Z',
    },
    {
        id: 'julo-xiaomi-smart-band-8-active',
        name: 'Xiaomi Smart Band 8 Active Bracelet Connecté Ultra-Léger — Noir',
        description:
            'Bracelet d’activité compact avec écran TFT 1.47 pouce, boîtier ultra-mince de 9.99 mm, suivi permanent de la fréquence cardiaque et de l’oxygène sanguin SpO2, 50+ modes d’entraînement et 14 jours d’autonomie record.',
        mrp: 20000,
        price: 15000,
        stock: 40,
        inStock: true,
        category: 'Montres & Wearables',
        categoryId: 'cat-8',
        Category: { id: 'cat-8', name: 'Montres & Wearables' },
        images: ['/product-placeholder.png'],
        specs: {
            Écran: '1.47" TFT vibrant',
            Poids: 'Seulement 14.9g (sans bracelet)',
            Autonomie: '14 jours sur une seule charge',
            Étanchéité: '5 ATM (jusqu’à 50 mètres de profondeur)',
            Garantie: '12 mois',
        },
        rating: [
            {
                rating: 5,
                review: 'Batterie incroyable, je la charge 2 fois par mois seulement.',
                user: { name: 'Moussa Faye' },
            },
        ],
        createdAt: '2026-08-04T12:00:00Z',
    },
];

const JULO_CATEGORY_NAMES = new Set(JULO_CATEGORIES.map((c) => c.name.toLowerCase()));

/**
 * Un produit venu de la base n'appartient au catalogue JULO que si sa catégorie
 * est l'une des huit catégories ci-dessus.
 *
 * Liste blanche volontaire : la base héberge encore le catalogue Global Air
 * (Ventilateur, Téléviseur, Woofer, Fontaine…). Le filtrage par mots-clés sur le
 * nom laissait passer « GE-190 », les cinq « Smart TV » et « Speaker GLOBAL AIR 8" »,
 * qui s'affichaient donc dans la boutique high-tech.
 */
export function isJuloProduct(product) {
    const categoryName = (product?.Category?.name || product?.category || '').toLowerCase().trim();
    return JULO_CATEGORY_NAMES.has(categoryName);
}
