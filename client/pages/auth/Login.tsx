import { useAuth } from "@/state/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      await login(String(data.get("email")), String(data.get("password")));
      nav("/profile");
    } catch (e: any) {
      setError(e.message || "Login failed");
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="text-2xl md:text-3xl font-semibold">Login</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error && <div className="rounded-md bg-destructive/15 text-destructive px-3 py-2 text-sm">{error}</div>}
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Email</label>
          <input name="email" type="email" required className="w-full rounded-md bg-muted/60 px-3 py-2" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Password</label>
          <input name="password" type="password" required className="w-full rounded-md bg-muted/60 px-3 py-2" />
        </div>
        <button className="rounded-full bg-foreground text-background px-5 py-2.5 text-sm">Sign In</button>
      </form>
      <div className="mt-4 text-sm text-muted-foreground">
        <Link to="/signup" className="underline">Create account</Link> · <Link to="/forgot" className="underline">Forgot password</Link>
      </div>
    </div>
  );
}
