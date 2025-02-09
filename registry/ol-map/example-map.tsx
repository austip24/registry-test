"use client";

import { Feature, View } from "ol";
import { LineString, Point } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { OSM } from "ol/source";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";
import { Map, MapLayer, MapTooltip } from "./components/map";
import CircleStyle from "ol/style/Circle";
import { useEffect, useRef } from "react";
import { StyleLike } from "ol/style/Style";

// Example usage with custom data
export const ExampleMap = () => {
  const baseLayer = new TileLayer({
    source: new OSM(),
  });

  // Sample point data
  const features = [
    new Feature({ geometry: new Point([0, 0]), name: "Point A" }),
    new Feature({ geometry: new Point([1000000, 1000000]), name: "Point B" }),
  ];

  const lineStringFeatures = [
    new Feature({
      geometry: new LineString([
        [0, 0],
        [1000000, 1000000],
      ]),
      name: "Line A",
    }),
  ];

  const pointStyleRef = useRef<StyleLike | undefined>(undefined);
  const lineStringStyleRef = useRef<StyleLike | undefined>(undefined);

  useEffect(() => {
    const pointStyle = new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({ color: "red" }),
        stroke: new Stroke({ color: "black", width: 1 }),
      }),
    });

    const lineStringStyle = new Style({
      stroke: new Stroke({
        color: `hsl(${window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("--chart-1")})`,
        width: 2,
      }),
    });

    pointStyleRef.current = pointStyle;
    lineStringStyleRef.current = lineStringStyle;
  }, []);

  features.forEach((feature) => feature.setStyle(pointStyleRef.current));
  lineStringFeatures.forEach((feature) =>
    feature.setStyle(lineStringStyleRef.current)
  );

  // Vector layer for custom points
  const vectorLayer = new VectorLayer({
    source: new VectorSource({ features }),
  });

  const lineStringLayer = new VectorLayer({
    source: new VectorSource({ features: lineStringFeatures }),
  });

  return (
    <Map options={{ view: new View({ center: [0, 0], zoom: 2 }) }}>
      <MapLayer layer={baseLayer} />
      <MapLayer layer={vectorLayer} />
      <MapLayer layer={lineStringLayer} />
      <MapTooltip render={(feature) => <div>{feature.get("name")}</div>} />
    </Map>
  );
};
