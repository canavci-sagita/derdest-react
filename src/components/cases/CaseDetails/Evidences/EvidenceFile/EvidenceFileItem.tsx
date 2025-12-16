"use client";

import { useState } from "react";
import { Spin } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import { EvidenceFileDto } from "@/services/cases/cases.types";
import { formatFileSize, isImageFile } from "@/lib/utils/file.utils";
import { formatDate } from "@/lib/utils/date.utils";
import AppIcon from "@/components/common/ui/AppIcon";
import Button from "@/components/common/ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { slideUpDownVariants } from "@/lib/animations/slide-up-down.variants";
import FormTextEditor from "@/components/common/forms/FormTextEditor";
import { twMerge } from "tailwind-merge";

import cssClasses from "./EvidenceFileItem.module.css";
import { isTextEditorContentEmpty } from "@/lib/utils/string.utils";
import DropdownMenu from "@/components/common/ui/DropdownMenu";
import { DropdownMenuItem } from "@/types/dropdown-menu.types";
import FileIcon from "@/components/common/file-icon/FileIcon";
import { useEvidenceFile } from "@/components/cases/CaseDetails/Evidences/EvidenceFile/useEvidenceFile";

interface EvidenceFileItemProps {
  caseId: number;
  evidenceId: number;
  file: EvidenceFileDto;
}

const EvidenceFileItem: React.FC<EvidenceFileItemProps> = ({
  caseId,
  evidenceId,
  file,
}) => {
  const { t, currentLang } = useTranslation();

  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState<string>("");

  const {
    description,
    isLoadingDescription,
    saveDescription,
    isSaving,
    transcribe,
    download,
    isDownloading,
    deleteFile,
  } = useEvidenceFile(caseId, evidenceId, file, isPanelVisible);

  const handleTogglePanel = () => {
    setIsPanelVisible((prev) => !prev);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setEditorContent(description);
    setIsEditing(true);
  };

  const handleSetDescription = async () => {
    if (!isTextEditorContentEmpty(editorContent)) {
      const result = await saveDescription(editorContent);
      if (result.isSuccess) {
        setIsEditing(false);
      }
    }
  };

  const handleTranscribe = async () => {
    await transcribe();
  };

  const handleDelete = async () => {
    await deleteFile();
  };

  const menuItems = [
    {
      type: "item",
      icon: "Download",
      key: "download",
      label: t("download"),
    },
    {
      type: "item",
      icon: "Trash2",
      key: "delete",
      label: t("delete"),
      popconfirm: {
        title: t("deleteConfirmation.title"),
        description: t("deleteConfirmation.text"),
        onConfirm: handleDelete,
      },
      variant: "danger",
    },
  ] as DropdownMenuItem[];

  return (
    <div className="relative bg-white border border-slate-200 rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-[1.01]">
      {isDownloading && (
        <div className="absolute inset-0 bg-slate-200/40 z-10 flex items-center justify-center overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
        </div>
      )}
      <div className="p-4 flex items-center gap-4">
        <div className="flex-shrink-0">
          <FileIcon fileType={file.fileType} widthHeight={35} />
        </div>
        <div className="flex-grow">
          <p className="font-semibold text-slate-800">{file.fileName}</p>
          <p className="text-xs text-slate-500">
            <span className="font-semibold">
              {`${t("createdOn")}: ${formatDate(
                currentLang,
                file.createdOn,
                false,
                false
              )}`}
            </span>
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-slate-600">
            {formatFileSize(file.fileSize)}
          </p>
          <button
            onClick={handleTogglePanel}
            className="flex items-center mt-1 text-xs font-semibold text-primary hover:underline"
            disabled={isLoadingDescription}
          >
            {!isLoadingDescription && (
              <AppIcon
                icon={isPanelVisible ? "ChevronsUp" : "ChevronsDown"}
                className="w-3 h-3 mr-1 text-primary stroke-[1.5]"
              />
            )}

            {isLoadingDescription
              ? t("loading")
              : isPanelVisible
              ? t("hideDescription")
              : t("setOrViewDescription")}
          </button>
        </div>
        <DropdownMenu
          placement="bottom"
          overlayClassName="p-2 dark:bg-darkmode-600 w-auto mt-1"
          items={menuItems}
          trigger={["click"]}
          onItemClick={({ key }) => key === "download" && download()}
        >
          <a className="cursor-pointer" onClick={(e) => e.preventDefault()}>
            <AppIcon
              icon="EllipsisVertical"
              className="stroke-[1] w-5 h-5 text-slate-400/70"
            />
          </a>
        </DropdownMenu>
      </div>
      <AnimatePresence>
        {isPanelVisible && (
          <motion.div
            className="overflow-hidden border-t border-slate-200"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={slideUpDownVariants}
          >
            <div className="p-4">
              {isLoadingDescription && (
                <div className="flex justify-center items-center min-h-[8rem]">
                  <Spin />
                </div>
              )}

              {!isLoadingDescription && isEditing ? (
                <div className="pb-4">
                  <FormTextEditor
                    value={editorContent}
                    onChange={(value) => {
                      setEditorContent(value);
                    }}
                    placeholder={t("enterDescription")}
                    rootClassName={twMerge([
                      "h-full flex flex-col bg-white",
                      cssClasses["quill-wrapper"],
                    ])}
                  />
                  <div className="text-right space-x-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      localizedLabel="cancel"
                      disabled={isSaving}
                      onClick={() => setIsEditing(false)}
                    />
                    <Button
                      size="sm"
                      variant="primary"
                      localizedLabel={isSaving ? "loading" : "save"}
                      loading={isSaving}
                      disabled={isSaving}
                      onClick={handleSetDescription}
                    />
                  </div>
                </div>
              ) : (
                !isLoadingDescription && (
                  <div>
                    <div
                      className={twMerge([
                        "bg-slate-50 p-4 pt-4 rounded-md prose prose-sm max-w-none text-slate-700",
                        description ? "min-h-[8rem]" : "min-h-[4rem]",
                      ])}
                      dangerouslySetInnerHTML={{
                        __html:
                          description ||
                          `<i class="text-slate-400">${t(
                            "noDescriptionSet"
                          )}</i>`,
                      }}
                    ></div>
                    <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-200">
                      {isImageFile(file.fileType) && (
                        <Button
                          size="sm"
                          variant="outline-primary"
                          iconDirection="left"
                          icon="Sparkles"
                          onClick={handleTranscribe}
                          localizedLabel="transcribe"
                        />
                      )}
                      <Button
                        size="sm"
                        variant="outline-primary"
                        iconDirection="left"
                        icon="Pencil"
                        iconClassName="h-4 w-3 stroke-2"
                        localizedLabel="edit"
                        onClick={handleEdit}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EvidenceFileItem;
