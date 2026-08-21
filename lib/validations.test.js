import { describe, it, expect } from 'vitest';
import { validatePhone, registerSchema, productSchema } from './validations';

describe('validatePhone', () => {
    it('accepte les numéros Sénégal valides (77, 78, 76, 70, 75)', () => {
        expect(validatePhone('771234567')).toBe(true);
        expect(validatePhone('781234567')).toBe(true);
        expect(validatePhone('761234567')).toBe(true);
        expect(validatePhone('701234567')).toBe(true);
        expect(validatePhone('751234567')).toBe(true);
    });

    it('accepte les numéros avec préfixe 221', () => {
        expect(validatePhone('221771234567')).toBe(true);
        expect(validatePhone('221781234567')).toBe(true);
    });

    it('accepte les numéros avec espaces et tirets (nettoyage)', () => {
        expect(validatePhone('77 123 45 67')).toBe(true);
        expect(validatePhone('77-123-45-67')).toBe(true);
        expect(validatePhone('77.123.45.67')).toBe(true);
    });

    it('rejette les numéros trop courts', () => {
        expect(validatePhone('7712345')).toBe(false); // 7 chiffres seulement
    });

    it('rejette les numéros avec mauvais préfixe', () => {
        expect(validatePhone('991234567')).toBe(false);
        expect(validatePhone('601234567')).toBe(false);
    });

    it('rejette les numéros vides', () => {
        expect(validatePhone('')).toBe(false);
    });
});

describe('registerSchema', () => {
    it('valide un utilisateur correct', () => {
        const result = registerSchema.safeParse({
            name: 'Makhtar Diop',
            email: 'makhtar@example.com',
            password: 'motdepasse123',
        });
        expect(result.success).toBe(true);
    });

    it('rejette un email invalide', () => {
        const result = registerSchema.safeParse({
            name: 'Makhtar',
            email: 'pas-un-email',
            password: 'motdepasse123',
        });
        expect(result.success).toBe(false);
    });

    it('rejette un mot de passe trop court (< 8 chars)', () => {
        const result = registerSchema.safeParse({
            name: 'Makhtar',
            email: 'makhtar@example.com',
            password: '123',
        });
        expect(result.success).toBe(false);
    });

    it('rejette un nom trop court (< 2 chars)', () => {
        const result = registerSchema.safeParse({
            name: 'M',
            email: 'makhtar@example.com',
            password: 'motdepasse123',
        });
        expect(result.success).toBe(false);
    });
});

describe('productSchema', () => {
    const baseProduct = {
        name: 'Climatiseur Inverter 12000 BTU',
        description: 'Description complète du produit avec plus de 10 caractères',
        mrp: 250000,
        price: 220000,
        categoryId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        stock: 5,
        images: ['https://example.com/image.jpg'],
    };

    it('valide un produit correct', () => {
        const result = productSchema.safeParse(baseProduct);
        expect(result.success).toBe(true);
    });

    it('rejette un prix négatif', () => {
        const result = productSchema.safeParse({ ...baseProduct, price: -1000 });
        expect(result.success).toBe(false);
    });

    it('rejette un stock négatif', () => {
        const result = productSchema.safeParse({ ...baseProduct, stock: -1 });
        expect(result.success).toBe(false);
    });

    it('rejette sans images', () => {
        const result = productSchema.safeParse({ ...baseProduct, images: [] });
        expect(result.success).toBe(false);
    });

    it('rejette un UUID de catégorie invalide', () => {
        const result = productSchema.safeParse({ ...baseProduct, categoryId: 'pas-un-uuid' });
        expect(result.success).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────
// Tests coupon — Cas limites
// ─────────────────────────────────────────────────────────────

describe('Calcul de remise coupon — Cas limites', () => {
    // Simulation de la logique de validateCoupon (logique pure, sans Supabase)
    function computeDiscount({ type, value, maxDiscountAmount, orderAmount }) {
        let discount = 0;
        if (type === 'PERCENTAGE') {
            discount = (orderAmount * value) / 100;
            if (maxDiscountAmount) discount = Math.min(discount, maxDiscountAmount);
        } else {
            discount = value;
        }
        // Garde : la remise ne peut pas dépasser le montant total
        return Math.min(discount, orderAmount);
    }

    it('remise FIXED ne dépasse jamais le montant de la commande', () => {
        const discount = computeDiscount({ type: 'FIXED', value: 50000, orderAmount: 10000 });
        expect(discount).toBe(10000); // Plafonné au montant
    });

    it('remise PERCENTAGE de 100% plafonnée au total', () => {
        const discount = computeDiscount({ type: 'PERCENTAGE', value: 100, orderAmount: 50000 });
        expect(discount).toBe(50000); // Pas de remise > total
    });

    it('remise PERCENTAGE de 10% calculée correctement', () => {
        const discount = computeDiscount({ type: 'PERCENTAGE', value: 10, orderAmount: 200000 });
        expect(discount).toBe(20000);
    });

    it('remise PERCENTAGE plafonnée par maxDiscountAmount', () => {
        const discount = computeDiscount({
            type: 'PERCENTAGE',
            value: 50,
            maxDiscountAmount: 15000,
            orderAmount: 200000,
        });
        expect(discount).toBe(15000); // 50% = 100000, mais plafonné à 15000
    });

    it('remise 0 FCFA reste à 0', () => {
        const discount = computeDiscount({ type: 'FIXED', value: 0, orderAmount: 100000 });
        expect(discount).toBe(0);
    });

    it('total final après remise ne peut pas être négatif', () => {
        const discount = computeDiscount({ type: 'FIXED', value: 999999, orderAmount: 50000 });
        const finalTotal = Math.max(0, 50000 - discount);
        expect(finalTotal).toBe(0);
    });
});
