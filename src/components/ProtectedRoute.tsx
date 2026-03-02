import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  page: string;
}

export function ProtectedRoute({ children, page }: ProtectedRouteProps) {
  const { canAccess, loading } = useUserRole();
  const [session, setSession] = useState<null | "loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ? "authenticated" : "unauthenticated");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ? "authenticated" : "unauthenticated");
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (session === "unauthenticated") {
    return <Navigate to="/auth" replace />;
  }

  if (!canAccess(page)) {
    return <Navigate to="/perfil" replace />;
  }

  return <>{children}</>;
}
