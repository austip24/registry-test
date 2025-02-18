import { Feature } from "ol";
import { Geometry } from "ol/geom";

/** Type for property attribute in feature.  */
export type RoadProperties = {
  state: string;
  type: string;
  id: string;
  name: string;
  length: number;
};

export type RoadFeature = Feature<Geometry>;

/**
 * Fetches roads data from a remote source
 * @returns {RoadFeature[]} Array of road features
 */
export const getRoads = async () => {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/highway/roads.json"
    );

    if (!res.ok) {
      throw new Error("Failed to fetch roads");
    }

    const geoJsonData = await res.json();
    return geoJsonData as RoadFeature[];
  } catch (error) {
    console.log(error);
    return [];
  }
};
