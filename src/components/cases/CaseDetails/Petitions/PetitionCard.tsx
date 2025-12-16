import { useMemo } from "react";
import { App, Tooltip } from "antd";
import { useMutation } from "@tanstack/react-query";
import {
  downloadPetitionAttachmentFileAction,
  downloadPetitionFileAction,
} from "@/actions/cases.actions";
import AppIcon from "@/components/common/ui/AppIcon";
import DropdownMenu from "@/components/common/ui/DropdownMenu";
import { formatDate } from "@/lib/utils/date.utils";
import { PetitionGridDto } from "@/services/cases/cases.types";
import { ApprovalStatus, PetitionFileType } from "@/services/common/enums";
import { useTranslation } from "@/stores/TranslationContext";
import { DropdownMenuItem } from "@/types/dropdown-menu.types";

interface PetitionCardProps {
  item: PetitionGridDto;
  caseId: number;
  onEdit: (id: number) => void;
  onDelete?: (id: number) => void;
}

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

const PetitionCard: React.FC<PetitionCardProps> = ({
  item,
  caseId,
  onEdit,
}) => {
  const { t, currentLang } = useTranslation();
  const { message } = App.useApp();

  const downloadFileMutation = useMutation({
    mutationFn: async (fileType: PetitionFileType) => {
      return await downloadPetitionFileAction({
        caseId,
        petitionId: item.id,
        fileType,
      });
    },
    onSuccess: (response, fileType) => {
      if (response instanceof Blob) {
        const ext =
          fileType === PetitionFileType.DOCX
            ? "docx"
            : fileType === PetitionFileType.PDF
            ? "pdf"
            : "udf";
        downloadBlob(response, `${item.fileName}.${ext}`);
      } else {
        message.error(response.messages[0]);
      }
    },
    onError: () => message.error("An unexpected error occurred."),
  });

  const downloadAttachmentsMutation = useMutation({
    mutationFn: async () => {
      return await downloadPetitionAttachmentFileAction(caseId);
    },
    onSuccess: (response) => {
      if (response instanceof Blob) {
        downloadBlob(response, `${item.fileName}_${t("tableHeader.files")}`);
      } else {
        message.error(response.messages[0]);
      }
    },
    onError: () => message.error("An unexpected error occurred."),
  });

  const getStatusBadge = (status: { value: number; label: string }) => {
    switch (status?.value) {
      case ApprovalStatus.Approved:
        return { container: "text-emerald-800", dot: "bg-emerald-500" };
      case ApprovalStatus.WaitingForApproval:
        return { container: "text-amber-800", dot: "bg-amber-500" };
      case ApprovalStatus.Rejected:
        return { container: "text-red-800", dot: "bg-red-500" };
      default:
        return {
          container: "bg-slate-100 text-slate-800",
          dot: "bg-slate-500",
        };
    }
  };

  const statusStyle = getStatusBadge(item.status);
  const fileNameArr = item.fileName.split("-");
  const localizedFileName = `${t(fileNameArr[0])}-${fileNameArr[1]}`;

  const handleDownloadFileClick = (item: DropdownMenuItem) => {
    const typeMap: Record<string, PetitionFileType> = {
      docx: PetitionFileType.DOCX,
      pdf: PetitionFileType.PDF,
      udf: PetitionFileType.UDF,
    };
    if (typeMap[item.key]) {
      downloadFileMutation.mutate(typeMap[item.key]);
    }
  };

  const handleDownloadAttachmentClick = () => {
    downloadAttachmentsMutation.mutate();
  };

  const downloadFileMenuItems = useMemo<DropdownMenuItem[]>(
    () => [
      { type: "item", icon: "FileText", key: "docx", label: "DOCX" },
      { type: "item", icon: "FileType", key: "pdf", label: "PDF" },
      { type: "item", icon: "FileCode", key: "udf", label: "UDF" },
    ],
    []
  );

  const downloadAttachmentsMenuItems = useMemo<DropdownMenuItem[]>(
    () => [
      //{ type: "item", icon: "FileText", key: "docx", label: "DOCX" },
      { type: "item", icon: "FileType", key: "pdf", label: "PDF" },
      //{ type: "item", icon: "FileCode", key: "udf", label: "UDF" },
    ],
    []
  );

  const isDownloading =
    downloadFileMutation.isPending || downloadAttachmentsMutation.isPending;

  return (
    <div className="isolate bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col relative before:content-[''] before:absolute before:w-full before:h-full before:bg-white before:rounded-lg before:border before:border-slate-200 before:shadow-sm before:inset-0 before:transform before:-translate-y-2 before:rotate-[1.5deg] before:z-[-1]">
      {isDownloading && (
        <div className="absolute inset-0 top-[-9] bg-slate-200/40 z-10 flex items-center justify-center overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
        </div>
      )}
      <div className="p-4 pr-2 pb-2 border-b border-slate-200">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="text-sm font-semibold text-sky-600">
              {item.petitionType}
            </p>
          </div>
          <span
            className={`flex-shrink-0 inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium ${statusStyle.container}`}
          >
            <span className={`w-2 h-2 ${statusStyle.dot} rounded-full`}></span>
            <span className="font-semibold">{t(item.status.label)}</span>
          </span>
        </div>
        <h3 className="font-semibold text-theme-1">{localizedFileName}</h3>
      </div>
      <div className="p-2 px-4 flex-grow space-y-4 text-sm">
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            {t("template")}
          </p>
          <p className="text-slate-600 mt-1">{item.template ?? "-"}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            {t("description")}
          </p>
          <p className="text-slate-600 text-xs mt-1 truncate">
            {item.description}
          </p>
        </div>
      </div>
      <div className="p-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold">{t("createdBy")}</span>
          <span className="font-medium text-slate-700">{item.createdBy}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">{t("createdOn")}</span>
          <span className="font-medium text-slate-700">
            {formatDate(currentLang, item.createdOn, true, true)}
          </span>
        </div>
      </div>
      <div className="px-2 pt-1 pb-3 border-t border-slate-200 flex justify-between items-center gap-1">
        <div className="flex gap-1">
          <DropdownMenu
            placement="bottom"
            overlayClassName="p-2 dark:bg-darkmode-600 w-auto mt-1"
            items={downloadAttachmentsMenuItems}
            trigger={["click"]}
            onItemClick={handleDownloadAttachmentClick}
          >
            <Tooltip title={t("downloadAttachments")}>
              <button className="p-2 rounded-md hover:bg-slate-200">
                <AppIcon icon="Paperclip" className="w-4 h-4 text-slate-500" />
              </button>
            </Tooltip>
          </DropdownMenu>
          <DropdownMenu
            placement="bottom"
            overlayClassName="p-2 dark:bg-darkmode-600 w-auto mt-1"
            items={downloadFileMenuItems}
            trigger={["click"]}
            onItemClick={handleDownloadFileClick}
          >
            <Tooltip title={t("downloadAs")}>
              <button className="p-2 rounded-md hover:bg-slate-200">
                <AppIcon icon="Download" className="w-4 h-4 text-slate-500" />
              </button>
            </Tooltip>
          </DropdownMenu>
        </div>
        <div className="flex gap-1">
          <Tooltip title={t("edit")}>
            <button
              className="p-2 rounded-md hover:bg-slate-200"
              onClick={() => onEdit(item.id)}
            >
              <AppIcon icon="SquarePen" className="w-4 h-4 text-slate-500" />
            </button>
          </Tooltip>
          {/* <Tooltip title={t("delete")}>
            <button
              className="p-2 rounded-md text-red-500 hover:bg-red-100"
              onClick={() => onDelete?.(item.id)}
            >
              <AppIcon icon="Trash2" className="w-4 h-4" />
            </button>
          </Tooltip> */}
        </div>
      </div>
    </div>
  );
};

export default PetitionCard;
