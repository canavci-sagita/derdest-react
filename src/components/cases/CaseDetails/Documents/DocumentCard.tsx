"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "@/stores/TranslationContext";
import { motion, Variants } from "framer-motion";
import { twMerge } from "tailwind-merge";
import FileIcon from "@/components/common/file-icon/FileIcon";
import DropdownMenu from "@/components/common/ui/DropdownMenu";
import { formatFileSize } from "@/lib/utils/file.utils";
import { DocumentDto } from "@/services/cases/cases.types";
import {
  DropdownMenuEntry,
  DropdownMenuItem,
} from "@/types/dropdown-menu.types";
import { LookupResponse } from "@/services/common/LookupResponse";
import ScanResultModal from "./ScanResultModal";
import { useDocumentFile } from "./useDocumentFile";

interface DocumentCardProps {
  caseId: number;
  document: DocumentDto;
  folders: LookupResponse[];
  onChangeDocumentType: (documentId: number) => void;
  onDelete: (documentId: number) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  caseId,
  document,
  folders,
  onChangeDocumentType,
  onDelete,
}) => {
  const { t } = useTranslation();

  const {
    moveDocument,
    isMoving,
    deleteDocument,
    isDeleting,
    downloadDocument,
    isDownloading,
  } = useDocumentFile(caseId, document, {
    onDeleteSuccess: onDelete,
    onMoveSuccess: onChangeDocumentType,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isHovering, setIsHovering] = useState(false);
  const [needsAnimation, setNeedsAnimation] = useState(false);
  const [overflowWidth, setOverflowWidth] = useState(0);
  const [needsTruncation, setNeedsTruncation] = useState(false);

  const pRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dynamicDuration = useMemo(() => {
    const pixelsPerSecond = 50;
    if (overflowWidth <= 0) return 5;
    return Math.max(1, overflowWidth / pixelsPerSecond);
  }, [overflowWidth]);

  const marqueeVariants: Variants = {
    animate: {
      x: [
        0,
        -(pRef.current?.scrollWidth || 0) +
          (containerRef.current?.offsetWidth || 0) +
          10,
      ],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: dynamicDuration,
          ease: "linear",
          delay: 0,
          repeatDelay: 0.5,
        },
      },
    },
    initial: { x: 0 },
  };

  const handleMenuItemClick = (key: string) => {
    switch (key) {
      case "scan":
        setIsModalOpen(true);
        break;
      case "download":
        downloadDocument();
        break;
      default:
        break;
    }
  };

  const menuItems = useMemo<DropdownMenuEntry[]>(() => {
    const moveToMenuItems: DropdownMenuItem[] = folders
      .filter(
        (f) =>
          f.value !==
            (document.documentTypeId === null ? 0 : document.documentTypeId) &&
          f.value !== -1
      )
      .map((f) => ({
        type: "item" as const,
        key: f.value.toString(),
        icon: "Folder",
        label: (
          <p
            className="font-medium text-slate-800"
            onClick={() => moveDocument(f.value)}
          >
            {f.label}
          </p>
        ),
      }));

    return [
      {
        type: "item",
        icon: "Sparkles",
        iconClassName: "text-theme-2 stroke-[1.5]",
        key: "scan",
        label: t("scanWithAI"),
        labelClassName: "text-theme-2",
      },
      { type: "divider" },
      {
        type: "item",
        icon: "FolderSymlink",
        iconClassName: "stroke-[1.5]",
        key: "moveTo",
        label: t("moveTo"),
        children: moveToMenuItems,
      },
      {
        type: "item",
        icon: "Download",
        iconClassName: "stroke-[1.5]",
        key: "download",
        label: t("download"),
      },
      {
        type: "item",
        icon: "Trash2",
        iconClassName: "stroke-[1.5]",
        key: "reset",
        label: t("delete"),
        popconfirm: {
          title: t("deleteConfirmation.title"),
          description: t("deleteConfirmation.text"),
          onConfirm: () => deleteDocument(),
        },
        variant: "danger",
      },
    ];
  }, [t, folders, document.documentTypeId, moveDocument, deleteDocument]);

  useEffect(() => {
    if (pRef.current && containerRef.current) {
      const pWidth = pRef.current.scrollWidth;
      const containerWidth = containerRef.current.offsetWidth;
      const overflow = pWidth - containerWidth;
      setNeedsAnimation(overflow > 0);
      setNeedsTruncation(pWidth > containerWidth);
      setOverflowWidth(overflow > 0 ? overflow : 0);
    }
  }, [document.fileName]);

  const isProcessing = isMoving || isDeleting || isDownloading;

  return (
    <>
      <DropdownMenu
        placement="bottom"
        overlayClassName="p-2 dark:bg-darkmode-600 w-auto mt-1"
        items={isProcessing ? [] : menuItems}
        trigger={["click"]}
        onItemClick={(item) => handleMenuItemClick(item.key!)}
      >
        <div
          className={twMerge([
            "relative shadow-sm rounded-md relative px-2 text-center overflow-hidden",
            !isProcessing && "cursor-pointer",
          ])}
        >
          {isProcessing && (
            <div className="absolute inset-0 top-[-9] bg-slate-200/40 z-10 flex items-center justify-center overflow-hidden">
              <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
            </div>
          )}
          <FileIcon
            fileType={document.fileType}
            className="flex-shrink-0 mx-auto w-12 h-12 flex items-center justify-center"
          />
          <div
            ref={containerRef}
            className="w-full overflow-hidden whitespace-nowrap relative"
          >
            <motion.p
              ref={pRef}
              className="text-xs font-semibold text-slate-800 inline-block cursor-default truncate"
              variants={marqueeVariants}
              animate={isHovering && needsAnimation ? "animate" : "initial"}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {document.fileName}
              {needsTruncation && !isHovering && "..."}
            </motion.p>
            {needsAnimation && !isHovering && (
              <span className="absolute inset-y-0 top-[-3px] h-full right-0 w-4 pointer-events-none bg-white">
                ...
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {formatFileSize(document.fileSize)}
          </p>
        </div>
      </DropdownMenu>

      {isModalOpen && (
        <ScanResultModal
          caseId={caseId}
          documentId={document.id}
          isOpen={isModalOpen}
          documentName={document.fileName}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default DocumentCard;
