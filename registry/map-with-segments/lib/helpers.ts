import { Collection, Feature } from "ol";
import { Geometry } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorImageLayer from "ol/layer/VectorImage";
import VectorSource from "ol/source/Vector";
import { StyleFunction } from "ol/style/Style";

/**
 * Creates a layer for the map using data, layer type, and style.
 * @param data - The data to be used for the layer.
 * @param type - The type of the layer, either "vector" or "image". "image" is better for large datasets (>10,000 features).
 * @param style - A function that returns the styling of each feature.
 */
export const createDataLayer = <
  T extends Feature<Geometry>[] | Collection<Feature<Geometry>> | undefined
>(
  data: T,
  type: "vector" | "image",
  style: StyleFunction
) => {
  const source = new VectorSource({
    features: data,
  });

  const layer =
    type === "image"
      ? new VectorImageLayer({
          source,
          style,
        })
      : new VectorLayer({
          source,
          style,
        });

  return layer;
};
