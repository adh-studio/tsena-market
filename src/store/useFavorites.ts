import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/api/products';
import { createJSONStorage } from './storage';

interface FavoritesState {
  items: Product[];
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clear: () => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) =>
        set((state) => {
          const exists = state.items.some((p) => p.id === product.id);
          return {
            items: exists
              ? state.items.filter((p) => p.id !== product.id)
              : [...state.items, product],
          };
        }),
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((p) => p.id !== productId) })),
      isFavorite: (productId) => get().items.some((p) => p.id === productId),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'tsena-favorites',
      storage: createJSONStorage<FavoritesState>(),
      partialize: (state) => ({ items: state.items }) as FavoritesState,
    }
  )
);

/** Selector: number of favourite products (used for the tab badge). */
export const selectFavoritesCount = (state: FavoritesState): number => state.items.length;
