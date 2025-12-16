"use client";

import { Spin } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import EvidenceFileItem from "./EvidenceFileItem";
import EvidenceFileUpload from "./EvidenceFileUpload";
import { useEvidenceFiles } from "@/components/cases/CaseDetails/Evidences/EvidenceFile/useEvidenceFiles";

interface EvidenceFileListProps {
  caseId: number;
  evidenceId: number;
}

const EvidenceFileList: React.FC<EvidenceFileListProps> = ({
  caseId,
  evidenceId,
}) => {
  const { t } = useTranslation();

  const { files, isLoading, addFileToCache } = useEvidenceFiles(
    caseId,
    evidenceId
  );

  return (
    <div className="p-2 bg-slate-50 rounded-b-lg">
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Spin />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <EvidenceFileUpload
            caseId={caseId}
            evidenceId={evidenceId}
            onUploadSuccess={addFileToCache}
          />
          {files && files.length > 0 && (
            <>
              <div className="flex items-center my-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500 font-medium">
                  {t("uploadedFiles")}
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <div className="grid gap-4 px-4">
                {files.map((file) => (
                  <EvidenceFileItem
                    key={file.id}
                    caseId={caseId}
                    evidenceId={evidenceId}
                    file={file}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EvidenceFileList;
