import { deliveryZones } from './deliveryZones';

/**
 * Formate un montant en FCFA selon le format local sénégalais
 * @param amount Le montant à formater
 * @returns Le montant formaté (ex: 15 000 FCFA)
 */
export const formatCurrency = (amount: number): string => {
    if (isNaN(amount)) return '0 FCFA';
    return `${Number(amount).toLocaleString('fr-SN')} FCFA`;
};

/**
 * Retourne le label français pour un statut de commande
 */
export const getOrderStatusLabel = (status: string): string => {
    switch (status) {
        case 'ORDER_PLACED':
            return 'Commande passée';
        case 'CONFIRMED':
            return 'Confirmée';
        case 'PROCESSING':
            return 'En préparation';
        case 'SHIPPED':
            return 'Expédiée';
        case 'DELIVERED':
            return 'Livrée';
        case 'CANCELLED':
            return 'Annulée';
        default:
            return status.replace(/_/g, ' ').toLowerCase();
    }
};

/**
 * Calcule les frais de livraison selon la zone et la méthode
 * @returns Le montant (ex: 2000, 0) ou -1 si à déterminer
 */
export const getDeliveryFee = (
    deliveryMethod: string,
    region?: string,
    zoneName?: string,
    selectedAddress?: any
): number => {
    if (deliveryMethod === 'PICKUP') return 0;

    // Si une adresse sauvegardée est utilisée, on garde l'ancienne logique de vérification sur "Dakar"
    if (selectedAddress) {
        const location = (selectedAddress?.city || '').toLowerCase();
        if (location.includes('dakar')) return 2000;
        return -1;
    }

    // Nouvelle logique "Méthode Jumia"
    if (region && zoneName) {
        const regionZones = deliveryZones[region];
        if (regionZones) {
            const zone = regionZones.find((z: any) => z.name === zoneName);
            if (zone) return zone.fee;
        }
    }

    // Par défaut
    return -1; // "À déterminer"
};
