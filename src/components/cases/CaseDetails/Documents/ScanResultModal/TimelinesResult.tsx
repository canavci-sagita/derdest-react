import NoDataAvailable from "@/components/common/data-table/NoDataAvailable";
import AppIcon from "@/components/common/ui/AppIcon";
import { TimelineGridDto } from "@/services/cases/cases.types";
import { Timeline } from "antd";
import { TimelineItemProps } from "antd/lib";

type TimelinesResultProps = {
  data: TimelineGridDto[];
};
const TimelinesResult: React.FC<TimelinesResultProps> = ({ data }) => {
  const items = data?.map((t) => ({
    key: t.id,
    label: t.date,
    dot: <AppIcon icon="CircleDot" className="w-4 h-4 text-theme-2 stroke-2" />,
    children: t.description,
  })) as TimelineItemProps[];

  return items && items.length > 1 ? (
    <Timeline mode="left" items={items} />
  ) : (
    <NoDataAvailable />
  );
};

export default TimelinesResult;
