import axios from "axios";

const BASE = "http://localhost:8080/api";

// Get user's wishlist
export async function getWishlist(token: string): Promise<number[]> {
  const res = await axios.get(`${BASE}/users/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 200) throw new Error("Failed to fetch wishlist");
  console.log("Wishlist response:", res.data);
  return res.data.data ?? res.data;
}

// Add a product to wishlist
export async function addToWishlist(productId: number, token: string): Promise<number[]> {
  const res = await axios.post(
    `${BASE}/users/wishlist/add`,
    { productId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status !== 200) throw new Error("Failed to add to wishlist");
  return res.data.data ?? res.data;
}

// Remove a product from wishlist
export async function removeFromWishlist(productId: number, token: string): Promise<number[]> {
  const res = await axios.post(
    `${BASE}/users/wishlist/remove`,
    { productId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status !== 200) throw new Error("Failed to remove from wishlist");
  return res.data.data ?? res.data;
}

// Check if product is in wishlist
export function inWishlist(productId: number, wishlist: number[]): boolean {
  return wishlist.includes(productId);
}
