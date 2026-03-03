import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "supervisor" | "coordenador" | "vendedor" | "posvenda";

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
    
    // Posvenda only sees perfil, pos-venda, eficacia
    if (role === "posvenda") {
      return ["/perfil", "/pos-venda", "/eficacia"].includes(page);
    }

    // Vendedor sees perfil, ranking (/), eficacia
    if (role === "vendedor") {
      return ["/perfil", "/", "/eficacia"].includes(page);
    }

    // Pages accessible by supervisor and coordenador
    const allAccess = ["/perfil", "/", "/eficacia", "/pos-venda", "/inbound"];
    if (allAccess.includes(page)) return true;

    return false;
  };

  return { role, loading, canAccess };
}
