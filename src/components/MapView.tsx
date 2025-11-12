import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  useMap,
  WMSTileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import proj4 from "proj4";
import pointOnFeature from "@turf/point-on-feature";
import area from "@turf/area";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, Maximize2, X, Download, Search } from "lucide-react";

/* ---------------------------- Helper Components --------------------------- */
function FitBounds({ geojson, enabled }: { geojson: any; enabled: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!enabled || !geojson) return;
    const layer = L.geoJSON(geojson);
    const b = layer.getBounds();
    if (b.isValid()) {
      // ✅ prevent leaflet_pos error by deferring until container is visible
      const ensureVisible = () => {
        if (!map.getContainer()?.offsetParent) {
          setTimeout(ensureVisible, 100);
          return;
        }
        map.whenReady(() => map.fitBounds(b, { padding: [20, 20] }));
      };
      ensureVisible();
    }
  }, [geojson, map, enabled]);

  return null;
}

/* ----------------------------- Reprojection ----------------------------- */
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
      const reprojected = {
        ...f,
        geometry: {
          ...f.geometry,
          coordinates: reprojectCoords(f.geometry.coordinates),
        },
      };
      try {
        reprojected.properties = {
          ...reprojected.properties,
          area_sqm: area(reprojected).toFixed(2),
        };
      } catch (err) {
        console.warn("Area calc failed:", err);
      }
      return reprojected;
    }),
  };
}

/* ---------------------------- Main Component ----------------------------- */
export default function MapViewCom(mapdata: any) {
  proj4.defs("EPSG:32646", "+proj=utm +zone=46 +datum=WGS84 +units=m +no_defs");
  const convertedGeojson = reprojectGeojson(mapdata.mapdata);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWMS, setShowWMS] = useState(false);
  const [showGeojson, setShowGeojson] = useState(true);
  const [baseLayer, setBaseLayer] = useState<"osm" | "sat">("sat");
  const [wmsOpacity, setWmsOpacity] = useState<number>(1);
  const [autoFit, setAutoFit] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const mapRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<any>(null);

  const initialCenter: [number, number] = [26.1445, 91.7362];

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const scale = L.control.scale({ imperial: false });
    scale.addTo(map);
    return () => {
      scale.remove();
    };
  }, []);

  /* ----------------------- Highlight (instead of zoom) ----------------------- */
  const zoomToFeature = (kide: string) => {
    if (!convertedGeojson) return;
    const found = convertedGeojson.features.find(
      (f: any) => String(f.properties?.kide) === String(kide)
    );
    if (!found) {
      alert("Feature not found");
      return;
    }

    try {
      const geoLayer = geoJsonLayerRef.current;
      if (!geoLayer) {
        alert("GeoJSON layer not ready");
        return;
      }

      let matched = false;

      // react-leaflet GeoJSON layer exposes eachLayer or _layers depending on version
      const handleLayer = (layer: any) => {
        if (layer && layer.feature === found) {
          matched = true;
          // apply highlight style (red border, stronger weight, brighter fill)
          layer.setStyle({
            color: "#b91c1c", // red border
            weight: 3.5,
            fillColor: "#fb923c",
            fillOpacity: 0.6,
          });

          // optional: open popup if available
          try {
            if (layer.getPopup) layer.openPopup();
          } catch {}

        }
      };

      if (typeof geoLayer.eachLayer === "function") {
        geoLayer.eachLayer(handleLayer);
      } else if (geoLayer._layers) {
        Object.values(geoLayer._layers).forEach(handleLayer);
      } else {
        // fallback: try treating geoLayer as a single layer
        handleLayer(geoLayer);
      }

      if (!matched) {
        alert("Rendered feature layer not found (it may not be displayed).");
      }
    } catch (err) {
      console.error("Highlight feature failed", err);
    }
  };

  /* ---------------------------- Download ---------------------------- */
  const downloadGeoJSON = (data: any) => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resurvey.geojson";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------------------------- Inner Map ---------------------------- */
  const MapView = () => (
    <MapContainer
      center={initialCenter}
      zoom={13}
      scrollWheelZoom
      className="w-full h-full"
      style={{ minHeight: "100%", minWidth: "100%" }}
      ref={(mapInstance) => {
        if (mapInstance && !mapRef.current) {
          mapRef.current = mapInstance;
          const scale = L.control.scale({ imperial: false });
          scale.addTo(mapInstance);
        }
      }}
    >
      {baseLayer === "osm" ? (
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
      ) : (
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles © Esri"
        />
      )}

      {showWMS && (
        <WMSTileLayer
          url="https://landhub.assam.gov.in/ori/resurvey/wms"
          layers="resurvey:corrected_resurvey"
          format="image/png"
          transparent
          opacity={wmsOpacity}
          attribution="© Bhunaksha"
        />
      )}

      <FitBounds geojson={convertedGeojson} enabled={!!autoFit} />

      {showGeojson && convertedGeojson && (
        <GeoJSON
          data={convertedGeojson}
          ref={geoJsonLayerRef}
          // Improved styling for visibility over green base layers:
          style={() => ({
            color: "#0f172a", // dark border (slate-900)
            weight: 2.5,
            fillColor: "rgba(251,191,36,0.35)", // amber translucent fill
            fillOpacity: 0,
            dashArray: "2",
          })}
          onEachFeature={(feature, layer) => {
            if (feature.properties) {
              const popup = `
                <b>Parcel Info</b><br/>
                <b>Survey Number:</b> ${feature.properties.kide || "Not Found"}<br/>
                <b>Area (sqm):</b> ${feature.properties.area_sqm || ""} m²<br/>
              `;
              layer.bindPopup(popup);
            }

            layer.on({
              mouseover: (e: any) =>
                e.target.setStyle({
                  fillColor: "#fb923c", // orange on hover
                  fillOpacity: 0.6,
                  color: "#b91c1c", // red border on hover
                  weight: 3.5,
                }),
              mouseout: (e: any) =>
                e.target.setStyle({
                  fillColor: "rgba(251,191,36,0.35)",
                  fillOpacity: 0,
                  color: "#0f172a",
                  weight: 2.5,
                }),
            });
          }}
        />
      )}

      {showGeojson &&
        convertedGeojson?.features.map((feature: any, i: number) => {
          try {
            const labelPoint = pointOnFeature(feature);
            const [lng, lat] = labelPoint.geometry.coordinates;
            // Use a styled divIcon so the KIDE label is readable over green/satellite basemaps
            const kideLabel = feature.properties?.kide || "?";
            return (
              <Marker
                key={i}
                position={[lat, lng]}
                icon={L.divIcon({
                  className: "", // keep it blank so inline styles take effect
                  html: `<div style="
                    display:inline-block;
                    background:#ffffff;
                    color:#b91c1c;
                    border:2px solid #b91c1c;
                    padding:1px 2px;
                    border-radius:6px;
                    font-weight:700;
                    font-size:8px;
                    box-shadow:0 1px 3px rgba(0,0,0,0.25);
                    white-space:nowrap;
                  ">${kideLabel}</div>`,
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

  /* ------------------------------ UI ------------------------------ */
  return (
    <div className="space-y-6">
      {/* Normal View */}
      {!isFullscreen && (
        <Card className="relative">
          <CardHeader className="py-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="h-4 w-4" /> Map View
              </CardTitle>

              <div className="flex items-center gap-2 text-sm">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={showGeojson}
                    onChange={(e) => setShowGeojson(e.target.checked)}
                  />
                  Village Map
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={showWMS}
                    onChange={(e) => setShowWMS(e.target.checked)}
                  />
                  Drone Image
                </label>
                <label className="flex items-center gap-1">
                  <select
                    value={baseLayer}
                    onChange={(e) =>
                      setBaseLayer(e.target.value as "osm" | "sat")
                    }
                    className="rounded px-1"
                  >
                    <option value="osm">OSM</option>
                    <option value="sat">Satellite</option>
                  </select>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={autoFit}
                    onChange={(e) => setAutoFit(e.target.checked)}
                  />
                  Auto-fit
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <input
                  placeholder="Search survey no"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded px-2 py-1 text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (searchTerm.trim()) zoomToFeature(searchTerm.trim());
                  }}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => downloadGeoJSON(convertedGeojson)}
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFullscreen(true)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {convertedGeojson ? (
              <div className="w-full h-[800px] rounded-lg overflow-hidden relative">
                <div className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded shadow">
                  <label className="text-xs">WMS opacity</label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={wmsOpacity}
                    onChange={(e) => setWmsOpacity(Number(e.target.value))}
                  />
                </div>
                <MapView />
              </div>
            ) : (
              <>Map not uploaded yet</>
            )}
          </CardContent>
        </Card>
      )}

      {/* Fullscreen */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-[1000] bg-white shadow-lg rounded-full"
          >
            <X className="h-5 w-5 text-black" />
          </Button>

          <div className="absolute top-4 left-4 z-[1000] space-y-2">
            <div className="bg-white p-2 rounded shadow flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBaseLayer((b) => (b === "osm" ? "sat" : "osm"))}
              >
                Toggle base
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGeojson((s) => !s)}
              >
                Toggle GeoJSON
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWMS((s) => !s)}
              >
                Toggle WMS
              </Button>
            </div>
          </div>

          <div className="absolute inset-0">
            <MapView />
          </div>
        </div>
      )}
    </div>
  );
}
