import { Navigate, Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { authClient } from "../lib/auth";

export function ProtectedRoute() {
  const { data: session, isPending } = authClient.useSession();
  const location = useLocation();
  
  // Legacy token fallback check for transition period
  const [hasLegacyToken, setHasLegacyToken] = useState<boolean>(false);
  
  useEffect(() => {
    setHasLegacyToken(!!localStorage.getItem("token"));
  }, [location.pathname]);

  const isAuthenticated = !!session || hasLegacyToken;

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-foreground mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="text-foreground-muted font-medium">Verifying session...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
