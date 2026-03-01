import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { useState, useCallback } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

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

interface CityMarker {
  name: string;
  state: string;
  coordinates: [number, number];
}

const cityMarkers: CityMarker[] = [
  { name: "São Paulo", state: "São Paulo", coordinates: [-46.63, -23.55] },
  { name: "Campinas", state: "São Paulo", coordinates: [-47.06, -22.9] },
  { name: "Guarulhos", state: "São Paulo", coordinates: [-46.53, -23.46] },
  { name: "Santos", state: "São Paulo", coordinates: [-46.33, -23.96] },
  { name: "Rio de Janeiro", state: "Rio de Janeiro", coordinates: [-43.17, -22.9] },
  { name: "Niterói", state: "Rio de Janeiro", coordinates: [-43.1, -22.88] },
  { name: "Duque de Caxias", state: "Rio de Janeiro", coordinates: [-43.31, -22.79] },
  { name: "Belo Horizonte", state: "Minas Gerais", coordinates: [-43.94, -19.92] },
  { name: "Uberlândia", state: "Minas Gerais", coordinates: [-48.28, -18.92] },
  { name: "Contagem", state: "Minas Gerais", coordinates: [-44.05, -19.93] },
  { name: "Curitiba", state: "Paraná", coordinates: [-49.27, -25.43] },
  { name: "Londrina", state: "Paraná", coordinates: [-51.16, -23.31] },
  { name: "Salvador", state: "Bahia", coordinates: [-38.51, -12.97] },
  { name: "Feira de Santana", state: "Bahia", coordinates: [-38.97, -12.27] },
  { name: "Porto Alegre", state: "Rio Grande do Sul", coordinates: [-51.18, -30.03] },
  { name: "Recife", state: "Pernambuco", coordinates: [-34.88, -8.05] },
  { name: "Fortaleza", state: "Ceará", coordinates: [-38.54, -3.72] },
  { name: "Florianópolis", state: "Santa Catarina", coordinates: [-48.55, -27.6] },
  { name: "Goiânia", state: "Goiás", coordinates: [-49.25, -16.68] },
];

const maxLeads = 480;

const getColor = (leads: number) => {
  const intensity = leads / maxLeads;
  if (intensity > 0.6) return "hsl(170 80% 45%)";
  if (intensity > 0.35) return "hsl(170 60% 35%)";
  if (intensity > 0.15) return "hsl(170 40% 25%)";
  return "hsl(215 35% 22%)";
};

// Center coordinates for each state (for zoom-to-state)
const stateCenters: Record<string, { center: [number, number]; zoom: number }> = {
  "São Paulo": { center: [-48.5, -22.5], zoom: 4 },
  "Rio de Janeiro": { center: [-43.2, -22.5], zoom: 5 },
  "Minas Gerais": { center: [-44.5, -18.5], zoom: 3.5 },
  "Bahia": { center: [-41, -13], zoom: 3 },
  "Paraná": { center: [-51.5, -24.5], zoom: 4 },
  "Rio Grande do Sul": { center: [-53, -29.5], zoom: 3.5 },
  "Pernambuco": { center: [-36.5, -8.3], zoom: 4.5 },
  "Ceará": { center: [-39.5, -5], zoom: 4 },
  "Santa Catarina": { center: [-50, -27.5], zoom: 4.5 },
  "Goiás": { center: [-49.5, -15.5], zoom: 3.5 },
  "Distrito Federal": { center: [-47.9, -15.8], zoom: 8 },
  "Pará": { center: [-52, -4], zoom: 2.5 },
  "Maranhão": { center: [-45, -5], zoom: 3 },
  "Amazonas": { center: [-64, -4], zoom: 2 },
  "Espírito Santo": { center: [-40.5, -19.5], zoom: 5 },
  "Mato Grosso": { center: [-55, -13], zoom: 2.5 },
  "Mato Grosso do Sul": { center: [-55, -21], zoom: 3 },
  "Paraíba": { center: [-36.5, -7], zoom: 5 },
  "Rio Grande do Norte": { center: [-36.5, -5.8], zoom: 5 },
  "Alagoas": { center: [-36.5, -9.5], zoom: 6 },
  "Piauí": { center: [-43, -7], zoom: 3 },
  "Sergipe": { center: [-37.5, -10.5], zoom: 6 },
  "Rondônia": { center: [-63, -11], zoom: 3 },
  "Tocantins": { center: [-48.5, -10], zoom: 3 },
  "Acre": { center: [-70, -9], zoom: 3 },
  "Amapá": { center: [-51, 1], zoom: 3.5 },
  "Roraima": { center: [-61, 2], zoom: 3 },
};

interface BrazilMapProps {
  onStateClick?: (stateName: string) => void;
  onCityClick?: (cityName: string) => void;
}

const BrazilMap = ({ onStateClick, onCityClick }: BrazilMapProps) => {
  const [tooltip, setTooltip] = useState<{ text: string; details?: string[]; x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([-54, -15]);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const showCities = zoom >= 2.5;

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.5, 12));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => {
      const next = Math.max(prev / 1.5, 1);
      if (next < 2) setSelectedState(null);
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setCenter([-54, -15]);
    setSelectedState(null);
  }, []);

  const handleStateClick = useCallback((stateName: string) => {
    const sc = stateCenters[stateName];
    if (sc) {
      setCenter(sc.center);
      setZoom(sc.zoom);
      setSelectedState(stateName);
    }
    onStateClick?.(stateName);
  }, [onStateClick]);

  const handleCityClick = useCallback((cityName: string) => {
    onCityClick?.(cityName);
  }, [onCityClick]);

  const visibleCities = showCities
    ? selectedState
      ? cityMarkers.filter(c => c.state === selectedState)
      : cityMarkers
    : [];

  return (
    <div className="relative w-full h-full">
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          className="glass-card w-8 h-8 rounded-md flex items-center justify-center border border-border/50 hover:bg-muted/40 transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4 text-foreground" />
        </button>
        <button
          onClick={handleZoomOut}
          className="glass-card w-8 h-8 rounded-md flex items-center justify-center border border-border/50 hover:bg-muted/40 transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4 text-foreground" />
        </button>
        <button
          onClick={handleReset}
          className="glass-card w-8 h-8 rounded-md flex items-center justify-center border border-border/50 hover:bg-muted/40 transition-colors"
          title="Resetar"
        >
          <RotateCcw className="h-3.5 w-3.5 text-foreground" />
        </button>
      </div>

      {/* Zoom hint */}
      {zoom < 2 && (
        <div className="absolute bottom-2 left-2 z-10 text-[9px] text-muted-foreground bg-background/60 px-2 py-1 rounded">
          Clique num estado para dar zoom e ver cidades
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 600, center: [-54, -15] }}
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={({ coordinates, zoom: z }) => {
            setCenter(coordinates as [number, number]);
            setZoom(z);
          }}
          minZoom={1}
          maxZoom={12}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.name;
                const data = stateData[stateName];
                const leads = data?.leads || 0;
                const isSelected = selectedState === stateName;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isSelected ? "hsl(170 80% 50%)" : getColor(leads)}
                    stroke={isSelected ? "hsl(170 90% 65%)" : "hsl(215 30% 30%)"}
                    strokeWidth={isSelected ? 1.5 / zoom : 0.5 / zoom}
                    onMouseEnter={(e) => {
                      if (data) {
                        setTooltip({
                          text: `${stateName} (${data.name})`,
                          details: [
                            `Leads: ${data.leads}`,
                            `Investido: R$ ${data.spend.toLocaleString("pt-BR")}`,
                          ],
                          x: e.clientX,
                          y: e.clientY,
                        });
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => handleStateClick(stateName)}
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

          {/* City markers */}
          {visibleCities.map((city) => (
            <Marker key={city.name} coordinates={city.coordinates}>
              <circle
                r={3 / zoom}
                fill="hsl(45 90% 55%)"
                stroke="hsl(0 0% 10%)"
                strokeWidth={0.5 / zoom}
                onClick={() => handleCityClick(city.name)}
                onMouseEnter={(e) => {
                  setTooltip({
                    text: city.name,
                    details: [`Estado: ${city.state}`],
                    x: e.clientX,
                    y: e.clientY,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: "pointer" }}
              />
              {zoom >= 4 && (
                <text
                  textAnchor="middle"
                  y={-6 / zoom}
                  style={{
                    fontSize: `${Math.max(3, 10 / zoom)}px`,
                    fill: "hsl(0 0% 85%)",
                    fontWeight: 600,
                    pointerEvents: "none",
                    textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                  }}
                >
                  {city.name}
                </text>
              )}
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          className="fixed z-50 glass-card rounded-lg p-3 text-xs pointer-events-none border border-border/50"
          style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
        >
          <p className="font-bold font-display text-foreground text-sm">{tooltip.text}</p>
          {tooltip.details?.map((d, i) => (
            <p key={i} className="text-muted-foreground">
              {d.split(": ")[0]}: <span className="text-primary font-semibold">{d.split(": ")[1]}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrazilMap;
