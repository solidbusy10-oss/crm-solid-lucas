import GaugeChart from "@/components/GaugeChart";
import Podium from "@/components/Podium";
import RankingTable from "@/components/RankingTable";
import { Trophy, Crown, Medal, Award } from "lucide-react";

const sellers = [
  { rank: 1, name: "NATIELY A.", form: 28, cg: 11, conv: 50, audit: 0, auditTrc: 0 },
  { rank: 2, name: "Y. GUIMARAES", form: 30, cg: 11, conv: 37, audit: 0, auditTrc: 45 },
  { rank: 3, name: "MARIO T.", form: 29, cg: 10, conv: 38, audit: 9, auditTrc: 50 },
  { rank: 4, name: "MATHEUS S.", form: 24, cg: 10, conv: 42, audit: 0, auditTrc: 0 },
  { rank: 5, name: "DRIEL7", form: 24, cg: 8, conv: 42, audit: 70, auditTrc: 0 },
  { rank: 6, name: "KAUAN F.", form: 23, cg: 1, conv: 35, audit: 75, auditTrc: 0 },
  { rank: 7, name: "LUIZ F.", form: 4, cg: 0, conv: 25, audit: 100, auditTrc: 0 },
  { rank: 8, name: "LUDIERRY", form: 27, cg: 0, conv: 0, audit: 0, auditTrc: 0 },
  { rank: 9, name: "RHUAN", form: 7, cg: 0, conv: 0, audit: 0, auditTrc: 0 },
];

const podiumData = [
  { name: "NATIELY A.", score: 11, position: 1 as const },
  { name: "Y. GUIMARAES", score: 11, position: 2 as const },
  { name: "MARIO T.", score: 10, position: 3 as const },
];

const positionStyles = {
  1: {
    border: "border-rank-gold/50",
    glow: "shadow-[0_0_30px_hsl(45_90%_55%/0.2),0_0_60px_hsl(45_90%_55%/0.08)]",
    bg: "bg-gradient-to-br from-rank-gold/15 via-rank-gold/5 to-transparent",
    avatarBg: "bg-gradient-to-br from-rank-gold/40 to-rank-gold/10 border-rank-gold/50",
    text: "text-rank-gold",
    badge: "bg-rank-gold text-primary-foreground",
    Icon: Crown,
    label: "1º LUGAR",
  },
  2: {
    border: "border-rank-silver/40",
    glow: "shadow-[0_0_20px_hsl(210_10%_70%/0.12)]",
    bg: "bg-gradient-to-br from-rank-silver/10 via-rank-silver/3 to-transparent",
    avatarBg: "bg-gradient-to-br from-rank-silver/30 to-rank-silver/10 border-rank-silver/40",
    text: "text-rank-silver",
    badge: "bg-rank-silver text-primary-foreground",
    Icon: Medal,
    label: "2º LUGAR",
  },
  3: {
    border: "border-rank-bronze/40",
    glow: "shadow-[0_0_20px_hsl(25_60%_45%/0.12)]",
    bg: "bg-gradient-to-br from-rank-bronze/10 via-rank-bronze/3 to-transparent",
    avatarBg: "bg-gradient-to-br from-rank-bronze/30 to-rank-bronze/10 border-rank-bronze/40",
    text: "text-rank-bronze",
    badge: "bg-rank-bronze text-primary-foreground",
    Icon: Award,
    label: "3º LUGAR",
  },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-primary mb-5 tracking-wide">
          Ranking Vendedores
        </h1>

        {/* Gauges Row */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
            <GaugeChart label="Form" value={212} max={400} />
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
            <GaugeChart label="Vendas" value={65} max={200} />
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
            <GaugeChart label="Conv." value={31} isPercentage />
          </div>
        </div>

        {/* TOP 3 Highlight Section */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-rank-gold" />
            <h2 className="text-lg font-bold font-display text-foreground uppercase tracking-wider">
              Top 3 Vendedores
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {podiumData
              .sort((a, b) => a.position - b.position)
              .map((player) => {
                const style = positionStyles[player.position];
                const Icon = style.Icon;
                return (
                  <div
                    key={player.name}
                    className={`relative rounded-xl border ${style.border} ${style.bg} ${style.glow} p-5 transition-all duration-300 hover:scale-[1.02]`}
                  >
                    {/* Position badge */}
                    <div className={`absolute -top-3 left-4 px-3 py-0.5 rounded-full text-xs font-bold font-display ${style.badge} flex items-center gap-1`}>
                      <Icon className="h-3 w-3" />
                      {style.label}
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      {/* Avatar */}
                      <div className={`h-14 w-14 rounded-full border-2 ${style.avatarBg} flex items-center justify-center shrink-0`}>
                        <span className={`text-xl font-bold font-display ${style.text}`}>
                          {player.name.charAt(0)}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-sm truncate">{player.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Vendedor(a)</p>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <p className={`text-2xl font-bold font-display ${style.text}`}>
                          {player.score}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">vendas</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Full Width Ranking */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-display text-foreground">
              Classificação Geral
            </h2>
            <span className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
              {sellers.length} vendedores
            </span>
          </div>
          <RankingTable sellers={sellers} />
        </div>
      </div>
    </div>
  );
};

export default Index;
