import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  page: string;
}

export function ProtectedRoute({ children, page }: ProtectedRouteProps) {
  const { canAccess, loading } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!canAccess(page)) {
    return <Navigate to="/perfil" replace />;
  }

  return <>{children}</>;
}
