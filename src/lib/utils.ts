import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import area from "@turf/area";
import proj4 from "proj4";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function calculateAreaByKide(data: any, kideValue: string) {
  if (!data?.features) return null;

  // Find the feature with matching kide
  const feature = data.features.find(
    (f: any) => f.properties?.kide === kideValue
  );

  if (!feature || !feature.geometry) return null;

  // Reproject that feature
  const reprojectedFeature = {
    ...feature,
    geometry: {
      ...feature.geometry,
      coordinates: reprojectCoords(feature.geometry.coordinates),
    },
  };

  try {
    // Calculate area in sqm
    const polygonArea = area(reprojectedFeature);

    // Return with area info
    return {
      ...reprojectedFeature,
      properties: {
        ...reprojectedFeature.properties,
        area_sqm: polygonArea.toFixed(2),
      },
    };
  } catch (err) {
    console.error("Area calc failed:", err);
    return null;
  }
}

function reprojectCoords(coords: any): any {
  if (typeof coords[0] === "number") {
    const [x, y] = coords;
    return proj4("EPSG:32646", "EPSG:4326", [x, y]);
  }
  return coords.map(reprojectCoords);
}
