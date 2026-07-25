import { createAuthClient } from "better-auth/react";

// Synchronously extract and store session token from URL callback if present
if (typeof window !== "undefined") {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    localStorage.setItem("token", token);
    params.delete("token");
    const newSearch = params.toString() ? `?${params.toString()}` : "";
    window.history.replaceState({}, document.title, window.location.pathname + newSearch);
  }
}

const getBackendUrl = (): string => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      return "https://backend-cloudflare-worker.chmahesh997.workers.dev";
    }
  }
  return import.meta.env.VITE_BACKEND_URL || "http://localhost:8787";
};

export const authClient = createAuthClient({
  baseURL: getBackendUrl(),
  fetchOptions: {
    onRequest(context) {
      const token = localStorage.getItem("token");
      if (token) {
        context.headers.set("Authorization", token.startsWith("Bearer ") ? token : `Bearer ${token}`);
      }
    }
  }
});
