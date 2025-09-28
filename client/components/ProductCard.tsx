import { Link } from "react-router-dom";
import type { Product } from "@/api/types";
import { useCart } from "@/state/CartContext";
import { useWishlist } from "@/state/WishlistContext";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { ids, toggle } = useWishlist();
  const wished = Array.isArray(ids) ? ids.includes(product.id) : false;


  // Async handler for Add to Cart
  const handleAddToCart = async () => {
    try {
      await add(String(product.id), 1, {}); // Pass empty object for selectedAttributes
      console.log(`${product.title} added to cart`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  return (
    <div className="group rounded-xl bg-card shadow-[var(--shadow-soft)] ring-1 ring-border/60 overflow-hidden hover:shadow-xl transition-shadow">
      <Link to={`/product/${product.id}`} className="block aspect-square bg-muted/60 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-contain p-6 group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`} className="line-clamp-2 font-medium hover:underline">
          {product.title}
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-lg font-semibold">${product.price.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">⭐ {product.rating?.rate ?? 4.5}</div>
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
            onClick={() => toggle(product.id)} 
            className={`rounded-full px-3 py-2 bg-secondary hover:bg-secondary/80 ${wished ? "text-red-500" : "text-foreground/80"}`}
          >
            {wished ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
}
