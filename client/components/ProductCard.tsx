import { Link } from "react-router-dom";
import type { Product } from "@/api/types";
import { useCart } from "@/state/CartContext";
import { useWishlist } from "@/state/WishlistContext";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { ids, toggle } = useWishlist();
  const safeId = product?._id ?? "";
  const title = product?.name ?? "Untitled";
  const image = product?.images?.[0] || "/placeholder.svg";
  const price = typeof product?.price === "number" ? product.price : 0;
  const rating = typeof product?.ratings === "number" ? product.ratings : 0;
  const wished = Array.isArray(ids) ? ids.includes(String(safeId)) : false;

  const handleAddToCart = async () => {
    try {
      if (!safeId) throw new Error("Invalid product id");
      await add(String(safeId), 1, {});
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  return (
    <div className="group rounded-xl bg-card shadow-[var(--shadow-soft)] ring-1 ring-border/60 overflow-hidden hover:shadow-xl transition-shadow">
      <Link to={`/product/${safeId}`} className="block aspect-square bg-muted/60 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-contain p-6 group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${safeId}`} className="line-clamp-2 font-medium hover:underline">
          {title}
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-lg font-semibold">${price.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">⭐ {rating.toFixed(1)}</div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 rounded-full bg-foreground text-background text-sm py-2 hover:opacity-90"
          >
            Add to Cart
          </button>
          <button
            aria-label="Wishlist"
            onClick={() => toggle(String(safeId))}
            className={`rounded-full px-3 py-2 bg-secondary hover:bg-secondary/80 ${wished ? "text-red-500" : "text-foreground/80"}`}
          >
            {wished ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
}
