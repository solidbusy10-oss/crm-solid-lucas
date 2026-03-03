import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Crown, Medal, Award, FileText, TrendingUp } from "lucide-react";
import GaugeChart from "@/components/GaugeChart";
import RankingTable from "@/components/RankingTable";

const sellers = [
  { rank: 1, name: "Carlos Silva", form: 142, cg: 0, conv: 0, audit: 0, auditTrc: 0, leads: 320, leadXForm: 44.4 },
  { rank: 2, name: "Ana Beatriz", form: 128, cg: 0, conv: 0, audit: 0, auditTrc: 0, leads: 310, leadXForm: 41.3 },
  { rank: 3, name: "Roberto Lima", form: 115, cg: 0, conv: 0, audit: 0, auditTrc: 0, leads: 295, leadXForm: 39.0 },
  { rank: 4, name: "Juliana Costa", form: 102, cg: 0, conv: 0, audit: 0, auditTrc: 0, leads: 280, leadXForm: 36.4 },
  { rank: 5, name: "Felipe Rocha", form: 95, cg: 0, conv: 0, audit: 0, auditTrc: 0, leads: 270, leadXForm: 35.2 },
  { rank: 6, name: "Mariana Dias", form: 88, cg: 0, conv: 0, audit: 0, auditTrc: 0, leads: 260, leadXForm: 33.8 },
  { rank: 7, name: "Lucas Mendes", form: 80, cg: 0, conv: 0, audit: 0, auditTrc: 0, leads: 250, leadXForm: 32.0 },
  { rank: 8, name: "Beatriz Nunes", form: 72, cg: 0, conv: 0, audit: 0, auditTrc: 0, leads: 240, leadXForm: 30.0 },
];

const podiumData = [
  { name: "Carlos Silva", form: 142, leadXForm: 44.4, position: 1 as const },
  { name: "Ana Beatriz", form: 128, leadXForm: 41.3, position: 2 as const },
  { name: "Roberto Lima", form: 115, leadXForm: 39.0, position: 3 as const },
];

const positionStyles = {
  1: {
    border: "border-yellow-500/60",
    glow: "shadow-[0_0_24px_rgba(234,179,8,0.15)]",
    bg: "bg-gradient-to-b from-yellow-500/10 to-transparent",
    avatarBg: "bg-yellow-500/20",
    text: "text-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-300",
    Icon: Crown,
    label: "1º Lugar",
  },
  2: {
    border: "border-zinc-400/40",
    glow: "shadow-[0_0_16px_rgba(161,161,170,0.10)]",
    bg: "bg-gradient-to-b from-zinc-400/10 to-transparent",
    avatarBg: "bg-zinc-400/20",
    text: "text-zinc-300",
    badge: "bg-zinc-400/20 text-zinc-200",
    Icon: Medal,
    label: "2º Lugar",
  },
  3: {
    border: "border-orange-500/40",
    glow: "shadow-[0_0_16px_rgba(249,115,22,0.10)]",
    bg: "bg-gradient-to-b from-orange-500/10 to-transparent",
    avatarBg: "bg-orange-400/20",
    text: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-300",
    Icon: Award,
    label: "3º Lugar",
  },
};

const totalForm = sellers.reduce((sum, s) => sum + s.form, 0);
const totalLeads = sellers.reduce((sum, s) => sum + s.leads, 0);
const avgLeadXForm = totalLeads > 0 ? ((totalForm / totalLeads) * 100) : 0;

const Follow = () => {
  return (
    <div className="space-y-8 p-2 md:p-6 animate-fadein">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Follow</h1>
          <p className="text-muted-foreground text-sm">
            Indicadores de conversão de Leads em Formulários
          </p>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...podiumData].sort((a, b) => a.position - b.position).map((seller) => {
          const s = positionStyles[seller.position];
          return (
            <Card
              key={seller.name}
              className={`relative overflow-hidden border ${s.border} ${s.glow} ${s.bg}`}
            >
              <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                <div className="flex items-center gap-2">
                  <Trophy className={`h-5 w-5 ${s.text}`} />
                  <span className={`text-xs font-bold uppercase tracking-widest ${s.text}`}>
                    {s.label}
                  </span>
                </div>
                <div className={`h-14 w-14 rounded-full flex items-center justify-center ${s.avatarBg}`}>
                  <span className={`text-xl font-bold ${s.text}`}>
                    {seller.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <span className="font-semibold text-foreground">{seller.name}</span>
                <div className="flex gap-4 text-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-muted-foreground text-xs">Form</span>
                    <span className="font-bold text-foreground">{seller.form}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-muted-foreground text-xs">Lead x Form</span>
                    <span className="font-bold text-foreground">{seller.leadXForm}%</span>
                  </div>
                </div>
                <s.Icon className={`absolute top-3 right-3 h-8 w-8 ${s.text} opacity-20`} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" /> Total Formulários
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pb-4">
            <GaugeChart label="Form" value={totalForm} max={1200} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pb-4">
            <GaugeChart label="Leads" value={totalLeads} max={3000} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Lead x Form
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pb-4">
            <GaugeChart label="Lead x Form" value={parseFloat(avgLeadXForm.toFixed(1))} max={100} isPercentage />
          </CardContent>
        </Card>
      </div>

      {/* Ranking Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Ranking Follow — {sellers.length} participantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RankingTable
            sellers={sellers}
            hideColumns={["audit", "auditTrc"]}
            subtitle={(s: any) => `Leads: ${s.leads}`}
            customStats={[
              { label: "Form", value: (s: any) => s.form },
              { label: "Lead x Form", value: (s: any) => `${s.leadXForm}%`, isBadge: true },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Follow;
