import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as CartApi from "@/api/cart";
import type { CartItem } from "@/api/types";

interface CartCtx {
  items: CartItem[];
  count: number;
  add: (
    productId: string | number,
    quantity?: number,
    selectedAttributes?: Record<string, string>,
  ) => Promise<void>;
  update: (productId: string | number, quantity: number) => Promise<void>;
  remove: (productId: string | number) => Promise<void>;
  clear: () => Promise<void>;
}

const Ctx = createContext<CartCtx | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    let mounted = true;
    async function fetchCart() {
      try {
        const cart = await CartApi.getCart();
        if (!mounted) return;
        setItems(cart.items || []);
      } catch (err) {
        console.error("Failed to load cart:", err);
        if (mounted) setItems([]);
      }
    }
    fetchCart();

    const onAuth = () => {
      fetchCart();
    };
    window.addEventListener("auth_change", onAuth);

    return () => {
      mounted = false;
      window.removeEventListener("auth_change", onAuth);
    };
  }, []);

  const add = async (
    productId: string | number,
    quantity = 1,
    selectedAttributes: Record<string, string> = {},
  ) => {
    try {
      const cart = await CartApi.addToCart(
        String(productId),
        quantity,
        selectedAttributes,
      );
      setItems(cart.items || []);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const update = async (productId: string | number, quantity: number) => {
    try {
      const cart = await CartApi.addToCart(String(productId), quantity);
      setItems(cart.items || []);
    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  };

  const remove = async (productId: string | number) => {
    try {
      const cart = await CartApi.removeFromCart(String(productId));
      setItems(cart.items || []);
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  const clear = async () => {
    try {
      const cart = await CartApi.clearCart();
      setItems(cart.items || []);
    } catch (err) {
      console.error("Failed to clear cart:", err);
      setItems([]);
    }
  };

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count: items.reduce((a, i) => a + (i.quantity || 0), 0),
      add,
      update,
      remove,
      clear,
    }),
    [items],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
