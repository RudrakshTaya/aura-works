import type { Seller } from "@/api/types";

export default function SellerCard({ seller }: { seller: Seller }) {
  return (
    <div className="rounded-xl bg-card shadow-[var(--shadow-soft)] ring-1 ring-border/60 p-4 flex items-center gap-4">
      <img src={seller.avatar} alt={seller.name} className="h-14 w-14 rounded-full object-cover" loading="lazy" />
      <div className="min-w-0">
        <div className="font-medium truncate">{seller.name}</div>
        <div className="text-xs text-muted-foreground truncate">{seller.bio}</div>
        <div className="text-xs mt-1">⭐ {seller.rating} · {seller.location}</div>
      </div>
    </div>
  );
}
