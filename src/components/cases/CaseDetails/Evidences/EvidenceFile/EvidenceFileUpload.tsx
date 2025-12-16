"use client";

import { App, Progress, Upload, UploadFile } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import AppIcon from "@/components/common/ui/AppIcon";
import { uploadEvidenceFileAction } from "@/actions/cases.actions";
import { toBase64 } from "@/lib/utils/file.utils";
import { useRef, useState } from "react";
import { formatFileSize } from "@/lib/utils/file.utils";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import { VALIDATION_CONSTANTS } from "@/lib/constants/validation.constants";
import { EvidenceFileDto } from "@/services/cases/cases.types";
import { FileUploadStatus } from "@/services/common/FileUploadStatus";
import { AnimatePresence, motion } from "framer-motion";
import { useSubscription } from "@/lib/hooks/useSubscription";
import FileIcon from "@/components/common/file-icon/FileIcon";

interface EvidenceFileUploadStatus extends FileUploadStatus {
  id?: number;
  fileType?: string;
  createdOn?: Date;
}

interface EvidenceFileUploadProps {
  caseId: number;
  evidenceId: number;
  onUploadSuccess: (evidenceFiles: EvidenceFileDto) => void;
}

const EvidenceFileUpload: React.FC<EvidenceFileUploadProps> = ({
  caseId,
  evidenceId,
  onUploadSuccess,
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  useSubscription("progress", (notification) => {
    if (notification && notification.fileName) {
      setUploadStatuses((currentStatuses) =>
        currentStatuses.map((s) =>
          s.fileName === notification.fileName
            ? { ...s, progress: notification.percentage }
            : s
        )
      );
    }
  });

  const isUploadingRef = useRef(false);
  const errorShownRef = useRef(false);

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatuses, setUploadStatuses] = useState<
    EvidenceFileUploadStatus[]
  >([]);

  const handleBeforeUpload = (file: RcFile, fileList: RcFile[]) => {
    if (fileList.length > 5) {
      if (!errorShownRef.current) {
        message.error(t("maxAllowedFileCount", { max: 5 }));
        errorShownRef.current = true;
      }
      return Upload.LIST_IGNORE;
    }

    errorShownRef.current = false;
    return false;
  };

  const handleFileChange = async (info: UploadChangeParam) => {
    if (isUploadingRef.current) {
      return;
    }
    setFileList(info.fileList);

    const acceptedFiles = info.fileList.map((f) => f.originFileObj as RcFile);
    if (acceptedFiles.length === 0) return;

    isUploadingRef.current = true;
    setIsUploading(true);

    const initialStatuses = acceptedFiles.map((file) => ({
      fileName: file.name,
      fileSize: file.size,
      progress: 0,
    }));

    setUploadStatuses(initialStatuses);

    const uploadPromises = acceptedFiles.map(async (file) => {
      try {
        const fileContent = await toBase64(file);
        const request = {
          fileContent,
          fileName: file.name,
          fileSize: file.size,
          caseId: caseId,
          evidenceId: evidenceId,
        };

        const response = await uploadEvidenceFileAction(request);

        if (response.isSuccess) {
          setTimeout(() => {
            if (response.result) {
              setUploadStatuses((prev) =>
                prev.filter((f) => f.fileName !== response.result?.fileName)
              );
              onUploadSuccess(response.result);
            }
          }, 500);
          return response.result;
        } else {
          setUploadStatuses((prev) =>
            prev.map((s) =>
              s.fileName === file.name
                ? {
                    ...s,
                    error: response.messages.join(" "),
                    progress: 100,
                  }
                : s
            )
          );
          return null;
        }
      } catch (err) {
        setUploadStatuses((prev) =>
          prev.map((s) =>
            s.fileName === file.name
              ? { ...s, error: (err as Error).message }
              : s
          )
        );
        return null;
      }
    });

    await Promise.all(uploadPromises);

    setTimeout(() => {
      isUploadingRef.current = false;
      setIsUploading(false);
      setFileList([]);
    }, 500);
  };

  return (
    <Upload
      fileList={fileList}
      multiple={true}
      showUploadList={false}
      disabled={isUploading}
      style={{ width: "100%" }}
      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.wav,.mp3,.mp4"
      beforeUpload={handleBeforeUpload}
      onChange={handleFileChange}
    >
      <div className="grid grid-cols-1 gap-4">
        {isUploading ? (
          <AnimatePresence>
            {uploadStatuses.map((file) => (
              <motion.div
                key={file.fileName}
                layout
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ opacity: 0, y: -30, transition: { duration: 0.3 } }}
                className="bg-white border border-slate-200 rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <FileIcon fileType={file.fileType} />
                  </div>
                  <div className="flex-shrink-0">
                    <p className="font-semibold text-slate-800">
                      {file.fileName}
                    </p>
                    <p className="text-xs text-slate-500">
                      <span className="font-semibold">{t("pleaseWait")}</span>
                    </p>
                  </div>
                  <div className="w-full px-6">
                    <Progress
                      percent={file.progress}
                      strokeColor={"rgb(var(--color-theme-2))"}
                      status={
                        file.error
                          ? "exception"
                          : file.progress === 100
                          ? "success"
                          : "normal"
                      }
                    />
                    <p className="text-xs text-red-500 mt-1">{file.error}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-slate-600">
                      {formatFileSize(file.fileSize)}
                    </p>
                    <span className="mt-1 text-xs font-semibold text-primary hover:underline">
                      {t("uploading")}
                    </span>
                  </div>
                  {/* <div className="text-right flex-shrink-0 w-28 flex items-center justify-end gap-3">
                  <p className="text-sm font-medium text-slate-600">
                    {formatFileSize(file.fileSize)}
                  </p>
                </div> */}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="cursor-pointer flex justify-center px-6 pt-5 pb-6 border border-slate-400 border-dashed bg-white rounded-md hover:border-primary transition-colors">
            <div className="space-y-1 text-center w-full">
              <AppIcon
                icon="CloudUpload"
                className="mx-auto h-12 w-12 text-slate-400 stroke-1"
              />
              <span className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-600">
                {t("clickOrDragDrop")}
              </span>
              <p className="text-xs text-slate-500">
                {t("evidenceFile.uploadDesc", {
                  max: VALIDATION_CONSTANTS.FILES
                    .EVIDENCE_FILE_MAX_FILE_SIZE_IN_MB,
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </Upload>
  );
};

export default EvidenceFileUpload;
