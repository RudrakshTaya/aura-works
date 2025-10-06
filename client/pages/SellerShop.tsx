import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/api/products";
import { getFeaturedSellers } from "@/api/sellers";
import SellerCard from "@/components/SellerCard";
import ProductCard from "@/components/ProductCard";

function assignSellerId(productId: string, sellerIds: string[]) {
  const hash = Array.from(productId).reduce(
    (acc, c) => acc + c.charCodeAt(0),
    0,
  );
  return sellerIds[hash % sellerIds.length];
}

export default function SellerShop() {
  const { id } = useParams();
  const { data: sellers = [] } = useQuery({
    queryKey: ["sellers"],
    queryFn: getFeaturedSellers,
  });
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const seller = sellers.find((s) => s.id === id) || sellers[0];
  const sellerIds = sellers.map((s) => s.id);
  const list = products.filter(
    (p) => assignSellerId(p._id, sellerIds) === seller.id,
  );

  if (!seller)
    return (
      <div className="container mx-auto px-4 py-10">Seller not found.</div>
    );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="rounded-3xl bg-gradient-to-br from-primary/40 via-secondary/50 to-accent/40 p-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="h-16 w-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {seller.name}
              </h1>
              <div className="text-sm text-muted-foreground">
                ⭐ {seller.rating} · {seller.location}
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-prose">{seller.bio}</p>
        </div>
      </div>

      <h2 className="mt-8 text-xl md:text-2xl font-semibold">Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {list.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      <h2 className="mt-10 text-xl md:text-2xl font-semibold">
        About the Seller
      </h2>
      <div className="mt-3 max-w-2xl">
        <SellerCard seller={seller} />
      </div>

      <h2 className="mt-10 text-xl md:text-2xl font-semibold">
        Ratings & Reviews
      </h2>
      <div className="mt-3 space-y-3">
        {[
          "Beautiful work!",
          "Fast shipping and great quality.",
          "Highly recommend this shop.",
        ].map((t, i) => (
          <div key={i} className="rounded-xl bg-card ring-1 ring-border/60 p-4">
            <div className="text-sm">{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
