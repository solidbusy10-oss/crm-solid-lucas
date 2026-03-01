import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useState, useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const GEO_URL = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

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

const selectedStyle: L.PathOptions = {
  fillColor: "hsl(170, 80%, 50%)",
  fillOpacity: 0.4,
  color: "hsl(45, 90%, 55%)",
  weight: 3,
};

// Fit map to Brazil on mount
function FitBrazil() {
  const map = useMap();
  useEffect(() => {
    map.setView([-14.5, -51], 4);
  }, [map]);
  return null;
}

// Component that handles flying to a state
function FlyToState({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, { padding: [30, 30], maxZoom: 8, duration: 0.8 });
    }
  }, [map, bounds]);
  return null;
}

const BrazilMap = ({ onStateClick, onCityClick }: BrazilMapProps) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [flyBounds, setFlyBounds] = useState<L.LatLngBounds | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  // Fetch GeoJSON
  useEffect(() => {
    fetch(GEO_URL)
      .then(r => r.json())
      .then(setGeoData)
      .catch(console.error);
  }, []);

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
        // Reset all layers
        geoJsonRef.current?.eachLayer((l: any) => {
          l.setStyle(stateStyle);
        });

        path.setStyle(selectedStyle);
        setSelectedState(stateName);

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
      `}</style>
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
      </MapContainer>
    </div>
  );
};

export default BrazilMap;
