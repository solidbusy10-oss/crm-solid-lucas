import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useState } from "react";

const GEO_URL = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

interface StateData {
  name: string;
  leads: number;
  spend: number;
}

const stateData: Record<string, StateData> = {
  "São Paulo": { name: "SP", leads: 480, spend: 12400 },
  "Rio de Janeiro": { name: "RJ", leads: 310, spend: 8200 },
  "Minas Gerais": { name: "MG", leads: 245, spend: 6100 },
  "Bahia": { name: "BA", leads: 180, spend: 4500 },
  "Paraná": { name: "PR", leads: 165, spend: 4100 },
  "Rio Grande do Sul": { name: "RS", leads: 155, spend: 3800 },
  "Pernambuco": { name: "PE", leads: 120, spend: 3000 },
  "Ceará": { name: "CE", leads: 110, spend: 2700 },
  "Santa Catarina": { name: "SC", leads: 130, spend: 3200 },
  "Goiás": { name: "GO", leads: 95, spend: 2300 },
  "Distrito Federal": { name: "DF", leads: 88, spend: 2200 },
  "Pará": { name: "PA", leads: 72, spend: 1800 },
  "Maranhão": { name: "MA", leads: 58, spend: 1400 },
  "Amazonas": { name: "AM", leads: 45, spend: 1100 },
  "Espírito Santo": { name: "ES", leads: 68, spend: 1700 },
  "Mato Grosso": { name: "MT", leads: 52, spend: 1300 },
  "Mato Grosso do Sul": { name: "MS", leads: 48, spend: 1200 },
  "Paraíba": { name: "PB", leads: 42, spend: 1000 },
  "Rio Grande do Norte": { name: "RN", leads: 38, spend: 950 },
  "Alagoas": { name: "AL", leads: 35, spend: 870 },
  "Piauí": { name: "PI", leads: 30, spend: 750 },
  "Sergipe": { name: "SE", leads: 25, spend: 620 },
  "Rondônia": { name: "RO", leads: 22, spend: 550 },
  "Tocantins": { name: "TO", leads: 18, spend: 450 },
  "Acre": { name: "AC", leads: 12, spend: 300 },
  "Amapá": { name: "AP", leads: 10, spend: 250 },
  "Roraima": { name: "RR", leads: 8, spend: 200 },
};

const maxLeads = 480;

const getColor = (leads: number) => {
  const intensity = leads / maxLeads;
  if (intensity > 0.6) return "hsl(170 80% 45%)";
  if (intensity > 0.35) return "hsl(170 60% 35%)";
  if (intensity > 0.15) return "hsl(170 40% 25%)";
  return "hsl(215 35% 22%)";
};

const BrazilMap = () => {
  const [tooltip, setTooltip] = useState<{ name: string; data: StateData; x: number; y: number } | null>(null);

  return (
    <div className="relative w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 600, center: [-54, -15] }}
        className="w-full h-full"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name;
              const data = stateData[stateName];
              const leads = data?.leads || 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getColor(leads)}
                  stroke="hsl(215 30% 30%)"
                  strokeWidth={0.5}
                  onMouseEnter={(e) => {
                    if (data) {
                      setTooltip({
                        name: stateName,
                        data,
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "hsl(170 80% 55%)", outline: "none", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {tooltip && (
        <div
          className="fixed z-50 glass-card rounded-lg p-3 text-xs pointer-events-none border border-border/50"
          style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
        >
          <p className="font-bold font-display text-foreground text-sm">{tooltip.name} ({tooltip.data.name})</p>
          <p className="text-muted-foreground">Leads: <span className="text-primary font-semibold">{tooltip.data.leads}</span></p>
          <p className="text-muted-foreground">Investido: <span className="text-primary font-semibold">R$ {tooltip.data.spend.toLocaleString("pt-BR")}</span></p>
        </div>
      )}
    </div>
  );
};

export default BrazilMap;
