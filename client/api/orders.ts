import type { CartItem, Order, OrderStatus, ShippingAddress } from "./types";
import { http, unwrap } from "./http";

// User Orders
export async function listOrders(_token?: string): Promise<Order[]> {
  const res = await http.get(`/orders/me`);
  return unwrap<Order[]>(res) ?? [];
}

export async function getOrder(id: string, _token?: string): Promise<Order> {
  try {
    const res = await http.get(`/orders/${id}`);
    return unwrap<Order>(res);
  } catch {
    // Fallback: fetch my orders and find one
    const all = await listOrders(_token);
    const found = all.find((o) => o._id === id);
    if (!found) throw new Error("Order not found");
    return found;
  }
}

export async function createOrder(params: {
  items: CartItem[];
  shipping: ShippingAddress;
  token?: string;
}): Promise<Order> {
  const res = await http.post(`/orders`, {
    items: params.items,
    shippingAddress: params.shipping,
  });
  return unwrap<Order>(res);
}

// Admin-only in backend; keep exported but not used in user flows
export async function updateStatus(
  id: string,
  status: OrderStatus,
  _token?: string,
): Promise<Order> {
  const res = await http.patch(`/orders/${id}/status`, { status });
  return unwrap<Order>(res);
}
