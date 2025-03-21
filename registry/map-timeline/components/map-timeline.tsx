"use client";

import { Circle, Fill, Icon, RegularShape, Stroke, Style } from "ol/style";
import { Map, MapLayer, MapTooltip } from "@/registry/ol-map/map";
import { GeoJSON } from "ol/format";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import { createDataLayer } from "@/registry/map-with-segments/lib/helpers";
import { View } from "ol";
import { useCallback, useEffect, useMemo } from "react";
import { roads } from "@/registry/map-timeline/data/roads";
import { gps } from "@/registry/map-timeline/data/gps";
import { Point } from "ol/geom";

type MapTimelineProps = {
  roads: typeof roads;
  gps: typeof gps;
};

/**
 * Leverage OpenLayers API to format data. This makes sure that openlayers knows how to process the data
 * @param roads Unformatted json data
 * @returns {RoadFeature[]} Array of OL features
 */
const processData = <T,>(data: T) => {
  const format = new GeoJSON();
  const features = format.readFeatures(data, {
    featureProjection: "EPSG:3857", // Web Mercator coordinates
  });
  return features;
};

function createTeardropStyle(options: Record<string, any> = {}) {
  // Default options
  const scale = options.scale || 1;
  const color = options.color || "#ffffff";
  const strokeColor = options.strokeColor || "#000000";
  const strokeWidth = options.strokeWidth || 1;
  const rotation = options.rotation || 0;
  const anchor = options.anchor || [0.5, 0.5];

  // Size of the SVG viewport
  // const size = 40 * scale;

  // Create an SVG for the teardrop shape

  // Convert SVG to data URL
  // const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  // const dataUrl = encodeURIComponent("/public/truck-indicator.svg");
  // const dataUrl = "data:image/svg+xml;chartset=utf-8," + encodeURIComponent('/public/truck-indicator.svg')

  // Create an icon style
  return new Style({
    image: new Icon({
      src: '/truck-indicator.svg',
      scale: 1, // We've already scaled the SVG
      rotation: rotation,
      anchor: [0.75, 0.5],
      // anchor: anchor,
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
    }),
  });
}

export const MapTimeline: React.FC<MapTimelineProps> = ({ gps, roads }) => {
  const tileLayer = new TileLayer({
    source: new XYZ({
      url: "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2l6enk4NSIsImEiOiJjbHJ5NGx6dHQxNjZsMmpsejN2OXlzZjR6In0.kp6vK9Gb_gtFXSGGZ63CRw",
    }),
  });
  const olRoads = processData(roads);
  const olGps = processData(gps);

  const formattedOlGps = olGps.map((feature, idx, arr) => {
    const currCoord = feature.getProperties().geometry.flatCoordinates;
    const nextCoord = arr[idx + 1]?.getProperties().geometry.flatCoordinates;

    if (!nextCoord || arr.length === 1) {
      feature.set("rotation", null);
      return feature;
    }

    const dx = nextCoord?.[0] - currCoord[0];
    const dy = nextCoord?.[1] - currCoord[1];
    const rotation = Math.atan2(dy, dx);
    feature.set("rotation", rotation);

    return feature;
  });

  const roadsLayer = createDataLayer(olRoads, "vector", () => {
    return new Style({
      stroke: new Stroke({
        color: "black",
        width: 2,
      }),
    });
  });

  const gpsLayer = createDataLayer(formattedOlGps, "vector", (feature) => {
    const rotation = feature.get("rotation");

    return createTeardropStyle({
      color: "red",
      strokeColor: "transparent",
      scale: 1.2,
      rotation: rotation ? -rotation : null,
    });
  });

  const view = useMemo(
    () =>
      new View({
        center: [0, 0],
        zoom: 2,
      }),
    []
  );

  const fitView = useCallback(() => {
    view.fit(roadsLayer.getSource()?.getExtent() ?? [0, 0, 0, 0], {
      duration: 1500,
      easing: (t) => t * (2 - t),
      padding: [10, 10, 10, 10],
    });
  }, [roadsLayer, view]);

  // ensures that the map view is always fit to the data initially
  useEffect(() => {
    fitView();
  }, [fitView]);

  return (
    <Map
      options={{
        view,
      }}
    >
      <MapTooltip
        render={(feature) => {
          const properties = feature.getProperties();

          // Note that geometry is a valid key, which contains represents the GeoJSON qualities of the feature
          // Usually, we aren't too interested in this but it is useful to know that it exists
          return Object.entries(properties).map(
            ([key, value], idx) =>
              key !== "geometry" && (
                <div key={`${key}-${idx}-${value}`}>
                  {key}: {`${value}`}
                </div>
              )
          );
        }}
      />
      <MapLayer layer={tileLayer} />
      <MapLayer layer={roadsLayer} />
      <MapLayer layer={gpsLayer} />
    </Map>
  );
};
