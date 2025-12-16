"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { App } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import { getAllDocumentTypesForLookupAction } from "@/actions/lookups.actions";
import { LookupResponse } from "@/services/common/LookupResponse";
import AppIcon from "@/components/common/ui/AppIcon";
import FolderSidebar from "./FolderSidebar";
import DocumentGrid from "./DocumentGrid";
import { getAllDocumentsAction } from "@/actions/cases.actions";
import { DocumentDto } from "@/services/cases/cases.types";
import { useDebounce } from "@/lib/hooks/useDebounce";
import FormInput from "@/components/common/forms/FormInput";

interface DocumentsProps {
  caseId: number;
}

const Documents: React.FC<DocumentsProps> = ({ caseId }) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [folders, setFolders] = useState<LookupResponse[]>([]);
  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  const debouncedSearchText = useDebounce(searchText, 500);

  const isOptimisticUpdate = useRef(false);

  const defaultFolders = useMemo(
    () => [
      new LookupResponse(-1, t("all")),
      new LookupResponse(0, t("unclassified")),
    ],
    [t]
  );

  const fetchFiles = useCallback(async () => {
    if (selectedFolderId === null) return;
    setIsLoadingFiles(true);
    const response = await getAllDocumentsAction({
      caseId,
      documentTypeId: selectedFolderId,
      searchText: debouncedSearchText,
    });
    if (response.isSuccess && response.result) {
      setDocuments(response.result);
    } else {
      message.error(response.messages);
      setDocuments([]);
    }
    setIsLoadingFiles(false);
  }, [caseId, selectedFolderId, debouncedSearchText, message]);

  const handleUploadSuccess = (document: DocumentDto) => {
    const newFolderId = document.documentTypeId ?? 0;

    if (selectedFolderId === newFolderId) {
      setDocuments((prevFiles) => [...prevFiles, document]);
    } else {
      isOptimisticUpdate.current = true;
      setSelectedFolderId(newFolderId);
      setDocuments([document]);
    }
  };

  const handleRemoveFileFromFolder = (documentId: number) => {
    setDocuments((prev) => prev.filter((f) => f.id !== documentId));
  };

  useEffect(() => {
    setIsLoadingFolders(true);
    getAllDocumentTypesForLookupAction().then((res) => {
      const allFolders = defaultFolders.concat(res);
      setFolders(allFolders);

      setSelectedFolderId(allFolders[0].value);
      setIsLoadingFolders(false);
    });
  }, [defaultFolders]);

  useEffect(() => {
    if (selectedFolderId === null) return;

    if (isOptimisticUpdate.current) {
      isOptimisticUpdate.current = false;
      return;
    }

    fetchFiles();
  }, [selectedFolderId, fetchFiles]);

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
          onSelectFolder={(id) => setSelectedFolderId(id)}
        />
        <main className="w-full sm:w-3/4 p-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            {t("files")}
          </h2>
          <DocumentGrid
            caseId={caseId}
            documents={documents}
            folders={folders}
            loading={isLoadingFiles}
            onUploadSuccess={handleUploadSuccess}
            onDocumentTypeChangeSuccess={handleRemoveFileFromFolder}
            onDeleteSuccess={handleRemoveFileFromFolder}
          />
        </main>
      </div>
    </div>
  );
};

export default Documents;
