import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "@/components/Layout";
import ProductsPage from "@/pages/Products";
import Placeholder from "@/pages/Placeholder";
import ProductDetail from "@/pages/ProductDetail";

const queryClient = new QueryClient();

import { AuthProvider } from "@/state/AuthContext";
import { CartProvider } from "@/state/CartContext";
import { WishlistProvider } from "@/state/WishlistContext";
import CartPage from "@/pages/Cart";
import CheckoutPage from "@/pages/Checkout";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import WishlistPage from "@/pages/Wishlist";
import LoginPage from "@/pages/auth/Login";
import SignupPage from "@/pages/auth/Signup";
import ForgotPage from "@/pages/auth/Forgot";
import ProfilePage from "@/pages/Profile";
import SellerShop from "@/pages/SellerShop";
import OrderTracking from "@/pages/OrderTracking";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetail />} />

                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order/success/:id" element={<CheckoutSuccess />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/seller/:id" element={<SellerShop />} />
                  <Route path="/order/:id" element={<OrderTracking />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot" element={<ForgotPage />} />

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
