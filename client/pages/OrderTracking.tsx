import { useParams } from "react-router-dom";
import { getOrder, updateStatus } from "@/api/orders";
import { useEffect, useMemo, useState } from "react";

const steps = ["Placed","Shipped","Delivered"] as const;

export default function OrderTracking() {
  const { id } = useParams();
  const [tick, setTick] = useState(0);
  const order = useMemo(()=> id ? getOrder(id) : undefined, [id, tick]);

  useEffect(()=>{
    const t = setInterval(()=> setTick((x)=>x+1), 60000);
    return ()=> clearInterval(t);
  },[]);

  if (!order) return <div className="container mx-auto px-4 py-10">Order not found.</div>;

  const placed = new Date(order.createdAt).getTime();
  const minutes = Math.floor((Date.now() - placed)/60000);
  let idx = 0;
  if (minutes > 1) idx = 1;
  if (minutes > 3) idx = 2;
  if (order.status !== steps[idx]) updateStatus(order.id, steps[idx]);

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-semibold">Order #{order.id}</h1>
      <div className="mt-2 text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleString()}</div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {steps.map((s, i) => (
          <div key={s} className={`rounded-xl p-4 text-center ring-1 ${i<=idx? 'bg-foreground text-background ring-foreground' : 'bg-card ring-border/60'}`}>
            <div className="font-medium">{s}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">Status updates every minute for demo purposes.</div>
    </div>
  );
}
