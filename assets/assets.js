import julo_logo from './julo_logo.png';
import julo_logo_transparent from './julo_logo_transparent.png';
import julo_logo_white from './julo_logo_white.png';

import { ShieldCheck, Award, Truck, Zap } from 'lucide-react';

export const assets = {
    julo_logo,
    julo_logo_transparent,
    julo_logo_white,
};

export const ourSpecsData = [
    {
        title: 'Produits 100% Originaux',
        description:
            'Smartphones, ordinateurs et accessoires neufs certifiés avec garantie constructeur.',
        icon: ShieldCheck,
        accent: '#f59e0b',
    },
    {
        title: 'Garantie & SAV Réactif',
        description:
            'Assistance technique locale et service après-vente dédié à Dakar et dans tout le Sénégal.',
        icon: Award,
        accent: '#3b82f6',
    },
    {
        title: 'Livraison Express Sénégal',
        description:
            'Expédition rapide et sécurisée à Dakar, Thiès, Touba et dans toutes les régions du Sénégal.',
        icon: Truck,
        accent: '#10b981',
    },
    {
        title: 'Paiement 1-Clic Sécurisé',
        description:
            'Réglez facilement via Wave, Orange Money ou à la livraison en toute tranquillité.',
        icon: Zap,
        accent: '#8b5cf6',
    },
];
