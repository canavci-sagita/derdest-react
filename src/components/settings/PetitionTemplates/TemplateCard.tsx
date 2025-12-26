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

interface TemplateCardProps {
  template: PetitionTemplateDto;
  onPreview: (id: number) => void;
  onDownload: (id: number) => void;
  onDelete: (id: number) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onDownload,
  onDelete,
}) => {
  const { currentLang } = useTranslation();
  const fileType = getFileTypeFromFileName(template.fileName);

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
          <button
            onClick={() => onDownload(template.id)}
            className="p-2 bg-white rounded-full shadow-lg text-slate-600 hover:text-emerald-600 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 hover:scale-110"
            title="Download"
          >
            <AppIcon icon="Download" className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-2 bg-white border-t border-slate-100 relative z-10">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
            <AppIcon
              icon={fileType === "pdf" ? "File" : "FileText"}
              className={`w-4 h-4 ${
                fileType === "pdf" ? "text-red-500" : "text-blue-500"
              }`}
            />
            <span
              className="w-full text-xs font-bold text-slate-600 truncate pr-3"
              title={template.fileName}
            >
              {template.fileName}
            </span>
          </div>
          <button
            onClick={() => onDelete(template.id)}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <AppIcon icon="Trash2" className="w-4 h-4" />
          </button>
        </div>
        <div className="w-full flex justify-between">
          <span className="text-xs text-slate-500">
            {formatDate(currentLang, template.createdOn, false, false)}
          </span>
          <span className="text-slate-400 text-xs" title={template.fileName}>
            {formatFileSize(template.fileSize)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
