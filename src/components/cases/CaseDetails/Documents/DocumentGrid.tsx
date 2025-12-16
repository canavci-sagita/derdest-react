"use client";

import { useState } from "react";
import { App, Tooltip, Upload } from "antd";
import type { UploadProps } from "antd";
import { useMutation } from "@tanstack/react-query";
import { DocumentDto } from "@/services/cases/cases.types";
import DocumentCard from "./DocumentCard";
import AppIcon from "@/components/common/ui/AppIcon";
import { useTranslation } from "@/stores/TranslationContext";
import cssClasses from "./DocumentGrid.module.css";
import { twMerge } from "tailwind-merge";
import { toBase64 } from "@/lib/utils/file.utils";
import { uploadDocumentAction } from "@/actions/cases.actions";
import { useSubscription } from "@/lib/hooks/useSubscription";
import UploadingDocumentCard from "./UploadingDocumentCard";
import { VALIDATION_CONSTANTS } from "@/lib/constants/validation.constants";
import DocumentCardSkeleton from "./DocumentCardSkeleton";
import { LookupResponse } from "@/services/common/LookupResponse";

const { Dragger } = Upload;

interface DocumentGridProps {
  caseId: number;
  documents: DocumentDto[];
  folders: LookupResponse[];
  loading: boolean;
  onUploadSuccess: (document: DocumentDto) => void;
  onDocumentTypeChangeSuccess: (documentId: number) => void;
  onDeleteSuccess: (documentId: number) => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({
  caseId,
  documents,
  folders,
  loading,
  onUploadSuccess,
  onDocumentTypeChangeSuccess,
  onDeleteSuccess,
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadMutation = useMutation({
    mutationFn: uploadDocumentAction,
    onSuccess: (response) => {
      if (response.isSuccess) {
        message.success(response.messages);
        onUploadSuccess(response.result!);
      } else {
        message.error(response.messages);
      }
      setProgress(0);
      setFile(null);
    },
    onError: () => {
      setProgress(0);
      setFile(null);
    },
  });

  useSubscription("progress", (notification) => {
    if (
      notification &&
      notification.fileName === file?.name &&
      uploadMutation.isPending
    ) {
      setProgress(notification.percentage);
    }
  });

  const handleUpload: UploadProps["customRequest"] = async (options) => {
    const { file } = options;
    const typedFile = file as File;

    setProgress(0);
    setFile(typedFile);

    try {
      const fileContent = await toBase64(typedFile);
      const request = {
        fileContent,
        fileName: typedFile.name,
        fileSize: typedFile.size,
        caseId: caseId,
      };
      uploadMutation.mutate(request);
    } catch {
      setFile(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4">
      {uploadMutation.isPending && file ? (
        <UploadingDocumentCard fileName={file.name} progress={progress} />
      ) : (
        <Dragger
          customRequest={handleUpload}
          showUploadList={false}
          multiple={false}
          className={twMerge(
            "col-span-full sm:col-span-1",
            cssClasses["document-upload"]
          )}
        >
          <div className="text-center hover:bg-slate-50 rounded-lg h-24">
            <div className="flex-shrink-0 mx-auto w-12 h-12 flex items-center justify-center">
              <AppIcon
                icon="FilePlus"
                className="mx-auto h-10 w-10 text-slate-400 stroke-1"
              />
            </div>
            <p className="text-xs font-semibold text-slate-500 truncate">
              {t("uploadFile")}
            </p>
            <div className="text-xs flex align-center justify-center text-slate-500">
              <Tooltip
                title={t("document.uploadDesc", {
                  max: VALIDATION_CONSTANTS.FILES.DOCUMENT_MAX_FILE_SIZE_IN_MB,
                })}
                placement="bottom"
              >
                <AppIcon
                  icon="Info"
                  className="w-4 h-4 stroke-[1.5] mt-1 text-slate-800"
                />
              </Tooltip>
            </div>
          </div>
        </Dragger>
      )}
      {loading ? (
        <>
          <DocumentCardSkeleton />
          <DocumentCardSkeleton />
          <DocumentCardSkeleton />
        </>
      ) : (
        documents.map((d) => (
          <DocumentCard
            key={d.id}
            caseId={caseId}
            document={d}
            folders={folders}
            onDelete={onDeleteSuccess}
            onChangeDocumentType={onDocumentTypeChangeSuccess}
          />
        ))
      )}
    </div>
  );
};

export default DocumentGrid;
