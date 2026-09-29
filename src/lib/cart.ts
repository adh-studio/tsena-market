import { Product } from '@/api/products';

/**
 * A cart line stores a snapshot of the product plus the ordered quantity.
 * Snapshotting keeps the cart stable even if the catalogue price changes.
 */
export interface CartLine {
  product: Product;
  qty: number;
}

/** Sub-total for a single line (unit price × quantity). */
export function lineSubtotal(line: CartLine): number {
  return line.product.price * line.qty;
}

/** Grand total across every line in the cart. */
export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + lineSubtotal(line), 0);
}

/** Total number of units in the cart (sum of quantities). */
export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.qty, 0);
}

/**
 * Clamps a requested quantity into a valid range: at least 1, never above the
 * available stock. Used by the quantity stepper and the store.
 */
export function clampQty(qty: number, stock: number): number {
  if (qty < 1) return 1;
  if (stock > 0 && qty > stock) return stock;
  return qty;
}
