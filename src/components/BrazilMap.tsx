import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents } from "react-leaflet";
import { useState, useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, X, MapPin, Crosshair } from "lucide-react";
import { citiesByState } from "@/data/brazilCities";

const GEO_URL = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

const allCitiesFlat = Object.entries(citiesByState).flatMap(([state, cities]) =>
  cities.map(city => ({ name: city, state }))
);

interface BrazilMapProps {
  onStateClick?: (stateName: string) => void;
  onCityClick?: (cityName: string, stateName: string) => void;
  onClearFilter?: () => void;
}

const stateStyle: L.PathOptions = {
  fillColor: "hsl(170, 80%, 45%)",
  fillOpacity: 0.12,
  color: "hsl(170, 70%, 50%)",
  weight: 1.2,
  dashArray: "",
};

const stateHoverStyle: L.PathOptions = {
  fillColor: "hsl(170, 80%, 55%)",
  fillOpacity: 0.3,
  weight: 2,
  color: "hsl(170, 90%, 65%)",
  dashArray: "",
};

const selectedStateStyle: L.PathOptions = {
  fillColor: "hsl(170, 80%, 50%)",
  fillOpacity: 0.35,
  color: "hsl(45, 90%, 55%)",
  weight: 2.5,
  dashArray: "",
};

const DARK_TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";
const DARK_TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';
const LABELS_TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png";

const BRAZIL_BOUNDS: L.LatLngBoundsExpression = [
  [-38.0, -80.0],
  [10.0, -28.0],
];

function FitBrazil() {
  const map = useMap();
  useEffect(() => {
    map.setView([-14.5, -51], 4);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function FlyToState({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, { padding: [30, 30], maxZoom: 8, duration: 0.8 });
    }
  }, [map, bounds]);
  return null;
}

function FlyToPoint({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 12, { duration: 0.8 });
    }
  }, [map, coords]);
  return null;
}

function ResetMap({ trigger, onDone }: { trigger: number; onDone: () => void }) {
  const map = useMap();
  useEffect(() => {
    if (trigger > 0) {
      map.flyTo([-14.5, -51], 4, { duration: 0.6 });
      onDone();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);
  return null;
}

function MapClickHandler({ onCityFound, clearTrigger }: { onCityFound: (city: string, state: string) => void; clearTrigger: number }) {
  const markerRef = useRef<L.Marker | null>(null);
  const map = useMap();

  useEffect(() => {
    if (clearTrigger > 0 && markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [clearTrigger]);

  useMapEvents({
    click: async (e) => {
      if (map.getZoom() < 8) return;

      // Remove old marker
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      const icon = L.divIcon({
        className: "selected-city-pin",
        html: `<div style="width:20px;height:20px;background:linear-gradient(135deg,hsl(170,80%,45%),hsl(170,90%,60%));border:3px solid #fff;border-radius:50%;box-shadow:0 0 20px hsla(170,80%,50%,0.5),0 2px 8px rgba(0,0,0,0.5);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const m = L.marker(e.latlng, { icon }).addTo(map);
      m.bindTooltip("⏳ Buscando...", {
        permanent: true,
        className: "city-pin-tooltip",
        direction: "top",
        offset: [0, -14],
      }).openTooltip();
      markerRef.current = m;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json&zoom=10&addressdetails=1`,
          { headers: { "Accept-Language": "pt-BR" } }
        );
        const data = await res.json();
        const city = data.address?.city || data.address?.town || data.address?.municipality || data.address?.village;
        const state = data.address?.state;

        if (markerRef.current === m) {
          const label = city ? `${city} — ${state || ""}` : "Cidade não identificada";
          m.setTooltipContent(label);
          if (city) onCityFound(city, state || "");
        }
      } catch {
        if (markerRef.current === m) {
          m.setTooltipContent("Erro ao buscar cidade");
        }
      }
    },
  });

  return null;
}

const BrazilMap = ({ onStateClick, onCityClick, onClearFilter }: BrazilMapProps) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [flyBounds, setFlyBounds] = useState<L.LatLngBounds | null>(null);
  const [flyPoint, setFlyPoint] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [clearMarkerTrigger, setClearMarkerTrigger] = useState(0);
  const [statusText, setStatusText] = useState("Clique num estado para selecionar · Use a busca para encontrar cidades");
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  const selectedStateRef = useRef<string | null>(null);
  const selectedLayerRef = useRef<L.Path | null>(null);

  useEffect(() => {
    fetch(GEO_URL)
      .then(r => r.json())
      .then(setGeoData)
      .catch(console.error);
  }, []);

  const filteredCities = searchQuery.length >= 2
    ? allCitiesFlat
        .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 20)
    : [];

  const handleCitySelectFromSearch = useCallback(async (cityName: string, stateName: string) => {
    setSearchQuery("");
    setShowSearch(false);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName + ", " + stateName + ", Brazil")}&format=json&limit=1`,
        { headers: { "Accept-Language": "pt-BR" } }
      );
      const data = await res.json();
      if (data.length > 0) {
        setFlyPoint([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch {
      // silently fail
    }

    onCityClick?.(cityName, stateName);
  }, [onCityClick]);

  const handleCityFromMap = useCallback((city: string, state: string) => {
    onCityClick?.(city, state);
  }, [onCityClick]);

  const handleReset = useCallback(() => {
    selectedStateRef.current = null;
    if (selectedLayerRef.current) {
      selectedLayerRef.current.setStyle(stateStyle);
      selectedLayerRef.current = null;
    }
    setFlyBounds(null);
    setFlyPoint(null);
    setResetTrigger(prev => prev + 1);
    setClearMarkerTrigger(prev => prev + 1);
    setStatusText("Clique num estado para selecionar · Use a busca para encontrar cidades");
    onClearFilter?.();
  }, [onClearFilter]);

  // Stable callback — no dependency on selectedState state
  const onEachFeature = useCallback((feature: any, layer: L.Layer) => {
    const stateName = feature.properties.name;
    const path = layer as L.Path;

    layer.on({
      mouseover: () => {
        if (selectedStateRef.current !== stateName) {
          path.setStyle(stateHoverStyle);
        }
      },
      mouseout: () => {
        if (selectedStateRef.current !== stateName) {
          path.setStyle(stateStyle);
        }
      },
      click: (e) => {
        const map = (e as any).target._map;
        if (map && map.getZoom() >= 8) return;

        // Reset previous selection
        if (selectedLayerRef.current) {
          selectedLayerRef.current.setStyle(stateStyle);
        }

        path.setStyle(selectedStateStyle);
        selectedStateRef.current = stateName;
        selectedLayerRef.current = path;
        setFlyPoint(null);
        setStatusText(`📍 ${stateName} selecionado · Dê zoom e clique para selecionar cidade`);

        const bounds = (layer as L.Polygon).getBounds();
        setFlyBounds(bounds);

        onStateClick?.(stateName);
      },
    });

    layer.bindTooltip(stateName, {
      sticky: true,
      className: "map-state-tooltip",
      direction: "top",
    });
  }, [onStateClick]);

  const style = useCallback(() => stateStyle, []);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border/30">
      <style>{`
        .leaflet-container {
          background: hsl(220, 30%, 8%) !important;
          font-family: inherit;
        }
        .leaflet-control-zoom { border: none !important; box-shadow: 0 4px 16px rgba(0,0,0,0.5) !important; }
        .leaflet-control-zoom a {
          background: hsla(220, 30%, 14%, 0.95) !important;
          color: hsl(0, 0%, 80%) !important;
          border: 1px solid hsl(220, 20%, 22%) !important;
          width: 32px !important; height: 32px !important; line-height: 32px !important; font-size: 16px !important;
          transition: all 0.2s ease;
        }
        .leaflet-control-zoom a:hover { background: hsla(220, 30%, 20%, 0.95) !important; color: hsl(170, 80%, 55%) !important; }
        .leaflet-control-attribution { background: hsla(220, 30%, 8%, 0.8) !important; color: hsl(220, 15%, 45%) !important; font-size: 9px !important; }
        .leaflet-control-attribution a { color: hsl(170, 60%, 45%) !important; }
        .map-state-tooltip, .city-pin-tooltip {
          background: hsla(220, 35%, 10%, 0.95) !important;
          color: hsl(0, 0%, 95%) !important;
          border: 1px solid hsl(170, 60%, 40%) !important;
          border-radius: 8px !important;
          padding: 6px 14px !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5) !important;
        }
        .city-pin-tooltip { color: hsl(170, 80%, 55%) !important; }
        .map-search-dropdown::-webkit-scrollbar { width: 4px; }
        .map-search-dropdown::-webkit-scrollbar-thumb { background: hsl(220, 20%, 30%); border-radius: 4px; }
      `}</style>

      {/* Floating Controls */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border backdrop-blur-xl ${
                showSearch
                  ? "bg-primary/20 border-primary/50 shadow-[0_0_15px_hsla(170,80%,50%,0.2)]"
                  : "bg-background/70 border-border/40 hover:bg-muted/50 hover:border-border/60"
              }`}
              title="Buscar cidade"
            >
              <Search className={`h-4 w-4 ${showSearch ? "text-primary" : "text-muted-foreground"}`} />
            </button>
            {showSearch && (
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar cidade..."
                  className="bg-background/90 backdrop-blur-xl border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground w-60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 placeholder:text-muted-foreground/60 shadow-lg transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 hover:text-foreground transition-colors">
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>
            )}
          </div>
          {showSearch && filteredCities.length > 0 && (
            <div className="mt-1.5 ml-[42px] bg-background/95 backdrop-blur-xl border border-border/50 rounded-lg overflow-hidden w-60 max-h-56 overflow-y-auto map-search-dropdown shadow-2xl">
              {filteredCities.map((city) => (
                <button
                  key={`${city.name}-${city.state}`}
                  onClick={() => handleCitySelectFromSearch(city.name, city.state)}
                  className="w-full text-left px-3 py-2.5 text-xs text-foreground hover:bg-primary/10 transition-all border-b border-border/15 last:border-0 flex items-center gap-2.5 group"
                >
                  <MapPin className="h-3.5 w-3.5 text-primary/60 group-hover:text-primary shrink-0 transition-colors" />
                  <div className="flex flex-col">
                    <span className="font-semibold group-hover:text-primary transition-colors">{city.name}</span>
                    <span className="text-muted-foreground/70 text-[10px]">{city.state}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-destructive/15 backdrop-blur-xl border border-destructive/30 hover:bg-destructive/25 hover:border-destructive/50 transition-all duration-200"
          title="Limpar filtro do mapa"
        >
          <X className="h-3.5 w-3.5 text-destructive" />
          <span className="text-[10px] font-semibold text-destructive">Limpar filtro</span>
        </button>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-2">
        <div className="bg-background/80 backdrop-blur-xl border border-border/30 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg">
          <Crosshair className="h-3 w-3 text-primary/70" />
          <span className="text-[10px] text-muted-foreground/80 font-medium">{statusText}</span>
        </div>
      </div>

      <MapContainer
        center={[-14.5, -51]}
        zoom={4}
        minZoom={3}
        maxZoom={18}
        maxBounds={BRAZIL_BOUNDS as L.LatLngBoundsExpression}
        maxBoundsViscosity={0.8}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
        boxZoom={false}
      >
        <FitBrazil />
        <FlyToState bounds={flyBounds} />
        <FlyToPoint coords={flyPoint} />
        <ResetMap trigger={resetTrigger} onDone={() => {}} />
        <TileLayer attribution={DARK_TILE_ATTR} url={DARK_TILE_URL} />
        <TileLayer url={LABELS_TILE_URL} />
        {geoData && (
          <GeoJSON
            ref={(ref) => { geoJsonRef.current = ref; }}
            data={geoData}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
        <MapClickHandler onCityFound={handleCityFromMap} clearTrigger={clearMarkerTrigger} />
      </MapContainer>
    </div>
  );
};

export default BrazilMap;
