"use client";

import { useTranslation } from "@/stores/TranslationContext";
import { Radio, Space } from "antd";
import type { RadioChangeEvent } from "antd";

interface CaseTableSortProps {
  currentSort: string[];
  onSortChange: (newSort: string[]) => void;
}

const CaseTableSort: React.FC<CaseTableSortProps> = ({
  currentSort,
  onSortChange,
}) => {
  const { t } = useTranslation();

  const [sortField, sortDirection] = (currentSort[0] || "date desc").split(" ");

  const handleFieldChange = (e: RadioChangeEvent) => {
    onSortChange([`${e.target.value} ${sortDirection}`]);
  };

  const handleDirectionChange = (e: RadioChangeEvent) => {
    onSortChange([`${sortField} ${e.target.value}`]);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">{t("sortBy")}</h4>
        <Radio.Group onChange={handleFieldChange} value={sortField}>
          <Space direction="vertical">
            <Radio value="date">{t("date")}</Radio>
            <Radio value="client">{t("client")}</Radio>
            <Radio value="title">{t("title")}</Radio>
            <Radio value="lastModifiedOn">{t("lastUpdated")}</Radio>
          </Space>
        </Radio.Group>
      </div>
      <div>
        <h4 className="font-semibold mb-2">{t("direction")}</h4>
        <Radio.Group onChange={handleDirectionChange} value={sortDirection}>
          <Space direction="vertical">
            <Radio value="asc">{t("ascending")}</Radio>
            <Radio value="desc">{t("descending")}</Radio>
          </Space>
        </Radio.Group>
      </div>
    </div>
  );
};

export default CaseTableSort;
