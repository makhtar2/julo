import { describe, it, expect } from 'vitest';
import { formatCurrency, getOrderStatusLabel } from './utils';

describe('Utils: formatCurrency', () => {
    it('devrait formater correctement un nombre entier en FCFA', () => {
        expect(formatCurrency(15000)).toBe('15\u202F000 FCFA'); // \u202F est l'espace insécable utilisé par fr-SN
    });

    it('devrait gérer la valeur zéro', () => {
        expect(formatCurrency(0)).toBe('0 FCFA');
    });
});

describe('Utils: getOrderStatusLabel', () => {
    it('devrait retourner "En préparation" pour PROCESSING', () => {
        expect(getOrderStatusLabel('PROCESSING')).toBe('En préparation');
    });

    it('devrait retourner le texte formaté pour un statut inconnu', () => {
        expect(getOrderStatusLabel('UNKNOWN_STATUS')).toBe('unknown status');
    });
});
