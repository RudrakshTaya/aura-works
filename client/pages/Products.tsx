import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getCategories, filterProducts, getSuggestions } from "@/api/products";
import ProductCard from "@/components/ProductCard";
import { useSearchParams } from "react-router-dom";

export default function ProductsPage() {
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: getAllProducts });
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const [params, setParams] = useSearchParams();

  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "all";
  const minPrice = Number(params.get("minPrice") ?? "");
  const maxPrice = Number(params.get("maxPrice") ?? "");
  const minRating = Number(params.get("minRating") ?? "");
  const sort = (params.get("sort") as any) ?? "popular";

  const filtered = useMemo(() => filterProducts(products, {
    q: q || undefined,
    category: category || undefined,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    minRating: Number.isFinite(minRating) ? minRating : undefined,
    sort: sort as any,
  }), [products, q, category, minPrice, maxPrice, minRating, sort]);

  const [suggestOpen, setSuggestOpen] = useState(false);
  const suggestions = useMemo(() => getSuggestions(products, q, 8), [products, q]);

  const update = (key: string, value?: string) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key); else next.set(key, value);
    setParams(next, { replace: true });
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-semibold">Explore Creative Goods</h1>
      <p className="text-muted-foreground mt-1">Search, filter, and discover handcrafted items from local artists.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-[280px,1fr]">
        <aside className="rounded-xl bg-card ring-1 ring-border/60 p-4 h-fit sticky top-24">
          <div className="font-medium">Filters</div>
          <div className="mt-3 space-y-3 text-sm">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Search</label>
              <div className="relative">
                <input value={q} onChange={(e)=>update("q", e.target.value)} onFocus={()=>setSuggestOpen(true)} onBlur={()=>setTimeout(()=>setSuggestOpen(false), 120)} placeholder="Try 'painting'" className="w-full rounded-md bg-muted/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/60" />
                {suggestOpen && suggestions.length>0 && (
                  <div className="absolute z-20 mt-1 w-full rounded-md border bg-white shadow-md">
                    {suggestions.map((s)=> (
                      <button key={s} onMouseDown={(e)=>{ e.preventDefault(); update("q", s); }} className="block w-full text-left px-3 py-2 hover:bg-muted/60 text-sm">{s}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Category</label>
              <select value={category} onChange={(e)=>update("category", e.target.value)} className="w-full rounded-md bg-muted/60 px-3 py-2">
                <option value="all">All</option>
                {categories.map((c)=> (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Min Price</label>
                <input type="number" min={0} value={Number.isFinite(minPrice)?minPrice:""} onChange={(e)=>update("minPrice", e.target.value)} className="w-full rounded-md bg-muted/60 px-3 py-2" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Max Price</label>
                <input type="number" min={0} value={Number.isFinite(maxPrice)?maxPrice:""} onChange={(e)=>update("maxPrice", e.target.value)} className="w-full rounded-md bg-muted/60 px-3 py-2" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Min Rating</label>
              <select value={Number.isFinite(minRating)?minRating:""} onChange={(e)=>update("minRating", e.target.value)} className="w-full rounded-md bg-muted/60 px-3 py-2">
                <option value="">Any</option>
                {[5,4,3,2,1].map((r)=> (
                  <option key={r} value={r}>{r}+</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Sort by</label>
              <select value={sort} onChange={(e)=>update("sort", e.target.value)} className="w-full rounded-md bg-muted/60 px-3 py-2">
                <option value="popular">Popular</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            <button onClick={()=>setParams(new URLSearchParams(), { replace:true })} className="w-full rounded-md bg-foreground text-background py-2 text-sm">Clear</button>
          </div>
        </aside>

        <section>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({length:8}).map((_,i)=> (
                <div key={i} className="rounded-xl bg-muted/60 h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">{filtered.length} results</div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((p)=> (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
