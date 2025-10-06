import type { Cart, CartItem } from "./types";
import { http, unwrap } from "./http";

const API_BASE = `/users/cart`;

function normalizeCart(payload: any): Cart {
  if (!payload) return { items: [] };
  if (Array.isArray(payload)) return { items: payload as CartItem[] };
  if (payload.items && Array.isArray(payload.items))
    return { items: payload.items as CartItem[] };
  if (payload.data) return normalizeCart(payload.data);
  return { items: [] };
}

// Get current cart
export async function getCart(): Promise<Cart> {
  try {
    const res = await http.get(`${API_BASE}`);
    const data = unwrap<any>(res);
    return normalizeCart(data);
  } catch (err) {
    console.error("Error fetching cart:", err);
    return { items: [] };
  }
}

// Add item to cart
export async function addToCart(
  productId: string,
  quantity = 1,
  selectedAttributes: Record<string, string> = {},
): Promise<Cart> {
  try {
    const res = await http.post(`${API_BASE}/add`, {
      productId,
      quantity,
      selectedAttributes,
    });
    return normalizeCart(unwrap<any>(res));
  } catch (err) {
    console.error("Error adding to cart:", err);
    return { items: [] };
  }
}

// Remove item from cart
export async function removeFromCart(productId: string): Promise<Cart> {
  try {
    const res = await http.post(`${API_BASE}/remove`, { productId });
    return normalizeCart(unwrap<any>(res));
  } catch (err) {
    console.error("Error removing item from cart:", err);
    return { items: [] };
  }
}

// Optional clear cart if backend supports it
export async function clearCart(): Promise<Cart> {
  try {
    const res = await http.post(`${API_BASE}/clear`, {});
    return normalizeCart(unwrap<any>(res));
  } catch {
    return { items: [] };
  }
}

export async function countItems(): Promise<number> {
  const cart = await getCart();
  return (cart.items || []).reduce((sum, i) => sum + (i.quantity || 0), 0);
}
