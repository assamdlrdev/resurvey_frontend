import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map } from 'ol';
import { View } from 'ol';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat } from 'ol/proj';
import { Style, Stroke, Fill } from 'ol/style';

const DisplayFeatureComp = ({ geoJsonData }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!geoJsonData) return;

    // Initialize the map (without zoom controls, background tile layer, and mouse wheel zoom)
    const map = new Map({
      target: mapRef.current,
      layers: [], // No base map
      controls: [], // Disable all controls (including zoom)
      interactions: [], // Disable interactions (like drag, zoom, etc.)
      view: new View({
        center: fromLonLat([94.7798457766328, 27.19891276841121]), // Set initial center
        zoom: 2, // Set default zoom level
        constrainResolution: true,
      }),
    });

    // Create a vector source and add the GeoJSON data
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geoJsonData, {
        featureProjection: 'EPSG:3857', // Use projection compatible with OpenLayers
      }),
    });

    // Create a vector layer to display the GeoJSON features with a black accent and border
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: 'black', // Black accent border color
          width: 2, // Thickness of the border
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 0, 0.1)', // Semi-transparent black fill
        }),
      }),
    });

    // Add the vector layer to the map
    map.addLayer(vectorLayer);

    // Fit the map view to the extent of the GeoJSON feature
    const extent = vectorSource.getExtent();
    map.getView().fit(extent, { size: map.getSize(), padding: [50, 50, 50, 50] });

    // Disable mouse wheel zoom
    map.getInteractions().forEach((interaction) => {
      if (interaction instanceof ol.interaction.MouseWheelZoom) {
        interaction.setActive(false); // Disable mouse wheel zoom
      }
    });

    // Cleanup on component unmount
    return () => {
      map.setTarget(undefined);
    };
  }, [geoJsonData]);

  return (
    <div style={{ position: 'relative', padding: '10px' }}>
      <div
        ref={mapRef}
        style={{
          height: '300px', // Full height of the viewport
          width: '100%',
          border: '1px solid black', // Adding border around the map container
        }}
      ></div>

      {/* Title for the Parcel Shape */}
      <div
        className='text-center'
      >
        Selected Map Parcel Area
      </div>
    </div>
  );
};

export default DisplayFeatureComp;
