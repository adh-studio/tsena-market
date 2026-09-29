import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/api/products';
import { CartLine, cartCount, cartTotal, clampQty } from '@/lib/cart';
import { createJSONStorage } from './storage';

interface CartState {
  items: CartLine[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, qty = 1) =>
        set((state) => {
          const existing = state.items.find((l) => l.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((l) =>
                l.product.id === product.id
                  ? { ...l, qty: clampQty(l.qty + qty, product.stock) }
                  : l
              ),
            };
          }
          return {
            items: [...state.items, { product, qty: clampQty(qty, product.stock) }],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((l) => l.product.id !== productId),
        })),
      updateQty: (productId, qty) =>
        set((state) => ({
          items: state.items.map((l) =>
            l.product.id === productId
              ? { ...l, qty: clampQty(qty, l.product.stock) }
              : l
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'tsena-cart',
      storage: createJSONStorage<CartState>(),
      partialize: (state) => ({ items: state.items }) as CartState,
    }
  )
);

/** Selector: grand total of the cart in Ariary. */
export const selectCartTotal = (state: CartState): number => cartTotal(state.items);

/** Selector: total number of units in the cart (used for the tab badge). */
export const selectCartCount = (state: CartState): number => cartCount(state.items);
