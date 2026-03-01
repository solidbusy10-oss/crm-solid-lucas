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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold font-display text-primary mb-8 tracking-wide">
          Ranking Vendedores
        </h1>

        {/* Top Row - Gauges + Podium */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass-card rounded-xl p-6 glow-primary">
            <div className="flex justify-around items-center flex-wrap gap-4">
              <GaugeChart label="Form" value={212} max={400} />
              <GaugeChart label="Vendas" value={65} max={200} />
              <GaugeChart label="Conv." value={31} isPercentage />
            </div>
          </div>
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold font-display text-foreground mb-2">
              Top 3 Vendedores
            </h2>
            <Podium players={podiumPlayers} />
          </div>
        </div>

        {/* Full Width Ranking */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
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
