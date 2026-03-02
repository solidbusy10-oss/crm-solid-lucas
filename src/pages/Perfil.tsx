import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, LogOut, TrendingUp, Package, BarChart3, FileText, ShoppingCart, Percent, Users, DollarSign, Zap, Target, Filter, Settings, Trophy, Crown, Medal, Award, ShieldCheck, FileCheck, MapPin, CalendarIcon, Wifi } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import GaugeChart from "@/components/GaugeChart";
import FunnelChart from "@/components/FunnelChart";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

// Inbound city data for coordenador profile
const inboundCities = [
  { city: "São Paulo", uf: "SP", cg: 68, instalado: 92, inviabilidade: 42, reprovado: 14, jaCliente: 22, fraude: 2, semCobertura: 5, semCondicao: 3 },
  { city: "Rio de Janeiro", uf: "RJ", cg: 45, instalado: 58, inviabilidade: 35, reprovado: 10, jaCliente: 18, fraude: 1, semCobertura: 12, semCondicao: 8 },
  { city: "Belo Horizonte", uf: "MG", cg: 38, instalado: 42, inviabilidade: 28, reprovado: 8, jaCliente: 12, fraude: 1, semCobertura: 18, semCondicao: 10 },
  { city: "Curitiba", uf: "PR", cg: 35, instalado: 40, inviabilidade: 15, reprovado: 5, jaCliente: 10, fraude: 0, semCobertura: 8, semCondicao: 4 },
  { city: "Porto Alegre", uf: "RS", cg: 32, instalado: 35, inviabilidade: 14, reprovado: 4, jaCliente: 8, fraude: 0, semCobertura: 10, semCondicao: 5 },
  { city: "Salvador", uf: "BA", cg: 28, instalado: 30, inviabilidade: 20, reprovado: 6, jaCliente: 8, fraude: 1, semCobertura: 25, semCondicao: 15 },
  { city: "Florianópolis", uf: "SC", cg: 25, instalado: 30, inviabilidade: 8, reprovado: 3, jaCliente: 6, fraude: 0, semCobertura: 6, semCondicao: 3 },
];

const topCG = [...inboundCities].sort((a, b) => b.cg - a.cg).slice(0, 3);
const topInstalado = [...inboundCities].sort((a, b) => b.instalado - a.instalado).slice(0, 3);
const citiesWithViab = inboundCities.map(c => {
  const total = c.inviabilidade + c.cg + c.reprovado + c.jaCliente + c.fraude + c.semCobertura + c.semCondicao + c.instalado;
  return { ...c, viabilidade: total > 0 ? Math.round((c.instalado / total) * 100) : 0 };
});
const topViab = [...citiesWithViab].sort((a, b) => b.viabilidade - a.viabilidade).slice(0, 3);

const inboundTotalCabeado = inboundCities.reduce((s, c) => s + c.inviabilidade + c.cg + c.reprovado + c.jaCliente + c.fraude, 0);
const inboundTotalNaoCabeado = inboundCities.reduce((s, c) => s + c.semCobertura + c.semCondicao, 0);
const inboundPieData = [
  { name: "CEP Cabeado", value: inboundTotalCabeado },
  { name: "CEP Não Cabeado", value: inboundTotalNaoCabeado },
];
const PIE_COLORS = ["hsl(170 80% 45%)", "hsl(0 70% 55%)"];

const podiumStyles = {
  0: { border: "border-rank-gold/50", glow: "shadow-[0_0_25px_hsl(45_90%_55%/0.18)]", bg: "bg-gradient-to-br from-rank-gold/12 via-rank-gold/4 to-transparent", text: "text-rank-gold", badge: "bg-rank-gold text-primary-foreground", Icon: Crown, label: "1º" },
  1: { border: "border-rank-silver/40", glow: "shadow-[0_0_15px_hsl(210_10%_70%/0.1)]", bg: "bg-gradient-to-br from-rank-silver/8 via-rank-silver/2 to-transparent", text: "text-rank-silver", badge: "bg-rank-silver text-primary-foreground", Icon: Medal, label: "2º" },
  2: { border: "border-rank-bronze/40", glow: "shadow-[0_0_15px_hsl(25_60%_45%/0.1)]", bg: "bg-gradient-to-br from-rank-bronze/8 via-rank-bronze/2 to-transparent", text: "text-rank-bronze", badge: "bg-rank-bronze text-primary-foreground", Icon: Award, label: "3º" },
};

const PodiumCard = ({ city, uf, value, label, idx }: { city: string; uf: string; value: string | number; label: string; idx: number }) => {
  const style = podiumStyles[idx as 0 | 1 | 2];
  const Icon = style.Icon;
  return (
    <div className={`relative rounded-lg border ${style.border} ${style.bg} ${style.glow} p-3 transition-all duration-300 hover:scale-[1.01]`}>
      <div className={`absolute -top-2 -left-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-display ${style.badge} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />{style.label}
      </div>
      <div className="flex items-center justify-between mt-1">
        <div>
          <p className="font-bold text-foreground text-sm">{city}</p>
          <p className="text-[10px] text-muted-foreground">{uf}</p>
        </div>
        <div className="text-right">
          <p className={`text-xl font-bold font-display ${style.text} leading-none`}>{value}</p>
          <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-lg p-3 text-xs border border-border/50">
      {payload.map((p: any) => (
        <p key={p.name} className="text-muted-foreground">
          {p.name}: <span className="font-semibold" style={{ color: p.fill || p.color }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
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

type DateMode = "single" | "range";

const Perfil = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [indicators, setIndicators] = useState<Indicators>(defaultIndicators);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { role } = useUserRole();
  const [dateMode, setDateMode] = useState<DateMode>("single");
  const [singleDate, setSingleDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [selectedSeller, setSelectedSeller] = useState<string>("todos");

  const allSellers = mockTeamSales.members.map(m => m.name);

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
                      {role === "coordenador" ? "Inbound" : role}
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

        {/* Date Filter */}
        <div className="glass-card rounded-xl p-4 mb-6 glow-primary">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold font-display text-foreground uppercase tracking-wider">Período</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDateMode("single")}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg font-semibold transition-all border",
                  dateMode === "single"
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "bg-secondary/40 border-border/30 text-muted-foreground hover:bg-secondary/60"
                )}
              >
                Dia específico
              </button>
              <button
                onClick={() => setDateMode("range")}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg font-semibold transition-all border",
                  dateMode === "range"
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "bg-secondary/40 border-border/30 text-muted-foreground hover:bg-secondary/60"
                )}
              >
                Período
              </button>
            </div>

            {dateMode === "single" ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[200px] justify-start text-left text-xs font-normal bg-secondary/60 border-border/50",
                      !singleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {singleDate ? format(singleDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={singleDate}
                    onSelect={setSingleDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[150px] justify-start text-left text-xs font-normal bg-secondary/60 border-border/50",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {dateRange.from ? format(dateRange.from, "dd/MM/yyyy", { locale: ptBR }) : "De"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(d) => setDateRange(prev => ({ ...prev, from: d }))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-xs text-muted-foreground">até</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[150px] justify-start text-left text-xs font-normal bg-secondary/60 border-border/50",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {dateRange.to ? format(dateRange.to, "dd/MM/yyyy", { locale: ptBR }) : "Até"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(d) => setDateRange(prev => ({ ...prev, to: d }))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {(singleDate || dateRange.from || dateRange.to) && (
              <button
                onClick={() => { setSingleDate(new Date()); setDateRange({ from: undefined, to: undefined }); }}
                className="text-xs text-destructive hover:text-destructive/80 underline transition-colors"
              >
                Limpar
              </button>
            )}
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

            {/* Filtro por vendedor */}
            <div className="glass-card rounded-xl p-4 mb-6 glow-primary">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold font-display text-foreground uppercase tracking-wider">Vendedor</span>
                </div>
                <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                  <SelectTrigger className="w-[220px] text-xs bg-secondary/60 border-border/50">
                    <SelectValue placeholder="Todos os vendedores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os vendedores</SelectItem>
                    {allSellers.map((name) => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedSeller !== "todos" && (
                  <button
                    onClick={() => setSelectedSeller("todos")}
                    className="text-xs text-destructive hover:text-destructive/80 underline transition-colors"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {/* Row 4: Team tables + Planos (filtered) */}
            {(() => {
              const filteredSalesMembers = selectedSeller === "todos"
                ? mockTeamSales.members
                : mockTeamSales.members.filter(m => m.name === selectedSeller);
              const filteredInstMembers = selectedSeller === "todos"
                ? mockTeamInstallations.members
                : mockTeamInstallations.members.filter(m => m.name === selectedSeller);
              const fTotalForm = filteredSalesMembers.reduce((s, m) => s + m.form, 0);
              const fTotalCG = filteredSalesMembers.reduce((s, m) => s + m.cg, 0);
              const fConvMedia = fTotalForm > 0 ? Math.round((fTotalCG / fTotalForm) * 1000) / 10 : 0;
              const fTotalCGPos = filteredInstMembers.reduce((s, m) => s + m.cg, 0);
              const fTotalInstalada = filteredInstMembers.reduce((s, m) => s + m.instalada, 0);
              const fPercMedia = fTotalCGPos > 0 ? Math.round((fTotalInstalada / fTotalCGPos) * 1000) / 10 : 0;

              const allTeamPlans = [
                { name: "João Silva", p500: 3, p700: 2, p1gb: 1 },
                { name: "Maria Santos", p500: 2, p700: 3, p1gb: 2 },
                { name: "Pedro Costa", p500: 4, p700: 1, p1gb: 1 },
                { name: "Ana Oliveira", p500: 2, p700: 1, p1gb: 1 },
                { name: "Carlos Lima", p500: 1, p700: 1, p1gb: 0 },
              ];
              const teamPlans = selectedSeller === "todos" ? allTeamPlans : allTeamPlans.filter(m => m.name === selectedSeller);
              const total500 = teamPlans.reduce((s, m) => s + m.p500, 0);
              const total700 = teamPlans.reduce((s, m) => s + m.p700, 0);
              const total1gb = teamPlans.reduce((s, m) => s + m.p1gb, 0);
              const totalAll = total500 + total700 + total1gb;
              const altoValor = total700 + total1gb;
              const percAlto = totalAll > 0 ? Math.round((altoValor / totalAll) * 100) : 0;

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Team Vendas */}
                    <div>
                      <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Visão do Time — Vendas
                      </h2>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        {statCard(<FileText className="h-4 w-4 text-primary" />, "Total Forms", fTotalForm)}
                        {statCard(<ShoppingCart className="h-4 w-4 text-primary" />, "Total CG", fTotalCG)}
                        {statCard(<Percent className="h-4 w-4 text-primary" />, "Conv. Média", `${fConvMedia}%`)}
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
                            {filteredSalesMembers.map((m, i) => (
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
                        {statCard(<ShoppingCart className="h-4 w-4 text-primary" />, "Total CG", fTotalCGPos)}
                        {statCard(<Package className="h-4 w-4 text-primary" />, "Instalada", fTotalInstalada)}
                        {statCard(<TrendingUp className="h-4 w-4 text-primary" />, "% Média", `${fPercMedia}%`)}
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
                            {filteredInstMembers.map((m, i) => (
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

                  {/* Indicadores de Planos — Time */}
                  <div className="mt-6">
                    <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-primary" />
                      Indicadores de Planos — Time
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      {statCard(<Wifi className="h-4 w-4 text-primary" />, "500 MB", total500)}
                      {statCard(<Wifi className="h-4 w-4 text-primary" />, "700 MB", total700)}
                      {statCard(<Wifi className="h-4 w-4 text-primary" />, "1 GB", total1gb)}
                      {statCard(<TrendingUp className="h-4 w-4 text-primary" />, "Alto Valor", `${percAlto}%`)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="glass-card rounded-xl p-3 flex items-center justify-center glow-primary">
                        <GaugeChart label="500 MB" value={total500} max={30} />
                      </div>
                      <div className="glass-card rounded-xl p-3 flex items-center justify-center glow-primary">
                        <GaugeChart label="700 MB" value={total700} max={20} />
                      </div>
                      <div className="glass-card rounded-xl p-3 flex items-center justify-center glow-primary">
                        <GaugeChart label="1 GB" value={total1gb} max={15} />
                      </div>
                      <div className="glass-card rounded-xl p-3 flex items-center justify-center glow-primary">
                        <GaugeChart label="Alto Valor" value={percAlto} isPercentage />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
                      <div className="glass-card rounded-xl p-3 overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-border/30">
                              <th className="text-left py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">Vendedor</th>
                              <th className="text-center py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">500 MB</th>
                              <th className="text-center py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">700 MB</th>
                              <th className="text-center py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">1 GB</th>
                              <th className="text-center py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">Alto Valor</th>
                              <th className="text-center py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider">%</th>
                            </tr>
                          </thead>
                          <tbody>
                            {teamPlans.map((m, i) => {
                              const mTotal = m.p500 + m.p700 + m.p1gb;
                              const mAlto = m.p700 + m.p1gb;
                              const mPerc = mTotal > 0 ? Math.round((mAlto / mTotal) * 100) : 0;
                              return (
                                <tr key={i} className="border-b border-border/10 hover:bg-primary/5 transition-colors">
                                  <td className="py-2 px-2 font-medium text-foreground">{m.name}</td>
                                  <td className="py-2 px-2 text-center text-muted-foreground">{m.p500}</td>
                                  <td className="py-2 px-2 text-center text-muted-foreground">{m.p700}</td>
                                  <td className="py-2 px-2 text-center text-muted-foreground">{m.p1gb}</td>
                                  <td className="py-2 px-2 text-center font-semibold text-primary">{mAlto}</td>
                                  <td className="py-2 px-2 text-center font-semibold text-primary">{mPerc}%</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="glass-card rounded-xl p-4 glow-primary min-w-[220px]">
                        <h3 className="text-xs font-semibold font-display text-foreground mb-2">Distribuição</h3>
                        <div className="h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "500 MB", value: total500 },
                                  { name: "700 MB", value: total700 },
                                  { name: "1 GB", value: total1gb },
                                ]}
                                cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" strokeWidth={0}
                              >
                                <Cell fill="hsl(210 80% 55%)" />
                                <Cell fill="hsl(170 80% 45%)" />
                                <Cell fill="hsl(45 90% 55%)" />
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                          {[
                            { label: "500 MB", value: total500, color: "hsl(210 80% 55%)" },
                            { label: "700 MB", value: total700, color: "hsl(170 80% 45%)" },
                            { label: "1 GB", value: total1gb, color: "hsl(45 90% 55%)" },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2">
                              <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                              <span className="text-[10px] text-muted-foreground">{item.label}: <span className="font-semibold text-foreground">{item.value}</span></span>
                            </div>
                          ))}
                          <div className="border-t border-border/30 pt-1.5 mt-1">
                            <p className="text-[10px] text-muted-foreground">Alto Valor (700MB + 1GB)</p>
                            <p className="text-primary font-bold font-display text-lg">{percAlto}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </>
        )}

        {/* Coordenador: visão Inbound */}
        {isCoordenador && (() => {
          const tratativas = inboundCities.map(c => ({
            city: `${c.city} (${c.uf})`,
            Inviabilidade: c.inviabilidade,
            CG: c.cg,
            Reprovado: c.reprovado,
            "Já Cliente": c.jaCliente,
            Fraude: c.fraude,
            "Sem Cobertura": c.semCobertura,
            "Sem Condição": c.semCondicao,
            Instalado: c.instalado,
          }));

          const BAR_COLORS = [
            "hsl(0 70% 55%)", "hsl(170 80% 45%)", "hsl(35 90% 55%)",
            "hsl(210 80% 55%)", "hsl(280 60% 55%)", "hsl(45 90% 55%)",
            "hsl(190 70% 50%)", "hsl(130 60% 45%)",
          ];

          return (
            <>
              {/* Funil de Conversão */}
              <div className="mb-6">
                <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  Funil de Conversão
                </h2>
                <div className="glass-card rounded-xl p-4 glow-primary flex items-center justify-center">
                  <FunnelChart stages={computeFunnelStages(mockFunnel)} />
                </div>
              </div>

              {/* Inbound KPIs */}
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

              {/* Pódios Top 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="text-xs font-bold font-display text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Trophy className="h-3.5 w-3.5 text-rank-gold" /> Top CG
                  </h3>
                  <div className="flex flex-col gap-2">
                    {topCG.map((c, i) => (
                      <PodiumCard key={c.city} city={c.city} uf={c.uf} value={c.cg} label="CG" idx={i} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold font-display text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Trophy className="h-3.5 w-3.5 text-rank-gold" /> Top Instalação
                  </h3>
                  <div className="flex flex-col gap-2">
                    {topInstalado.map((c, i) => (
                      <PodiumCard key={c.city} city={c.city} uf={c.uf} value={c.instalado} label="Instalado" idx={i} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold font-display text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Trophy className="h-3.5 w-3.5 text-rank-gold" /> Top Viabilidade
                  </h3>
                  <div className="flex flex-col gap-2">
                    {topViab.map((c, i) => (
                      <PodiumCard key={c.city} city={c.city} uf={c.uf} value={`${c.viabilidade}%`} label="Viabilidade" idx={i} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Cobertura + Tratativas */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 mb-6">
                {/* Pie - Cabeado vs Não Cabeado */}
                <div>
                  <h3 className="text-xs font-bold font-display text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> Cobertura
                  </h3>
                  <div className="glass-card rounded-xl p-4 glow-primary">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={inboundPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" strokeWidth={0}>
                            <Cell fill={PIE_COLORS[0]} />
                            <Cell fill={PIE_COLORS[1]} />
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      {inboundPieData.map((item, i) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                          <span className="text-[10px] text-muted-foreground">{item.name}: <span className="font-semibold text-foreground">{item.value}</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bar - Tratativas por cidade */}
                <div>
                  <h3 className="text-xs font-bold font-display text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5 text-primary" /> Tratativas por Cidade
                  </h3>
                  <div className="glass-card rounded-xl p-4 glow-primary">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tratativas} layout="vertical" margin={{ left: 10 }}>
                          <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                          <YAxis type="category" dataKey="city" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} width={120} />
                          <Tooltip content={<CustomTooltip />} />
                          {["Inviabilidade", "CG", "Reprovado", "Já Cliente", "Fraude", "Sem Cobertura", "Sem Condição", "Instalado"].map((key, i) => (
                            <Bar key={key} dataKey={key} stackId="a" fill={BAR_COLORS[i]} />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })()}

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

            {/* Indicadores de Planos */}
            <h2 className="text-lg font-bold font-display text-foreground uppercase tracking-wider mb-4 mt-8 flex items-center gap-2">
              <Wifi className="h-5 w-5 text-primary" />
              Indicadores de Planos
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {statCard(<Wifi className="h-4 w-4 text-primary" />, "500 MB", 12)}
              {statCard(<Wifi className="h-4 w-4 text-primary" />, "700 MB", 8)}
              {statCard(<Wifi className="h-4 w-4 text-primary" />, "1 GB", 5)}
              {statCard(<TrendingUp className="h-4 w-4 text-primary" />, "Alto Valor", 13)}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
                <GaugeChart label="500 MB" value={12} max={30} />
              </div>
              <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
                <GaugeChart label="700 MB" value={8} max={20} />
              </div>
              <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
                <GaugeChart label="1 GB" value={5} max={15} />
              </div>
              <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
                <GaugeChart label="Alto Valor" value={52} isPercentage />
              </div>
            </div>
            <div className="glass-card rounded-xl p-4 glow-primary">
              <h3 className="text-xs font-semibold font-display text-foreground mb-2">Distribuição de Planos</h3>
              <div className="grid grid-cols-[1fr_auto] gap-6 items-center">
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "500 MB", value: 12 },
                          { name: "700 MB", value: 8 },
                          { name: "1 GB", value: 5 },
                        ]}
                        cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" strokeWidth={0}
                      >
                        <Cell fill="hsl(210 80% 55%)" />
                        <Cell fill="hsl(170 80% 45%)" />
                        <Cell fill="hsl(45 90% 55%)" />
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3 pr-4">
                  {[
                    { label: "500 MB", value: 12, pct: "48%", color: "hsl(210 80% 55%)" },
                    { label: "700 MB", value: 8, pct: "32%", color: "hsl(170 80% 45%)" },
                    { label: "1 GB", value: 5, pct: "20%", color: "hsl(45 90% 55%)" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="text-xs font-semibold text-foreground">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground">{item.value} vendas · {item.pct}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-border/30 pt-2 mt-1">
                    <p className="text-xs text-muted-foreground">Alto Valor (700MB + 1GB)</p>
                    <p className="text-primary font-bold font-display text-lg">52%</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Perfil;
