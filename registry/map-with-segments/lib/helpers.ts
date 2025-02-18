import { Collection, Feature, View } from "ol";
import { createEmpty, extend, getCenter } from "ol/extent";
import { FeatureLike } from "ol/Feature";
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

/**
 * Creates a view for the map that is centered on all provided features
 * @param features
 * @returns {View} The view for the map
 */
export const createCenteredView = (features: FeatureLike[]) => {
  if (features.length === 0) {
    return new View({
      center: [0, 0],
      zoom: 2,
    });
  }

  const extent = createEmpty();

  features.forEach((feature) => {
    const geom = feature.getGeometry();
    if (geom) {
      extend(extent, geom.getExtent());
    }
  });

  const center = getCenter(extent);

  const view = new View({
    center,
    extent,
  });

  view.fit(extent, {
    duration: 1000,
    padding: [50, 50, 50, 50],
  });

  return view;
};
