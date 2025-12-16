import { formatDate } from "@/lib/utils/date.utils";
import { ActivityGridDto } from "@/services/cases/cases.types";
import { useTranslation } from "@/stores/TranslationContext";
import { Table, TableProps } from "antd";

type ActivitiesResultProps = {
  data: ActivityGridDto[];
};

const ActivitiesResult: React.FC<ActivitiesResultProps> = ({
  data,
  ...rest
}) => {
  const { t, currentLang } = useTranslation();

  const columns: TableProps<ActivityGridDto>["columns"] = [
    {
      title: t("tableHeader.title"),
      dataIndex: "title",
      key: "title",
      width: "30%",
    },
    {
      title: t("tableHeader.description"),
      dataIndex: "description",
      key: "description",
      width: "50%",
    },
    {
      title: t("tableHeader.startDate"),
      dataIndex: "startDate",
      key: "startDate",
      width: "10%",
      render: (date: Date) => formatDate(currentLang, date, false, false),
    },
    {
      title: t("tableHeader.endDate"),
      dataIndex: "endDate",
      key: "endDate",
      width: "10%",
      render: (date: Date) => formatDate(currentLang, date, false, false),
    },
  ];

  return (
    <div className="overflow-auto xl:overflow-visible">
      <Table
        columns={columns?.map((col) => ({
          ...col,
        }))}
        sortDirections={["ascend", "descend", "ascend"]}
        showSorterTooltip={false}
        pagination={false}
        dataSource={data}
        size="middle"
        rowKey="id"
        bordered
        {...rest}
      />
    </div>
  );
};

export default ActivitiesResult;
