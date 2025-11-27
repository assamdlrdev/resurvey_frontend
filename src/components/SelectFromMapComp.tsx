import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";
import {
    MapContainer,
    TileLayer,
    GeoJSON,
    Marker,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import proj4 from "proj4";
import L from "leaflet";
import pointOnFeature from "@turf/point-on-feature";
import area from "@turf/area";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import ApiService from "@/services/ApiService";
import toast from "react-hot-toast";

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

function FitBoundsOnce({ geojson }: { geojson: any }) {
    const map = useMap();
    useEffect(() => {
        if (geojson) {
            const layer = L.geoJSON(geojson);
            map.fitBounds(layer.getBounds(), { padding: [20, 20] });
        }
        // 👇 run only once when mounted
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
}


function InvalidateSizeOnOpen({ open }: { open: boolean }) {
    const map = useMap();
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                map.invalidateSize();
            }, 200);
        }
    }, [open, map]);
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
                const polygonArea = area(reprojectedFeature);
                reprojectedFeature.properties = {
                    ...reprojectedFeature.properties,
                    area_sqm: polygonArea.toFixed(2),
                };
            } catch { }
            return reprojectedFeature;
        }),
    };
}

export default function SelectFromMap({ mapdata, partDag, villCode, onSelect }: any) {
    const [open, setOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<any>(null);
    const [isLoading,setIsLoading] = useState(false);
    const [existingPartDag,setExistingPartDag] = useState<any>('');

    proj4.defs(
        "EPSG:32646",
        "+proj=utm +zone=46 +datum=WGS84 +units=m +no_defs"
    );
    const convertedGeojson = reprojectGeojson(mapdata);

    const handleSelect = (feature: any) => {
        onSelect(feature);
        setSelectedFeature(null);
        setOpen(false);
    };

    const fecthSurveyNoData = async (surveyNo) => {
        const data = {
            partDag: partDag,
            loc_code: villCode,
            bhunaksa_survey_no: surveyNo
        };

        setIsLoading(true);
        const response = await ApiService.get('get-survey-no-data', JSON.stringify(data));
        setIsLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        const surveyNoDetails = response.data;
        if(surveyNoDetails?.part_dag){
            setExistingPartDag(surveyNoDetails.part_dag);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger */}
            <DialogTrigger asChild>
                <span
                    className="inline-flex items-center gap-1 ml-2 px-2 py-1 text-sm font-medium text-blue-600 bg-blue-50 
           rounded-full cursor-pointer hover:bg-blue-100 hover:text-blue-800 transition-all duration-200"
                >
                    <MapPin className="w-4 h-4" />
                    Select from Map
                </span>
            </DialogTrigger>

            {/* Fullscreen modal */}
            <DialogContent className="p-0 m-0 max-w-full h-screen w-screen">
                <VisuallyHidden>
                    <DialogTitle>Select from Map</DialogTitle>
                </VisuallyHidden>

                {/* Floating close button */}
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 z-[1000] bg-white shadow-lg rounded-full"
                >
                    <X className="h-5 w-5 text-black" />
                </Button>

                {/* Floating feature info panel */}
                {selectedFeature && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 z-[1000] w-[300px]">
                        <h3 className="font-semibold text-gray-800 mb-2">
                            Parcel Information
                        </h3>
                        <p>
                            <b>Survey No:</b> {selectedFeature.properties?.kide}
                        </p>
                        <p>
                            <b>Area:</b> {selectedFeature.properties?.area_sqm} m²
                        </p>
                        <div className="flex justify-end gap-2 mt-3">
                            <Button
                                size="sm"
                                onClick={() => handleSelect(selectedFeature)}
                            >
                                Select
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedFeature(null)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}

                {/* Map */}
                {open && (
                    <div className="w-full h-full">
                        <MapContainer
                            center={[26.1445, 91.7362]}
                            zoom={13}
                            scrollWheelZoom={true}
                            className="w-full h-full"
                        >
                            <InvalidateSizeOnOpen open={open} />

                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />

                            <FitBoundsOnce geojson={convertedGeojson} />

                            {convertedGeojson && (
                                <GeoJSON
                                    key="geojson-layer"
                                    data={convertedGeojson}
                                    style={() => ({
                                        color: "#374151",
                                        weight: 1.5,
                                        fillColor: "#86efac",
                                        fillOpacity: 0.6,
                                    })}
                                    onEachFeature={(feature, layer) => {
                                        layer.on({
                                            click: () => {
                                                if (feature.properties?.kide) {
                                                    fecthSurveyNoData(feature.properties.kide);
                                                    setSelectedFeature(feature);
                                                }
                                            },
                                            mouseover: (e) => {
                                                e.target.setStyle({
                                                    fillColor: "#fbbf24",
                                                    fillOpacity: 0.8,
                                                });
                                            },
                                            mouseout: (e) => {
                                                e.target.setStyle({
                                                    fillColor: "#86efac",
                                                    fillOpacity: 0.6,
                                                });
                                            },
                                        });
                                    }}
                                />
                            )}

                            {/* Labels */}
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
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
