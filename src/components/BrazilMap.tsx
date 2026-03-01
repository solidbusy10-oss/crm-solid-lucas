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

// All major cities with coordinates across every state
const cityMarkers: CityMarker[] = [
  // São Paulo
  { name: "São Paulo", state: "São Paulo", coordinates: [-46.63, -23.55] },
  { name: "Campinas", state: "São Paulo", coordinates: [-47.06, -22.9] },
  { name: "Guarulhos", state: "São Paulo", coordinates: [-46.53, -23.46] },
  { name: "Santos", state: "São Paulo", coordinates: [-46.33, -23.96] },
  { name: "São José dos Campos", state: "São Paulo", coordinates: [-45.89, -23.18] },
  { name: "Ribeirão Preto", state: "São Paulo", coordinates: [-47.81, -21.18] },
  { name: "Sorocaba", state: "São Paulo", coordinates: [-47.46, -23.5] },
  { name: "São Bernardo do Campo", state: "São Paulo", coordinates: [-46.55, -23.69] },
  { name: "Osasco", state: "São Paulo", coordinates: [-46.79, -23.53] },
  { name: "Bauru", state: "São Paulo", coordinates: [-49.07, -22.31] },
  { name: "Piracicaba", state: "São Paulo", coordinates: [-47.65, -22.73] },
  { name: "Presidente Prudente", state: "São Paulo", coordinates: [-51.39, -22.13] },
  { name: "Marília", state: "São Paulo", coordinates: [-49.95, -22.21] },
  { name: "Araçatuba", state: "São Paulo", coordinates: [-50.43, -21.21] },
  { name: "Araraquara", state: "São Paulo", coordinates: [-48.17, -21.79] },
  // Rio de Janeiro
  { name: "Rio de Janeiro", state: "Rio de Janeiro", coordinates: [-43.17, -22.9] },
  { name: "Niterói", state: "Rio de Janeiro", coordinates: [-43.1, -22.88] },
  { name: "Duque de Caxias", state: "Rio de Janeiro", coordinates: [-43.31, -22.79] },
  { name: "Nova Iguaçu", state: "Rio de Janeiro", coordinates: [-43.45, -22.76] },
  { name: "São Gonçalo", state: "Rio de Janeiro", coordinates: [-43.05, -22.83] },
  { name: "Petrópolis", state: "Rio de Janeiro", coordinates: [-43.18, -22.51] },
  { name: "Volta Redonda", state: "Rio de Janeiro", coordinates: [-44.1, -22.52] },
  { name: "Campos dos Goytacazes", state: "Rio de Janeiro", coordinates: [-41.3, -21.75] },
  { name: "Macaé", state: "Rio de Janeiro", coordinates: [-41.79, -22.37] },
  // Minas Gerais
  { name: "Belo Horizonte", state: "Minas Gerais", coordinates: [-43.94, -19.92] },
  { name: "Uberlândia", state: "Minas Gerais", coordinates: [-48.28, -18.92] },
  { name: "Contagem", state: "Minas Gerais", coordinates: [-44.05, -19.93] },
  { name: "Juiz de Fora", state: "Minas Gerais", coordinates: [-43.35, -21.76] },
  { name: "Betim", state: "Minas Gerais", coordinates: [-44.2, -19.97] },
  { name: "Montes Claros", state: "Minas Gerais", coordinates: [-43.86, -16.73] },
  { name: "Uberaba", state: "Minas Gerais", coordinates: [-47.93, -19.75] },
  { name: "Governador Valadares", state: "Minas Gerais", coordinates: [-41.95, -18.85] },
  { name: "Ipatinga", state: "Minas Gerais", coordinates: [-42.54, -19.47] },
  { name: "Poços de Caldas", state: "Minas Gerais", coordinates: [-46.56, -21.79] },
  // Paraná
  { name: "Curitiba", state: "Paraná", coordinates: [-49.27, -25.43] },
  { name: "Londrina", state: "Paraná", coordinates: [-51.16, -23.31] },
  { name: "Maringá", state: "Paraná", coordinates: [-51.94, -23.42] },
  { name: "Ponta Grossa", state: "Paraná", coordinates: [-50.16, -25.09] },
  { name: "Cascavel", state: "Paraná", coordinates: [-53.46, -24.96] },
  { name: "Foz do Iguaçu", state: "Paraná", coordinates: [-54.59, -25.55] },
  { name: "Guarapuava", state: "Paraná", coordinates: [-51.46, -25.39] },
  // Bahia
  { name: "Salvador", state: "Bahia", coordinates: [-38.51, -12.97] },
  { name: "Feira de Santana", state: "Bahia", coordinates: [-38.97, -12.27] },
  { name: "Vitória da Conquista", state: "Bahia", coordinates: [-40.84, -14.86] },
  { name: "Ilhéus", state: "Bahia", coordinates: [-39.05, -14.79] },
  { name: "Itabuna", state: "Bahia", coordinates: [-39.28, -14.79] },
  { name: "Juazeiro", state: "Bahia", coordinates: [-40.5, -9.41] },
  { name: "Barreiras", state: "Bahia", coordinates: [-44.99, -12.15] },
  { name: "Camaçari", state: "Bahia", coordinates: [-38.32, -12.7] },
  // Rio Grande do Sul
  { name: "Porto Alegre", state: "Rio Grande do Sul", coordinates: [-51.18, -30.03] },
  { name: "Caxias do Sul", state: "Rio Grande do Sul", coordinates: [-51.18, -29.17] },
  { name: "Pelotas", state: "Rio Grande do Sul", coordinates: [-52.34, -31.77] },
  { name: "Santa Maria", state: "Rio Grande do Sul", coordinates: [-53.81, -29.68] },
  { name: "Canoas", state: "Rio Grande do Sul", coordinates: [-51.17, -29.92] },
  { name: "Passo Fundo", state: "Rio Grande do Sul", coordinates: [-52.41, -28.26] },
  { name: "Novo Hamburgo", state: "Rio Grande do Sul", coordinates: [-51.13, -29.68] },
  // Pernambuco
  { name: "Recife", state: "Pernambuco", coordinates: [-34.88, -8.05] },
  { name: "Jaboatão dos Guararapes", state: "Pernambuco", coordinates: [-35.02, -8.18] },
  { name: "Olinda", state: "Pernambuco", coordinates: [-34.86, -8.01] },
  { name: "Caruaru", state: "Pernambuco", coordinates: [-35.98, -8.28] },
  { name: "Petrolina", state: "Pernambuco", coordinates: [-40.5, -9.39] },
  { name: "Garanhuns", state: "Pernambuco", coordinates: [-36.49, -8.89] },
  // Ceará
  { name: "Fortaleza", state: "Ceará", coordinates: [-38.54, -3.72] },
  { name: "Juazeiro do Norte", state: "Ceará", coordinates: [-39.32, -7.21] },
  { name: "Sobral", state: "Ceará", coordinates: [-40.35, -3.69] },
  { name: "Caucaia", state: "Ceará", coordinates: [-38.65, -3.74] },
  { name: "Maracanaú", state: "Ceará", coordinates: [-38.63, -3.88] },
  { name: "Crato", state: "Ceará", coordinates: [-39.41, -7.23] },
  // Santa Catarina
  { name: "Florianópolis", state: "Santa Catarina", coordinates: [-48.55, -27.6] },
  { name: "Joinville", state: "Santa Catarina", coordinates: [-48.84, -26.3] },
  { name: "Blumenau", state: "Santa Catarina", coordinates: [-49.07, -26.92] },
  { name: "Chapecó", state: "Santa Catarina", coordinates: [-52.62, -27.1] },
  { name: "Criciúma", state: "Santa Catarina", coordinates: [-49.37, -28.68] },
  { name: "Itajaí", state: "Santa Catarina", coordinates: [-48.67, -26.91] },
  // Goiás
  { name: "Goiânia", state: "Goiás", coordinates: [-49.25, -16.68] },
  { name: "Aparecida de Goiânia", state: "Goiás", coordinates: [-49.24, -16.82] },
  { name: "Anápolis", state: "Goiás", coordinates: [-48.95, -16.33] },
  { name: "Rio Verde", state: "Goiás", coordinates: [-49.47, -17.79] },
  { name: "Luziânia", state: "Goiás", coordinates: [-47.95, -16.25] },
  // Distrito Federal
  { name: "Brasília", state: "Distrito Federal", coordinates: [-47.88, -15.79] },
  { name: "Taguatinga", state: "Distrito Federal", coordinates: [-48.06, -15.83] },
  { name: "Ceilândia", state: "Distrito Federal", coordinates: [-48.11, -15.81] },
  // Pará
  { name: "Belém", state: "Pará", coordinates: [-48.5, -1.46] },
  { name: "Ananindeua", state: "Pará", coordinates: [-48.39, -1.37] },
  { name: "Santarém", state: "Pará", coordinates: [-54.71, -2.44] },
  { name: "Marabá", state: "Pará", coordinates: [-49.12, -5.37] },
  { name: "Castanhal", state: "Pará", coordinates: [-47.93, -1.3] },
  { name: "Altamira", state: "Pará", coordinates: [-52.21, -3.2] },
  // Maranhão
  { name: "São Luís", state: "Maranhão", coordinates: [-44.28, -2.53] },
  { name: "Imperatriz", state: "Maranhão", coordinates: [-47.47, -5.52] },
  { name: "Caxias", state: "Maranhão", coordinates: [-43.36, -4.86] },
  { name: "Timon", state: "Maranhão", coordinates: [-42.84, -5.09] },
  { name: "Codó", state: "Maranhão", coordinates: [-43.89, -4.46] },
  // Amazonas
  { name: "Manaus", state: "Amazonas", coordinates: [-60.03, -3.12] },
  { name: "Parintins", state: "Amazonas", coordinates: [-56.74, -2.63] },
  { name: "Itacoatiara", state: "Amazonas", coordinates: [-58.44, -3.14] },
  { name: "Manacapuru", state: "Amazonas", coordinates: [-60.62, -3.3] },
  { name: "Tefé", state: "Amazonas", coordinates: [-64.71, -3.35] },
  // Espírito Santo
  { name: "Vitória", state: "Espírito Santo", coordinates: [-40.34, -20.32] },
  { name: "Vila Velha", state: "Espírito Santo", coordinates: [-40.29, -20.33] },
  { name: "Serra", state: "Espírito Santo", coordinates: [-40.31, -20.13] },
  { name: "Cariacica", state: "Espírito Santo", coordinates: [-40.42, -20.26] },
  { name: "Linhares", state: "Espírito Santo", coordinates: [-40.07, -19.39] },
  { name: "Cachoeiro de Itapemirim", state: "Espírito Santo", coordinates: [-41.11, -20.85] },
  // Mato Grosso
  { name: "Cuiabá", state: "Mato Grosso", coordinates: [-56.1, -15.6] },
  { name: "Várzea Grande", state: "Mato Grosso", coordinates: [-56.13, -15.65] },
  { name: "Rondonópolis", state: "Mato Grosso", coordinates: [-54.64, -16.47] },
  { name: "Sinop", state: "Mato Grosso", coordinates: [-55.5, -11.86] },
  { name: "Tangará da Serra", state: "Mato Grosso", coordinates: [-57.5, -14.62] },
  // Mato Grosso do Sul
  { name: "Campo Grande", state: "Mato Grosso do Sul", coordinates: [-54.62, -20.44] },
  { name: "Dourados", state: "Mato Grosso do Sul", coordinates: [-54.81, -22.22] },
  { name: "Três Lagoas", state: "Mato Grosso do Sul", coordinates: [-51.68, -20.75] },
  { name: "Corumbá", state: "Mato Grosso do Sul", coordinates: [-57.65, -19.01] },
  { name: "Ponta Porã", state: "Mato Grosso do Sul", coordinates: [-55.73, -22.54] },
  // Paraíba
  { name: "João Pessoa", state: "Paraíba", coordinates: [-34.86, -7.12] },
  { name: "Campina Grande", state: "Paraíba", coordinates: [-35.88, -7.23] },
  { name: "Santa Rita", state: "Paraíba", coordinates: [-34.98, -7.11] },
  { name: "Patos", state: "Paraíba", coordinates: [-37.28, -7.02] },
  // Rio Grande do Norte
  { name: "Natal", state: "Rio Grande do Norte", coordinates: [-35.21, -5.79] },
  { name: "Mossoró", state: "Rio Grande do Norte", coordinates: [-37.34, -5.19] },
  { name: "Parnamirim", state: "Rio Grande do Norte", coordinates: [-35.26, -5.92] },
  { name: "Caicó", state: "Rio Grande do Norte", coordinates: [-37.1, -6.46] },
  // Alagoas
  { name: "Maceió", state: "Alagoas", coordinates: [-35.74, -9.67] },
  { name: "Arapiraca", state: "Alagoas", coordinates: [-36.66, -9.75] },
  { name: "Rio Largo", state: "Alagoas", coordinates: [-35.85, -9.48] },
  // Piauí
  { name: "Teresina", state: "Piauí", coordinates: [-42.8, -5.09] },
  { name: "Parnaíba", state: "Piauí", coordinates: [-41.78, -2.9] },
  { name: "Picos", state: "Piauí", coordinates: [-41.47, -7.08] },
  { name: "Floriano", state: "Piauí", coordinates: [-43.02, -6.77] },
  // Sergipe
  { name: "Aracaju", state: "Sergipe", coordinates: [-37.07, -10.91] },
  { name: "Nossa Senhora do Socorro", state: "Sergipe", coordinates: [-37.13, -10.86] },
  { name: "Lagarto", state: "Sergipe", coordinates: [-37.65, -10.92] },
  // Rondônia
  { name: "Porto Velho", state: "Rondônia", coordinates: [-63.9, -8.76] },
  { name: "Ji-Paraná", state: "Rondônia", coordinates: [-61.95, -10.88] },
  { name: "Vilhena", state: "Rondônia", coordinates: [-60.15, -12.74] },
  { name: "Ariquemes", state: "Rondônia", coordinates: [-63.04, -9.91] },
  // Tocantins
  { name: "Palmas", state: "Tocantins", coordinates: [-48.33, -10.18] },
  { name: "Araguaína", state: "Tocantins", coordinates: [-48.21, -7.19] },
  { name: "Gurupi", state: "Tocantins", coordinates: [-49.07, -11.73] },
  // Acre
  { name: "Rio Branco", state: "Acre", coordinates: [-67.81, -9.97] },
  { name: "Cruzeiro do Sul", state: "Acre", coordinates: [-72.67, -7.63] },
  // Amapá
  { name: "Macapá", state: "Amapá", coordinates: [-51.07, 0.03] },
  { name: "Santana", state: "Amapá", coordinates: [-51.17, -0.06] },
  // Roraima
  { name: "Boa Vista", state: "Roraima", coordinates: [-60.67, 2.82] },
  { name: "Rorainópolis", state: "Roraima", coordinates: [-60.44, 0.94] },
];

const maxLeads = 480;

const getColor = (leads: number) => {
  const intensity = leads / maxLeads;
  if (intensity > 0.6) return "hsl(170 80% 45%)";
  if (intensity > 0.35) return "hsl(170 60% 35%)";
  if (intensity > 0.15) return "hsl(170 40% 25%)";
  return "hsl(215 35% 22%)";
};

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
  const showLabels = zoom >= 3.5;

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

      {zoom < 2 && (
        <div className="absolute bottom-2 left-2 z-10 text-[9px] text-muted-foreground bg-background/60 px-2 py-1 rounded">
          Clique num estado para ver as cidades
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

          {/* City name labels on the map territory */}
          {visibleCities.map((city) => (
            <Marker key={city.name} coordinates={city.coordinates}>
              <g
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
              >
                {/* Small dot */}
                <circle
                  r={1.5 / zoom}
                  fill="hsl(45 90% 60%)"
                  stroke="hsl(0 0% 0%)"
                  strokeWidth={0.3 / zoom}
                />
                {/* City name text label */}
                {showLabels && (
                  <text
                    x={4 / zoom}
                    y={1 / zoom}
                    style={{
                      fontSize: `${Math.max(2.5, 8 / zoom)}px`,
                      fill: "hsl(0 0% 90%)",
                      fontWeight: 600,
                      fontFamily: "system-ui, sans-serif",
                      pointerEvents: "all",
                      textShadow: "0 0 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.6)",
                    }}
                  >
                    {city.name}
                  </text>
                )}
                {/* Larger invisible hitbox for easier clicking */}
                <rect
                  x={-6 / zoom}
                  y={-5 / zoom}
                  width={showLabels ? Math.max(60, city.name.length * 6) / zoom : 12 / zoom}
                  height={10 / zoom}
                  fill="transparent"
                />
              </g>
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
