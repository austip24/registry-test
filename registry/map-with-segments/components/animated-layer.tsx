import { useMapStore } from "@/registry/ol-map/map";
import { useEffect, useRef } from "react";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import { Stroke } from "ol/style";

type AnimatedLayerProps = {
  layer: VectorLayer<any>;
  speed?: number;
};

const useInfiniteAnimation = (updateFn: () => void) => {
  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      updateFn();
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [updateFn]);
};

export const AnimatedLayer: React.FC<AnimatedLayerProps> = ({
  layer,
  speed = 0.1,
}) => {
  const { map } = useMapStore((s) => s);
  const dashOffsetRef = useRef<number>(0);
  const styleRef = useRef(
    new Style({
      stroke: new Stroke({
        color: "blue",
        width: 2,
        lineDash: [4, 6],
        lineDashOffset: dashOffsetRef.current,
      }),
    })
  );

  useEffect(() => {
    if (layer) {
      layer.setStyle(styleRef.current);
    }
  }, [layer]);

  // Use an infinite animation hook to continuously update the dash offset.
  useEffect(() => {
    if (!map || !layer) return;

    const updateAnimation = () => {
      dashOffsetRef.current -= speed;
      const stroke = styleRef.current.getStroke();
      if (stroke) {
        stroke.setLineDashOffset(dashOffsetRef.current);
      }
      // Notify OpenLayers that the style has changed.
      layer.changed();
    };

    map.on("postrender", updateAnimation);

    return () => {
      map.un("postrender", updateAnimation);
    };
  }, [map, layer, speed]);

  return null;
};
