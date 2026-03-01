import { Magnet, Users, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";

const channels = [
  { name: "Google Ads", leads: 342, conversion: 12.4, trend: "up" },
  { name: "Meta Ads", leads: 287, conversion: 9.8, trend: "up" },
  { name: "Orgânico", leads: 156, conversion: 15.2, trend: "up" },
  { name: "Indicação", leads: 98, conversion: 22.1, trend: "down" },
  { name: "E-mail Marketing", leads: 64, conversion: 7.3, trend: "down" },
];

const stats = [
  { label: "Total de Leads", value: "947", icon: Users, change: "+12.5%" },
  { label: "Taxa de Conversão", value: "13.2%", icon: TrendingUp, change: "+2.1%" },
  { label: "Custo por Lead", value: "R$ 18,40", icon: BarChart3, change: "-5.3%" },
];

const Inbound = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Magnet className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold font-display text-primary tracking-wide">
            Inbound Marketing
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-6 glow-primary">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <span className={`text-xs font-semibold ${stat.change.startsWith('+') ? 'text-gauge-good' : stat.change.startsWith('-') && stat.label !== 'Custo por Lead' ? 'text-gauge-bad' : 'text-gauge-good'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Channels Table */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold font-display text-foreground mb-4">
            Canais de Aquisição
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Canal</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Leads</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Conversão</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Tendência</th>
                </tr>
              </thead>
              <tbody>
                {channels.map((ch) => (
                  <tr key={ch.name} className="border-b border-border/10 hover:bg-sidebar-accent/20 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{ch.name}</td>
                    <td className="py-3 px-4 text-center text-foreground">{ch.leads}</td>
                    <td className="py-3 px-4 text-center text-foreground">{ch.conversion}%</td>
                    <td className="py-3 px-4 text-center">
                      {ch.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4 text-gauge-good inline-block" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-gauge-bad inline-block" />
                      )}
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
