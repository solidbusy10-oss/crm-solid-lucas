import GaugeChart from "@/components/GaugeChart";
import RankingTable from "@/components/RankingTable";
import { CheckCircle, Trophy, Crown, Medal, Award } from "lucide-react";

const sellers = [
  { rank: 1, name: "ANA COSTA", form: 0, cg: 18, conv: 78, audit: 0, auditTrc: 0 },
  { rank: 2, name: "JOÃO SILVA", form: 0, cg: 15, conv: 73, audit: 0, auditTrc: 0 },
  { rank: 3, name: "MARIA SANTOS", form: 0, cg: 14, conv: 64, audit: 0, auditTrc: 0 },
  { rank: 4, name: "CARLOS OLIVEIRA", form: 0, cg: 12, conv: 58, audit: 0, auditTrc: 0 },
  { rank: 5, name: "PEDRO SOUZA", form: 0, cg: 10, conv: 50, audit: 0, auditTrc: 0 },
  { rank: 6, name: "LUCIA FERREIRA", form: 0, cg: 8, conv: 44, audit: 0, auditTrc: 0 },
  { rank: 7, name: "RAFAEL LIMA", form: 0, cg: 6, conv: 38, audit: 0, auditTrc: 0 },
  { rank: 8, name: "BRUNA ALVES", form: 0, cg: 4, conv: 25, audit: 0, auditTrc: 0 },
];

const podiumData = [
  { name: "ANA COSTA", score: 18, position: 1 as const },
  { name: "JOÃO SILVA", score: 15, position: 2 as const },
  { name: "MARIA SANTOS", score: 14, position: 3 as const },
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

const Eficacia = () => {
  const totalCG = sellers.reduce((sum, s) => sum + s.cg, 0);
  const totalInstalada = sellers.reduce((sum, s) => sum + Math.round(s.cg * s.conv / 100), 0);
  const percInstalacao = totalCG > 0 ? Math.round((totalInstalada / totalCG) * 100) : 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <CheckCircle className="h-7 w-7 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold font-display text-primary tracking-wide">
            Eficácia — Pós Vendas
          </h1>
        </div>

        {/* TOP 3 Highlight Section */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-rank-gold" />
            <h2 className="text-lg font-bold font-display text-foreground uppercase tracking-wider">
              Top 3 Instalações
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {podiumData
              .sort((a, b) => a.position - b.position)
              .map((player) => {
                const style = positionStyles[player.position];
                const Icon = style.Icon;
                const sellerData = sellers.find(s => s.name === player.name);
                const instalada = sellerData ? Math.round(sellerData.cg * sellerData.conv / 100) : 0;
                return (
                  <div
                    key={player.name}
                    className={`relative rounded-xl border ${style.border} ${style.bg} ${style.glow} p-6 transition-all duration-300 hover:scale-[1.02]`}
                  >
                    <div className={`absolute -top-3 left-5 px-3 py-1 rounded-full text-xs font-bold font-display ${style.badge} flex items-center gap-1.5`}>
                      <Icon className="h-3.5 w-3.5" />
                      {style.label}
                    </div>

                    <div className="flex flex-col items-center text-center mt-3 gap-3">
                      <div className={`h-20 w-20 rounded-full border-2 ${style.avatarBg} flex items-center justify-center`}>
                        <span className={`text-3xl font-bold font-display ${style.text}`}>
                          {player.name.charAt(0)}
                        </span>
                      </div>

                      <div>
                        <p className="font-bold text-foreground text-base">{player.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Pós-venda</p>
                      </div>

                      <div>
                        <p className={`text-4xl font-bold font-display ${style.text} leading-none`}>
                          {instalada}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">instaladas</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Gauges Row */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
            <GaugeChart label="CG" value={totalCG} max={150} />
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
            <GaugeChart label="Instalada" value={totalInstalada} max={100} />
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
            <GaugeChart label="% Instalação" value={percInstalacao} isPercentage />
          </div>
        </div>

        {/* Full Width Ranking */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-display text-foreground">
              Classificação Geral — Instalações
            </h2>
            <span className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
              {sellers.length} colaboradores
            </span>
          </div>
          <RankingTable
            sellers={sellers}
            subtitle={(s) => `${Math.round(s.cg * s.conv / 100)} instaladas`}
            customStats={[
              { label: "CG", value: (s) => s.cg },
              { label: "Instalada", value: (s) => Math.round(s.cg * s.conv / 100) },
              { label: "% Instal.", value: (s) => s.conv, isBadge: true },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Eficacia;
