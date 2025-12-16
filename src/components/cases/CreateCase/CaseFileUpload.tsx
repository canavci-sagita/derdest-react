"use client";

import { useState } from "react";
import { Spin, Upload } from "antd";
import type { UploadProps } from "antd";
import Button from "@/components/common/ui/Button";
import { toBase64 } from "@/lib/utils/file.utils";
import { useTranslation } from "@/stores/TranslationContext";
import AppIcon from "@/components/common/ui/AppIcon";
import { transcribeUploadedFileAction } from "@/actions/cases.actions";
import { VALIDATION_CONSTANTS } from "@/lib/constants/validation.constants";
import { FileUploadRequest } from "@/services/common/FileUploadRequest";
import { v4 as uuidv4 } from "uuid";

const { Dragger } = Upload;

interface CaseFileUploadProps {
  onProcess: (transcribedText: string, fileName: string) => void;
}

const CaseFileUpload: React.FC<CaseFileUploadProps> = ({ onProcess }) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadProps: UploadProps = {
    multiple: false,
    accept: ".pdf, .doc, .docx",
    beforeUpload: (file: File) => {
      setFile(file);
      setError(null);
      return false;
    },
    showUploadList: false,
  };

  const handleRemoveFile = () => {
    setError(null);
    setFile(null);
  };
  const handleProcessFile = async () => {
    if (!file) {
      return;
    }

    if (file.size! > VALIDATION_CONSTANTS.FILES.CASE_UPLOADED_FILE_MAX_SIZE) {
      setError(
        t("maxFileSize", {
          max: VALIDATION_CONSTANTS.FILES.CASE_UPLOADED_FILE_MAX_SIZE_IN_MB,
        })
      );
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const fileExtension = file.name.split(".").pop()!.toLowerCase();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const fileContent = await toBase64(file);

      const request: FileUploadRequest = {
        fileContent: fileContent,
        fileName: fileName,
        fileSize: file.size!,
      };

      const response = await transcribeUploadedFileAction(request);

      if (response.isSuccess && response.result) {
        onProcess(response.result, request.fileName);
        setFile(null);
      } else {
        setError(response.messages[0]);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {file ? (
        <div className="flex-grow flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg">
          <AppIcon
            icon="FileCheck2"
            className="w-16 h-16 text-emerald-500 stroke-1"
          />
          <p className="mt-4 font-semibold text-slate-700">{file.name}</p>
          <p className="text-xs text-slate-500">
            {((file.size || 0) / 1024).toFixed(1)} KB
          </p>
          <p className="text-sm text-slate-500 mt-4 text-center">
            {t("uploadFileReady")}
          </p>
          <Button
            variant="danger"
            className="mt-2"
            localizedLabel="removeFile"
            onClick={handleRemoveFile}
          />
          {file && error && (
            <p className="text-xs text-red-500 mt-5">{error}</p>
          )}
        </div>
      ) : (
        <Dragger {...uploadProps} className="flex-grow !flex !flex-col">
          <div className="flex-grow flex flex-col items-center justify-center">
            <p className="ant-upload-drag-icon">
              <AppIcon
                icon="CloudUpload"
                className="mx-auto h-12 w-12 text-slate-400 stroke-1"
              />
            </p>
            <p className="ant-upload-text">{t("clickOrDragDrop")}</p>
            <p className="ant-upload-hint">
              {t("caseFile.uploadDesc", {
                max: VALIDATION_CONSTANTS.FILES
                  .CASE_UPLOADED_FILE_MAX_SIZE_IN_MB,
              })}
            </p>
          </div>
          {!file && error && (
            <p className="text-xs text-red-500 mt-5">{error}</p>
          )}
        </Dragger>
      )}

      <div className="self-center mt-4">
        {isProcessing ? (
          <Spin />
        ) : (
          <Button
            type="button"
            variant="outline-primary"
            disabled={!file || isProcessing}
            onClick={handleProcessFile}
            className="mt-4"
            localizedLabel="processFile"
          />
        )}
      </div>
    </div>
  );
};

export default CaseFileUpload;
