"use client";

import {
  RoadFeature,
  RoadProperties,
} from "@/registry/map-with-segments/lib/roads";
import { Stroke, Style } from "ol/style";
import { Map, MapLayer, MapTooltip } from "@/registry/ol-map/map";
import { GeoJSON } from "ol/format";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import { createDataLayer } from "@/registry/map-with-segments/lib/helpers";
import { Geometry } from "ol/geom";
import { View } from "ol";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { AnimatedLayer } from "./animated-layer";
import VectorLayer from "ol/layer/Vector";

type MapWithSegmentsProps = {
  accidents: unknown[];
  roads: RoadFeature[];
};

/**
 * Leverage OpenLayers API to format data. This makes sure that openlayers knows how to process the data
 * @param roads Unformatted json data
 * @returns {RoadFeature[]} Array of OL features
 */
const formatRoads = (roads: RoadFeature[]) => {
  const format = new GeoJSON();
  const features = format.readFeatures(roads, {
    featureProjection: "EPSG:3857", // Web Mercator coordinates
  });
  return features as RoadFeature[];
};

export const MapWithSegments: React.FC<MapWithSegmentsProps> = ({
  accidents,
  roads,
}) => {
  console.log(accidents);
  console.log(roads);

  const tileLayer = new TileLayer({
    source: new XYZ({
      url: "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2l6enk4NSIsImEiOiJjbHJ5NGx6dHQxNjZsMmpsejN2OXlzZjR6In0.kp6vK9Gb_gtFXSGGZ63CRw",
    }),
  });
  const dashOffset = useRef<number>(0);

  const olRoads = formatRoads(roads);

  const filteredRoads = olRoads.filter((road) => {
    const properties = road.getProperties() as RoadProperties;

    // Apply any filters to roads here. Return true if you want to keep the feature.
    // In this case, we are only keeping roads that are in Arizona (AZ)
    const { state } = properties;
    return state === "AZ";
  });

  const roadsLayer = createDataLayer(filteredRoads, "vector", (feature) => {
    const properties = feature.getProperties() as RoadProperties;

    const { type } = properties;

    const determineStrokeColor = (type: string) => {
      switch (type) {
        case "SR":
          return "#FF0000";
        case "US":
          return "#00AA00";
        case "I":
          return "#0000FF";
        default:
          return "#000000";
      }
    };

    return new Style({
      stroke: new Stroke({
        color: determineStrokeColor(type),
        lineDash: [4, 6],
        lineDashOffset: dashOffset.current,
        width: 2,
      }),
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

  useEffect(() => {
    const interval = setInterval(() => {
      dashOffset.current = (dashOffset.current + 1) % 20;
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Map
      options={{
        view,
      }}
    >
      <MapTooltip
        render={(feature) => {
          const properties = feature.getProperties() as RoadProperties & {
            geometry: Geometry;
          };

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
      <AnimatedLayer layer={roadsLayer as VectorLayer<any>} speed={1} />
    </Map>
  );
};
