import { useState, useMemo } from "react";
import { Facebook, DollarSign, Users, FileText, FileCheck, TrendingDown, Trophy, Crown, Medal, Award, MapPin, ShieldCheck, ShieldAlert, Filter, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import BrazilMap from "@/components/BrazilMap";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ── Data ──

interface CityData {
  city: string;
  state: string;
  uf: string;
  inviabilidade: number;
  semCobertura: number;
  semCondicao: number;
  cg: number;
  reprovado: number;
  jaCliente: number;
  fraude: number;
  instalado: number;
}

const allCities: CityData[] = [
  { city: "São Paulo", state: "São Paulo", uf: "SP", inviabilidade: 42, semCobertura: 5, semCondicao: 3, cg: 68, reprovado: 14, jaCliente: 22, fraude: 2, instalado: 92 },
  { city: "Campinas", state: "São Paulo", uf: "SP", inviabilidade: 18, semCobertura: 3, semCondicao: 2, cg: 20, reprovado: 5, jaCliente: 8, fraude: 0, instalado: 25 },
  { city: "Guarulhos", state: "São Paulo", uf: "SP", inviabilidade: 15, semCobertura: 2, semCondicao: 2, cg: 18, reprovado: 4, jaCliente: 7, fraude: 1, instalado: 22 },
  { city: "Santos", state: "São Paulo", uf: "SP", inviabilidade: 10, semCobertura: 2, semCondicao: 1, cg: 12, reprovado: 3, jaCliente: 5, fraude: 0, instalado: 15 },
  { city: "Rio de Janeiro", state: "Rio de Janeiro", uf: "RJ", inviabilidade: 35, semCobertura: 12, semCondicao: 8, cg: 45, reprovado: 10, jaCliente: 18, fraude: 1, instalado: 58 },
  { city: "Niterói", state: "Rio de Janeiro", uf: "RJ", inviabilidade: 12, semCobertura: 5, semCondicao: 3, cg: 22, reprovado: 4, jaCliente: 6, fraude: 0, instalado: 28 },
  { city: "Duque de Caxias", state: "Rio de Janeiro", uf: "RJ", inviabilidade: 15, semCobertura: 8, semCondicao: 4, cg: 18, reprovado: 4, jaCliente: 5, fraude: 1, instalado: 20 },
  { city: "Belo Horizonte", state: "Minas Gerais", uf: "MG", inviabilidade: 28, semCobertura: 18, semCondicao: 10, cg: 38, reprovado: 8, jaCliente: 12, fraude: 1, instalado: 42 },
  { city: "Uberlândia", state: "Minas Gerais", uf: "MG", inviabilidade: 10, semCobertura: 10, semCondicao: 6, cg: 18, reprovado: 4, jaCliente: 5, fraude: 0, instalado: 22 },
  { city: "Contagem", state: "Minas Gerais", uf: "MG", inviabilidade: 10, semCobertura: 10, semCondicao: 6, cg: 16, reprovado: 3, jaCliente: 5, fraude: 0, instalado: 24 },
  { city: "Curitiba", state: "Paraná", uf: "PR", inviabilidade: 15, semCobertura: 8, semCondicao: 4, cg: 35, reprovado: 5, jaCliente: 10, fraude: 0, instalado: 40 },
  { city: "Londrina", state: "Paraná", uf: "PR", inviabilidade: 8, semCobertura: 5, semCondicao: 3, cg: 15, reprovado: 3, jaCliente: 4, fraude: 1, instalado: 16 },
  { city: "Salvador", state: "Bahia", uf: "BA", inviabilidade: 20, semCobertura: 25, semCondicao: 15, cg: 28, reprovado: 6, jaCliente: 8, fraude: 1, instalado: 30 },
  { city: "Feira de Santana", state: "Bahia", uf: "BA", inviabilidade: 15, semCobertura: 20, semCondicao: 13, cg: 24, reprovado: 6, jaCliente: 7, fraude: 1, instalado: 28 },
  { city: "Porto Alegre", state: "Rio Grande do Sul", uf: "RS", inviabilidade: 14, semCobertura: 10, semCondicao: 5, cg: 32, reprovado: 4, jaCliente: 8, fraude: 0, instalado: 35 },
  { city: "Recife", state: "Pernambuco", uf: "PE", inviabilidade: 12, semCobertura: 18, semCondicao: 10, cg: 22, reprovado: 4, jaCliente: 6, fraude: 1, instalado: 24 },
  { city: "Fortaleza", state: "Ceará", uf: "CE", inviabilidade: 12, semCobertura: 20, semCondicao: 12, cg: 18, reprovado: 3, jaCliente: 5, fraude: 0, instalado: 22 },
  { city: "Florianópolis", state: "Santa Catarina", uf: "SC", inviabilidade: 8, semCobertura: 6, semCondicao: 3, cg: 25, reprovado: 3, jaCliente: 6, fraude: 0, instalado: 30 },
  { city: "Goiânia", state: "Goiás", uf: "GO", inviabilidade: 10, semCobertura: 15, semCondicao: 8, cg: 15, reprovado: 3, jaCliente: 5, fraude: 1, instalado: 18 },
];

const states = [...new Set(allCities.map(c => c.state))].sort();

const stats = [
  { label: "Total Gastado", value: "R$ 67.450", icon: DollarSign, color: "text-destructive" },
  { label: "Total de Leads", value: "2.841", icon: Users, color: "text-primary" },
  { label: "Total de Form", value: "1.247", icon: FileText, color: "text-primary" },
  { label: "Total de Contrato", value: "312", icon: FileCheck, color: "text-success" },
  { label: "Custo por Lead", value: "R$ 23,74", icon: TrendingDown, color: "text-foreground" },
  { label: "Custo por Form", value: "R$ 54,09", icon: TrendingDown, color: "text-foreground" },
  { label: "Custo por Contrato", value: "R$ 216,19", icon: TrendingDown, color: "text-foreground" },
];

// ── Podium styles ──

const podiumStyles = {
  0: {
    border: "border-rank-gold/50",
    glow: "shadow-[0_0_25px_hsl(45_90%_55%/0.18)]",
    bg: "bg-gradient-to-br from-rank-gold/12 via-rank-gold/4 to-transparent",
    text: "text-rank-gold",
    badge: "bg-rank-gold text-primary-foreground",
    Icon: Crown,
    label: "1º",
  },
  1: {
    border: "border-rank-silver/40",
    glow: "shadow-[0_0_15px_hsl(210_10%_70%/0.1)]",
    bg: "bg-gradient-to-br from-rank-silver/8 via-rank-silver/2 to-transparent",
    text: "text-rank-silver",
    badge: "bg-rank-silver text-primary-foreground",
    Icon: Medal,
    label: "2º",
  },
  2: {
    border: "border-rank-bronze/40",
    glow: "shadow-[0_0_15px_hsl(25_60%_45%/0.1)]",
    bg: "bg-gradient-to-br from-rank-bronze/8 via-rank-bronze/2 to-transparent",
    text: "text-rank-bronze",
    badge: "bg-rank-bronze text-primary-foreground",
    Icon: Award,
    label: "3º",
  },
};

// ── Chart colors ──
const COLORS = {
  inviabilidade: "hsl(0 70% 55%)",
  cg: "hsl(170 80% 45%)",
  reprovado: "hsl(25 60% 45%)",
  jaCliente: "hsl(210 10% 70%)",
  fraude: "hsl(0 90% 40%)",
  semCobertura: "hsl(45 90% 55%)",
  semCondicao: "hsl(280 50% 55%)",
  instalado: "hsl(145 65% 42%)",
};

const PIE_COLORS = [
  "hsl(170 80% 45%)",
  "hsl(0 70% 55%)",
];

// ── Custom Tooltip ──
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-lg p-3 text-xs border border-border/50">
      <p className="font-bold font-display text-foreground text-sm mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-muted-foreground">
          {p.name}: <span className="font-semibold" style={{ color: p.color }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ── Podium Card ──
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

// ── Component ──

const Inbound = () => {
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const filteredCities = useMemo(() => {
    let data = allCities;
    if (selectedState !== "all") data = data.filter(c => c.state === selectedState);
    if (selectedCity !== "all") data = data.filter(c => c.city === selectedCity);
    return data;
  }, [selectedState, selectedCity]);

  const availableCities = useMemo(() => {
    if (selectedState === "all") return [...new Set(allCities.map(c => c.city))].sort();
    return [...new Set(allCities.filter(c => c.state === selectedState).map(c => c.city))].sort();
  }, [selectedState]);

  const aggregated = useMemo(() => {
    const agg = { inviabilidade: 0, semCobertura: 0, semCondicao: 0, cg: 0, reprovado: 0, jaCliente: 0, fraude: 0, instalado: 0 };
    filteredCities.forEach(c => {
      agg.inviabilidade += c.inviabilidade;
      agg.semCobertura += c.semCobertura;
      agg.semCondicao += c.semCondicao;
      agg.cg += c.cg;
      agg.reprovado += c.reprovado;
      agg.jaCliente += c.jaCliente;
      agg.fraude += c.fraude;
      agg.instalado += c.instalado;
    });
    return agg;
  }, [filteredCities]);

  const barData = useMemo(() => [
    { name: "Inviab.", value: aggregated.inviabilidade, fill: COLORS.inviabilidade },
    { name: "CG", value: aggregated.cg, fill: COLORS.cg },
    { name: "Reprov.", value: aggregated.reprovado, fill: COLORS.reprovado },
    { name: "Já Cliente", value: aggregated.jaCliente, fill: COLORS.jaCliente },
    { name: "Fraude", value: aggregated.fraude, fill: COLORS.fraude },
    { name: "S/ Cobert.", value: aggregated.semCobertura, fill: COLORS.semCobertura },
    { name: "S/ Cond.", value: aggregated.semCondicao, fill: COLORS.semCondicao },
    { name: "Instalado", value: aggregated.instalado, fill: COLORS.instalado },
  ], [aggregated]);

  const totalCabeado = aggregated.inviabilidade + aggregated.cg + aggregated.reprovado + aggregated.jaCliente + aggregated.fraude;
  const totalNaoCabeado = aggregated.semCobertura + aggregated.semCondicao;
  const pieData = useMemo(() => [
    { name: "CEP Cabeado", value: totalCabeado },
    { name: "CEP Não Cabeado", value: totalNaoCabeado },
  ], [totalCabeado, totalNaoCabeado]);

  const sourceForPodium = selectedState !== "all" ? filteredCities : allCities;
  const topCG = useMemo(() => [...sourceForPodium].sort((a, b) => b.cg - a.cg).slice(0, 3), [sourceForPodium]);
  const topInstalado = useMemo(() => [...sourceForPodium].sort((a, b) => b.instalado - a.instalado).slice(0, 3), [sourceForPodium]);

  const citiesWithViab = useMemo(() =>
    sourceForPodium.map(c => {
      const total = c.inviabilidade + c.cg + c.reprovado + c.jaCliente + c.fraude + c.semCobertura + c.semCondicao + c.instalado;
      return { ...c, viabilidade: total > 0 ? Math.round((c.instalado / total) * 100) : 0 };
    }), [sourceForPodium]);
  const topViab = useMemo(() => [...citiesWithViab].sort((a, b) => b.viabilidade - a.viabilidade).slice(0, 3), [citiesWithViab]);

  const radarData = useMemo(() => [
    { metric: "Inviab.", value: aggregated.inviabilidade },
    { metric: "CG", value: aggregated.cg },
    { metric: "Reprov.", value: aggregated.reprovado },
    { metric: "Já Cliente", value: aggregated.jaCliente },
    { metric: "S/ Cobert.", value: aggregated.semCobertura },
    { metric: "S/ Cond.", value: aggregated.semCondicao },
    { metric: "Instalado", value: aggregated.instalado },
  ], [aggregated]);

  const handleStateChange = (val: string) => {
    setSelectedState(val);
    setSelectedCity("all");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-[#1877F2]/20 flex items-center justify-center">
            <Facebook className="h-6 w-6 text-[#1877F2]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground tracking-wide">Facebook Ads</h1>
            <p className="text-xs text-muted-foreground">Métricas de tráfego pago</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4 glow-primary">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">{stat.label}</p>
              </div>
              <p className={`text-lg md:text-xl font-bold font-display ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ══════ TOP 3 PODIUMS (abaixo dos cards) ══════ */}
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-rank-gold" />
          <h2 className="text-lg font-bold font-display text-foreground uppercase tracking-wider">
            Top 3 Cidades {selectedState !== "all" ? `— ${selectedState}` : ""}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Top CG */}
          <div className="glass-card rounded-xl p-5 glow-primary">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-rank-gold" />
              <h3 className="text-sm font-bold font-display text-foreground uppercase tracking-wider">Mais CG</h3>
            </div>
            <div className="flex flex-col gap-3">
              {topCG.map((c, idx) => (
                <PodiumCard key={c.city} city={c.city} uf={c.uf} value={c.cg} label="contratos" idx={idx} />
              ))}
            </div>
          </div>

          {/* Top Instalado */}
          <div className="glass-card rounded-xl p-5 glow-primary">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="h-5 w-5 text-rank-gold" />
              <h3 className="text-sm font-bold font-display text-foreground uppercase tracking-wider">Mais Instalação</h3>
            </div>
            <div className="flex flex-col gap-3">
              {topInstalado.map((c, idx) => (
                <PodiumCard key={c.city} city={c.city} uf={c.uf} value={c.instalado} label="instalados" idx={idx} />
              ))}
            </div>
          </div>

          {/* Top Viabilidade */}
          <div className="glass-card rounded-xl p-5 glow-primary">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-rank-gold" />
              <h3 className="text-sm font-bold font-display text-foreground uppercase tracking-wider">Mais Viabilidade</h3>
            </div>
            <div className="flex flex-col gap-3">
              {topViab.map((c, idx) => (
                <PodiumCard key={c.city} city={c.city} uf={c.uf} value={`${c.viabilidade}%`} label="viável" idx={idx} />
              ))}
            </div>
          </div>
        </div>

        {/* ══════ FILTERS ══════ */}
        <div className="glass-card rounded-xl p-5 glow-primary mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold font-display text-foreground uppercase tracking-wider">Filtros</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="w-56">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">Estado</label>
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger className="bg-secondary/60 border-border/50 text-foreground">
                  <SelectValue placeholder="Todos os estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os estados</SelectItem>
                  {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-56">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">Cidade</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="bg-secondary/60 border-border/50 text-foreground">
                  <SelectValue placeholder="Todas as cidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {availableCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {(selectedState !== "all" || selectedCity !== "all") && (
              <div className="flex items-end">
                <button
                  onClick={() => { setSelectedState("all"); setSelectedCity("all"); }}
                  className="text-xs text-destructive hover:text-destructive/80 underline transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ══════ MAPA + GRÁFICOS SIDE BY SIDE ══════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Mapa do Brasil */}
          <div className="glass-card rounded-xl p-5 glow-primary">
            <h2 className="text-base font-semibold font-display text-foreground mb-1">Distribuição por Estado</h2>
            <p className="text-[10px] text-muted-foreground mb-3">Leads e investimento por região</p>
            <div className="h-[420px]">
              <BrazilMap />
            </div>
          </div>

          {/* Gráficos empilhados ao lado do mapa */}
          <div className="flex flex-col gap-4">
            {/* Bar Chart */}
            <div className="glass-card rounded-xl p-5 glow-primary flex-1">
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="h-4 w-4 text-destructive" />
                <h2 className="text-sm font-semibold font-display text-foreground">Breakdown de Métricas</h2>
              </div>
              <p className="text-[10px] text-muted-foreground mb-3">Categorias de inviabilidade + instalado</p>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fill: "hsl(215 15% 55%)", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {barData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie + Radar side by side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Pie Chart */}
              <div className="glass-card rounded-xl p-4 glow-primary">
                <h2 className="text-sm font-semibold font-display text-foreground mb-1">Cabeado vs Não Cabeado</h2>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value" strokeWidth={0}>
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-around text-xs mt-1">
                  <div className="text-center">
                    <p className="text-primary font-bold font-display text-sm">{totalCabeado}</p>
                    <p className="text-muted-foreground text-[9px]">Cabeado</p>
                  </div>
                  <div className="text-center">
                    <p className="text-destructive font-bold font-display text-sm">{totalNaoCabeado}</p>
                    <p className="text-muted-foreground text-[9px]">N. Cabeado</p>
                  </div>
                  <div className="text-center">
                    <p className="text-foreground font-bold font-display text-sm">
                      {totalCabeado + totalNaoCabeado > 0 ? ((totalCabeado / (totalCabeado + totalNaoCabeado)) * 100).toFixed(1) : 0}%
                    </p>
                    <p className="text-muted-foreground text-[9px]">% Cab.</p>
                  </div>
                </div>
              </div>

              {/* Radar Chart */}
              <div className="glass-card rounded-xl p-4 glow-primary">
                <h2 className="text-sm font-semibold font-display text-foreground mb-1">Radar de Métricas</h2>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
                      <PolarGrid stroke="hsl(215 30% 25%)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(215 15% 55%)", fontSize: 8 }} />
                      <PolarRadiusAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 8 }} />
                      <Radar name="Quantidade" dataKey="value" stroke="hsl(170 80% 45%)" fill="hsl(170 80% 45%)" fillOpacity={0.25} strokeWidth={2} />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════ DETAIL TABLE ══════ */}
        <div className="glass-card rounded-xl p-5 glow-primary">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold font-display text-foreground">
              Detalhamento {selectedCity !== "all" ? `— ${selectedCity}` : selectedState !== "all" ? `— ${selectedState}` : "Geral"}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">{filteredCities.length} resultado(s)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">Cidade</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">UF</th>
                  <th className="text-center py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">Inviab.</th>
                  <th className="text-center py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">CG</th>
                  <th className="text-center py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">Reprov.</th>
                  <th className="text-center py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">Já Cli.</th>
                  <th className="text-center py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">Fraude</th>
                  <th className="text-center py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">S/ Cob.</th>
                  <th className="text-center py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">S/ Cond.</th>
                  <th className="text-center py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">Instal.</th>
                  <th className="text-center py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">% Cab.</th>
                  <th className="text-center py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">% N.Cab.</th>
                </tr>
              </thead>
              <tbody>
                {filteredCities.map((c) => {
                  const cab = c.inviabilidade + c.cg + c.reprovado + c.jaCliente + c.fraude;
                  const nCab = c.semCobertura + c.semCondicao;
                  const total = cab + nCab + c.instalado;
                  const pCab = total > 0 ? ((cab / total) * 100).toFixed(1) : "0";
                  const pNCab = total > 0 ? ((nCab / total) * 100).toFixed(1) : "0";
                  return (
                    <tr key={`${c.city}-${c.uf}`} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-2 font-semibold text-foreground">{c.city}</td>
                      <td className="py-3 px-2 text-muted-foreground">{c.uf}</td>
                      <td className="text-center py-3 px-2 text-foreground">{c.inviabilidade}</td>
                      <td className="text-center py-3 px-2 text-primary font-semibold">{c.cg}</td>
                      <td className="text-center py-3 px-2 text-foreground">{c.reprovado}</td>
                      <td className="text-center py-3 px-2 text-foreground">{c.jaCliente}</td>
                      <td className="text-center py-3 px-2 text-destructive">{c.fraude}</td>
                      <td className="text-center py-3 px-2 text-destructive font-semibold">{c.semCobertura}</td>
                      <td className="text-center py-3 px-2 text-destructive">{c.semCondicao}</td>
                      <td className="text-center py-3 px-2 text-success font-semibold">{c.instalado}</td>
                      <td className="text-center py-3 px-2">
                        <span className="bg-primary/15 text-primary px-2 py-0.5 rounded-full font-semibold">{pCab}%</span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className="bg-destructive/15 text-destructive px-2 py-0.5 rounded-full font-semibold">{pNCab}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbound;
