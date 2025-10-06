import { http, unwrap } from "./http";

import { http, unwrap } from "./http";

// Get user's wishlist
export async function getWishlist(): Promise<number[]> {
  const res = await http.get(`/users/wishlist`);
  return unwrap<number[]>(res);
}

// Add a product to wishlist
export async function addToWishlist(productId: number): Promise<number[]> {
  const res = await http.post(`/users/wishlist/add`, { productId });
  return unwrap<number[]>(res);
}

// Remove a product from wishlist
export async function removeFromWishlist(productId: number): Promise<number[]> {
  const res = await http.post(`/users/wishlist/remove`, { productId });
  return unwrap<number[]>(res);
}

export function inWishlist(productId: number, wishlist: number[]): boolean {
  return wishlist.includes(productId);
}
