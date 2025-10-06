import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/api/products";
import { getFeaturedSellers } from "@/api/sellers";
import ProductCard from "@/components/ProductCard";
import SellerCard from "@/components/SellerCard";
import CategoryPill from "@/components/CategoryPill";
import { Link } from "react-router-dom";

export default function Index() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["home-products"],
    queryFn: getAllProducts,
  });
  const { data: sellers = [] } = useQuery({
    queryKey: ["sellers"],
    queryFn: getFeaturedSellers,
  });
  console.log(products);
  const featured = products.slice(0, 8);
  const trending = [...products]
    .sort((a, b) => (b.rating?.count ?? 0) - (a.rating?.count ?? 0))
    .slice(0, 8);
  const newest = [...products].sort((a, b) => Number(b._id) - Number(a._id)).slice(0, 8);

  return (
    <div>
      <section className="container mx-auto px-4 pt-10 pb-16 md:pt-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Discover Local Creativity
            </h1>
            <p className="mt-4 text-muted-foreground max-w-prose">
              Shop unique handmade art, crafts, paintings, and custom creative
              products from local sellers. Support artists near you with every
              purchase.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <CategoryPill to="/products?category=all" label="All" />
              <CategoryPill to="/products?q=painting" label="Paintings" />
              <CategoryPill to="/products?q=craft" label="Crafts" />
              <CategoryPill to="/products?q=digital" label="Digital Art" />
              <CategoryPill to="/products?q=diy" label="DIY" />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Link
                to="/products"
                className="rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium"
              >
                Explore Products
              </Link>
              <Link
                to="/wishlist"
                className="text-sm underline underline-offset-4"
              >
                View Wishlist
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-primary/40 via-secondary/50 to-accent/40 shadow-[var(--shadow-soft)]"></div>
            <img
              src="/placeholder.svg"
              alt="Artistic collage"
              className="absolute inset-0 m-auto h-24 opacity-50"
            />
          </div>
        </div>
      </section>

      <HomeSection title="Featured">
        <ProductGrid loading={isLoading} products={featured} />
      </HomeSection>

      <HomeSection title="Trending">
        <ProductGrid loading={isLoading} products={trending} />
      </HomeSection>

      <HomeSection title="New Arrivals">
        <ProductGrid loading={isLoading} products={newest} />
      </HomeSection>

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold">
            Featured Sellers
          </h2>
          <Link to="/sellers" className="text-sm underline underline-offset-4">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellers.map((s) => (
            <SellerCard key={s._id} seller={s} />
          ))}
        </div>
      </section>
    </div>
  );
}

function HomeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        <Link to="/products" className="text-sm underline underline-offset-4">
          View all
        </Link>
      </div>
      {children}
    </section>
  );
}

function ProductGrid({
  loading,
  products,
}: {
  loading: boolean;
  products: any[];
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-muted/60 h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  try {
    const rows = Array.isArray(products) ? products : [];
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rows.map((p, idx) => {
          if (!p || typeof p !== "object") {
            return (
              <div
                key={`placeholder-${idx}`}
                className="rounded-xl bg-muted/60 h-64"
              />
            );
          }
          const id = (p as any).id ?? `prod-${idx}`;
          return <ProductCard key={`${id}-${idx}`} product={p as any} />;
        })}
      </div>
    );
  } catch (err) {
    console.error("ProductGrid render error:", err, products);
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-muted/60 h-64" />
        ))}
      </div>
    );
  }
}
