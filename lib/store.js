import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create()(
    persist(
        (set, get) => ({
            cart: [],
            addresses: [],
            wishlist: [],

            addToCart: (product, quantity = 1) => {
                const { cart } = get();
                const existingItem = cart.find((item) => item.id === product.id);

                if (existingItem) {
                    set({
                        cart: cart.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                    });
                } else {
                    set({ cart: [...cart, { ...product, quantity }] });
                }
            },

            removeFromCart: (productId) => {
                set({ cart: get().cart.filter((item) => item.id !== productId) });
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }
                set({
                    cart: get().cart.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => set({ cart: [] }),

            getTotalPrice: () => {
                return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            getCartCount: () => {
                return get().cart.reduce((total, item) => total + item.quantity, 0);
            },

            // Address actions
            addAddress: (address) => {
                set({ addresses: [...get().addresses, address] });
            },

            removeAddress: (index) => {
                set({ addresses: get().addresses.filter((_, i) => i !== index) });
            },

            // Wishlist actions
            toggleWishlist: (product) => {
                const { wishlist } = get();
                const exists = wishlist.find((item) => item.id === product.id);
                if (exists) {
                    set({ wishlist: wishlist.filter((item) => item.id !== product.id) });
                    return false; // Removed
                } else {
                    set({ wishlist: [...wishlist, product] });
                    return true; // Added
                }
            },

            isInWishlist: (productId) => {
                return get().wishlist.some((item) => item.id === productId);
            },
        }),
        {
            name: 'globalair-storage',
            version: 1, // Store version
        }
    )
);
