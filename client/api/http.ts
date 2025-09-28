import axios from "axios";

// Determine API base URL: prefer VITE_API_BASE, fallback to same-origin /api
const baseURL = (typeof window !== "undefined" && (import.meta as any)?.env?.VITE_API_BASE)
  ? (import.meta as any).env.VITE_API_BASE
  : (typeof window !== "undefined" ? `${window.location.origin}/api` : "http://localhost:8080/api");

export const http = axios.create({ baseURL });

// Attach Authorization header automatically if token exists
http.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("auth_token");
    if (token && token !== "undefined") {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// Normalize success envelope { success, data }
export function unwrap<T = any>(res: any): T {
  if (!res) return res as T;
  const data = res.data ?? res;
  if (data && typeof data === "object" && "success" in data && "data" in data) {
    return (data as any).data as T;
  }
  return data as T;
}
