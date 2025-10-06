import { useCart } from "@/state/CartContext";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/api/products";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, update, remove, clear } = useCart();
  const navigate = useNavigate();
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: getAllProducts });

  const map = new Map(products.map((p) => [p._id, p]));
  const detailed = items.map((i) => ({ ...i, product: map.get(i.productId)! })).filter((i) => i.product);
  const subtotal = detailed.reduce((a, i) => a + i.product.price * i.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-semibold">Your Cart</h1>
      {detailed.length === 0 ? (
        <div className="mt-6 text-muted-foreground">Your cart is empty. <Link to="/products" className="underline">Start shopping</Link>.</div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,360px]">
          <div className="space-y-4">
            {detailed.map((i) => (
              <div key={i.productId} className="flex items-center gap-4 rounded-xl bg-card ring-1 ring-border/60 p-4">
                <img src={i.product.image} alt={i.product.name} className="h-20 w-20 object-contain bg-muted/60 rounded-md" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium line-clamp-1">{i.product.name}</div>
                  <div className="text-sm text-muted-foreground">${i.product.price.toFixed(2)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">Qty</label>
                    <input type="number" min={1} value={i.quantity} onChange={(e)=>update(i.productId, Math.max(1, Number(e.target.value)||1))} className="w-16 rounded-md bg-muted/60 px-2 py-1" />
                    <button onClick={()=>remove(i.productId)} className="text-xs underline underline-offset-4">Remove</button>
                  </div>
                </div>
                <div className="font-semibold">${(i.product.price * i.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <aside className="rounded-xl bg-card ring-1 ring-border/60 p-4 h-fit">
            <div className="font-medium">Order Summary</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>$0.00</span></div>
              <div className="flex justify-between font-semibold"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
            </div>
            <button onClick={()=>navigate("/checkout")} className="mt-4 w-full rounded-full bg-foreground text-background py-2 text-sm">Checkout</button>
            <button onClick={clear} className="mt-2 w-full rounded-full bg-secondary py-2 text-sm">Clear Cart</button>
          </aside>
        </div>
      )}
    </div>
  );
}
