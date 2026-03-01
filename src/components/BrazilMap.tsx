import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents, Marker, Popup } from "react-leaflet";
import { useState, useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, X } from "lucide-react";

const GEO_URL = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

interface CityCoord {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

// Cities with coordinates matching allCities in Inbound.tsx
const knownCities: CityCoord[] = [
  { name: "São Paulo", state: "São Paulo", lat: -23.55, lng: -46.63 },
  { name: "Campinas", state: "São Paulo", lat: -22.9, lng: -47.06 },
  { name: "Guarulhos", state: "São Paulo", lat: -23.46, lng: -46.53 },
  { name: "Santos", state: "São Paulo", lat: -23.96, lng: -46.33 },
  { name: "Rio de Janeiro", state: "Rio de Janeiro", lat: -22.9, lng: -43.17 },
  { name: "Niterói", state: "Rio de Janeiro", lat: -22.88, lng: -43.1 },
  { name: "Duque de Caxias", state: "Rio de Janeiro", lat: -22.79, lng: -43.31 },
  { name: "Belo Horizonte", state: "Minas Gerais", lat: -19.92, lng: -43.94 },
  { name: "Uberlândia", state: "Minas Gerais", lat: -18.92, lng: -48.28 },
  { name: "Contagem", state: "Minas Gerais", lat: -19.93, lng: -44.05 },
  { name: "Curitiba", state: "Paraná", lat: -25.43, lng: -49.27 },
  { name: "Londrina", state: "Paraná", lat: -23.31, lng: -51.16 },
  { name: "Salvador", state: "Bahia", lat: -12.97, lng: -38.51 },
  { name: "Feira de Santana", state: "Bahia", lat: -12.27, lng: -38.97 },
  { name: "Porto Alegre", state: "Rio Grande do Sul", lat: -30.03, lng: -51.18 },
  { name: "Recife", state: "Pernambuco", lat: -8.05, lng: -34.88 },
  { name: "Fortaleza", state: "Ceará", lat: -3.72, lng: -38.54 },
  { name: "Florianópolis", state: "Santa Catarina", lat: -27.6, lng: -48.55 },
  { name: "Goiânia", state: "Goiás", lat: -16.68, lng: -49.25 },
];

interface BrazilMapProps {
  onStateClick?: (stateName: string) => void;
  onCityClick?: (cityName: string) => void;
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

// Custom city marker icon
const cityIcon = L.divIcon({
  className: "city-marker",
  html: `<div style="width:10px;height:10px;background:hsl(45,90%,55%);border:2px solid hsl(0,0%,10%);border-radius:50%;box-shadow:0 0 6px rgba(255,200,50,0.5);"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const selectedCityIcon = L.divIcon({
  className: "city-marker-selected",
  html: `<div style="width:14px;height:14px;background:hsl(0,85%,55%);border:2px solid hsl(0,0%,100%);border-radius:50%;box-shadow:0 0 10px rgba(255,80,80,0.6);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

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

function FlyToCity({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 11, { duration: 0.8 });
    }
  }, [map, coords]);
  return null;
}

// Show city markers when zoom >= threshold
function CityMarkers({ cities, selectedCity, onCityClick }: {
  cities: CityCoord[];
  selectedCity: string | null;
  onCityClick: (name: string) => void;
}) {
  const [zoom, setZoom] = useState(4);
  const map = useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  if (zoom < 6) return null;

  return (
    <>
      {cities.map((city) => (
        <Marker
          key={city.name}
          position={[city.lat, city.lng]}
          icon={selectedCity === city.name ? selectedCityIcon : cityIcon}
          eventHandlers={{
            click: () => onCityClick(city.name),
          }}
        >
          <Popup className="city-popup">
            <span style={{ fontWeight: 700, fontSize: 13 }}>{city.name}</span>
            <br />
            <span style={{ fontSize: 11, opacity: 0.7 }}>{city.state}</span>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

const BrazilMap = ({ onStateClick, onCityClick }: BrazilMapProps) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [flyBounds, setFlyBounds] = useState<L.LatLngBounds | null>(null);
  const [flyCity, setFlyCity] = useState<[number, number] | null>(null);
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
    ? knownCities.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleCitySelect = useCallback((cityName: string) => {
    const city = knownCities.find(c => c.name === cityName);
    if (city) {
      setSelectedCity(cityName);
      setFlyCity([city.lat, city.lng]);
      setSearchQuery("");
      setShowSearch(false);
      onCityClick?.(cityName);
    }
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
      click: () => {
        geoJsonRef.current?.eachLayer((l: any) => {
          l.setStyle(stateStyle);
        });
        path.setStyle(selectedStateStyle);
        setSelectedState(stateName);
        setSelectedCity(null);
        setFlyCity(null);

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
        .leaflet-container {
          background: hsl(215, 35%, 10%) !important;
        }
        .city-popup .leaflet-popup-content-wrapper {
          background: hsl(215, 35%, 12%) !important;
          color: hsl(0, 0%, 90%) !important;
          border: 1px solid hsl(215, 30%, 25%) !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
        }
        .city-popup .leaflet-popup-tip {
          background: hsl(215, 35%, 12%) !important;
        }
      `}</style>

      {/* City search bar */}
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
                className="bg-background/95 border border-border/50 rounded-md px-3 py-1.5 text-xs text-foreground w-48 focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); }} className="absolute right-2 top-1/2 -translate-y-1/2">
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>
          )}
        </div>
        {/* Search results dropdown */}
        {showSearch && filteredCities.length > 0 && (
          <div className="mt-1 ml-9 bg-background/95 border border-border/50 rounded-md overflow-hidden w-48 max-h-48 overflow-y-auto">
            {filteredCities.map((city) => (
              <button
                key={city.name}
                onClick={() => handleCitySelect(city.name)}
                className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted/40 transition-colors border-b border-border/20 last:border-0"
              >
                <span className="font-semibold">{city.name}</span>
                <span className="text-muted-foreground ml-1">— {city.state}</span>
              </button>
            ))}
          </div>
        )}
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
        <FlyToCity coords={flyCity} />
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
        <CityMarkers
          cities={knownCities}
          selectedCity={selectedCity}
          onCityClick={handleCitySelect}
        />
      </MapContainer>
    </div>
  );
};

export default BrazilMap;
