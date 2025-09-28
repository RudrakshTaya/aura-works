export type Rating = {
  rate: number;
  count: number;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: Rating;
};

export type Seller = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  bio: string;
  location: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  savedSellerIds?: string[];
};

export type AuthCredentials = { email: string; password: string; };

export type CartItem = { productId: number; quantity: number };
export type Cart = { items: CartItem[] };

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type OrderStatus = "Placed" | "Shipped" | "Delivered";

export type Order = {
  id: string;
  userId?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  shipping: ShippingAddress;
};
