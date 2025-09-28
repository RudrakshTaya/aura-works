import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as CartApi from "@/api/cart";
import type { CartItem } from "@/api/types";

interface CartCtx {
  items: CartItem[];
  count: number;
  add: (productId: string | number, quantity?: number, selectedAttributes?: Record<string, string>) => Promise<void>;
  update: (productId: string | number, quantity: number) => Promise<void>;
  remove: (productId: string | number) => Promise<void>;
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

  const add = async (productId: string | number, quantity = 1, selectedAttributes: Record<string, string> = {}) => {
    const cart = await CartApi.addToCart(String(productId), quantity, selectedAttributes);
    setItems(cart.items);
  };

  const update = async (productId: string | number, quantity: number) => {
    const cart = await CartApi.addToCart(String(productId), quantity);
    setItems(cart.items);
  };

  const remove = async (productId: string | number) => {
    const cart = await CartApi.removeFromCart(String(productId));
    setItems(cart.items);
  };

  const clear = async () => {
    const cart = await CartApi.clearCart();
    setItems(cart.items);
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
