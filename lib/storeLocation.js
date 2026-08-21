/** Informations boutique Julo — Sénégal */
export const STORE_LOCATION = {
    name: 'Julo Store & Studio',
    street: 'Dakar & Touba',
    city: 'Dakar',
    state: 'Dakar',
    country: 'Sénégal',
    get fullAddress() {
        return `${this.street}, ${this.city}, ${this.country}`;
    },
    email: 'contact@julo.sn',
    phone: '+221754469097',
    phoneDisplay: '75 446 90 97',
    hours: 'Lun – Sam, 9h – 20h',
};

export const DELIVERY_INFO_SN = {
    title: 'Livraison à domicile & en région',
    dakarFeeLabel: '2 000 FCFA',
    lines: [
        'Livraison express dans tout Dakar, Thiès et Touba.',
        'Expédition sécurisée dans toutes les régions du Sénégal (GP, La Poste, transporteurs agréés).',
        'Suivi de commande direct via WhatsApp.',
    ],
};

export const PICKUP_INFO_SN = {
    title: 'Retrait en point relais / boutique',
    lines: [
        'Retrait gratuit à nos points de retrait partenaires à Dakar et Touba.',
        'Munissez-vous de votre référence de commande ou numéro de téléphone.',
        'Paiement en ligne (Wave / Orange Money) ou au retrait.',
    ],
};
