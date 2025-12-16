"use client";

import { App, Segmented, Spin } from "antd";
import Button from "../../common/ui/Button";
import { useTranslation } from "@/stores/TranslationContext";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import FormSelect from "../../common/forms/FormSelect";
import { LookupResponse } from "@/services/common/LookupResponse";
import { getAllClientsForLookupAction } from "@/actions/lookups.actions";
import AppIcon from "../../common/ui/AppIcon";
import { createCaseFromTranscribedTextAction } from "@/actions/cases.actions";
import {
  TranscribedCaseRequest,
  transcribedCaseRequestSchema,
} from "@/services/cases/cases.types";
import { createFormState } from "@/lib/utils/form.utils";
import { useActionForm } from "@/lib/hooks/useActionForm";
import FormError from "../../common/forms/FormError";
import dynamic from "next/dynamic";
import CaseFileUpload from "./CaseFileUpload";
import FormTextEditor from "@/components/common/forms/FormTextEditor";
import { twMerge } from "tailwind-merge";

const CaseAudioRecorder = dynamic(() => import("./CaseAudioRecorder"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Spin />
    </div>
  ),
});

type CreationMethod = "recording" | "upload" | "editor";

const initialState = createFormState<TranscribedCaseRequest>();

const CreateCase: React.FC = () => {
  const { message } = App.useApp();
  const { t } = useTranslation();
  const router = useRouter();

  const [activeMethod, setActiveMethod] = useState<CreationMethod>("recording");
  const [clients, setClients] = useState<LookupResponse[]>([]);

  const [clientId, setClientId] = useState<number | null>(null);
  const [sourceFileName, setSourceFileName] = useState("");
  const [transcribedText, setTranscribedText] = useState("");

  const [serverState, formAction, isPending] = useActionState(
    createCaseFromTranscribedTextAction,
    initialState
  );
  const { displayState, setDisplayState, clearFieldError } = useActionForm(
    serverState,
    initialState
  );

  const handleStartOver = () => {
    setTranscribedText("");
  };

  const handleTranscription = (text: string, fileName?: string) => {
    setTranscribedText(text);
    if (fileName) {
      setSourceFileName(fileName);
    }
    setActiveMethod("editor");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationData = {
      clientId: clientId!,
      text: transcribedText,
      sourceFileName: sourceFileName,
    };

    const localizedSchema = transcribedCaseRequestSchema(t);
    const validation = localizedSchema.safeParse(validationData);

    if (!validation.success) {
      const formattedErrors = validation.error.format();

      setDisplayState({
        status: "error",
        message: null,
        errors: formattedErrors,
        fields: validationData,
      });
      return;
    }

    const formData = new FormData();
    formData.append("clientId", String(validation.data.clientId));
    formData.append("text", validation.data.text);
    if (validation.data.sourceFileName) {
      formData.append("sourceFileName", validation.data.sourceFileName);
    }

    startTransition(() => formAction(formData));
  };

  useEffect(() => {
    getAllClientsForLookupAction().then((res) => res && setClients(res));
  }, []);

  useEffect(() => {
    if (displayState.status === "success") {
      message.success(displayState.message);

      router.push("/cases");
    } else if (displayState.status === "error" && displayState.message) {
      message.error(displayState.message);
    }
  }, [displayState.status, displayState.message, message, router]);

  return (
    <>
      <div className="mb-3 p-4 rounded-md shadow-md bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {t("createNewCase")}
            </h1>
            <p className="mt-1 text-slate-600">{t("fillInCaseForm.add")}</p>
          </div>
          <Button
            type="button"
            variant="outline-primary"
            className="text-sm font-medium text-slate-600"
            localizedLabel="backToCases"
            iconDirection="left"
            icon="ArrowLeft"
            onClick={() => router.push("/cases")}
          />
        </div>
      </div>
      <main>
        <form
          id="case-form"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-24"
          onSubmit={handleSubmit}
        >
          <div className="lg:col-span-1 space-y-3">
            <section className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div
                  className={twMerge([
                    "flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full text-white font-bold",
                    displayState.errors?.clientId
                      ? "bg-red-500"
                      : "bg-theme-1 ",
                  ])}
                >
                  1
                </div>
                <div className="ml-4 flex flex-col">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {t("clientSelection")}
                  </h2>
                  <FormError
                    className="font-semibold"
                    errors={displayState.errors?.clientId}
                  />
                </div>
              </div>
              <div className="mt-4">
                <FormSelect
                  id="clientId"
                  options={clients}
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  defaultValue={displayState.fields?.clientId}
                  onChange={(value) => {
                    setClientId(value);
                    clearFieldError("clientId");
                  }}
                />
              </div>
            </section>
            <section className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-theme-1 text-white font-bold">
                  2
                </div>
                <h2 className="ml-4 text-lg font-semibold text-slate-900">
                  {t("chooseCreationMethod")}
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {t("creationMethod.desc")}
              </p>
              <div className="mt-4 space-y-3">
                <Segmented<CreationMethod>
                  size="large"
                  vertical
                  block
                  options={[
                    {
                      label: (
                        <div className="p-1.5 flex flex-col items-center">
                          <div className="flex items-center gap-x-2">
                            <AppIcon
                              className="h-4 w-4 stroke-1.5"
                              icon="Mic"
                            />
                            <span className="text-primary">
                              {t("audioRecord")}
                            </span>
                          </div>
                          <span className="flex items-center text-xs text-slate-500">
                            <AppIcon
                              className="h-3 w-3 stroke-1 mr-1"
                              icon="Info"
                            />
                            {t("createCase.audioRecord.desc")}
                          </span>
                        </div>
                      ),
                      value: "recording",
                    },
                    {
                      label: (
                        <div className="p-1.5 flex flex-col items-center">
                          <div className="flex items-center gap-x-2">
                            <AppIcon
                              className="h-4 w-4 stroke-1.5"
                              icon="CloudUpload"
                            />
                            <span className="text-primary">
                              {t("fileUpload")}
                            </span>
                          </div>
                          <span className="flex items-center text-xs text-slate-500">
                            <AppIcon
                              className="h-3 w-3 stroke-1 mr-1"
                              icon="Info"
                            />
                            {t("createCase.uploadFile.desc")}
                          </span>
                        </div>
                      ),
                      value: "upload",
                    },
                    {
                      label: (
                        <div className="p-1.5 flex flex-col items-center">
                          <div className="flex items-center gap-x-2">
                            <AppIcon
                              className="h-4 w-4 stroke-1.5"
                              icon="SquarePen"
                            />
                            <span className="text-primary">
                              {t("textEditor")}
                            </span>
                          </div>
                          <span className="flex items-center text-xs text-slate-500">
                            <AppIcon
                              className="h-3 w-3 stroke-1 mr-1"
                              icon="Info"
                            />
                            {t("createCase.textEditor.desc")}
                          </span>
                        </div>
                      ),
                      value: "editor",
                    },
                  ]}
                  value={activeMethod}
                  onChange={(value) => {
                    setActiveMethod(value);
                    handleStartOver();
                  }}
                />
              </div>
            </section>
          </div>
          <div className="lg:col-span-2">
            <section className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm h-full flex flex-col">
              <div className="flex items-center">
                <div
                  className={twMerge([
                    "flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full text-white font-bold",
                    displayState.errors?.text ? "bg-red-500" : "bg-theme-1 ",
                  ])}
                >
                  3
                </div>
                <div className="ml-4 flex flex-col">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {activeMethod === "recording" && t("recordYourCase")}
                    {activeMethod === "upload" && t("uploadCaseFile")}
                    {activeMethod === "editor" && t("writeCaseDetails")}
                  </h2>
                  <FormError
                    className="font-semibold"
                    errors={displayState.errors?.text}
                  />
                </div>
              </div>
              <div className="mt-4 space-y-6 flex-grow flex flex-col">
                {activeMethod === "recording" && (
                  <CaseAudioRecorder onProcess={handleTranscription} />
                )}
                {activeMethod === "upload" && (
                  <CaseFileUpload onProcess={handleTranscription} />
                )}
                {activeMethod === "editor" && (
                  <FormTextEditor
                    value={transcribedText}
                    onChange={(value) => {
                      setTranscribedText(value);
                      clearFieldError("text");
                    }}
                    placeholder={t("enterOrModifyDetails")}
                    rootClassName="h-full flex flex-col"
                  />
                )}
              </div>
            </section>
          </div>
        </form>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 z-50 xl:pl-[289px]">
        <div className="container mx-auto px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-sm border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] rounded-t-lg">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline-primary"
              localizedLabel="cancel"
              onClick={() => router.push("/cases")}
            />
            <Button
              type="submit"
              variant="primary"
              iconDirection="left"
              icon="Save"
              disabled={isPending}
              loading={isPending}
              localizedLabel={isPending ? "saving" : "createYourCase"}
              form="case-form"
            />
          </div>
        </div>
      </footer>
    </>
  );
};

export default CreateCase;
