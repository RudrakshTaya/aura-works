import type { Seller } from "./types";

export async function getFeaturedSellers(): Promise<Seller[]> {
  const res = await fetch("/mock/sellers.json");
  if (!res.ok) throw new Error("Failed to fetch sellers");
  const all: Seller[] = await res.json();
  return all.slice(0, 6);
}

export async function getSellerById(id: string): Promise<Seller | undefined> {
  const res = await fetch("/mock/sellers.json");
  if (!res.ok) throw new Error("Failed to fetch sellers");
  const all: Seller[] = await res.json();
  return all.find((s) => s.id === id);
}
