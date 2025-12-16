import { useTranslation } from "@/stores/TranslationContext";
import AppIcon from "../../common/ui/AppIcon";
import { useMutation, useQuery } from "@tanstack/react-query";
import { App, Tooltip } from "antd";
import { getRecentDocuments } from "@/services/reports/reports.service";
import { downloadDocumentAction } from "@/actions/cases.actions";
import { formatRelativeTime } from "@/lib/utils/date.utils";
import { formatFileSize } from "@/lib/utils/file.utils";
import FileIcon from "../../common/file-icon/FileIcon";
import { RecentDocumentDto } from "@/services/reports/reports.types";
import LoadingIcon from "../../common/ui/LoadingIcon";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import DocumentsWidgetSkeleton from "./DocumentsWidgetSkeleton";

const DocumentsWidget: React.FC = () => {
  const { t, currentLang } = useTranslation();
  const { message } = App.useApp();

  const { data: recentDocuments = [], isLoading } = useQuery({
    queryKey: ["recent-documents"],
    queryFn: async () => {
      const response = await getRecentDocuments();
      if (response.isSuccess && response.result) {
        return response.result;
      }
      return [];
    },
    select: (data) => {
      return data
        .sort(
          (a, b) =>
            new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
        )
        .slice(0, 5);
    },
    staleTime: 1000 * 60 * 5,
  });

  const downloadMutation = useMutation({
    mutationFn: async (doc: RecentDocumentDto) => {
      return await downloadDocumentAction(doc.caseId, doc.id);
    },
    onSuccess: (response, doc) => {
      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement("a");
        a.href = url;
        a.download = doc.fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } else {
        message.error(response.messages[0]);
      }
    },
    onError: (e) => message.error(e.message),
  });

  return (
    <div className="box flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm h-full overflow-hidden">
      <div className="flex items-center justify-between p-5 pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-50 rounded-lg text-indigo-600">
            <AppIcon icon="Files" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              {t("lastUploadedDocuments")}
            </h3>
          </div>
        </div>
      </div>
      <div className="flex-grow relative min-h-[300px]">
        {isLoading ? (
          <DocumentsWidgetSkeleton />
        ) : recentDocuments.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {recentDocuments.map((doc) => (
              <div
                key={doc.id}
                className="group flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <FileIcon fileType={doc.fileType} widthHeight={36} />
                </div>
                <div className="flex-grow min-w-0 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-slate-700 truncate transition-colors pr-2">
                      {doc.fileName}
                    </h4>
                    <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
                      {formatFileSize(doc.fileSize)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 min-w-0 pr-2 overflow-hidden">
                      <AppIcon
                        icon="Briefcase"
                        className="w-3 h-3 text-slate-400 flex-shrink-0"
                      />
                      <Link
                        href={`/cases/${doc.caseId}`}
                        className="text-xs font-medium text-slate-500 hover:text-theme-1 truncate"
                      >
                        {doc.caseTitle}
                      </Link>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
                      {formatRelativeTime(currentLang, doc.createdOn)}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tooltip title={t("download")}>
                    <button
                      onClick={() => downloadMutation.mutate(doc)}
                      disabled={downloadMutation.isPending}
                      className={twMerge([
                        "w-8 h-8  p-2 rounded-full text-slate-500 hover:text-emerald-600 transition-colors",
                        !downloadMutation.isPending && "hover:bg-slate-200",
                      ])}
                    >
                      {downloadMutation.isPending &&
                      downloadMutation.variables?.id === doc.id ? (
                        <LoadingIcon
                          icon="spinning-circles"
                          className="w-4 h-4"
                        />
                      ) : (
                        <AppIcon icon="Download" className="w-4 h-4 stroke-2" />
                      )}
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
            <AppIcon icon="Files" className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm">{t("noDocumentsFound")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsWidget;
