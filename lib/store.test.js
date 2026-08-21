import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './store';

describe('useCartStore', () => {
    beforeEach(() => {
        useCartStore.getState().clearCart();
    });

    it('should start with an empty cart', () => {
        const state = useCartStore.getState();
        expect(state.cart).toEqual([]);
    });

    it('should add a product to the cart', () => {
        const product = { id: '1', name: 'Produit Test', price: 1000 };
        useCartStore.getState().addToCart(product);

        const state = useCartStore.getState();
        expect(state.cart).toHaveLength(1);
        expect(state.cart[0]).toEqual({ ...product, quantity: 1 });
    });

    it('should increment quantity if product already in cart', () => {
        const product = { id: '1', name: 'Produit Test', price: 1000 };
        useCartStore.getState().addToCart(product);
        useCartStore.getState().addToCart(product);

        const state = useCartStore.getState();
        expect(state.cart).toHaveLength(1);
        expect(state.cart[0].quantity).toBe(2);
    });

    it('should update quantity correctly', () => {
        const product = { id: '1', name: 'Produit Test', price: 1000 };
        useCartStore.getState().addToCart(product);
        useCartStore.getState().updateQuantity('1', 5);

        const state = useCartStore.getState();
        expect(state.cart[0].quantity).toBe(5);
    });

    it('should remove product if quantity set to 0', () => {
        const product = { id: '1', name: 'Produit Test', price: 1000 };
        useCartStore.getState().addToCart(product);
        useCartStore.getState().updateQuantity('1', 0);

        const state = useCartStore.getState();
        expect(state.cart).toHaveLength(0);
    });

    it('should calculate total price correctly', () => {
        useCartStore.getState().addToCart({ id: '1', price: 1000 }, 2);
        useCartStore.getState().addToCart({ id: '2', price: 500 }, 1);

        expect(useCartStore.getState().getTotalPrice()).toBe(2500);
    });

    it('should calculate cart count correctly', () => {
        useCartStore.getState().addToCart({ id: '1' }, 2);
        useCartStore.getState().addToCart({ id: '2' }, 3);

        expect(useCartStore.getState().getCartCount()).toBe(5);
    });
});
