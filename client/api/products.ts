import type { Product } from "./types";
import { http, unwrap } from "./http";

export async function getAllProducts(): Promise<Product[]> {
  const res = await http.get(`/products`);
  return unwrap<Product[]>(res);
}

export async function getProduct(id: number): Promise<Product> {
  const res = await http.get(`/products/${id}`);
  return unwrap<Product>(res);
}

export async function getCategories(): Promise<string[]> {
  // Compute categories from products to avoid relying on a non-standard endpoint
  const products = await getAllProducts();
  const set = new Set<string>();
  for (const p of products) if (p.category) set.add(p.category);
  return Array.from(set).sort();
}

export function filterProducts(
  products: Product[],
  opts: {
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sort?: "price_asc" | "price_desc" | "newest" | "popular";
  } = {},
): Product[] {
  let list = [...products];

  if (opts.q) {
    const q = opts.q.toLowerCase();
    list = list.filter((p) =>
      [p.name, p.description, p.category].some((v) =>
        v?.toLowerCase().includes(q),
      ),
    );
  }

  if (opts.category && opts.category !== "all") {
    list = list.filter((p) => p.category === opts.category);
  }

  if (typeof opts.minPrice === "number") {
    list = list.filter((p) => p.price >= (opts.minPrice as number));
  }

  if (typeof opts.maxPrice === "number") {
    list = list.filter((p) => p.price <= (opts.maxPrice as number));
  }

  if (typeof opts.minRating === "number") {
    list = list.filter(
      (p) => (p.rating?.rate ?? 0) >= (opts.minRating as number),
    );
  }

  switch (opts.sort) {
    case "price_asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      list.sort((a, b) => (b.rating?.count ?? 0) - (a.rating?.count ?? 0));
      break;
    case "newest":
      list.sort((a, b) => b._id.localeCompare(a._id));
      break;
  }

  return list;
}

export function getSuggestions(
  products: Product[],
  q: string,
  limit = 8,
): string[] {
  if (!q) return [];
  const lower = q.toLowerCase();
  const seen = new Set<string>();
  const suggestions: string[] = [];
  for (const p of products) {
    const terms = [p.name, p.category];
    for (const t of terms) {
      if (!t) continue;
      if (t.toLowerCase().includes(lower) && !seen.has(t)) {
        seen.add(t);
        suggestions.push(t);
        if (suggestions.length >= limit) return suggestions;
      }
    }
  }
  return suggestions;
}
