import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents } from "react-leaflet";
import { useState, useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, X, MapPin } from "lucide-react";
import { citiesByState } from "@/data/brazilCities";

const GEO_URL = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

// Flatten all cities for search
const allCitiesFlat = Object.entries(citiesByState).flatMap(([state, cities]) =>
  cities.map(city => ({ name: city, state }))
);

interface BrazilMapProps {
  onStateClick?: (stateName: string) => void;
  onCityClick?: (cityName: string, stateName: string) => void;
}

const stateStyle: L.PathOptions = {
  fillColor: "hsl(170, 80%, 45%)",
  fillOpacity: 0.15,
  color: "hsl(170, 90%, 55%)",
  weight: 1.5,
};

const stateHoverStyle: L.PathOptions = {
  fillOpacity: 0.35,
  weight: 2.5,
  color: "hsl(170, 90%, 65%)",
};

const selectedStateStyle: L.PathOptions = {
  fillColor: "hsl(170, 80%, 50%)",
  fillOpacity: 0.4,
  color: "hsl(45, 90%, 55%)",
  weight: 3,
};

function FitBrazil() {
  const map = useMap();
  useEffect(() => {
    map.setView([-14.5, -51], 4);
  }, [map]);
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

// Reverse geocode on map click at high zoom to get city name
function MapClickHandler({ onCityFound }: { onCityFound: (city: string, state: string) => void }) {
  const [marker, setMarker] = useState<L.LatLng | null>(null);
  const [loading, setLoading] = useState(false);
  const [cityLabel, setCityLabel] = useState<string | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const map = useMapEvents({
    click: async (e) => {
      const zoom = map.getZoom();
      if (zoom < 8) return; // Only reverse geocode at high zoom

      setLoading(true);
      setMarker(e.latlng);
      setCityLabel(null);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json&zoom=10&addressdetails=1`,
          { headers: { "Accept-Language": "pt-BR" } }
        );
        const data = await res.json();
        const city = data.address?.city || data.address?.town || data.address?.municipality || data.address?.village;
        const state = data.address?.state;

        if (city) {
          setCityLabel(`${city} — ${state || ""}`);
          onCityFound(city, state || "");
        } else {
          setCityLabel("Cidade não identificada");
        }
      } catch {
        setCityLabel("Erro ao buscar cidade");
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    if (marker && map) {
      if (markerRef.current) {
        markerRef.current.remove();
      }

      const icon = L.divIcon({
        className: "selected-city-pin",
        html: `<div style="
          width:16px;height:16px;
          background:hsl(0,85%,55%);
          border:3px solid white;
          border-radius:50%;
          box-shadow:0 0 12px rgba(255,80,80,0.6), 0 2px 8px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const m = L.marker(marker, { icon }).addTo(map);

      const label = loading ? "Buscando..." : cityLabel || "";
      if (label) {
        m.bindTooltip(label, {
          permanent: true,
          className: "city-pin-tooltip",
          direction: "top",
          offset: [0, -12],
        }).openTooltip();
      }

      markerRef.current = m;
    }

    return () => {
      // cleanup on unmount only
    };
  }, [marker, map, loading, cityLabel]);

  return null;
}

const BrazilMap = ({ onStateClick, onCityClick }: BrazilMapProps) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [flyBounds, setFlyBounds] = useState<L.LatLngBounds | null>(null);
  const [flyPoint, setFlyPoint] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    fetch(GEO_URL)
      .then(r => r.json())
      .then(setGeoData)
      .catch(console.error);
  }, []);

  const filteredCities = searchQuery.length >= 2
    ? allCitiesFlat
        .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 20) // limit results
    : [];

  const handleCitySelectFromSearch = useCallback(async (cityName: string, stateName: string) => {
    setSearchQuery("");
    setShowSearch(false);

    // Geocode city to fly to it
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

  const onEachFeature = useCallback((feature: any, layer: L.Layer) => {
    const stateName = feature.properties.name;
    const path = layer as L.Path;

    layer.on({
      mouseover: () => {
        if (selectedState !== stateName) {
          path.setStyle(stateHoverStyle);
        }
      },
      mouseout: () => {
        if (selectedState !== stateName) {
          path.setStyle(stateStyle);
        }
      },
      click: (e) => {
        // Only handle state click at low zoom
        const map = (e as any).target._map;
        if (map && map.getZoom() >= 8) return; // Let MapClickHandler handle it

        geoJsonRef.current?.eachLayer((l: any) => {
          l.setStyle(stateStyle);
        });
        path.setStyle(selectedStateStyle);
        setSelectedState(stateName);
        setFlyPoint(null);

        const bounds = (layer as L.Polygon).getBounds();
        setFlyBounds(bounds);

        onStateClick?.(stateName);
      },
    });

    layer.bindTooltip(stateName, {
      sticky: true,
      className: "state-tooltip",
      direction: "top",
    });
  }, [onStateClick, selectedState]);

  const style = useCallback(() => stateStyle, []);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <style>{`
        .state-tooltip {
          background: hsl(215, 35%, 12%) !important;
          color: hsl(0, 0%, 90%) !important;
          border: 1px solid hsl(215, 30%, 25%) !important;
          border-radius: 6px !important;
          padding: 4px 10px !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
        }
        .state-tooltip::before {
          border-top-color: hsl(215, 30%, 25%) !important;
        }
        .city-pin-tooltip {
          background: hsl(215, 35%, 12%) !important;
          color: hsl(45, 90%, 55%) !important;
          border: 1px solid hsl(45, 70%, 40%) !important;
          border-radius: 6px !important;
          padding: 4px 10px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
        }
        .city-pin-tooltip::before {
          border-top-color: hsl(45, 70%, 40%) !important;
        }
        .leaflet-container {
          background: hsl(215, 35%, 10%) !important;
        }
      `}</style>

      {/* Search bar */}
      <div className="absolute top-2 left-12 z-[1000] flex flex-col">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="glass-card w-8 h-8 rounded-md flex items-center justify-center border border-border/50 hover:bg-muted/40 transition-colors"
            title="Buscar cidade"
          >
            <Search className="h-4 w-4 text-foreground" />
          </button>
          {showSearch && (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cidade..."
                className="bg-background/95 border border-border/50 rounded-md px-3 py-1.5 text-xs text-foreground w-56 focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>
          )}
        </div>
        {showSearch && filteredCities.length > 0 && (
          <div className="mt-1 ml-9 bg-background/95 border border-border/50 rounded-md overflow-hidden w-56 max-h-52 overflow-y-auto">
            {filteredCities.map((city) => (
              <button
                key={`${city.name}-${city.state}`}
                onClick={() => handleCitySelectFromSearch(city.name, city.state)}
                className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted/40 transition-colors border-b border-border/20 last:border-0 flex items-center gap-2"
              >
                <MapPin className="h-3 w-3 text-primary shrink-0" />
                <div>
                  <span className="font-semibold">{city.name}</span>
                  <span className="text-muted-foreground ml-1 text-[10px]">— {city.state}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom hint */}
      <div className="absolute bottom-2 left-2 z-[1000] text-[9px] text-muted-foreground bg-background/70 px-2 py-1 rounded flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        Clique no estado para zoom · Dê zoom e clique para selecionar cidade
      </div>

      <MapContainer
        center={[-14.5, -51]}
        zoom={4}
        minZoom={3}
        maxZoom={18}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
      >
        <FitBrazil />
        <FlyToState bounds={flyBounds} />
        <FlyToPoint coords={flyPoint} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && (
          <GeoJSON
            ref={(ref) => { geoJsonRef.current = ref; }}
            key={selectedState || "default"}
            data={geoData}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
        <MapClickHandler onCityFound={handleCityFromMap} />
      </MapContainer>
    </div>
  );
};

export default BrazilMap;
