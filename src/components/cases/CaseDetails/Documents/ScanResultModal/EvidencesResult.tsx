import AppIcon from "@/components/common/ui/AppIcon";
import { EvidenceGridDto } from "@/services/cases/cases.types";
import { useTranslation } from "@/stores/TranslationContext";
import { Table, TableProps, Tooltip } from "antd";

type PartiesResultProps = {
  data: EvidenceGridDto[];
};

const EvidencesResult: React.FC<PartiesResultProps> = ({ data, ...rest }) => {
  const { t } = useTranslation();

  const columns: TableProps<EvidenceGridDto>["columns"] = [
    {
      title: t("tableHeader.details"),
      dataIndex: "title",
      key: "title",
      width: "70%",
      render: (_, record) => (
        <div className="flex items-center gap-4 p-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 truncate">
              {record.title}
            </p>
            <p className="text-slate-500 text-xs truncate">
              {record.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {record.timeline ? (
              <Tooltip title={t("relatedTimeline")} placement="left">
                <span className="inline-flex items-center text-xs font-medium text-theme-1">
                  <AppIcon
                    icon="ChartNoAxesGantt"
                    className="w-3.5 h-3.5 mr-1"
                  />
                  {record.timeline?.label}
                </span>
              </Tooltip>
            ) : (
              <span className="inline-flex items-center text-xs font-medium text-slate-400">
                <AppIcon icon="CircleAlert" className="w-3.5 h-3.5 mr-1" />
                {t("timelineNotRelated")}
              </span>
            )}
            <span className="inline-flex items-center text-xs font-medium text-theme-2">
              <AppIcon icon="FileText" className="w-3.5 h-3.5 mr-1" />
              {record.filesCount} {t("file_s")}
            </span>
          </div>
        </div>
      ),
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

export default EvidencesResult;
