import { Link, useParams } from "react-router-dom";

export default function CheckoutSuccess() {
  const { id } = useParams();
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-accent flex items-center justify-center text-2xl">✓</div>
      <h1 className="mt-4 text-2xl md:text-3xl font-semibold">Order placed successfully</h1>
      <p className="mt-2 text-muted-foreground">Your order ID is {id}. You can track it below.</p>
      <div className="mt-6 flex gap-3 justify-center">
        <Link to={`/order/${id}`} className="rounded-full bg-foreground text-background px-4 py-2 text-sm">Track Order</Link>
        <Link to="/products" className="rounded-full bg-secondary px-4 py-2 text-sm">Continue Shopping</Link>
      </div>
    </div>
  );
}
