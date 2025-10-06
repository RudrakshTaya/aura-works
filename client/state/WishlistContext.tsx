import React, { createContext, useContext, useState, useEffect } from "react";
import { addToWishlist, removeFromWishlist, getWishlist } from "@/api/wishlist";
import { getToken } from "@/api/auth";

type WishlistContextType = {
  ids: number[];
  toggle: (id: number | string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType>({
  ids: [],
  toggle: async () => {},
});

export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    let mounted = true;
    async function fetchWishlist() {
      try {
        if (!getToken()) {
          if (mounted) setIds([]);
          return;
        }
        const list = await getWishlist();
        if (mounted) setIds(Array.isArray(list) ? list : []);
      } catch {
        if (mounted) setIds([]);
      }
    }
    fetchWishlist();

    const onAuth = () => {
      fetchWishlist();
    };
    window.addEventListener("auth_change", onAuth);
    return () => {
      mounted = false;
      window.removeEventListener("auth_change", onAuth);
    };
  }, []);

  const toggle = async (productId: number | string) => {
    try {
      if (!getToken()) return;
      const id = typeof productId === "string" ? Number(productId) : productId;
      if (!Number.isFinite(id)) return;
      if (ids.includes(id)) {
        await removeFromWishlist(id);
        setIds((prev) => prev.filter((i) => i !== id));
      } else {
        await addToWishlist(id);
        setIds((prev) => [...prev, id]);
      }
    } catch (err) {
      console.error("Failed to update wishlist:", err);
    }
  };

  return (
    <WishlistContext.Provider value={{ ids, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
