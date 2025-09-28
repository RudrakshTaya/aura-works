import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/api/products";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = Number(id);
  const { data, isLoading, error } = useQuery({ queryKey: ["product", productId], queryFn: () => getProduct(productId), enabled: Number.isFinite(productId) });

  if (!Number.isFinite(productId)) return <div className="container mx-auto px-4 py-10">Invalid product</div>;
  if (isLoading) return <div className="container mx-auto px-4 py-10">Loading…</div>;
  if (error || !data) return <div className="container mx-auto px-4 py-10">Failed to load product.</div>;

  return (
    <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-2">
      <div className="rounded-2xl bg-card ring-1 ring-border/60 p-6">
        <img src={data.image} alt={data.title} className="w-full h-auto object-contain" />
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">{data.title}</h1>
        <div className="mt-2 text-lg font-semibold">${data.price.toFixed(2)}</div>
        <div className="mt-2 text-sm text-muted-foreground">⭐ {data.rating?.rate ?? 4.5}</div>
        <p className="mt-4 max-w-prose">{data.description}</p>
        <div className="mt-6 flex items-center gap-3">
          <button className="rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium">Add to Cart</button>
          <button className="rounded-full bg-secondary px-5 py-2.5 text-sm font-medium">Wishlist</button>
        </div>
      </div>
    </div>
  );
}
