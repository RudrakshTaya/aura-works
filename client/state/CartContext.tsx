import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as CartApi from "@/api/cart";
import type { CartItem } from "@/api/types";

interface CartCtx {
  items: CartItem[];
  count: number;
  add: (productId: string, quantity?: number, selectedAttributes?: Record<string, string>) => Promise<void>;
  update: (productId: string, quantity: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
}

const Ctx = createContext<CartCtx | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Fetch cart on mount
  useEffect(() => {
    async function fetchCart() {
      const cart = await CartApi.getCart();
      setItems(cart.items);
    }
    fetchCart();
  }, []);

  const add = async (productId: string, quantity = 1, selectedAttributes: Record<string, string> = {}) => {
    const cart = await CartApi.addToCart(productId, quantity, selectedAttributes);
    setItems(cart.items);
  };

  const update = async (productId: string, quantity: number) => {
    // You can add an updateQuantity API if backend supports it
    const cart = await CartApi.addToCart(productId, quantity); // fallback to add endpoint
    setItems(cart.items);
  };

  const remove = async (productId: string) => {
    const cart = await CartApi.removeFromCart(productId);
    setItems(cart.items);
  };

  const clear = async () => {
    const cart = await CartApi.clearCart?.(); // if you implement clear in backend
    if (cart) setItems(cart.items);
    else setItems([]);
  };

  const value = useMemo<CartCtx>(() => ({
    items,
    count: items.reduce((a, i) => a + i.quantity, 0),
    add,
    update,
    remove,
    clear,
  }), [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
