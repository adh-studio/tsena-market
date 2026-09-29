/**
 * Mocked catalogue backend.
 *
 * This module simulates a remote catalogue API: every function returns a
 * `Promise` and adds a small artificial latency so the UI exercises the same
 * loading / error states it would with a real network call.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * Replacing this by a real backend (Supabase / REST) is intentionally simple:
 * keep the exported signatures identical and swap the body, e.g.
 *
 *   export async function fetchProducts(): Promise<Product[]> {
 *     const { data, error } = await supabase.from('products').select('*');
 *     if (error) throw error;
 *     return data;
 *   }
 *
 * The React Query hooks (see `queries.ts`) and every screen would keep working
 * without changes.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type Category = 'Alimentation' | 'Artisanat' | 'Épices' | 'Textile' | 'Boissons';

export interface Product {
  id: string;
  name: string;
  /** Price in Malagasy Ariary (MGA), no decimals. */
  price: number;
  category: Category;
  description: string;
  image: string;
  /** Producer / seller displayed on the product sheet. */
  seller: string;
  /** Average customer rating, 0–5. */
  rating: number;
  /** Remaining units; 0 means out of stock. */
  stock: number;
}

export const CATEGORIES: Category[] = [
  'Alimentation',
  'Artisanat',
  'Épices',
  'Textile',
  'Boissons',
];

/**
 * Realistic seed catalogue. Prices reflect typical Malagasy market values.
 * Images use the deterministic picsum.photos placeholder service.
 */
const CATALOG: Product[] = [
  {
    id: 'p-001',
    name: 'Riz rouge de Madagascar (5 kg)',
    price: 32000,
    category: 'Alimentation',
    description:
      "Riz rouge complet cultivé sur les hautes terres. Riche en fibres et en fer, il accompagne parfaitement le romazava et le ravitoto. Sac de 5 kg.",
    image: 'https://picsum.photos/seed/tsena-riz/600/600',
    seller: 'Coopérative Betsileo',
    rating: 4.7,
    stock: 42,
  },
  {
    id: 'p-002',
    name: 'Vanille Bourbon (10 gousses)',
    price: 48000,
    category: 'Épices',
    description:
      'Gousses de vanille Bourbon de la région SAVA, séchées et affinées pendant plusieurs mois. Arôme intense, taux de vanilline élevé.',
    image: 'https://picsum.photos/seed/tsena-vanille/600/600',
    seller: 'Vanille de Sambava',
    rating: 4.9,
    stock: 18,
  },
  {
    id: 'p-003',
    name: 'Miel sauvage de forêt (500 g)',
    price: 24000,
    category: 'Alimentation',
    description:
      "Miel récolté dans les forêts de l'Est. Non chauffé, non filtré, au goût floral prononcé. Pot en verre de 500 g.",
    image: 'https://picsum.photos/seed/tsena-miel/600/600',
    seller: 'Apiculteurs de Moramanga',
    rating: 4.6,
    stock: 30,
  },
  {
    id: 'p-004',
    name: 'Panier tressé en raphia',
    price: 45000,
    category: 'Artisanat',
    description:
      "Panier tressé main en fibres de raphia par des artisanes de l'Itasy. Solide et léger, idéal pour le marché ou la décoration.",
    image: 'https://picsum.photos/seed/tsena-panier/600/600',
    seller: 'Atelier Antsirabe',
    rating: 4.8,
    stock: 12,
  },
  {
    id: 'p-005',
    name: 'Lamba hoany en coton',
    price: 28000,
    category: 'Textile',
    description:
      'Tissu traditionnel en coton aux motifs colorés et proverbe malgache imprimé. Multi-usage : paréo, châle ou nappe.',
    image: 'https://picsum.photos/seed/tsena-lamba/600/600',
    seller: 'Tissage Mahajanga',
    rating: 4.5,
    stock: 55,
  },
  {
    id: 'p-006',
    name: 'Café Arabica torréfié (250 g)',
    price: 19000,
    category: 'Boissons',
    description:
      "Café Arabica d'altitude cultivé près d'Antsirabe, torréfaction artisanale médium. Notes de cacao et de fruits rouges. Grains entiers.",
    image: 'https://picsum.photos/seed/tsena-cafe/600/600',
    seller: 'Torréfaction Vakinankaratra',
    rating: 4.7,
    stock: 27,
  },
  {
    id: 'p-007',
    name: 'Poivre noir sauvage (100 g)',
    price: 15000,
    category: 'Épices',
    description:
      'Poivre noir de brousse récolté à la main, séché au soleil. Piquant équilibré et parfum boisé. Sachet refermable de 100 g.',
    image: 'https://picsum.photos/seed/tsena-poivre/600/600',
    seller: 'Épices de la côte Est',
    rating: 4.4,
    stock: 60,
  },
  {
    id: 'p-008',
    name: 'Chocolat noir 70 % (grand cru)',
    price: 22000,
    category: 'Alimentation',
    description:
      'Tablette de chocolat noir 70 % issue de fèves de cacao de la vallée du Sambirano, réputées parmi les meilleures au monde.',
    image: 'https://picsum.photos/seed/tsena-chocolat/600/600',
    seller: 'Cacao Sambirano',
    rating: 4.9,
    stock: 40,
  },
  {
    id: 'p-009',
    name: 'Sculpture en bois de palissandre',
    price: 85000,
    category: 'Artisanat',
    description:
      'Zébu sculpté à la main dans du bois de palissandre certifié durable. Pièce unique, finition huilée. Hauteur ~20 cm.',
    image: 'https://picsum.photos/seed/tsena-sculpture/600/600',
    seller: 'Artisans Ambositra',
    rating: 4.8,
    stock: 6,
  },
  {
    id: 'p-010',
    name: 'Sac à main en cuir de zébu',
    price: 120000,
    category: 'Textile',
    description:
      'Sac cousu main en cuir pleine fleur de zébu, tannage végétal. Doublure en coton et fermeture aimantée. Fabrication artisanale.',
    image: 'https://picsum.photos/seed/tsena-sac/600/600',
    seller: 'Maroquinerie Fianar',
    rating: 4.6,
    stock: 9,
  },
  {
    id: 'p-011',
    name: 'Rhum arrangé vanille-litchi (70 cl)',
    price: 38000,
    category: 'Boissons',
    description:
      'Rhum traditionnel macéré avec vanille Bourbon et litchi de la côte Est. Édition artisanale, 40°. Bouteille de 70 cl.',
    image: 'https://picsum.photos/seed/tsena-rhum/600/600',
    seller: 'Distillerie Toamasina',
    rating: 4.7,
    stock: 21,
  },
  {
    id: 'p-012',
    name: 'Baume au Ravintsara (50 ml)',
    price: 16000,
    category: 'Artisanat',
    description:
      "Baume apaisant à base d'huile essentielle de Ravintsara, endémique de Madagascar. Idéal pour la respiration et les massages.",
    image: 'https://picsum.photos/seed/tsena-baume/600/600',
    seller: 'Aroma Analamanga',
    rating: 4.5,
    stock: 33,
  },
];

/** Simulated network latency (ms). */
const LATENCY = 550;

function delay<T>(value: T, ms: number = LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * Returns the full catalogue, optionally filtered by category.
 * Mirrors `GET /products?category=…`.
 */
export function fetchProducts(category?: Category): Promise<Product[]> {
  const list = category ? CATALOG.filter((p) => p.category === category) : CATALOG;
  return delay([...list]);
}

/**
 * Returns a single product by id, or rejects if it does not exist.
 * Mirrors `GET /products/:id`.
 */
export function fetchProduct(id: string): Promise<Product> {
  const found = CATALOG.find((p) => p.id === id);
  if (!found) {
    return new Promise<Product>((_, reject) =>
      setTimeout(() => reject(new Error(`Produit introuvable : ${id}`)), LATENCY)
    );
  }
  return delay({ ...found });
}

/**
 * Full-text-ish search across name, description and seller.
 * Mirrors `GET /products?q=…`.
 */
export function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return delay([...CATALOG]);
  const results = CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.seller.toLowerCase().includes(q)
  );
  return delay(results);
}
