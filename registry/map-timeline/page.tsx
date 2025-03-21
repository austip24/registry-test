import { roads } from "@/registry/map-timeline/data/roads";
import { gps } from "@/registry/map-timeline/data/gps";
import { MapTimeline } from "@/registry/map-timeline/components/map-timeline";

const Page = async () => {
  return (
    <div className="grow w-full h-full">
      <MapTimeline roads={roads} gps={gps} />
    </div>
  );
};

export default Page;
