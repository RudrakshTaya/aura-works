import { http, unwrap } from "./http";

// Get user's wishlist
export async function getWishlist(): Promise<string[]> {
  const res = await http.get(`/users/wishlist`);
  const data = unwrap<any>(res);
  if (Array.isArray(data)) return data.map(String);
  if (Array.isArray(data?.wishlist)) return data.wishlist.map(String);
  return [];
}

// Add a product to wishlist
export async function addToWishlist(productId: string): Promise<string[]> {
  const res = await http.post(`/users/wishlist/add`, { productId });
  return (unwrap<any>(res)?.wishlist as string[]) || [];
}

// Remove a product from wishlist
export async function removeFromWishlist(productId: string): Promise<string[]> {
  const res = await http.post(`/users/wishlist/remove`, { productId });
  return (unwrap<any>(res)?.wishlist as string[]) || [];
}

export function inWishlist(productId: string, wishlist: string[]): boolean {
  return wishlist.includes(String(productId));
}
