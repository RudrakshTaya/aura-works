import axios from "axios";
import type { Cart, CartItem } from "./types";

const API_BASE = "http://localhost:8080/api/users/cart";

// 🔹 Helper to get auth token safely
function getToken(): string | null {
  const token = localStorage.getItem("auth_token");
  return token && token !== "undefined" ? token : null;
}

// 🔹 Get current cart
export async function getCart(): Promise<Cart> {
  const token = getToken();
  if (!token) return { items: [] };

  try {
    const { data } = await axios.get<Cart>(API_BASE, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    console.error("Error fetching cart:", err);
    return { items: [] };
  }
}

// 🔹 Add item to cart
export async function addToCart(
  productId: string,
  quantity = 1,
  selectedAttributes: Record<string, string> = {}
): Promise<Cart> {
  const token = getToken();
  if (!token) return { items: [] };

  try {
    const { data } = await axios.post<Cart>(
      `${API_BASE}/add`,
      { productId, quantity, selectedAttributes },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (err) {
    console.error("Error adding to cart:", err);
    return { items: [] };
  }
}

// 🔹 Remove item from cart
export async function removeFromCart(productId: string): Promise<Cart> {
  const token = getToken();
  if (!token) return { items: [] };

  try {
    const { data } = await axios.post<Cart>(
      `${API_BASE}/remove`,
      { productId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (err) {
    console.error("Error removing item from cart:", err);
    return { items: [] };
  }
}

// 🔹 Count total items in cart
export async function countItems(): Promise<number> {
  const cart = await getCart();
  return cart.items.reduce((sum, i) => sum + i.quantity, 0);
}
