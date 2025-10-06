import { useCart } from "@/state/CartContext";
import { useAuth } from "@/state/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/api/products";
import { createOrder } from "@/api/orders";
import type { ShippingAddress } from "@/api/types";
import { useNavigate } from "react-router-dom";
import { getToken } from "@/api/auth";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const map = new Map(products.map((p) => [p._id, p]));
  const total = items.reduce((a, i) => a + (map.get(i.productId)?.price || 0) * i.quantity, 0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const shipping: ShippingAddress = {
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      addressLine1: String(data.get("addressLine1") || ""),
      city: String(data.get("city") || ""),
      state: String(data.get("state") || ""),
      postalCode: String(data.get("postalCode") || ""),
      country: String(data.get("country") || ""),
    };
    const token = getToken() || "";
    const order = await createOrder({ items, shipping, token });
    await clear();
    navigate(`/order/success/${order._id}`);
  }

  if (items.length === 0)
    return <div className="container mx-auto px-4 py-10">Your cart is empty.</div>;

  return (
    <div className="container mx-auto px-4 py-10 grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">Checkout</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Full Name</label>
              <input name="name" required className="w-full rounded-md bg-muted/60 px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Phone</label>
              <input name="phone" required className="w-full rounded-md bg-muted/60 px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Address</label>
            <input name="addressLine1" required className="w-full rounded-md bg-muted/60 px-3 py-2" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">City</label>
              <input name="city" required className="w-full rounded-md bg-muted/60 px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">State</label>
              <input name="state" required className="w-full rounded-md bg-muted/60 px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Postal Code</label>
              <input name="postalCode" required className="w-full rounded-md bg-muted/60 px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Country</label>
            <input name="country" required className="w-full rounded-md bg-muted/60 px-3 py-2" />
          </div>

          <div className="rounded-xl bg-card ring-1 ring-border/60 p-4">
            <div className="font-medium">Payment</div>
            <p className="text-sm text-muted-foreground">
              Payment will be processed with a placeholder API in production.
            </p>
          </div>

          <button type="submit" className="rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium">
            Place Order
          </button>
        </form>
      </div>

      <aside className="rounded-xl bg-card ring-1 ring-border/60 p-4 h-fit">
        <div className="font-medium">Order Summary</div>
        <div className="mt-3 space-y-2 text-sm">
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between">
              <span>
                {map.get(i.productId)?.name} × {i.quantity}
              </span>
              <span>${((map.get(i.productId)?.price || 0) * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold border-t pt-2 mt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
