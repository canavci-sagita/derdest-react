"use client";

import React, { useMemo, memo } from "react";
import { Collapse, Popconfirm, Space, Tooltip } from "antd";
import type { CollapseProps } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import { AddEditTimelineDto } from "@/services/cases/cases.types";
import AppIcon from "@/components/common/ui/AppIcon";
import { CaretRightOutlined } from "@ant-design/icons";

interface TimelineItemProps {
  item: AddEditTimelineDto;
  isDeleting: boolean;
  onEdit: (timelineId: number) => void;
  onDelete: (timelineId: number) => void;
}

const TimelineItem: React.FC<TimelineItemProps> = memo(
  ({ item, isDeleting, onEdit, onDelete }) => {
    const { t } = useTranslation();

    const evidenceItems: CollapseProps["items"] = useMemo(() => {
      if (!item.evidences || item.evidences.length === 0) return [];

      return [
        {
          key: item.id || "evidence",
          label: (
            <span className="inline-flex items-center text-theme-1 text-sm font-semibold text-center">
              {t("relatedEvidences")}
              <span className="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-white bg-theme-2 rounded-full">
                {item.evidences.length}
              </span>
            </span>
          ),
          children: (
            <ul className="space-y-2 text-xs text-primary">
              {item.evidences.map((evidence) => (
                <li key={evidence.id}>
                  <span className="bg-theme-2 rounded-md py-0.5 px-1 text-white">
                    {evidence.title}
                  </span>
                </li>
              ))}
            </ul>
          ),
        },
      ];
    }, [item.evidences, item.id, t]);

    const handleEdit = () => {
      if (item.id) {
        onEdit(item.id);
      }
    };

    const handleDelete = () => {
      if (item.id) {
        onDelete(item.id);
      }
    };

    return (
      <div className="p-2 border rounded-md bg-slate-50">
        <div className="flex justify-between items-center">
          <p className="text-slate-700 flex-grow pr-4">{item.description}</p>
          <Space>
            <Tooltip title={t("edit")}>
              <button
                type="button"
                className="p-2 rounded-md text-slate-500 hover:bg-slate-200 transition-colors"
                onClick={handleEdit}
              >
                <AppIcon icon="SquarePen" className="w-4 h-4" />
              </button>
            </Tooltip>

            <Tooltip title={t("delete")}>
              <Popconfirm
                title={t("deleteConfirmation.title")}
                description={t("deleteConfirmation.text")}
                onConfirm={handleDelete}
                okText={t("yes")}
                cancelText={t("no")}
                okButtonProps={{ danger: true, loading: isDeleting }}
              >
                <button
                  type="button"
                  className="cursor-pointer text-red-600 flex items-center p-2 rounded-md hover:bg-red-200/60 transition-colors"
                >
                  <AppIcon className="h-4 w-4" icon="Trash2" />
                </button>
              </Popconfirm>
            </Tooltip>
          </Space>
        </div>

        {evidenceItems.length > 0 && (
          <Collapse
            items={evidenceItems}
            bordered={false}
            ghost
            size="small"
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
          />
        )}
      </div>
    );
  }
);

TimelineItem.displayName = "TimelineItem";

export default TimelineItem;
