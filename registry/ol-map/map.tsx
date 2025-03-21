"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapBrowserEvent, Map as OLMap } from "ol";
import "ol/ol.css";
import { create } from "zustand";
import { MapOptions } from "ol/Map";
import BaseLayer from "ol/layer/Base";
import { FeatureLike } from "ol/Feature";
import { cn } from "@/lib/utils";

// Zustand store to manage the map state
export type MapState = {
  map: OLMap | null;
};

export type MapActions = {
  setMap: (map: OLMap) => void;
};

export type MapStore = MapState & MapActions;

export const useMapStore = create<MapStore>((set) => ({
  map: null,
  setMap: (map) => set({ map }),
}));

// Map component that allows custom properties
export const Map = ({
  children,
  options,
  ...props
}: {
  children: React.ReactNode;
  options: MapOptions;
} & React.HTMLAttributes<HTMLElement>) => {
  const mapContainerRef = useRef(null);
  const setMap = useMapStore((state) => state.setMap);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new OLMap({
      target: mapContainerRef.current,
      ...options, // Spread custom map properties
    });

    setMap(map);

    return () => {
      map.setTarget();
    };
  }, [setMap, options]);

  return (
    <div
      ref={mapContainerRef}
      className={cn("absolute inset-0", props.className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Map Layer component that adds a layer to the map
export const MapLayer = ({ layer }: { layer: BaseLayer }) => {
  const map = useMapStore((state) => state.map);

  useEffect(() => {
    if (!map || !layer) return;

    map.addLayer(layer);
    return () => {
      map.removeLayer(layer);
    };
  }, [map, layer]);

  return <></>;
};

// Map Tooltip component
export const MapTooltip = ({
  render,
}: {
  render: (feature: FeatureLike) => React.ReactNode;
}) => {
  const map = useMapStore((state) => state.map);
  const [hoveredFeature, setHoveredFeature] = useState<FeatureLike | undefined>(
    undefined
  );

  useEffect(() => {
    if (!map) return;

    const handlePointerMove = (event: MapBrowserEvent<MouseEvent>) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat);
      setHoveredFeature(feature);
    };

    map.on("pointermove", handlePointerMove);
    return () => map.un("pointermove", handlePointerMove);
  }, [map]);

  if (!hoveredFeature) return null;

  return (
    <div className="absolute z-50 bg-white p-2 shadow-md text-sm border rounded top-2 right-2">
      {render(hoveredFeature)}
    </div>
  );
};
