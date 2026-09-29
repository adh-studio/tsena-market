import { useQuery } from '@tanstack/react-query';
import {
  Category,
  Product,
  fetchProduct,
  fetchProducts,
} from './products';

/**
 * Centralised React Query keys. Keeping them here avoids typos and makes
 * cache invalidation predictable when a real backend is plugged in.
 */
export const productKeys = {
  all: ['products'] as const,
  list: (category?: Category) => ['products', 'list', category ?? 'all'] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
};

/**
 * Fetches the catalogue, optionally scoped to a category.
 */
export function useProducts(category?: Category) {
  return useQuery<Product[]>({
    queryKey: productKeys.list(category),
    queryFn: () => fetchProducts(category),
  });
}

/**
 * Fetches a single product sheet.
 */
export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id),
    enabled: Boolean(id),
  });
}
