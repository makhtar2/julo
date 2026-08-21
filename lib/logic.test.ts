import { describe, it, expect } from 'vitest';
import { getDeliveryFee, formatCurrency } from './utils';

describe('Logic Utilities', () => {
    describe('getDeliveryFee', () => {
        it('should return 0 for PICKUP method', () => {
            expect(getDeliveryFee('PICKUP')).toBe(0);
        });

        it('should return 2000 for Dakar region (address object)', () => {
            expect(getDeliveryFee('DELIVERY', undefined, undefined, { city: 'Dakar' })).toBe(2000);
            expect(getDeliveryFee('DELIVERY', undefined, undefined, { city: 'DAKAR' })).toBe(2000);
        });

        it('should return 2000 for Dakar region (quartier string via zoneName)', () => {
            expect(getDeliveryFee('DELIVERY', 'Dakar', 'Dakar Plateau')).toBe(2000);
        });

        it('should return -1 for other regions', () => {
            expect(getDeliveryFee('DELIVERY', undefined, undefined, { city: 'Thiès' })).toBe(-1);
            expect(getDeliveryFee('DELIVERY', null, 'Saint-Louis')).toBe(-1);
        });

        it('should return -1 if no location info provided for DELIVERY', () => {
            expect(getDeliveryFee('DELIVERY')).toBe(-1);
        });
    });

    describe('formatCurrency', () => {
        it('should format FCFA correctly', () => {
            expect(formatCurrency(15000)).toBe('15 000 FCFA'); // Note: standard JS uses non-breaking space
        });

        it('should return 0 FCFA for NaN', () => {
            expect(formatCurrency(NaN)).toBe('0 FCFA');
        });
    });
});
