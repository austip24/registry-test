import { MapWithSegments } from "@/registry/map-with-segments/components/map-with-segments";
import { getAccidents } from "@/registry/map-with-segments/lib/accidents";
import { getRoads } from "@/registry/map-with-segments/lib/roads";

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
