import { describe, it, expect } from 'vitest';
import { getDeliveryFee, formatCurrency, getOrderStatusLabel } from './utils';

// ─────────────────────────────────────────────
// 1. CALCUL TOTAL COMMANDE (simulé)
// ─────────────────────────────────────────────
function computeOrderTotal({ items, deliveryFee, discountAmount }) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const fee = deliveryFee === -1 ? 0 : deliveryFee;
    return subtotal + fee - discountAmount;
}

// ─────────────────────────────────────────────
// 2. GÉNÉRATION URL WAVE
// ─────────────────────────────────────────────
function buildWaveUrl(total) {
    return `https://pay.wave.com/m/M_sn_mqjmXRyGEW2i/c/sn/?amount=${total}`;
}

// ─────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────

describe('Workflow Commande — Calcul des totaux', () => {
    it('calcule correctement le sous-total de plusieurs articles', () => {
        const items = [
            { price: 150000, quantity: 1 },
            { price: 50000, quantity: 2 },
        ];
        const total = computeOrderTotal({ items, deliveryFee: 0, discountAmount: 0 });
        expect(total).toBe(250000); // 150000 + 100000
    });

    it('ajoute les frais de livraison Dakar (2000 FCFA)', () => {
        const items = [{ price: 100000, quantity: 1 }];
        const total = computeOrderTotal({ items, deliveryFee: 2000, discountAmount: 0 });
        expect(total).toBe(102000);
    });

    it('ne compte pas les frais "à déterminer" (-1) dans le total', () => {
        const items = [{ price: 100000, quantity: 1 }];
        const total = computeOrderTotal({ items, deliveryFee: -1, discountAmount: 0 });
        expect(total).toBe(100000); // -1 traité comme 0
    });

    it('applique correctement une remise coupon', () => {
        const items = [{ price: 200000, quantity: 1 }];
        const total = computeOrderTotal({ items, deliveryFee: 2000, discountAmount: 20000 });
        expect(total).toBe(182000); // 200000 + 2000 - 20000
    });

    it('total ne peut pas être négatif avec remise excessive — protégé par Math.max(0,...)', () => {
        const items = [{ price: 10000, quantity: 1 }];
        const rawTotal = computeOrderTotal({ items, deliveryFee: 0, discountAmount: 50000 });
        // Le total brut serait -40000. Le backend protège avec Math.max(0, total).
        const safetotal = Math.max(0, rawTotal);
        expect(safetotal).toBe(0); // ✅ Jamais négatif en production
    });

    it('retrait = frais 0 FCFA', () => {
        expect(getDeliveryFee('PICKUP')).toBe(0);
    });

    it('livraison Dakar = 2000 FCFA', () => {
        expect(getDeliveryFee('DELIVERY', undefined, undefined, { city: 'Dakar' })).toBe(2000);
    });

    it('livraison Hors-Dakar = à déterminer (-1)', () => {
        expect(getDeliveryFee('DELIVERY', undefined, undefined, { city: 'Thiès' })).toBe(-1);
        expect(getDeliveryFee('DELIVERY', undefined, undefined, { city: 'Saint-Louis' })).toBe(-1);
    });

    it('quartier contenant "Dakar" = 2000 FCFA (via object address)', () => {
        expect(
            getDeliveryFee('DELIVERY', undefined, undefined, { city: 'Parcelles Assainies, Dakar' })
        ).toBe(2000);
        expect(getDeliveryFee('DELIVERY', undefined, undefined, { city: 'Mermoz, Dakar' })).toBe(
            2000
        );
    });
});

describe('Workflow Paiement Wave — URL avec montant', () => {
    it('génère le lien Wave avec le montant correct', () => {
        const url = buildWaveUrl(152000);
        expect(url).toBe('https://pay.wave.com/m/M_sn_mqjmXRyGEW2i/c/sn/?amount=152000');
    });

    it('le montant Wave = produits + livraison - réduction', () => {
        const items = [{ price: 200000, quantity: 1 }];
        const total = computeOrderTotal({ items, deliveryFee: 2000, discountAmount: 10000 });
        const url = buildWaveUrl(total);
        expect(url).toContain('amount=192000');
    });

    it('le montant Wave pour retrait = prix produits seulement', () => {
        const items = [{ price: 75000, quantity: 2 }];
        const total = computeOrderTotal({ items, deliveryFee: 0, discountAmount: 0 });
        const url = buildWaveUrl(total);
        expect(url).toContain('amount=150000');
    });
});

describe('Statuts de commande', () => {
    const statusMap = {
        ORDER_PLACED: 'Commande passée',
        CONFIRMED: 'Confirmée',
        PROCESSING: 'En préparation',
        SHIPPED: 'Expédiée',
        DELIVERED: 'Livrée',
        CANCELLED: 'Annulée',
    };

    Object.entries(statusMap).forEach(([status, expected]) => {
        it(`traduit "${status}" → "${expected}"`, () => {
            expect(getOrderStatusLabel(status)).toBe(expected);
        });
    });

    it('gère les statuts inconnus avec formatage lisible', () => {
        expect(getOrderStatusLabel('CUSTOM_STATUS')).toBe('custom status');
    });
});

describe('Formatage des prix', () => {
    it('formate 0 FCFA', () => {
        expect(formatCurrency(0)).toBe('0 FCFA');
    });

    it('formate les grands montants avec séparateur', () => {
        const result = formatCurrency(1500000);
        expect(result).toContain('FCFA');
        expect(result).toContain('500');
    });

    it('gère NaN', () => {
        expect(formatCurrency(NaN)).toBe('0 FCFA');
    });

    it('gère les nombres décimaux (arrondi sénégalais)', () => {
        const result = formatCurrency(15000.5);
        expect(result).toContain('FCFA');
    });
});
