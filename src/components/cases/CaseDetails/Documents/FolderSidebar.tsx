"use client";

import { memo } from "react";
import { LookupResponse } from "@/services/common/LookupResponse";
import { useTranslation } from "@/stores/TranslationContext";
import Button from "@/components/common/ui/Button";
import DocumentFolderSkeleton from "./DocumentFolderSkeleton";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

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
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-400">
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
          folders.map((folder) => {
            const isActive = selectedFolderId === folder.value;

            return (
              <Button
                key={folder.value}
                onClick={() => onSelectFolder(folder.value)}
                className={clsx(
                  "w-full flex items-center justify-start gap-3 px-3 py-2 rounded-md font-semibold border-white shadow-none transition-colors",
                  isActive
                    ? "bg-amber-500 text-white"
                    : "text-amber-600 hover:bg-amber-100 text-slate-800"
                )}
                icon={isActive ? "FolderOpen" : "Folder"}
                iconDirection="left"
                label={folder.label}
                iconClassName={twMerge([
                  "w-5 h-5 stroke-[1.5]",
                  isActive ? "text-white" : "text-amber-600",
                ])}
              />
            );
          })
        )}
      </nav>
    </aside>
  );
};

//NOTE: Using memo to prevent re-renders when parent search text changes.
export default memo(FolderSidebar);
