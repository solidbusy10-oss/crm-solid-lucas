import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, LogOut, TrendingUp, Package, BarChart3, FileText, ShoppingCart, Percent } from "lucide-react";
import GaugeChart from "@/components/GaugeChart";
import { toast } from "sonner";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  cargo: string | null;
  equipe: string | null;
}

interface Indicators {
  form: number;
  cg_vendas: number;
  conv_vendas: number;
  audit_vendas: number;
  audit_trc: number;
  cg_posvenda: number;
  instalada: number;
  perc_instalacao: number;
}

const defaultIndicators: Indicators = {
  form: 0, cg_vendas: 0, conv_vendas: 0, audit_vendas: 0, audit_trc: 0,
  cg_posvenda: 0, instalada: 0, perc_instalacao: 0,
};

const Perfil = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [indicators, setIndicators] = useState<Indicators>(defaultIndicators);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      setUserEmail(user.email || "");

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileData) setProfile(profileData);

      const currentPeriod = new Date().toISOString().slice(0, 7);
      const { data: indicatorData } = await supabase
        .from("seller_indicators")
        .select("*")
        .eq("user_id", user.id)
        .eq("period", currentPeriod)
        .single();

      if (indicatorData) {
        setIndicators({
          form: indicatorData.form,
          cg_vendas: indicatorData.cg_vendas,
          conv_vendas: Number(indicatorData.conv_vendas),
          audit_vendas: Number(indicatorData.audit_vendas),
          audit_trc: Number(indicatorData.audit_trc),
          cg_posvenda: indicatorData.cg_posvenda,
          instalada: indicatorData.instalada,
          perc_instalacao: Number(indicatorData.perc_instalacao),
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado!");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const statCard = (icon: React.ReactNode, label: string, value: string | number, color: string = "text-foreground") => (
    <div className="glass-card rounded-xl p-4 flex items-center gap-4">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className={`text-2xl font-bold font-display ${color}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="glass-card rounded-xl p-6 mb-6 glow-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/40 to-accent/20 border-2 border-primary/30 flex items-center justify-center">
                <span className="text-3xl font-bold font-display text-primary">
                  {(profile?.display_name || userEmail).charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display text-foreground">
                  {profile?.display_name || userEmail}
                </h1>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs bg-primary/15 text-primary px-2.5 py-0.5 rounded-full font-semibold">
                    {profile?.cargo || "Vendedor"}
                  </span>
                  {profile?.equipe && (
                    <span className="text-xs bg-muted/50 text-muted-foreground px-2.5 py-0.5 rounded-full">
                      {profile.equipe}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive hover:bg-destructive/25 transition-all text-sm font-semibold"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>

        {/* Vendas Section */}
        <h2 className="text-lg font-bold font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Indicadores de Vendas
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {statCard(<FileText className="h-5 w-5 text-primary" />, "Formulários", indicators.form)}
          {statCard(<ShoppingCart className="h-5 w-5 text-primary" />, "CG Vendas", indicators.cg_vendas)}
          {statCard(<Percent className="h-5 w-5 text-primary" />, "Auditoria", `${indicators.audit_vendas}%`)}
          {statCard(<BarChart3 className="h-5 w-5 text-primary" />, "Audit TRC", `${indicators.audit_trc}%`)}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
            <GaugeChart label="Form" value={indicators.form} max={50} />
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
            <GaugeChart label="CG Vendas" value={indicators.cg_vendas} max={30} />
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
            <GaugeChart label="Conv. Vendas" value={indicators.conv_vendas} isPercentage />
          </div>
        </div>

        {/* Pós-Venda Section */}
        <h2 className="text-lg font-bold font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Indicadores Pós-Venda
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {statCard(<ShoppingCart className="h-5 w-5 text-primary" />, "CG Pós-Venda", indicators.cg_posvenda)}
          {statCard(<Package className="h-5 w-5 text-primary" />, "Instalada", indicators.instalada)}
          {statCard(<TrendingUp className="h-5 w-5 text-primary" />, "% Instalação", `${indicators.perc_instalacao}%`)}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
            <GaugeChart label="CG" value={indicators.cg_posvenda} max={30} />
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
            <GaugeChart label="Instalada" value={indicators.instalada} max={30} />
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
            <GaugeChart label="% Instalação" value={indicators.perc_instalacao} isPercentage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
