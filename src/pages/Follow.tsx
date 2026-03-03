import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, Users, Target } from "lucide-react";
import GaugeChart from "@/components/GaugeChart";

const totalForm = 822;
const totalLeads = 2025;
const leadXForm = parseFloat(((totalForm / totalLeads) * 100).toFixed(1));
const metaDiaria = 35;
const formHoje = 28;
const diasUteis = 22;
const diasTrabalhados = 14;
const metaMensal = metaDiaria * diasUteis;

const Follow = () => {
  return (
    <div className="space-y-8 p-2 md:p-6 animate-fadein">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Follow</h1>
          <p className="text-muted-foreground text-sm">
            Indicadores do departamento — Conversão de Leads em Formulários
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: "Formulários Hoje", value: formHoje, sub: `Meta: ${metaDiaria}` },
          { icon: Target, label: "Meta Mensal", value: metaMensal, sub: `${diasTrabalhados}/${diasUteis} dias úteis` },
          { icon: Users, label: "Total Leads", value: totalLeads.toLocaleString("pt-BR"), sub: "No período" },
          { icon: TrendingUp, label: "Lead x Form", value: `${leadXForm}%`, sub: "Taxa de conversão" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <kpi.icon className="h-4 w-4" />
                <span className="text-xs font-medium">{kpi.label}</span>
              </div>
              <span className="text-2xl font-bold text-foreground font-display">{kpi.value}</span>
              <span className="text-xs text-muted-foreground">{kpi.sub}</span>
            </CardContent>
          </Card>
        ))}
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
            <GaugeChart label="Form" value={totalForm} max={metaMensal} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" /> Total Leads
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
            <GaugeChart label="Lead x Form" value={leadXForm} max={100} isPercentage />
          </CardContent>
        </Card>
      </div>

      {/* Progress toward goal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Progresso da Meta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Formulários / Meta Mensal</span>
              <span className="font-bold text-foreground">{totalForm} / {metaMensal}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted/40 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${Math.min((totalForm / metaMensal) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {((totalForm / metaMensal) * 100).toFixed(1)}% da meta
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Formulários Hoje / Meta Diária</span>
              <span className="font-bold text-foreground">{formHoje} / {metaDiaria}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted/40 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${Math.min((formHoje / metaDiaria) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {((formHoje / metaDiaria) * 100).toFixed(1)}% da meta diária
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Follow;
