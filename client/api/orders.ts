import type { CartItem, Order, OrderStatus, ShippingAddress } from "./types";
import { http, unwrap } from "./http";

// User Orders
export async function listOrders(_token: string): Promise<Order[]> {
  const res = await http.get(`/orders/me`);
  return unwrap<Order[]>(res);
}

export async function getOrder(id: string, _token: string): Promise<Order> {
  const res = await http.get(`/orders/${id}`);
  return unwrap<Order>(res);
}

export async function createOrder(params: {
  items: CartItem[];
  shipping: ShippingAddress;
  token: string;
}): Promise<Order> {
  const res = await http.post(`/orders`, {
    items: params.items,
    shippingAddress: params.shipping,
  });
  // Accept both 200 and 201 responses; unwrap handles envelope
  return unwrap<Order>(res);
}

export async function updateStatus(
  id: string,
  status: OrderStatus,
  _token: string,
): Promise<Order> {
  const res = await http.patch(`/orders/${id}/status`, { status });
  return unwrap<Order>(res);
}
