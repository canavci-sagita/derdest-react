"use client";

import React, { useRef, useState } from "react";
import TemplateCard from "./TemplateCard";
import AppIcon from "@/components/common/ui/AppIcon";
import { useTranslation } from "@/stores/TranslationContext";
import TemplatesSidebar from "./TemplateSidebar";
import { useCaseTypes } from "@/lib/hooks/tanstack/useCaseTypes";
import { usePetitionTypes } from "@/lib/hooks/tanstack/usePetitionTypes";
import {
  deletePetitionTemplateAction,
  getAllPetitionTemplatesAction,
  uploadPetitionTemplateAction,
} from "@/actions/users.actions";
import { App } from "antd";
import { PetitionTemplateDto } from "@/services/users/users.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toBase64 } from "@/lib/utils/file.utils";
import { getErrorMessage } from "@/lib/utils/error.utils";

const PetitionTemplates: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCaseTypeId, setSelectedCaseTypeId] = useState<number | null>(
    null
  );
  const [selectedPetitionTypeId, setSelectedPetitionTypeId] = useState<
    number | null
  >(selectedCaseTypeId);

  const { data: caseTypes, isLoading: isLoadingCaseTypes } = useCaseTypes();
  const { data: petitionTypes, isLoading: isLoadingPetitionTypes } =
    usePetitionTypes(selectedCaseTypeId);

  const { data: petitionTemplates = [], isLoading: isLoadingTemplates } =
    useQuery({
      queryKey: ["petition-templates", selectedPetitionTypeId],
      queryFn: async () => {
        if (!selectedPetitionTypeId) return [];

        const response = await getAllPetitionTemplatesAction(
          selectedPetitionTypeId
        );

        if (response.isSuccess) {
          return response.result || [];
        } else {
          message.error(response.messages);
          return [];
        }
      },
      enabled: !!selectedPetitionTypeId,
      staleTime: 1000 * 60 * 5,
    });

  const selectedCaseType = caseTypes?.find(
    (c) => c.value === selectedCaseTypeId
  );
  const selectedPetition = petitionTypes?.find(
    (pt) => pt.value === selectedPetitionTypeId
  );

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileContent = await toBase64(file);

      const request = {
        petitionTypeId: selectedPetitionTypeId!,
        fileName: file.name,
        fileContent: fileContent,
        fileSize: file.size,
      };

      return await uploadPetitionTemplateAction(request);
    },
    onSuccess: (response) => {
      if (response.isSuccess) {
        message.success(response.messages);
        queryClient.invalidateQueries({
          queryKey: ["petition-templates", selectedPetitionTypeId],
        });
        queryClient.invalidateQueries({
          queryKey: ["petition-types", selectedCaseTypeId],
        });
      } else {
        message.error(response.messages);
      }
    },
    onError: (error: unknown) => {
      message.error(getErrorMessage(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await deletePetitionTemplateAction(id);
    },
    onSuccess: (response) => {
      if (response.isSuccess) {
        message.success(response.messages);
        queryClient.invalidateQueries({
          queryKey: ["petition-templates", selectedPetitionTypeId],
        });
      } else {
        message.error(response.messages);
      }
    },
    onError: (error: unknown) => {
      message.error(getErrorMessage(error));
    },
  });

  const handleSelectCaseType = (id: number) => {
    if (selectedCaseTypeId === id) {
      setSelectedCaseTypeId(null);
    } else {
      setSelectedCaseTypeId(id);
    }
  };

  const handleSelectPetitionType = async (id: number) => {
    const response = await getAllPetitionTemplatesAction(id);

    if (response.isSuccess) {
      setSelectedPetitionTypeId(id);
    } else {
      message.error(response.messages);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".docx")) {
      message.warning(t("petitionTemplate.uploadDesc", { maxFileSize: 5 }));
      return;
    }

    uploadMutation.mutate(file);

    e.target.value = "";
  };

  const handleUpload = () => {
    if (!selectedPetitionTypeId) {
      message.warning(
        t("pleaseSelectPetitionType") ||
          "Please select a petition category first."
      );
      return;
    }
    fileInputRef.current?.click();
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="box flex overflow-hidden bg-slate-50">
      <TemplatesSidebar
        caseTypes={caseTypes || []}
        isLoadingCaseTypes={isLoadingCaseTypes}
        petitionTypes={petitionTypes || []}
        isLoadingPetitionTypes={isLoadingPetitionTypes}
        selectedCaseTypeId={selectedCaseTypeId}
        selectedPetitionTypeId={selectedPetitionTypeId}
        onSelectCaseType={handleSelectCaseType}
        onSelectPetitionType={handleSelectPetitionType}
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm z-10">
          <div>
            {selectedCaseType && (
              <nav className="flex items-center text-xs text-slate-500">
                <span className="hover:text-indigo-600 cursor-pointer transition-colors">
                  {selectedCaseType.label}
                </span>
                {selectedPetition && (
                  <>
                    <AppIcon icon="ChevronRight" className="w-3 h-3 mx-1" />
                    <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {selectedPetition.label}
                    </span>
                  </>
                )}
              </nav>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {selectedPetitionTypeId ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".docx,.pdf,.doc"
              />
              <button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="group relative flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <div className="w-14 h-14 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-indigo-200 transition-all">
                  {uploadMutation.isPending ? (
                    <AppIcon
                      icon="LoaderCircle"
                      className="w-6 h-6 text-indigo-600 animate-spin"
                    />
                  ) : (
                    <AppIcon
                      icon="Plus"
                      className="w-6 h-6 text-slate-400 group-hover:text-indigo-600"
                    />
                  )}
                </div>
                <span className="font-semibold text-slate-600 group-hover:text-indigo-700">
                  {uploadMutation.isPending
                    ? t("uploading")
                    : t("uploadTemplate")}
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  {t("petitionTemplate.uploadDesc", { maxFileSize: 5 })}
                </span>
              </button>
              {petitionTemplates.length > 0
                ? petitionTemplates.map((template: PetitionTemplateDto) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onPreview={(id) => console.log("Preview", id)}
                      onDownload={(id) => console.log("Download", id)}
                      onDelete={handleDelete}
                    />
                  ))
                : !isLoadingTemplates && (
                    <div className="col-span-full flex flex-col items-center justify-center py-10 text-slate-400 opacity-70">
                      <AppIcon icon="FileX" className="w-12 h-12 mb-2" />
                      <p>{t("noTemplatesFound")}</p>
                    </div>
                  )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <AppIcon
                icon="FolderOpen"
                className="w-16 h-16 mb-4 opacity-20"
              />
              <p className="text-lg font-medium">
                {t("selectCategoryToViewTemplates")}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PetitionTemplates;
