import { Facebook, DollarSign, Users, FileText, FileCheck, TrendingDown } from "lucide-react";
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
        <div className="glass-card rounded-xl p-6 glow-primary">
          <h2 className="text-lg font-semibold font-display text-foreground mb-1">
            Distribuição por Estado
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Leads e investimento por região</p>
          <div className="h-[500px] md:h-[600px]">
            <BrazilMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbound;
