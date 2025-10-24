import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css"; // ✅ required for map styling
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, Maximize2, X } from "lucide-react";
import proj4 from "proj4";
import L from "leaflet";
import pointOnFeature from "@turf/point-on-feature";
import area from "@turf/area";

function FitBounds({ geojson }: { geojson: any }) {
  const map = useMap();
  useEffect(() => {
    if (geojson) {
      const layer = L.geoJSON(geojson);
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    }
  }, [geojson, map]);
  return null;
}

function reprojectCoords(coords: any): any {
  if (typeof coords[0] === "number") {
    const [x, y] = coords;
    return proj4("EPSG:32646", "EPSG:4326", [x, y]);
  }
  return coords.map(reprojectCoords);
}

function reprojectGeojson(data: any) {
  if (!data) return null;

  return {
    ...data,
    features: data.features.map((f: any) => {
      if (!f.geometry) return f;

      const reprojectedFeature = {
        ...f,
        geometry: {
          ...f.geometry,
          coordinates: reprojectCoords(f.geometry.coordinates),
        },
      };

      try {
        // Calculate area in square metres
        const polygonArea = area(reprojectedFeature);

        // Attach to properties
        reprojectedFeature.properties = {
          ...reprojectedFeature.properties,
          area_sqm: polygonArea.toFixed(2), // keep 2 decimals
        };
      } catch (err) {
        console.error("Area calc failed:", err);
      }

      return reprojectedFeature;
    }),
  };
}

export default function MapViewCom(mapdata: any) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Projection definition
  proj4.defs("EPSG:32646", "+proj=utm +zone=46 +datum=WGS84 +units=m +no_defs");

  const convertedGeojson = reprojectGeojson(mapdata.mapdata);

  const MapView = () => (
    <MapContainer
      center={[26.1445, 91.7362]}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full h-full"
      style={{ minHeight: "100%", minWidth: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <FitBounds geojson={convertedGeojson} />

      {convertedGeojson && (
        <GeoJSON
          key="village-geojson"
          data={convertedGeojson}
          style={() => ({
            color: "#374151", // dark gray border
            weight: 1.5,
            fillColor: "#86efac", // soft green fill
            fillOpacity: 0.6,
          })}
          onEachFeature={(feature, layer) => {
            // Popup info
            if (feature.properties) {
              let content = "<b>Parcel Info</b><br/>";
              // for (const [key, value] of Object.entries(feature.properties)) {
                content += `<b>Survey Number:</b> ${feature.properties.kide || ""}<br/>`;
                content += `<b>Area (sqm):</b> ${feature.properties.area_sqm || ""}m²<br/>`;

              // }
              layer.bindPopup(content);
            }

            // Hover effect
            layer.on({
              mouseover: (e) => {
                e.target.setStyle({
                  fillColor: "#fbbf24", // amber fill on hover
                  fillOpacity: 0.8,
                });
              },
              mouseout: (e) => {
                e.target.setStyle({
                  fillColor: "#86efac", // reset to default green
                  fillOpacity: 0.6,
                });
              },
            });
          }}
        />
      )}

      {/* Labels on polygons */}
      {convertedGeojson?.features.map((feature: any, i: number) => {
        try {
          const labelPoint = pointOnFeature(feature);
          const [lng, lat] = labelPoint.geometry.coordinates;
          return (
            <Marker
              key={i}
              position={[lat, lng]}
              icon={L.divIcon({
                className:
                  "text-xs font-bold text-blue-900 px-1 rounded shadow",
                html: feature.properties?.kide || "",
              })}
              interactive={false}
            />
          );
        } catch {
          return null;
        }
      })}
    </MapContainer>
  );

  return (
    <div className="space-y-6">
      {/* Normal Map View */}
      {!isFullscreen && (
        <Card className="relative">
          <CardHeader className="py-1 flex items-center justify-between">
           
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {convertedGeojson ? (
              <div className="w-full h-[600px] rounded-lg overflow-hidden relative">
                <MapView />
              </div>
            ) : (
              <>Map not uploaded yet</>
            )}
          </CardContent>
        </Card>
      )}

      {/* Fullscreen Map */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Floating close button */}
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-[1000] bg-white shadow-lg rounded-full"
          >
            <X className="h-5 w-5 text-black" />
          </Button>

          {/* Fullscreen map fills entire screen */}
          <div className="absolute inset-0">
            <MapView />
          </div>
        </div>
      )}
    </div>
  );
}
