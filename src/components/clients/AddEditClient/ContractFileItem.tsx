"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/stores/TranslationContext";
import { ContractFileDto } from "@/services/clients/clients.types";
import { App, Popconfirm, Progress, Tooltip, Upload } from "antd";
import AppIcon from "@/components/common/ui/AppIcon";
import { UploadProps } from "antd/es/upload";
import {
  downloadContractFileAction,
  uploadAndVerifyContractFileAction,
} from "@/actions/clients.actions";
import { toBase64 } from "@/lib/utils/file.utils";
import { twMerge } from "tailwind-merge";
import { AIVerificationResult } from "@/services/common/enums";
import { VALIDATION_CONSTANTS } from "@/lib/constants/validation.constants";
import { useSubscription } from "@/lib/hooks/useSubscription";

interface ContractFileItemProps {
  clientId?: number | null;
  contractFile: ContractFileDto;
  description: string | null;
  onDelete(contractFile: ContractFileDto): void;
}

const ContractFileItem: React.FC<ContractFileItemProps> = ({
  contractFile,
  clientId,
  description,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const currentFileNameRef = useRef("");

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | string[] | null>(null);
  const [uploadedContractFile, setUploadedContractFile] =
    useState(contractFile);
  const [isDownloading, setIsDownloading] = useState(false);

  useSubscription("progress", (notification) => {
    if (
      notification &&
      notification.fileName === currentFileNameRef.current &&
      isUploading
    ) {
      setProgress(notification.percentage);
    }
  });

  const handleUpload: UploadProps["customRequest"] = async (options) => {
    if (clientId) {
      const { file } = options;
      const typedFile = file as File;

      setProgress(0);
      currentFileNameRef.current = typedFile.name;
      setIsUploading(true);
      setError(null);

      try {
        const fileContent = await toBase64(typedFile);
        const request = {
          fileContent,
          fileName: typedFile.name,
          fileSize: typedFile.size,
          clientId: clientId,
          contractTypeId: uploadedContractFile.contractTypeId,
        };

        uploadAndVerifyContractFileAction(request).then((response) => {
          if (response.isSuccess) {
            setUploadedContractFile(response.result!);
          } else {
            setError(response.messages);
          }

          setIsUploading(false);
          setProgress(0);
          currentFileNameRef.current = "";
        });
      } catch {
        setError("An unexpected error occurred while starting the upload.");
        setIsUploading(false);
        currentFileNameRef.current = "";
      }
    }
  };

  const handleDownload = async () => {
    if (clientId) {
      setIsDownloading(true);
      try {
        const response = await downloadContractFileAction(
          clientId,
          contractFile.contractTypeId
        );

        if (response instanceof Blob) {
          const url = window.URL.createObjectURL(response);

          const a = document.createElement("a");
          a.href = url;
          a.download = contractFile.fileName! || uploadedContractFile.fileName!;
          document.body.appendChild(a);
          a.click();

          window.URL.revokeObjectURL(url);
          a.remove();
        } else {
          message.error(response.messages[0]);
        }
      } catch {
        message.error("An unexpected error occurred.");
      } finally {
        setIsDownloading(false);
      }
    }
  };
  useEffect(() => {
    setUploadedContractFile(contractFile);
  }, [contractFile]);
  return (
    <div>
      <label className="block text-center pb-1 font-semibold bg-primary text-white rounded-t-md">
        {description}
      </label>
      {uploadedContractFile.createdOn ? (
        <div className="bg-white border border-slate-200 rounded-b-lg shadow-sm p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AppIcon icon="FileText" className="w-10 h-10 text-primary-500" />
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-slate-800 truncate">
                {uploadedContractFile.fileName}
              </p>
              <p className="text-sm text-slate-500">{`${(
                uploadedContractFile.fileSize! / 1024
              ).toFixed(1)} KB - ${uploadedContractFile.fileType}`}</p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={twMerge(
                    "inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium",
                    contractFile.verificationResult ===
                      AIVerificationResult.Verified &&
                      "bg-emerald-100 text-emerald-800",
                    contractFile.verificationResult !==
                      AIVerificationResult.Verified && "bg-red-100 text-red-800"
                  )}
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <circle cx="4" cy="4" r="3"></circle>
                  </svg>
                  {t(
                    AIVerificationResult[
                      uploadedContractFile.verificationResult!
                    ]
                  ) || "-"}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
              <Tooltip title={t("download")} placement="left">
                <button
                  className="cursor-pointer text-slate-500 hover:bg-slate-100 flex items-center p-2 rounded-md"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  <AppIcon className="h-4 w-4" icon="Download" />
                </button>
              </Tooltip>
              <Tooltip title={t("delete")} placement="right">
                <Popconfirm
                  title={t("deleteConfirmation.title")}
                  description={t("deleteConfirmation.text")}
                  onConfirm={() => onDelete(contractFile)}
                  okText={t("yes")}
                  cancelText={t("no")}
                  okButtonProps={{ danger: true }}
                >
                  <button
                    className="cursor-pointer text-red-600 flex items-center p-2 rounded-md hover:bg-red-200/60"
                    disabled={isDownloading}
                  >
                    <AppIcon className="h-4 w-4" icon="Trash2" />
                  </button>
                </Popconfirm>
              </Tooltip>
            </div>
          </div>
        </div>
      ) : (
        <Upload
          customRequest={handleUpload}
          showUploadList={false}
          disabled={isUploading}
          style={{ width: "100%" }}
          accept=".pdf,.doc,.docx"
        >
          <div className="cursor-pointer flex justify-center px-6 pt-5 pb-6 border border-slate-400 border-dashed border-t-0 rounded-b-md hover:border-primary transition-colors">
            <div className="space-y-1 text-center w-full">
              <AppIcon
                icon="CloudUpload"
                className="mx-auto h-12 w-12 text-slate-400 stroke-1"
              />
              {isUploading ? (
                <Progress
                  percent={progress}
                  strokeColor={"rgb(var(--color-theme-2))"}
                />
              ) : (
                <span className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-600">
                  {t("clickOrDragDrop")}
                </span>
              )}
              <p className="text-xs text-slate-500">
                {t("contractFile.uploadDesc", {
                  max: VALIDATION_CONSTANTS.FILES
                    .CONTRACT_FILE_MAX_FILE_SIZE_IN_MB,
                })}
              </p>
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
          </div>
        </Upload>
      )}
    </div>
  );
};

export default ContractFileItem;
