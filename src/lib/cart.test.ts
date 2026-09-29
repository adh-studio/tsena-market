import { Product } from '@/api/products';
import { CartLine, cartCount, cartTotal, clampQty, lineSubtotal } from './cart';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p-test',
    name: 'Produit test',
    price: 10000,
    category: 'Alimentation',
    description: 'Description test',
    image: 'https://example.com/test.jpg',
    seller: 'Vendeur test',
    rating: 4.5,
    stock: 20,
    ...overrides,
  };
}

describe('cart', () => {
  describe('lineSubtotal', () => {
    it('multiplies unit price by quantity', () => {
      const line: CartLine = { product: makeProduct({ price: 15000 }), qty: 3 };
      expect(lineSubtotal(line)).toBe(45000);
    });
  });

  describe('cartTotal', () => {
    it('returns 0 for an empty cart', () => {
      expect(cartTotal([])).toBe(0);
    });

    it('sums the sub-totals of every line', () => {
      const lines: CartLine[] = [
        { product: makeProduct({ id: 'a', price: 10000 }), qty: 2 },
        { product: makeProduct({ id: 'b', price: 5000 }), qty: 4 },
      ];
      expect(cartTotal(lines)).toBe(40000);
    });
  });

  describe('cartCount', () => {
    it('returns 0 for an empty cart', () => {
      expect(cartCount([])).toBe(0);
    });

    it('sums the quantities across lines', () => {
      const lines: CartLine[] = [
        { product: makeProduct({ id: 'a' }), qty: 2 },
        { product: makeProduct({ id: 'b' }), qty: 3 },
      ];
      expect(cartCount(lines)).toBe(5);
    });
  });

  describe('clampQty', () => {
    it('never goes below 1', () => {
      expect(clampQty(0, 10)).toBe(1);
      expect(clampQty(-4, 10)).toBe(1);
    });

    it('caps at the available stock', () => {
      expect(clampQty(12, 8)).toBe(8);
    });

    it('leaves a valid quantity untouched', () => {
      expect(clampQty(5, 10)).toBe(5);
    });

    it('ignores the cap when stock is unknown (0)', () => {
      expect(clampQty(99, 0)).toBe(99);
    });
  });
});
