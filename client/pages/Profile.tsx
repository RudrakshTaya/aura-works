import { useAuth } from "@/state/AuthContext";
import { listOrders } from "@/api/orders";
import { useWishlist } from "@/state/WishlistContext";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/api/products";
import { Link } from "react-router-dom";
import { useState } from "react";
import { getToken } from "@/api/auth";

export default function ProfilePage() {
  const { user, update } = useAuth();
  const [tab, setTab] = useState<"orders" | "wishlist" | "sellers" | "edit">(
    "orders",
  );
  const { ids, toggle } = useWishlist();
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  const wishes = products.filter((p) => ids.includes(p.id));
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => listOrders(getToken() || ""),
  });

  if (!user)
    return (
      <div className="container mx-auto px-4 py-10">
        Please{" "}
        <Link to="/login" className="underline">
          log in
        </Link>{" "}
        to view your profile.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-4">
        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-14 w-14 rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Hi, {user.name}
          </h1>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </div>

      <div className="mt-6 flex gap-2 text-sm">
        <button
          onClick={() => setTab("orders")}
          className={`rounded-full px-3 py-1.5 ${tab === "orders" ? "bg-foreground text-background" : "bg-secondary"}`}
        >
          My Orders
        </button>
        <button
          onClick={() => setTab("wishlist")}
          className={`rounded-full px-3 py-1.5 ${tab === "wishlist" ? "bg-foreground text-background" : "bg-secondary"}`}
        >
          Wishlist
        </button>
        <button
          onClick={() => setTab("sellers")}
          className={`rounded-full px-3 py-1.5 ${tab === "sellers" ? "bg-foreground text-background" : "bg-secondary"}`}
        >
          Saved Sellers
        </button>
        <button
          onClick={() => setTab("edit")}
          className={`rounded-full px-3 py-1.5 ${tab === "edit" ? "bg-foreground text-background" : "bg-secondary"}`}
        >
          Edit Profile
        </button>
      </div>

      {tab === "orders" && (
        <div className="mt-6 space-y-3">
          {orders.length ? (
            orders.map((o) => (
              <div
                key={o.id}
                className="rounded-xl bg-card ring-1 ring-border/60 p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">Order #{o.id}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(o.createdAt).toLocaleString()} · {o.items.length}{" "}
                    items
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{o.status}</span>
                  <Link
                    to={`/order/${o.id}`}
                    className="text-sm underline underline-offset-4"
                  >
                    Track
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">No orders yet.</div>
          )}
        </div>
      )}

      {tab === "wishlist" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {wishes.map((p) => (
            <div
              key={p.id}
              className="rounded-xl bg-card ring-1 ring-border/60 p-3"
            >
              <Link
                to={`/product/${p.id}`}
                className="block aspect-square bg-muted/60 rounded-md overflow-hidden"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-contain p-4"
                />
              </Link>
              <div className="mt-2 flex items-center justify-between">
                <div className="line-clamp-1 text-sm">{p.title}</div>
                <button
                  onClick={() => toggle(p.id)}
                  className="text-sm underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "sellers" && (
        <div className="mt-6 text-muted-foreground">
          Saved sellers coming soon.
        </div>
      )}

      {tab === "edit" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            update({ name: String(f.get("name") || user.name) });
          }}
          className="mt-6 max-w-md space-y-3"
        >
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Name
            </label>
            <input
              name="name"
              defaultValue={user.name}
              className="w-full rounded-md bg-muted/60 px-3 py-2"
            />
          </div>
          <button className="rounded-full bg-foreground text-background px-4 py-2 text-sm">
            Save
          </button>
        </form>
      )}
    </div>
  );
}
