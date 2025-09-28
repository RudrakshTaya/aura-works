import type { Product } from "./types";
import axios from "axios";

const BASE = "http://localhost:8080/api";

export async function getAllProducts(): Promise<Product[]> {
  const res = await axios.get(`${BASE}/products`);
  if (res.status !== 200) throw new Error("Failed to fetch products");
  // Assuming your backend returns { success: true, data: Product[] }
  return res.data.data ?? res.data; 
}

export async function getProduct(id: number): Promise<Product> {
  const res = await axios.get(`${BASE}/products/${id}`);
  if (res.status !== 200) throw new Error("Failed to fetch product");
  return res.data.data ?? res.data;
}

export async function getCategories(): Promise<string[]> {
  const res = await axios.get(`${BASE}/products/categories`);
  if (res.status !== 200) throw new Error("Failed to fetch categories");
  return res.data.data ?? res.data;
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
  } = {}
): Product[] {
  let list = [...products];

  if (opts.q) {
    const q = opts.q.toLowerCase();
    list = list.filter((p) =>
      [p.title, p.description, p.category].some((v) => v?.toLowerCase().includes(q))
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
    list = list.filter((p) => (p.rating?.rate ?? 0) >= (opts.minRating as number));
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
      list.sort((a, b) => b.id - a.id);
      break;
  }

  return list;
}

export function getSuggestions(products: Product[], q: string, limit = 8): string[] {
  if (!q) return [];
  const lower = q.toLowerCase();
  const seen = new Set<string>();
  const suggestions: string[] = [];
  for (const p of products) {
    const terms = [p.title, p.category];
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
