import axios from "axios";
import type { CartItem, Order, OrderStatus, ShippingAddress } from "./types";

const BASE = "http://localhost:8080/api";

// ------------------
// User Orders
// ------------------

// 1️⃣ List current user's orders
export async function listOrders(token: string): Promise<Order[]> {
  const res = await axios.get(`${BASE}/orders/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 200) throw new Error("Failed to fetch orders");
  return res.data.data ?? res.data;
}

// 2️⃣ Get a specific order by ID
export async function getOrder(id: string, token: string): Promise<Order> {
  const res = await axios.get(`${BASE}/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 200) throw new Error("Failed to fetch order");
  return res.data.data ?? res.data;
}

// 3️⃣ Create a new order
export async function createOrder(params: {
  items: CartItem[];
  shipping: ShippingAddress;
  token: string; // user's JWT
}): Promise<Order> {
  const res = await axios.post(
    `${BASE}/orders`,
    { items: params.items, shippingAddress: params.shipping },
    { headers: { Authorization: `Bearer ${params.token}` } }
  );
  if (res.status !== 201) throw new Error("Failed to create order");
  return res.data.data ?? res.data;
}

// 4️⃣ Update order status (admin or seller)
export async function updateStatus(
  id: string,
  status: OrderStatus,
  token: string
): Promise<Order> {
  const res = await axios.patch(
    `${BASE}/orders/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status !== 200) throw new Error("Failed to update order status");
  return res.data.data ?? res.data;
}
