"use client";

import { LookupResponse } from "@/services/common/LookupResponse";
import clsx from "clsx";
import { useTranslation } from "@/stores/TranslationContext";
import Button from "@/components/common/ui/Button";
import DocumentFolderSkeleton from "./DocumentFolderSkeleton";
import { twMerge } from "tailwind-merge";

interface FolderSidebarProps {
  folders: LookupResponse[];
  selectedFolderId: number | null;
  loading: boolean;
  onSelectFolder: (id: number) => void;
}

const FolderSidebar: React.FC<FolderSidebarProps> = ({
  folders,
  selectedFolderId,
  loading,
  onSelectFolder,
}) => {
  const { t } = useTranslation();

  return (
    <aside className="w-full sm:w-1/4 flex-shrink-0 border-r border-slate-200 p-4">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
        {t("folders")}
      </h2>
      <nav className="space-y-1">
        {loading ? (
          <>
            <DocumentFolderSkeleton />
            <DocumentFolderSkeleton />
            <DocumentFolderSkeleton />
          </>
        ) : (
          folders.map((folder) => (
            <Button
              key={folder.value}
              onClick={() => {
                onSelectFolder(folder.value);
              }}
              className={clsx(
                "w-full flex items-center justify-start gap-3 px-3 py-2 rounded-md font-semibold text-slate-800 border-white shadow-none transition-colors",
                selectedFolderId === folder.value
                  ? "bg-amber-500 text-white"
                  : "text-amber-600 hover:bg-amber-100"
              )}
              icon={selectedFolderId == folder.value ? "FolderOpen" : "Folder"}
              iconDirection="left"
              label={folder.label}
              iconClassName={twMerge([
                "w-5 h-5 stroke-[1.5]",
                selectedFolderId === folder.value
                  ? "text-white"
                  : "text-amber-600",
              ])}
            />
          ))
        )}
      </nav>
    </aside>
  );
};

export default FolderSidebar;
