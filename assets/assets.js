import julo_logo from './julo_logo.png';
import julo_logo_transparent from './julo_logo_transparent.png';
import julo_logo_white from './julo_logo_white.png';
import hero_model_img from './hero_model_img.png';

import { ClockFadingIcon, HeadsetIcon, SendIcon } from 'lucide-react';

export const assets = {
    hero_model_img,
    julo_logo,
    julo_logo_transparent,
    julo_logo_white,
};

export const ourSpecsData = [
    {
        title: 'Livraison Gratuite',
        description:
            "Profitez d'une livraison rapide et gratuite sur toutes vos commandes, sans condition, partout au Sénégal.",
        icon: SendIcon,
        accent: '#05DF72',
    },
    {
        title: 'Retour sous 7 Jours',
        description:
            "Vous avez changé d'avis ? Pas de souci. Retournez n'importe quel article sous 7 jours pour un échange ou remboursement.",
        icon: ClockFadingIcon,
        accent: '#FF8904',
    },
    {
        title: 'Support Client Local',
        description:
            "Besoin d'aide ? Notre équipe basée à Dakar est à votre écoute 24h/24 et 7j/7 pour vous conseiller.",
        icon: HeadsetIcon,
        accent: '#A684FF',
    },
];
