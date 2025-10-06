import { getOrder } from "@/api/orders";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "@/api/auth";
import type { OrderStatus } from "@/api/types";

const steps: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered"];

export default function OrderTracking() {
  const { id } = useParams();
  const { data: order } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      if (!id) throw new Error("Missing order id");
      return await getOrder(id, getToken() || "");
    },
    enabled: !!id,
    refetchInterval: 60000,
  });

  if (!order)
    return <div className="container mx-auto px-4 py-10">Loading order...</div>;

  const placedAt = new Date(
    order.orderedAt || order.updatedAt || Date.now(),
  ).toLocaleString();
  const currentIndex = Math.max(0, steps.indexOf(order.status as OrderStatus));

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-semibold">Order #{order._id}</h1>
      <div className="mt-2 text-muted-foreground">Placed on {placedAt}</div>

      <div className="mt-8 grid grid-cols-4 gap-3">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`rounded-xl p-4 text-center ring-1 ${i <= currentIndex ? "bg-foreground text-background ring-foreground" : "bg-card ring-border/60"}`}
          >
            <div className="font-medium">{s}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Status refreshes every minute.
      </div>
    </div>
  );
}
