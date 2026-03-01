import { Facebook, DollarSign, Users, FileText, FileCheck, TrendingDown, Trophy, Crown, Medal, Award, MapPin, Building2, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import BrazilMap from "@/components/BrazilMap";

const stats = [
  { label: "Total Gastado", value: "R$ 67.450", icon: DollarSign, color: "text-destructive" },
  { label: "Total de Leads", value: "2.841", icon: Users, color: "text-primary" },
  { label: "Total de Form", value: "1.247", icon: FileText, color: "text-primary" },
  { label: "Total de Contrato", value: "312", icon: FileCheck, color: "text-success" },
  { label: "Custo por Lead", value: "R$ 23,74", icon: TrendingDown, color: "text-foreground" },
  { label: "Custo por Form", value: "R$ 54,09", icon: TrendingDown, color: "text-foreground" },
  { label: "Custo por Contrato", value: "R$ 216,19", icon: TrendingDown, color: "text-foreground" },
];

// Inviabilidade reasons
// CEP Cabeado: INVIABILIDADE, CG, REPROVADO, JÁ CLIENTE, FRAUDE
// CEP Não Cabeado: SEM COBERTURA, SEM CONDIÇÃO COMERCIAL

interface StateViability {
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

interface CityViability {
  city: string;
  state: string;
  cg: number;
  instalado: number;
  viabilidade: number;
}

const stateViability: StateViability[] = [
  { state: "São Paulo", uf: "SP", inviabilidade: 85, semCobertura: 12, semCondicao: 8, cg: 142, reprovado: 28, jaCliente: 45, fraude: 3, instalado: 198 },
  { state: "Rio de Janeiro", uf: "RJ", inviabilidade: 62, semCobertura: 25, semCondicao: 15, cg: 98, reprovado: 18, jaCliente: 32, fraude: 2, instalado: 134 },
  { state: "Minas Gerais", uf: "MG", inviabilidade: 48, semCobertura: 38, semCondicao: 22, cg: 72, reprovado: 15, jaCliente: 22, fraude: 1, instalado: 88 },
  { state: "Bahia", uf: "BA", inviabilidade: 35, semCobertura: 45, semCondicao: 28, cg: 52, reprovado: 12, jaCliente: 15, fraude: 2, instalado: 58 },
  { state: "Paraná", uf: "PR", inviabilidade: 30, semCobertura: 18, semCondicao: 10, cg: 65, reprovado: 10, jaCliente: 18, fraude: 1, instalado: 72 },
  { state: "Rio Grande do Sul", uf: "RS", inviabilidade: 28, semCobertura: 22, semCondicao: 12, cg: 58, reprovado: 8, jaCliente: 15, fraude: 0, instalado: 65 },
  { state: "Pernambuco", uf: "PE", inviabilidade: 22, semCobertura: 32, semCondicao: 18, cg: 38, reprovado: 8, jaCliente: 10, fraude: 1, instalado: 42 },
  { state: "Ceará", uf: "CE", inviabilidade: 20, semCobertura: 35, semCondicao: 20, cg: 32, reprovado: 6, jaCliente: 8, fraude: 0, instalado: 38 },
  { state: "Santa Catarina", uf: "SC", inviabilidade: 18, semCobertura: 15, semCondicao: 8, cg: 48, reprovado: 6, jaCliente: 12, fraude: 0, instalado: 55 },
  { state: "Goiás", uf: "GO", inviabilidade: 15, semCobertura: 28, semCondicao: 14, cg: 28, reprovado: 5, jaCliente: 8, fraude: 1, instalado: 32 },
];

const cityViability: CityViability[] = [
  { city: "São Paulo", state: "SP", cg: 68, instalado: 92, viabilidade: 85 },
  { city: "Rio de Janeiro", state: "RJ", cg: 45, instalado: 58, viabilidade: 72 },
  { city: "Belo Horizonte", state: "MG", cg: 38, instalado: 42, viabilidade: 68 },
  { city: "Curitiba", state: "PR", cg: 35, instalado: 40, viabilidade: 78 },
  { city: "Salvador", state: "BA", cg: 28, instalado: 30, viabilidade: 55 },
  { city: "Porto Alegre", state: "RS", cg: 32, instalado: 35, viabilidade: 70 },
  { city: "Recife", state: "PE", cg: 22, instalado: 24, viabilidade: 58 },
  { city: "Fortaleza", state: "CE", cg: 18, instalado: 22, viabilidade: 52 },
  { city: "Florianópolis", state: "SC", cg: 25, instalado: 30, viabilidade: 75 },
  { city: "Goiânia", state: "GO", cg: 15, instalado: 18, viabilidade: 60 },
  { city: "Campinas", state: "SP", cg: 20, instalado: 25, viabilidade: 80 },
  { city: "Guarulhos", state: "SP", cg: 18, instalado: 22, viabilidade: 76 },
];

// Top 3 cities
const topCG = [...cityViability].sort((a, b) => b.cg - a.cg).slice(0, 3);
const topInstalado = [...cityViability].sort((a, b) => b.instalado - a.instalado).slice(0, 3);
const topViabilidade = [...cityViability].sort((a, b) => b.viabilidade - a.viabilidade).slice(0, 3);

const podiumStyles = {
  0: {
    border: "border-rank-gold/50",
    glow: "shadow-[0_0_25px_hsl(45_90%_55%/0.18)]",
    bg: "bg-gradient-to-br from-rank-gold/12 via-rank-gold/4 to-transparent",
    avatarBg: "bg-gradient-to-br from-rank-gold/35 to-rank-gold/10 border-rank-gold/50",
    text: "text-rank-gold",
    badge: "bg-rank-gold text-primary-foreground",
    Icon: Crown,
    label: "1º",
  },
  1: {
    border: "border-rank-silver/40",
    glow: "shadow-[0_0_15px_hsl(210_10%_70%/0.1)]",
    bg: "bg-gradient-to-br from-rank-silver/8 via-rank-silver/2 to-transparent",
    avatarBg: "bg-gradient-to-br from-rank-silver/25 to-rank-silver/8 border-rank-silver/40",
    text: "text-rank-silver",
    badge: "bg-rank-silver text-primary-foreground",
    Icon: Medal,
    label: "2º",
  },
  2: {
    border: "border-rank-bronze/40",
    glow: "shadow-[0_0_15px_hsl(25_60%_45%/0.1)]",
    bg: "bg-gradient-to-br from-rank-bronze/8 via-rank-bronze/2 to-transparent",
    avatarBg: "bg-gradient-to-br from-rank-bronze/25 to-rank-bronze/8 border-rank-bronze/40",
    text: "text-rank-bronze",
    badge: "bg-rank-bronze text-primary-foreground",
    Icon: Award,
    label: "3º",
  },
};

const PodiumSection = ({ title, icon: SectionIcon, data, metric, metricLabel }: {
  title: string;
  icon: React.ElementType;
  data: CityViability[];
  metric: keyof CityViability;
  metricLabel: string;
}) => (
  <div className="glass-card rounded-xl p-5 glow-primary">
    <div className="flex items-center gap-2 mb-4">
      <SectionIcon className="h-5 w-5 text-rank-gold" />
      <h3 className="text-sm font-bold font-display text-foreground uppercase tracking-wider">{title}</h3>
    </div>
    <div className="flex flex-col gap-3">
      {data.map((city, idx) => {
        const style = podiumStyles[idx as 0 | 1 | 2];
        const Icon = style.Icon;
        return (
          <div
            key={city.city}
            className={`relative rounded-lg border ${style.border} ${style.bg} ${style.glow} p-4 transition-all duration-300 hover:scale-[1.01]`}
          >
            <div className={`absolute -top-2 -left-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-display ${style.badge} flex items-center gap-1`}>
              <Icon className="h-3 w-3" />
              {style.label}
            </div>
            <div className="flex items-center justify-between mt-1">
              <div>
                <p className="font-bold text-foreground text-sm">{city.city}</p>
                <p className="text-[10px] text-muted-foreground">{city.state}</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold font-display ${style.text} leading-none`}>
                  {String(city[metric])}
                </p>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">{metricLabel}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const Inbound = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-[#1877F2]/20 flex items-center justify-center">
            <Facebook className="h-6 w-6 text-[#1877F2]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground tracking-wide">
              Facebook Ads
            </h1>
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

        {/* Brazil Map */}
        <div className="glass-card rounded-xl p-6 glow-primary mb-6">
          <h2 className="text-lg font-semibold font-display text-foreground mb-1">
            Distribuição por Estado
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Leads e investimento por região</p>
          <div className="h-[500px] md:h-[600px]">
            <BrazilMap />
          </div>
        </div>

        {/* Podiums - Top 3 Cities */}
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-rank-gold" />
          <h2 className="text-lg font-bold font-display text-foreground uppercase tracking-wider">
            Top 3 Cidades
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <PodiumSection title="Mais CG" icon={ShieldCheck} data={topCG} metric="cg" metricLabel="contratos" />
          <PodiumSection title="Mais Instalação" icon={FileCheck} data={topInstalado} metric="instalado" metricLabel="instalados" />
          <PodiumSection title="Mais Viabilidade" icon={MapPin} data={topViabilidade} metric="viabilidade" metricLabel="% viável" />
        </div>

        {/* Viability by State */}
        <div className="glass-card rounded-xl p-5 glow-primary mb-6">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <h2 className="text-lg font-semibold font-display text-foreground">
              Inviabilidade por Estado
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">CEP Cabeado vs Não Cabeado por estado</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">Estado</th>
                  <th colSpan={5} className="text-center py-1 px-2">
                    <span className="text-primary text-[10px] uppercase tracking-widest font-bold">CEP Cabeado</span>
                  </th>
                  <th colSpan={2} className="text-center py-1 px-2">
                    <span className="text-destructive text-[10px] uppercase tracking-widest font-bold">CEP Não Cabeado</span>
                  </th>
                  <th className="text-center py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">Instalado</th>
                  <th className="text-center py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">% Cabeado</th>
                  <th className="text-center py-3 px-2 text-muted-foreground font-semibold uppercase tracking-wider">% Não Cab.</th>
                </tr>
                <tr className="border-b border-border/30">
                  <th className="py-2 px-2"></th>
                  <th className="text-center py-2 px-2 text-muted-foreground text-[10px] uppercase">Inviab.</th>
                  <th className="text-center py-2 px-2 text-muted-foreground text-[10px] uppercase">CG</th>
                  <th className="text-center py-2 px-2 text-muted-foreground text-[10px] uppercase">Reprov.</th>
                  <th className="text-center py-2 px-2 text-muted-foreground text-[10px] uppercase">Já Cliente</th>
                  <th className="text-center py-2 px-2 text-muted-foreground text-[10px] uppercase">Fraude</th>
                  <th className="text-center py-2 px-2 text-muted-foreground text-[10px] uppercase">S/ Cobert.</th>
                  <th className="text-center py-2 px-2 text-muted-foreground text-[10px] uppercase">S/ Cond.</th>
                  <th className="py-2 px-2"></th>
                  <th className="py-2 px-2"></th>
                  <th className="py-2 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {stateViability.map((s) => {
                  const totalCabeado = s.inviabilidade + s.cg + s.reprovado + s.jaCliente + s.fraude;
                  const totalNaoCabeado = s.semCobertura + s.semCondicao;
                  const total = totalCabeado + totalNaoCabeado + s.instalado;
                  const pctCabeado = total > 0 ? ((totalCabeado / total) * 100).toFixed(1) : "0";
                  const pctNaoCabeado = total > 0 ? ((totalNaoCabeado / total) * 100).toFixed(1) : "0";
                  return (
                    <tr key={s.uf} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-2 font-semibold text-foreground">
                        {s.state} <span className="text-muted-foreground">({s.uf})</span>
                      </td>
                      <td className="text-center py-3 px-2 text-foreground">{s.inviabilidade}</td>
                      <td className="text-center py-3 px-2 text-primary font-semibold">{s.cg}</td>
                      <td className="text-center py-3 px-2 text-foreground">{s.reprovado}</td>
                      <td className="text-center py-3 px-2 text-foreground">{s.jaCliente}</td>
                      <td className="text-center py-3 px-2 text-destructive">{s.fraude}</td>
                      <td className="text-center py-3 px-2 text-destructive font-semibold">{s.semCobertura}</td>
                      <td className="text-center py-3 px-2 text-destructive">{s.semCondicao}</td>
                      <td className="text-center py-3 px-2 text-success font-semibold">{s.instalado}</td>
                      <td className="text-center py-3 px-2">
                        <span className="bg-primary/15 text-primary px-2 py-0.5 rounded-full font-semibold">{pctCabeado}%</span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className="bg-destructive/15 text-destructive px-2 py-0.5 rounded-full font-semibold">{pctNaoCabeado}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Viability by City */}
        <div className="glass-card rounded-xl p-5 glow-primary">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold font-display text-foreground">
              Métricas por Cidade
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">CG, instalações e viabilidade por cidade</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-3 text-muted-foreground font-semibold uppercase tracking-wider">Cidade</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-semibold uppercase tracking-wider">Estado</th>
                  <th className="text-center py-3 px-3 text-muted-foreground font-semibold uppercase tracking-wider">CG</th>
                  <th className="text-center py-3 px-3 text-muted-foreground font-semibold uppercase tracking-wider">Instalado</th>
                  <th className="text-center py-3 px-3 text-muted-foreground font-semibold uppercase tracking-wider">Viabilidade</th>
                </tr>
              </thead>
              <tbody>
                {cityViability.map((c) => (
                  <tr key={c.city} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-semibold text-foreground">{c.city}</td>
                    <td className="py-3 px-3 text-muted-foreground">{c.state}</td>
                    <td className="text-center py-3 px-3 text-primary font-semibold">{c.cg}</td>
                    <td className="text-center py-3 px-3 text-success font-semibold">{c.instalado}</td>
                    <td className="text-center py-3 px-3">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${c.viabilidade}%` }}
                          />
                        </div>
                        <span className="text-foreground font-semibold">{c.viabilidade}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbound;
