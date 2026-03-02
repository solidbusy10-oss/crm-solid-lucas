import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "supervisor" | "coordenador" | "vendedor";

export function useUserRole() {
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.rpc("get_user_role", { _user_id: user.id });
      setRole(data as AppRole | null);
      setLoading(false);
    };

    fetchRole();
  }, []);

  const canAccess = (page: string): boolean => {
    if (!role) return false;
    
    // Pages accessible by all roles
    const allAccess = ["/perfil", "/", "/eficacia"];
    if (allAccess.includes(page)) return true;

    // Inbound only for supervisor and coordenador
    if (page === "/inbound") {
      return role === "supervisor" || role === "coordenador";
    }

    return false;
  };

  return { role, loading, canAccess };
}
