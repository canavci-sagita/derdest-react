"use client";

import React from "react";
import AppIcon from "@/components/common/ui/AppIcon";
import { formatDate } from "@/lib/utils/date.utils";
import { useTranslation } from "@/stores/TranslationContext";
import { PetitionTemplateDto } from "@/services/users/users.types";
import {
  formatFileSize,
  getFileTypeFromFileName,
} from "@/lib/utils/file.utils";
import { Popconfirm, Tooltip } from "antd";

interface TemplateCardProps {
  template: PetitionTemplateDto;
  onPreview: (id: number) => void;
  onDelete: (id: number) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onDelete,
}) => {
  const { t, currentLang } = useTranslation();
  const fileType = getFileTypeFromFileName(template.fileName);
  const isPdf = fileType.includes("pdf");

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden">
      <div className="flex-1 bg-slate-100 relative p-4 flex items-center justify-center overflow-hidden group-hover:bg-slate-50 transition-colors">
        <div className="w-28 h-32 bg-white shadow-md border border-slate-200 flex flex-col p-3 gap-2">
          <div className="h-2 w-3/4 bg-slate-200 rounded-sm"></div>
          <div className="h-2 w-full bg-slate-100 rounded-sm"></div>
          <div className="h-2 w-5/6 bg-slate-100 rounded-sm"></div>
          <div className="h-2 w-full bg-slate-100 rounded-sm"></div>
          <div
            className={`mt-2 h-16 w-full rounded-sm border border-dashed ${
              fileType === "pdf"
                ? "bg-red-50 border-red-100"
                : "bg-indigo-50 border-indigo-100"
            }`}
          ></div>
        </div>
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
          <button
            onClick={() => onPreview(template.id)}
            className="p-2 bg-white rounded-full shadow-lg text-slate-600 hover:text-indigo-600 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:scale-110"
            title="Preview"
          >
            <AppIcon icon="Eye" className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-2 bg-white border-t border-slate-100 relative z-10">
        <div className="flex items-center gap-2 w-full mb-2">
          <AppIcon
            icon={isPdf ? "File" : "FileText"}
            className={`w-4 h-4 flex-shrink-0 ${
              isPdf ? "text-red-500" : "text-blue-500"
            }`}
          />
          <div className="min-w-0 flex-1">
            <Tooltip title={template.fileName}>
              <p className="text-xs font-bold text-slate-600 truncate">
                {template.fileName}
              </p>
            </Tooltip>
          </div>
        </div>
        <div className="w-full flex justify-between items-center">
          <span className="text-xs text-slate-400">
            {formatDate(currentLang, template.createdOn, false, false)}
          </span>

          <Popconfirm
            title={t("deleteConfirmation.title")}
            description={t("deleteConfirmation.text")}
            onConfirm={() => onDelete(template.id)}
            okText={t("yes")}
            cancelText={t("no")}
            okButtonProps={{ danger: true }}
          >
            <button className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50">
              <AppIcon icon="Trash2" className="w-4 h-4" />
            </button>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
