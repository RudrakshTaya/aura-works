import type { Cart } from "./types";
import { http } from "./http";

const API_BASE = `/users/cart`;

// Get current cart
export async function getCart(): Promise<Cart> {
  try {
    const { data } = await http.get<Cart>(`${API_BASE}`);
    return data as unknown as Cart;
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
    const { data } = await http.post<Cart>(`${API_BASE}/add`, {
      productId,
      quantity,
      selectedAttributes,
    });
    return data as unknown as Cart;
  } catch (err) {
    console.error("Error adding to cart:", err);
    return { items: [] };
  }
}

// Remove item from cart
export async function removeFromCart(productId: string): Promise<Cart> {
  try {
    const { data } = await http.post<Cart>(`${API_BASE}/remove`, { productId });
    return data as unknown as Cart;
  } catch (err) {
    console.error("Error removing item from cart:", err);
    return { items: [] };
  }
}

// Optional clear cart if backend supports it
export async function clearCart(): Promise<Cart> {
  try {
    const { data } = await http.post<Cart>(`${API_BASE}/clear`, {});
    return data as unknown as Cart;
  } catch {
    return { items: [] };
  }
}

export async function countItems(): Promise<number> {
  const cart = await getCart();
  return cart.items.reduce((sum, i) => sum + i.quantity, 0);
}
