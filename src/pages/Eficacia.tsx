import { CheckCircle, ThumbsUp, ThumbsDown, Clock, Star } from "lucide-react";

const metrics = [
  { label: "NPS Score", value: "72", icon: Star, color: "text-primary" },
  { label: "Taxa de Retenção", value: "89%", icon: ThumbsUp, color: "text-gauge-good" },
  { label: "Churn Rate", value: "3.2%", icon: ThumbsDown, color: "text-gauge-bad" },
  { label: "Tempo Médio Resolução", value: "4.2h", icon: Clock, color: "text-gauge-mid" },
];

const tickets = [
  { client: "João Silva", status: "Resolvido", satisfaction: 5, date: "28/02" },
  { client: "Maria Santos", status: "Resolvido", satisfaction: 4, date: "27/02" },
  { client: "Carlos Oliveira", status: "Pendente", satisfaction: null, date: "27/02" },
  { client: "Ana Costa", status: "Resolvido", satisfaction: 5, date: "26/02" },
  { client: "Pedro Souza", status: "Em andamento", satisfaction: null, date: "26/02" },
  { client: "Lucia Ferreira", status: "Resolvido", satisfaction: 3, date: "25/02" },
];

const statusColor: Record<string, string> = {
  "Resolvido": "text-gauge-good",
  "Pendente": "text-gauge-bad",
  "Em andamento": "text-gauge-mid",
};

const Eficacia = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <CheckCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold font-display text-primary tracking-wide">
            Eficácia — Pós Vendas
          </h1>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((m) => (
            <div key={m.label} className="glass-card rounded-xl p-6 glow-primary">
              <m.icon className={`h-6 w-6 ${m.color} mb-3`} />
              <p className="text-3xl font-bold text-foreground">{m.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Tickets Table */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold font-display text-foreground mb-4">
            Últimos Tickets
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Cliente</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Satisfação</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t, i) => (
                  <tr key={i} className="border-b border-border/10 hover:bg-sidebar-accent/20 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{t.client}</td>
                    <td className={`py-3 px-4 text-center font-semibold ${statusColor[t.status]}`}>
                      {t.status}
                    </td>
                    <td className="py-3 px-4 text-center text-foreground">
                      {t.satisfaction ? "⭐".repeat(t.satisfaction) : "—"}
                    </td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{t.date}</td>
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

export default Eficacia;
