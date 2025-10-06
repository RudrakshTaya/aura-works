import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/state/AuthContext";
import { useCart } from "@/state/CartContext";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold tracking-tight text-lg md:text-xl">
            <span className="inline-block rounded-md bg-primary/70 px-2 py-1 mr-2 shadow-sm">Artistry</span>
            <span className="text-foreground">Market</span>
          </Link>

          <nav className="ml-2 hidden md:flex items-center gap-4 text-sm">
            <NavLink to="/" className={({isActive})=>cn("hover:underline underline-offset-4", isActive && "font-semibold")}>Home</NavLink>
            <NavLink to="/products" className={({isActive})=>cn("hover:underline underline-offset-4", isActive && "font-semibold")}>Explore</NavLink>
            <NavLink to="/wishlist" className={({isActive})=>cn("hover:underline underline-offset-4", isActive && "font-semibold")}>Wishlist</NavLink>
            <NavLink to="/cart" className={({isActive})=>cn("hover:underline underline-offset-4", isActive && "font-semibold")}>Cart</NavLink>
          </nav>

          <form onSubmit={submit} className="ml-auto flex-1 max-w-md hidden md:flex">
            <div className="relative w-full">
              <input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                aria-label="Search products"
                placeholder="Search art, crafts, paintings..."
                className="w-full rounded-full bg-muted/60 pl-4 pr-10 py-2 outline-none focus:ring-2 focus:ring-primary/60 shadow-sm"
              />
              <button aria-label="Search" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 bg-primary/70 text-foreground/90">
                Go
              </button>
            </div>
          </form>

          <UserActions />

          <div className="md:hidden ml-2">
            <Link to="/products" className="text-sm underline underline-offset-4">Search</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-semibold text-lg">Artistry Market</div>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Discover unique handmade art, crafts, paintings, and custom creative products from local sellers.
          </p>
        </div>
        <div>
          <div className="font-medium">Explore</div>
          <ul className="mt-2 space-y-2 text-sm">
            <li><Link to="/products" className="hover:underline">All Products</Link></li>
            <li><Link to="/wishlist" className="hover:underline">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:underline">Cart</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium">Get in touch</div>
          <p className="text-sm text-muted-foreground mt-2">hello@artistry.market</p>
        </div>
      </div>
      <div className="py-4 text-xs text-muted-foreground text-center">© {new Date().getFullYear()} Artistry. All rights reserved.</div>
    </footer>
  );
}

function UserActions() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  const firstName = user?.name?.split(" ")[0] ?? "User";

  return (
    <div className="flex items-center gap-3 ml-2 relative">
      <Link to="/cart" className="relative inline-flex items-center text-sm">
        <span>Cart</span>
        {count > 0 && (
          <span aria-label={`Cart items: ${count}`} className="ml-1 inline-flex items-center justify-center min-w-[1.25rem] h-5 rounded-full bg-foreground text-background text-[10px] px-1.5">{count}</span>
        )}
      </Link>

      {user ? (
        <div className="flex items-center gap-2 relative">
          <button onClick={() => setOpen((s) => !s)} className="inline-flex items-center gap-2 text-sm rounded-md px-2 py-1 hover:bg-muted/50">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-full" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">{firstName.slice(0,1).toUpperCase()}</div>
            )}
            <span className="hidden sm:inline">{firstName}</span>
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-md bg-card ring-1 ring-border/60 shadow-md z-50">
              <ul className="p-2 text-sm">
                <li><Link to="/orders" onClick={() => setOpen(false)} className="block px-2 py-2 hover:bg-muted/60 rounded">Orders</Link></li>
                <li><Link to="/wishlist" onClick={() => setOpen(false)} className="block px-2 py-2 hover:bg-muted/60 rounded">Wishlist</Link></li>
                <li><Link to="/profile" onClick={() => setOpen(false)} className="block px-2 py-2 hover:bg-muted/60 rounded">Settings</Link></li>
                <li>
                  <button onClick={() => { setOpen(false); logout(); }} className="w-full text-left px-2 py-2 hover:bg-muted/60 rounded">Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login" className="text-sm underline underline-offset-4">Login</Link>
      )}
    </div>
  );
}
