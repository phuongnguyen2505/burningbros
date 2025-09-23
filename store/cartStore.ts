import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types';

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            addItem: (product) =>
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === product.id);
                    if (existingItem) {
                        const updatedItems = state.items.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        );
                        return { items: updatedItems };
                    } else {
                        return { items: [...state.items, { ...product, quantity: 1 }] };
                    }
                }),
            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId),
                })),
            updateQuantity: (productId, quantity) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ).filter(item => item.quantity > 0),
                })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);