import { useMutation } from "@tanstack/react-query";
import { App } from "antd";
import {
  changeDocumentTypeAction,
  deleteDocumentAction,
  downloadDocumentAction,
} from "@/actions/cases.actions";
import { DocumentDto } from "@/services/cases/cases.types";

interface UseDocumentFileOptions {
  onDeleteSuccess?: (id: number) => void;
  onMoveSuccess?: (id: number) => void;
}

export const useDocumentFile = (
  caseId: number,
  document: DocumentDto,
  options?: UseDocumentFileOptions
) => {
  const { message } = App.useApp();

  const moveMutation = useMutation({
    mutationFn: async (documentTypeId: number | null) => {
      return await changeDocumentTypeAction(
        caseId,
        document.id,
        documentTypeId === 0 ? null : documentTypeId
      );
    },
    onSuccess: (response) => {
      if (response.isSuccess) {
        message.success(response.messages);
        options?.onMoveSuccess?.(document.id);
      } else {
        message.error(response.messages);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await deleteDocumentAction(caseId, document.id);
    },
    onSuccess: (response) => {
      if (response.isSuccess) {
        message.success(response.messages);
        options?.onDeleteSuccess?.(document.id);
      } else {
        message.error(response.messages);
      }
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async () => {
      return await downloadDocumentAction(caseId, document.id);
    },
    onSuccess: (response) => {
      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const a = window.document.createElement("a");
        a.href = url;
        a.download = document.fileName;
        window.document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } else {
        message.error(response.messages[0]);
      }
    },
    onError: () => message.error("An unexpected error occurred."),
  });

  return {
    moveDocument: moveMutation.mutate,
    isMoving: moveMutation.isPending,

    deleteDocument: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,

    downloadDocument: downloadMutation.mutate,
    isDownloading: downloadMutation.isPending,
  };
};
