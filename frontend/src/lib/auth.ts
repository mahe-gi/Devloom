import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8787", // the base url of your auth server
});
