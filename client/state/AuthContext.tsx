import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/api/types";
import * as Auth from "@/api/auth";

interface AuthCtx {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  update: (patch: Partial<User>) => void;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(Auth.getCurrentUser());
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    user,
    async login(email, password) {
      const { user: u } = await Auth.login({ email, password });
      setUser(u);
    },
    async signup(name, email, password) {
      const { user: u } = await Auth.signup({ name, email, password });
      setUser(u);
    },
    logout() {
      Auth.logout();
      setUser(null);
    },
    update(patch) {
      const u = Auth.updateProfile(patch);
      setUser(u);
    },
  }), [user]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
