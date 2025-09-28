import { useWishlist } from "@/state/WishlistContext";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/api/products";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: getAllProducts });
  const list = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-semibold">Wishlist</h1>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {Array.from({length:8}).map((_,i)=> (<div key={i} className="h-64 bg-muted/60 rounded-xl animate-pulse" />))}
        </div>
      ) : list.length === 0 ? (
        <p className="mt-6 text-muted-foreground">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {list.map((p)=> (<ProductCard key={p.id} product={p} />))}
        </div>
      )}
    </div>
  );
}
