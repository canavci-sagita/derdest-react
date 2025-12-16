"use client";

import { useState } from "react";
import { useTranslation } from "@/stores/TranslationContext";
import AppIcon from "@/components/common/ui/AppIcon";
import FolderSidebar from "./FolderSidebar";
import DocumentGrid from "./DocumentGrid";
import { DocumentDto } from "@/services/cases/cases.types";
import { useDebounce } from "@/lib/hooks/useDebounce";
import FormInput from "@/components/common/forms/FormInput";
import { useDocuments } from "./useDocuments";

interface DocumentsProps {
  caseId: number;
}

const Documents: React.FC<DocumentsProps> = ({ caseId }) => {
  const { t } = useTranslation();

  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(-1);
  const [searchText, setSearchText] = useState("");

  const debouncedSearchText = useDebounce(searchText, 500);

  const {
    folders,
    isLoadingFolders,
    documents,
    isLoadingDocuments,
    invalidateDocuments,
  } = useDocuments(caseId, selectedFolderId, debouncedSearchText);

  const handleUploadSuccess = (document: DocumentDto) => {
    const newFolderId = document.documentTypeId ?? 0;

    if (selectedFolderId !== -1 && selectedFolderId !== newFolderId) {
      setSelectedFolderId(newFolderId);
    } else {
      invalidateDocuments();
    }
  };

  const handleDeleteSuccess = () => {
    invalidateDocuments();
  };

  const handleDocumentTypeChangeSuccess = () => {
    invalidateDocuments();
  };

  return (
    <div className="box box--stacked border border-slate-200 rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 border-b pb-4 mb-6">
        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-slate-100">
          <AppIcon icon="Folders" className="h-5 w-5 text-slate-500 stroke-1" />
        </div>
        <div className="w-full flex align-center justify-between">
          <div>
            <h3 className="text-md font-semibold text-slate-900">
              {t("documents")}
            </h3>
            <span className="text-slate-500">
              {t("caseDocumentsExplanation")}
            </span>
          </div>
          <div>
            <FormInput
              className="w-full sm:w-72"
              icon="Search"
              placeholder={`${t("tableHeader.fileName")}...`}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row min-h-[70vh]">
        <FolderSidebar
          folders={folders}
          selectedFolderId={selectedFolderId}
          loading={isLoadingFolders}
          onSelectFolder={setSelectedFolderId}
        />
        <main className="w-full sm:w-3/4 p-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-400">
            {t("files")}
          </h2>
          <DocumentGrid
            caseId={caseId}
            documents={documents}
            folders={folders}
            loading={isLoadingDocuments}
            onUploadSuccess={handleUploadSuccess}
            onDocumentTypeChangeSuccess={handleDocumentTypeChangeSuccess}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </main>
      </div>
    </div>
  );
};

export default Documents;
