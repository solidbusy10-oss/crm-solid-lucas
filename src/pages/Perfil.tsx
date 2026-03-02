import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, LogOut, TrendingUp, Package, BarChart3, FileText, ShoppingCart, Percent, Users, DollarSign, Zap, Target, Filter, Settings } from "lucide-react";
import GaugeChart from "@/components/GaugeChart";
import FunnelChart from "@/components/FunnelChart";
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

const mockTeamSales = {
  totalForm: 187, totalCG: 94, convMedia: 50.3, auditMedia: 88.5,
  members: [
    { name: "João Silva", form: 42, cg: 22, conv: 52.4 },
    { name: "Maria Santos", form: 38, cg: 20, conv: 52.6 },
    { name: "Pedro Costa", form: 35, cg: 18, conv: 51.4 },
    { name: "Ana Oliveira", form: 40, cg: 19, conv: 47.5 },
    { name: "Carlos Lima", form: 32, cg: 15, conv: 46.9 },
  ],
};

const mockTeamInstallations = {
  totalCGPos: 72, totalInstalada: 58, percMedia: 80.6,
  members: [
    { name: "João Silva", cg: 18, instalada: 15, perc: 83.3 },
    { name: "Maria Santos", cg: 16, instalada: 14, perc: 87.5 },
    { name: "Pedro Costa", cg: 14, instalada: 11, perc: 78.6 },
    { name: "Ana Oliveira", cg: 13, instalada: 10, perc: 76.9 },
    { name: "Carlos Lima", cg: 11, instalada: 8, perc: 72.7 },
  ],
};

const mockInbound = {
  totalGasto: 28500, totalLeads: 1425, valorLead: 20.0,
  valorContrato: 303.19, viabilidade: 67.2,
};

const mockFunnel = {
  leads: 1425,
  form: 187,
  formTratados: 145,
  cg: 94,
  fila: 42,
};

const computeFunnelStages = (f: typeof mockFunnel) => {
  const convForm = f.leads > 0 ? (f.form / f.leads) * 100 : 0;
  const convFormContrato = f.form > 0 ? (f.cg / f.form) * 100 : 0;
  const convLead = f.leads > 0 ? (f.cg / f.leads) * 100 : 0;
  const cgProjetado = Math.round(f.fila * (convFormContrato / 100) + f.cg);
  const convProjetada = f.leads > 0 ? (cgProjetado / f.leads) * 100 : 0;

  return [
    { label: "Leads", value: f.leads.toLocaleString("pt-BR"), raw: f.leads },
    { label: "Form", value: f.form, raw: f.form },
    { label: "Form Tratados", value: f.formTratados, raw: f.formTratados },
    { label: "Lead x Form", value: `${convForm.toFixed(1)}%`, raw: convForm },
    { label: "Form x Contrato", value: `${convFormContrato.toFixed(1)}%`, raw: convFormContrato },
    { label: "Conversão Geral", value: `${convLead.toFixed(1)}%`, raw: convLead },
    { label: "Contratos", value: f.cg, raw: f.cg },
    { label: "Fila", value: f.fila, raw: f.fila },
    { label: "Conversão Projetada", value: `${convProjetada.toFixed(1)}%`, raw: convProjetada },
    { label: "CG Projetado", value: cgProjetado, raw: cgProjetado },
  ];
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
        .from("profiles").select("*").eq("user_id", user.id).single();
      if (profileData) setProfile(profileData);

      const currentPeriod = new Date().toISOString().slice(0, 7);
      const { data: indicatorData } = await supabase
        .from("seller_indicators").select("*").eq("user_id", user.id).eq("period", currentPeriod).single();

      if (indicatorData) {
        setIndicators({
          form: indicatorData.form, cg_vendas: indicatorData.cg_vendas,
          conv_vendas: Number(indicatorData.conv_vendas), audit_vendas: Number(indicatorData.audit_vendas),
          audit_trc: Number(indicatorData.audit_trc), cg_posvenda: indicatorData.cg_posvenda,
          instalada: indicatorData.instalada, perc_instalacao: Number(indicatorData.perc_instalacao),
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

  const statCard = (icon: React.ReactNode, label: string, value: string | number) => (
    <div className="glass-card rounded-xl p-3 flex items-center gap-3">
      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold font-display text-foreground truncate">{value}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );

  const isSupervisor = role === "supervisor";
  const isCoordenador = role === "coordenador";

  const mockInboundProfile = {
    totalLeads: 3420,
    custoLead: 18.50,
    viabilidade: 72.4,
    topCidades: [
      { nome: "São Paulo", leads: 680, viabilidade: 78.2 },
      { nome: "Rio de Janeiro", leads: 520, viabilidade: 74.5 },
      { nome: "Belo Horizonte", leads: 390, viabilidade: 71.8 },
    ],
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="glass-card rounded-xl p-5 mb-6 glow-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/40 to-accent/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold font-display text-primary">
                    {(profile?.display_name || userEmail).charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-foreground">
                  {profile?.display_name || userEmail}
                </h1>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
                <div className="flex items-center gap-2 mt-1">
                  {role && (
                    <span className="text-[10px] bg-accent/15 text-accent-foreground px-2 py-0.5 rounded-full font-semibold capitalize">
                      {role}
                    </span>
                  )}
                  {profile?.equipe && (
                    <span className="text-[10px] bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                      {profile.equipe}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/configuracoes")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 transition-all text-xs font-semibold"
              >
                <Settings className="h-4 w-4" />
                Configurações
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive hover:bg-destructive/25 transition-all text-xs font-semibold"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </div>

        {isSupervisor && (
          <>
            {/* Row 1: Funnel (left) | Vendas + Pós-Venda stacked (right) */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 mb-6">
              {/* Funnel */}
              <div>
                <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  Funil de Conversão
                </h2>
                <div className="glass-card rounded-xl p-4 glow-primary h-[calc(100%-32px)] flex items-center justify-center">
                  <FunnelChart stages={computeFunnelStages(mockFunnel)} />
                </div>
              </div>

              {/* Vendas + Pós-Venda stacked */}
              <div className="flex flex-col gap-6">
                {/* Vendas */}
                <div>
                  <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    Indicadores de Vendas
                  </h2>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {statCard(<FileText className="h-4 w-4 text-primary" />, "Formulários", indicators.form)}
                    {statCard(<ShoppingCart className="h-4 w-4 text-primary" />, "CG Vendas", indicators.cg_vendas)}
                    {statCard(<Percent className="h-4 w-4 text-primary" />, "Conv. Vendas", `${indicators.conv_vendas}%`)}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="glass-card rounded-xl p-3 flex items-center justify-center glow-primary">
                      <GaugeChart label="Form" value={indicators.form} max={50} />
                    </div>
                    <div className="glass-card rounded-xl p-3 flex items-center justify-center glow-primary">
                      <GaugeChart label="CG" value={indicators.cg_vendas} max={30} />
                    </div>
                    <div className="glass-card rounded-xl p-3 flex items-center justify-center glow-primary">
                      <GaugeChart label="Conv." value={indicators.conv_vendas} isPercentage />
                    </div>
                  </div>
                </div>

                {/* Pós-Venda */}
                <div>
                  <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    Indicadores Pós-Venda
                  </h2>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {statCard(<ShoppingCart className="h-4 w-4 text-primary" />, "CG Pós", indicators.cg_posvenda)}
                    {statCard(<Package className="h-4 w-4 text-primary" />, "Instalada", indicators.instalada)}
                    {statCard(<TrendingUp className="h-4 w-4 text-primary" />, "% Instal.", `${indicators.perc_instalacao}%`)}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="glass-card rounded-xl p-3 flex items-center justify-center glow-primary">
                      <GaugeChart label="CG" value={indicators.cg_posvenda} max={30} />
                    </div>
                    <div className="glass-card rounded-xl p-3 flex items-center justify-center glow-primary">
                      <GaugeChart label="Instalada" value={indicators.instalada} max={30} />
                    </div>
                    <div className="glass-card rounded-xl p-3 flex items-center justify-center glow-primary">
                      <GaugeChart label="% Instal." value={indicators.perc_instalacao} isPercentage />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Inbound */}
            <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Inbound — Resumo
            </h2>
            <div className="grid grid-cols-5 gap-3 mb-3">
              {statCard(<DollarSign className="h-4 w-4 text-primary" />, "Total Gasto", `R$ ${mockInbound.totalGasto.toLocaleString("pt-BR")}`)}
              {statCard(<Users className="h-4 w-4 text-primary" />, "Total Leads", mockInbound.totalLeads.toLocaleString("pt-BR"))}
              {statCard(<Target className="h-4 w-4 text-primary" />, "CPL", `R$ ${mockInbound.valorLead.toFixed(2)}`)}
              {statCard(<ShoppingCart className="h-4 w-4 text-primary" />, "CPC", `R$ ${mockInbound.valorContrato.toFixed(2)}`)}
              {statCard(<TrendingUp className="h-4 w-4 text-primary" />, "% Viabilidade", `${mockInbound.viabilidade}%`)}
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="glass-card rounded-xl p-3 flex items-center justify-center glow-primary">
                <GaugeChart label="CPL" value={mockInbound.valorLead} max={50} />
              </div>
              <div className="glass-card rounded-xl p-3 flex items-center justify-center glow-primary">
                <GaugeChart label="CPC" value={mockInbound.valorContrato} max={500} />
              </div>
              <div className="glass-card rounded-xl p-3 flex items-center justify-center glow-primary">
                <GaugeChart label="Viabilidade" value={mockInbound.viabilidade} isPercentage />
              </div>
            </div>

            {/* Row 4: Team tables side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team Vendas */}
              <div>
                <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Visão do Time — Vendas
                </h2>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {statCard(<FileText className="h-4 w-4 text-primary" />, "Total Forms", mockTeamSales.totalForm)}
                  {statCard(<ShoppingCart className="h-4 w-4 text-primary" />, "Total CG", mockTeamSales.totalCG)}
                  {statCard(<Percent className="h-4 w-4 text-primary" />, "Conv. Média", `${mockTeamSales.convMedia}%`)}
                </div>
                <div className="glass-card rounded-xl p-3 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-left py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">Vendedor</th>
                        <th className="text-center py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">Form</th>
                        <th className="text-center py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">CG</th>
                        <th className="text-center py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">Conv.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTeamSales.members.map((m, i) => (
                        <tr key={i} className="border-b border-border/10 hover:bg-primary/5 transition-colors">
                          <td className="py-2 px-2 font-medium text-foreground">{m.name}</td>
                          <td className="py-2 px-2 text-center text-muted-foreground">{m.form}</td>
                          <td className="py-2 px-2 text-center text-muted-foreground">{m.cg}</td>
                          <td className="py-2 px-2 text-center font-semibold text-primary">{m.conv}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Team Instalações */}
              <div>
                <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Visão do Time — Instalações
                </h2>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {statCard(<ShoppingCart className="h-4 w-4 text-primary" />, "Total CG", mockTeamInstallations.totalCGPos)}
                  {statCard(<Package className="h-4 w-4 text-primary" />, "Instalada", mockTeamInstallations.totalInstalada)}
                  {statCard(<TrendingUp className="h-4 w-4 text-primary" />, "% Média", `${mockTeamInstallations.percMedia}%`)}
                </div>
                <div className="glass-card rounded-xl p-3 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-left py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">Vendedor</th>
                        <th className="text-center py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">CG</th>
                        <th className="text-center py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">Instalada</th>
                        <th className="text-center py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTeamInstallations.members.map((m, i) => (
                        <tr key={i} className="border-b border-border/10 hover:bg-primary/5 transition-colors">
                          <td className="py-2 px-2 font-medium text-foreground">{m.name}</td>
                          <td className="py-2 px-2 text-center text-muted-foreground">{m.cg}</td>
                          <td className="py-2 px-2 text-center text-muted-foreground">{m.instalada}</td>
                          <td className="py-2 px-2 text-center font-semibold text-primary">{m.perc}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Coordenador/Inbound: inbound metrics */}
        {isCoordenador && (
          <>
            <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Métricas Inbound
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {statCard(<Users className="h-4 w-4 text-primary" />, "Total de Leads", mockInboundProfile.totalLeads.toLocaleString("pt-BR"))}
              {statCard(<DollarSign className="h-4 w-4 text-primary" />, "Custo por Lead", `R$ ${mockInboundProfile.custoLead.toFixed(2)}`)}
              {statCard(<TrendingUp className="h-4 w-4 text-primary" />, "Viabilidade", `${mockInboundProfile.viabilidade}%`)}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-card rounded-xl p-3 flex items-center justify-center glow-primary">
                <GaugeChart label="CPL" value={mockInboundProfile.custoLead} max={50} />
              </div>
              <div className="glass-card rounded-xl p-3 flex items-center justify-center glow-primary">
                <GaugeChart label="Viabilidade" value={mockInboundProfile.viabilidade} isPercentage />
              </div>
            </div>

            <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Top 3 Cidades
            </h2>
            <div className="glass-card rounded-xl p-3 mb-6 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">#</th>
                    <th className="text-left py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">Cidade</th>
                    <th className="text-center py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">Leads</th>
                    <th className="text-center py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">Viabilidade</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInboundProfile.topCidades.map((c, i) => (
                    <tr key={i} className="border-b border-border/10 hover:bg-primary/5 transition-colors">
                      <td className="py-2 px-2 font-bold text-primary">{i + 1}º</td>
                      <td className="py-2 px-2 font-medium text-foreground">{c.nome}</td>
                      <td className="py-2 px-2 text-center text-muted-foreground">{c.leads.toLocaleString("pt-BR")}</td>
                      <td className="py-2 px-2 text-center font-semibold text-primary">{c.viabilidade}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Non-supervisor, non-coordenador: original vendedor layout */}
        {!isSupervisor && !isCoordenador && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Perfil;
