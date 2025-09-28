import { createContext, useContext, useState, useEffect } from "react";
import { addToWishlist, removeFromWishlist, getWishlist } from "@/api/wishlist";

type WishlistContextType = {
  ids: number[];
  toggle: (id: number) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType>({
  ids: [],
  toggle: async () => {},
});

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [ids, setIds] = useState<number[]>([]);
const token = localStorage.getItem("auth_token");
  useEffect(() => {
    async function fetchWishlist() {
      try {
        const list = await getWishlist(token); // real API returns number[]
        setIds(Array.isArray(list) ? list : []);
      } catch {
        setIds([]);
      }
    }
    fetchWishlist();
  }, []);

  const toggle = async (productId: number) => {
    try {
      if (ids.includes(productId)) {
        await removeFromWishlist(productId,token);
        setIds((prev) => prev.filter((id) => id !== productId));
      } else {
        await addToWishlist(productId,token);
        setIds((prev) => [...prev, productId]);
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
