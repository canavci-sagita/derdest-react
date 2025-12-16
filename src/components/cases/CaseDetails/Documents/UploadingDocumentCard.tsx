"use client";

import FileIcon from "@/components/common/file-icon/FileIcon";
import { getFileTypeFromFileName } from "@/lib/utils/file.utils";
import { Progress } from "antd";

interface UploadingDocumentCardProps {
  fileName: string;
  progress: number;
}

const UploadingDocumentCard: React.FC<UploadingDocumentCardProps> = ({
  fileName,
  progress,
}) => {
  return (
    <div className="relative border border-dashed border-slate-300 rounded-lg px-2 text-center overflow-hidden">
      <FileIcon
        fileType={getFileTypeFromFileName(fileName)}
        className="flex-shrink-0 mx-auto w-12 h-12 flex items-center justify-center"
      />
      <p className="text-xs font-semibold text-slate-800 truncate">
        {fileName}
      </p>
      <Progress
        percent={progress}
        strokeColor={"rgb(var(--color-theme-2))"}
        percentPosition={{ align: "center", type: "inner" }}
        showInfo={false}
      />
    </div>
  );
};

export default UploadingDocumentCard;
