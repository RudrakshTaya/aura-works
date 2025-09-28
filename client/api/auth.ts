import type { AuthCredentials, User } from "./types";
import { http, unwrap } from "./http";

const API_BASE = "/auth"; // http has baseURL /api

export async function login({
  email,
  password,
}: AuthCredentials): Promise<{ user: User; token: string }> {
  try {
    const res = await http.post(
      `${API_BASE}/user/login`,
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    const payload = unwrap<{ token: string; user: User }>(res);
    localStorage.setItem("auth_user", JSON.stringify(payload.user));
    localStorage.setItem("auth_token", payload.token);
    return { user: payload.user, token: payload.token };
  } catch (err: any) {
    console.error("Login failed:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Login failed");
  }
}

export async function signup({
  name,
  email,
  password,
}: { name: string } & AuthCredentials): Promise<{ user: User; token: string }> {
  try {
    const res = await http.post(
      `${API_BASE}/user/signup`,
      { name, email, password },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    const payload = unwrap<{ token: string; user: User }>(res);
    localStorage.setItem("auth_user", JSON.stringify(payload.user));
    localStorage.setItem("auth_token", payload.token);
    return { user: payload.user, token: payload.token };
  } catch (err: any) {
    console.error("Signup failed:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Signup failed");
  }
}

export function getCurrentUser(): User | null {
  const user = localStorage.getItem("auth_user");
  if (!user || user === "undefined") return null;
  try {
    return JSON.parse(user) as User;
  } catch (err) {
    console.error("Failed to parse auth_user:", err);
    return null;
  }
}

export function getToken(): string | null {
  const token = localStorage.getItem("auth_token");
  return token && token !== "undefined" ? token : null;
}

export function logout() {
  localStorage.removeItem("auth_user");
  localStorage.removeItem("auth_token");
}

export function updateProfile(patch: Partial<User>): User | null {
  const current = getCurrentUser();
  if (!current) return null;
  const updated: User = { ...current, ...patch } as User;
  localStorage.setItem("auth_user", JSON.stringify(updated));
  return updated;
}
