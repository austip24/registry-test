import { MapWithSegments } from "./components/map-with-segments";
import { getAccidents } from "./lib/accidents";
import { getRoads } from "./lib/roads";

const Page = async () => {
  const [roads, accidents] = await Promise.all([getRoads(), getAccidents()]);

  console.log("accidents", accidents);

  return (
    <div className="grow w-full h-full">
      <MapWithSegments roads={roads} accidents={[]} />
    </div>
  );
};

export default Page;
