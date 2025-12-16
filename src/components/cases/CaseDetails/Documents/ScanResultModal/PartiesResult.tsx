import { PartyGridDto } from "@/services/cases/cases.types";
import { useTranslation } from "@/stores/TranslationContext";
import { Table, TableProps } from "antd";

type PartiesResultProps = {
  data: PartyGridDto[];
};

const PartiesResult: React.FC<PartiesResultProps> = ({ data, ...rest }) => {
  const { t } = useTranslation();

  const columns: TableProps<PartyGridDto>["columns"] = [
    {
      title: t("tableHeader.fullName"),
      dataIndex: "fullName",
      key: "fullName",
      width: "30%",
    },
    {
      title: t("tableHeader.nationalId"),
      dataIndex: "nationalId",
      key: "nationalId",
      width: "15%",
    },
    {
      title: t("tableHeader.email"),
      dataIndex: "email",
      key: "email",
      width: "20%",
    },
    {
      title: t("tableHeader.partyType"),
      dataIndex: "partyType",
      key: "partyType",
      width: "15%",
    },
    {
      title: t("tableHeader.city"),
      dataIndex: "city",
      key: "city",
      width: "10%",
    },
    {
      title: t("tableHeader.country"),
      dataIndex: "country",
      key: "country",
      width: "15%",
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

export default PartiesResult;
