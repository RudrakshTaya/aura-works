export type Review = {
  userId: string;
  comment: string;
  rating: number; // 1-5
  createdAt: string;
};

export type Attributes = {
  color?: string[];
  size?: string[];
  material?: string;
};

export type Product = {
  _id: string;
  sellerId?: string;
  name: string;
  description?: string;
  category?: string;
  subCategory?: string;
  attributes?: Attributes;
  price: number;
  discount?: number;
  stock: number;
  images: string[];
  tags?: string[];
  ratings?: number; // aggregate average rating
  reviews?: Review[];
  createdAt?: string;
  updatedAt?: string;
};

export type Seller = {
  _id: string;
  name: string;
  avatar: string;
  rating: number;
  bio: string;
  location: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  addresses?: ShippingAddress[];
  wishlist?: string[];
};

export type AuthCredentials = { email: string; password: string };

export type CartItem = {
  productId: string;
  quantity: number;
  selectedAttributes?: Record<string, any>;
};
export type Cart = { items: CartItem[] };

// Backend shipping address shape
export type ShippingAddress = {
  name: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type Order = {
  _id: string;
  userId?: string;
  items: (CartItem & { sellerId?: string; priceAtPurchase?: number })[];
  totalAmount: number;
  status: OrderStatus;
  orderedAt: string;
  updatedAt?: string;
  shippingAddress: ShippingAddress;
};
