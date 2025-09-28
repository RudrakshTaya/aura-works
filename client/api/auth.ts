import type { AuthCredentials, User } from "./types";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/auth/user";

export async function login({ email, password }: AuthCredentials): Promise<User & { token: string }> {
  try {
    const { data } = await axios.post(`${API_BASE}/login`, { email, password }, {
      headers: { "Content-Type": "application/json" },
    });
    // store user locally if needed
    localStorage.setItem("auth_user", JSON.stringify(data.user));
    localStorage.setItem("auth_token", data.token);
    return data.user;
  } catch (err: any) {
    console.error("Login failed:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Login failed");
  }
}

export async function signup({ name, email, password }: { name: string } & AuthCredentials): Promise<User & { token: string }> {
  try {
    const { data } = await axios.post(`${API_BASE}/signup`, { name, email, password }, {
      headers: { "Content-Type": "application/json" },
    });
    localStorage.setItem("auth_user", JSON.stringify(data.user));
    localStorage.setItem("auth_token", data.token);
    return data.user;
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

export function logout() {
  localStorage.removeItem("auth_user");
  localStorage.removeItem("auth_token");
}
