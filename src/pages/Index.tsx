import GaugeChart from "@/components/GaugeChart";
import Podium from "@/components/Podium";
import RankingTable from "@/components/RankingTable";

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

const podiumPlayers = [
  { name: "Y. GUIMARAES", score: 11, position: 2 as const },
  { name: "NATIELY A.", score: 11, position: 1 as const },
  { name: "MARIO T.", score: 10, position: 3 as const },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-primary mb-5 tracking-wide">
          Ranking Vendedores
        </h1>

        {/* Summary Row - Gauges + Podium side by side, compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {/* 3 Gauges as individual small cards */}
          <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
            <GaugeChart label="Form" value={212} max={400} />
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
            <GaugeChart label="Vendas" value={65} max={200} />
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center justify-center glow-primary">
            <GaugeChart label="Conv." value={31} isPercentage />
          </div>
          {/* Mini Podium */}
          <div className="glass-card rounded-xl p-4">
            <h2 className="text-xs font-semibold font-display text-muted-foreground uppercase tracking-wider mb-2">
              Top 3
            </h2>
            <div className="space-y-2">
              {podiumPlayers
                .sort((a, b) => a.position - b.position)
                .map((p) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <span className={`text-sm font-bold font-display w-5 ${
                      p.position === 1 ? "text-rank-gold" : p.position === 2 ? "text-rank-silver" : "text-rank-bronze"
                    }`}>
                      {p.position}º
                    </span>
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold font-display text-primary">{p.name.charAt(0)}</span>
                    </div>
                    <span className="text-xs font-medium text-foreground truncate flex-1">{p.name}</span>
                    <span className="text-xs font-bold text-primary font-display">{p.score}</span>
                  </div>
                ))}
            </div>
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
