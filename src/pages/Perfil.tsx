import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, LogOut, TrendingUp, Package, BarChart3, FileText, ShoppingCart, Percent, Users, DollarSign, Zap, Target } from "lucide-react";
import GaugeChart from "@/components/GaugeChart";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";

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

// Mock data for supervisor team view
const mockTeamSales = {
  totalForm: 187,
  totalCG: 94,
  convMedia: 50.3,
  auditMedia: 88.5,
  members: [
    { name: "João Silva", form: 42, cg: 22, conv: 52.4 },
    { name: "Maria Santos", form: 38, cg: 20, conv: 52.6 },
    { name: "Pedro Costa", form: 35, cg: 18, conv: 51.4 },
    { name: "Ana Oliveira", form: 40, cg: 19, conv: 47.5 },
    { name: "Carlos Lima", form: 32, cg: 15, conv: 46.9 },
  ],
};

const mockTeamInstallations = {
  totalCGPos: 72,
  totalInstalada: 58,
  percMedia: 80.6,
  members: [
    { name: "João Silva", cg: 18, instalada: 15, perc: 83.3 },
    { name: "Maria Santos", cg: 16, instalada: 14, perc: 87.5 },
    { name: "Pedro Costa", cg: 14, instalada: 11, perc: 78.6 },
    { name: "Ana Oliveira", cg: 13, instalada: 10, perc: 76.9 },
    { name: "Carlos Lima", cg: 11, instalada: 8, perc: 72.7 },
  ],
};

const mockInbound = {
  totalGasto: 28500,
  totalLeads: 1425,
  valorLead: 20.0,
  valorContrato: 303.19,
  viabilidade: 67.2,
};

const Perfil = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [indicators, setIndicators] = useState<Indicators>(defaultIndicators);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { role } = useUserRole();

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

  const isSupervisor = role === "supervisor";

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
                  {role && (
                    <span className="text-xs bg-accent/15 text-accent-foreground px-2.5 py-0.5 rounded-full font-semibold capitalize">
                      {role}
                    </span>
                  )}
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

        {/* === SUPERVISOR TEAM VIEW === */}
        {isSupervisor && (
          <>
            {/* Team Sales Overview */}
            <h2 className="text-lg font-bold font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Visão do Time — Vendas
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {statCard(<FileText className="h-5 w-5 text-primary" />, "Total Forms", mockTeamSales.totalForm)}
              {statCard(<ShoppingCart className="h-5 w-5 text-primary" />, "Total CG", mockTeamSales.totalCG)}
              {statCard(<Percent className="h-5 w-5 text-primary" />, "Conv. Média", `${mockTeamSales.convMedia}%`)}
              {statCard(<BarChart3 className="h-5 w-5 text-primary" />, "Audit. Média", `${mockTeamSales.auditMedia}%`)}
            </div>

            <div className="glass-card rounded-xl p-4 mb-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-2 px-3 text-xs text-muted-foreground uppercase tracking-wider">Vendedor</th>
                    <th className="text-center py-2 px-3 text-xs text-muted-foreground uppercase tracking-wider">Form</th>
                    <th className="text-center py-2 px-3 text-xs text-muted-foreground uppercase tracking-wider">CG</th>
                    <th className="text-center py-2 px-3 text-xs text-muted-foreground uppercase tracking-wider">Conv.</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTeamSales.members.map((m, i) => (
                    <tr key={i} className="border-b border-border/10 hover:bg-primary/5 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-foreground">{m.name}</td>
                      <td className="py-2.5 px-3 text-center text-muted-foreground">{m.form}</td>
                      <td className="py-2.5 px-3 text-center text-muted-foreground">{m.cg}</td>
                      <td className="py-2.5 px-3 text-center font-semibold text-primary">{m.conv}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Team Installations Overview */}
            <h2 className="text-lg font-bold font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Visão do Time — Instalações
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {statCard(<ShoppingCart className="h-5 w-5 text-primary" />, "Total CG Pós", mockTeamInstallations.totalCGPos)}
              {statCard(<Package className="h-5 w-5 text-primary" />, "Total Instalada", mockTeamInstallations.totalInstalada)}
              {statCard(<TrendingUp className="h-5 w-5 text-primary" />, "% Média", `${mockTeamInstallations.percMedia}%`)}
            </div>

            <div className="glass-card rounded-xl p-4 mb-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-2 px-3 text-xs text-muted-foreground uppercase tracking-wider">Vendedor</th>
                    <th className="text-center py-2 px-3 text-xs text-muted-foreground uppercase tracking-wider">CG</th>
                    <th className="text-center py-2 px-3 text-xs text-muted-foreground uppercase tracking-wider">Instalada</th>
                    <th className="text-center py-2 px-3 text-xs text-muted-foreground uppercase tracking-wider">%</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTeamInstallations.members.map((m, i) => (
                    <tr key={i} className="border-b border-border/10 hover:bg-primary/5 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-foreground">{m.name}</td>
                      <td className="py-2.5 px-3 text-center text-muted-foreground">{m.cg}</td>
                      <td className="py-2.5 px-3 text-center text-muted-foreground">{m.instalada}</td>
                      <td className="py-2.5 px-3 text-center font-semibold text-primary">{m.perc}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Inbound Metrics */}
            <h2 className="text-lg font-bold font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Inbound — Resumo
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              {statCard(<DollarSign className="h-5 w-5 text-primary" />, "Total Gasto", `R$ ${mockInbound.totalGasto.toLocaleString("pt-BR")}`)}
              {statCard(<Target className="h-5 w-5 text-primary" />, "CPL (Lead)", `R$ ${mockInbound.valorLead.toFixed(2)}`)}
              {statCard(<ShoppingCart className="h-5 w-5 text-primary" />, "CPC (Contrato)", `R$ ${mockInbound.valorContrato.toFixed(2)}`)}
              {statCard(<TrendingUp className="h-5 w-5 text-primary" />, "% Viabilidade", `${mockInbound.viabilidade}%`)}
              {statCard(<Users className="h-5 w-5 text-primary" />, "Total Leads", mockInbound.totalLeads.toLocaleString("pt-BR"))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
                <GaugeChart label="CPL" value={mockInbound.valorLead} max={50} />
              </div>
              <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
                <GaugeChart label="CPC" value={mockInbound.valorContrato} max={500} />
              </div>
              <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
                <GaugeChart label="Viabilidade" value={mockInbound.viabilidade} isPercentage />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border/30 my-8" />
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-6 text-center">Meus Indicadores Pessoais</p>
          </>
        )}

        {/* Vendas Section (personal) */}
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
