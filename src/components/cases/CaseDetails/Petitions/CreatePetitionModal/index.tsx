"use client";

import { useState, useEffect, useActionState, startTransition } from "react";
import { App, Modal, Steps, Input, Spin } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import { LookupResponse } from "@/services/common/LookupResponse";
import Button from "@/components/common/ui/Button";
import FormLabel from "@/components/common/forms/FormLabel";
import FormSelect from "@/components/common/forms/FormSelect";
import FormTextEditor from "@/components/common/forms/FormTextEditor";
import { useActionForm } from "@/lib/hooks/useActionForm";
import {
  createPetitionAction,
  editPetitionAction,
} from "@/actions/cases.actions";
import { createFormState } from "@/lib/utils/form.utils";

import {
  CreatePetitionRequest,
  CreatePetitionResponse,
  createPetitionSchema,
  EditPetitionRequest,
  GetPetitionResponse,
} from "@/services/cases/cases.types";
import FormError from "@/components/common/forms/FormError";
import { isTextEditorContentEmpty } from "@/lib/utils/string.utils";
import { twMerge } from "tailwind-merge";

const { TextArea } = Input;

interface CreatePetitionModalProps {
  isOpen: boolean;
  initialPrompt: string;
  caseId: number;
  currentPetitionTypeId: number;
  petitionTypes: LookupResponse[];
  petition: (GetPetitionResponse & { id: number }) | null;
  onClose: (shouldRefetch: boolean) => void;
}

const initialState = createFormState<CreatePetitionRequest>();

const CreatePetitionModal: React.FC<CreatePetitionModalProps> = ({
  isOpen,
  initialPrompt,
  caseId,
  currentPetitionTypeId,
  petitionTypes,
  petition,
  onClose,
}) => {
  const { message } = App.useApp();
  const { t } = useTranslation();

  const [serverState, formAction, isPending] = useActionState(
    createPetitionAction,
    initialState
  );

  const { displayState, setDisplayState } = useActionForm(
    serverState,
    initialState
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [generatedPetition, setGeneratedPetition] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [selectedPetitionType, setSelectedPetitionType] = useState(
    currentPetitionTypeId
  );
  const [petitionId, setPetitionId] = useState<number>();

  const handleGoBack = () => {
    setDisplayState(initialState);
    setCurrentStep(0);
  };

  const handleCreatePetition = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentStep(1);

    const createPetitionRequest = {
      caseId,
      petitionTypeId: selectedPetitionType,
      prompt,
    };

    const localizedSchema = createPetitionSchema(t);

    const validation = localizedSchema.safeParse(createPetitionRequest);

    if (!validation.success) {
      setDisplayState({
        status: "error",
        message: null,
        errors: validation.error.format(),
        fields: createPetitionRequest,
      });

      return;
    }

    const formData = new FormData();
    Object.entries(validation.data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    startTransition(() => {
      formAction(formData);
    });
  };

  const handleEditPetition = async () => {
    if (isTextEditorContentEmpty(generatedPetition)) {
      message.error(t("required.petitionContent"));
      return;
    }

    if (petitionId) {
      setIsSaving(true);
      const editPetitionRequest = {
        caseId,
        petitionId,
        content: generatedPetition,
      };
      const formData = new FormData();
      Object.entries(editPetitionRequest).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      const response = await editPetitionAction(
        createFormState<EditPetitionRequest>(),
        formData
      );
      setIsSaving(false);

      if (response.status === "success") {
        message.success(response.message);
        onClose(true);
      } else if (response.status === "error" && response.message) {
        message.error(displayState.message);
      }
    }
  };

  const getFooter = () => {
    return (
      <div className="flex justify-between gap-3">
        <Button
          disabled={isPending}
          localizedLabel="cancel"
          onClick={() => onClose(false)}
        />
        <div className="flex justify-end gap-3">
          {currentStep === 2 && !petition && (
            <Button
              variant="secondary"
              disabled={isPending}
              localizedLabel="back"
              onClick={handleGoBack}
            />
          )}
          {currentStep === 0 && (
            <Button
              type="submit"
              variant="primary"
              loading={isPending}
              localizedLabel="generatePetition"
              form="create-petition-form"
            />
          )}
          {currentStep === 2 && (
            <Button
              variant="primary"
              loading={isSaving}
              disabled={isSaving}
              iconDirection="left"
              icon="Save"
              localizedLabel={isSaving ? "pleaseWait" : "savePetition"}
              onClick={handleEditPetition}
            />
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (isOpen) {
      if (petition) {
        setCurrentStep(2);
        setPetitionId(petition.id);
        setGeneratedPetition(petition.content);
      } else {
        setCurrentStep(0);
        setPrompt(initialPrompt);
        setSelectedPetitionType(currentPetitionTypeId);
        setGeneratedPetition("");
      }
    }
  }, [isOpen, initialPrompt, currentPetitionTypeId, petition]);

  useEffect(() => {
    if (displayState.status === "success" && displayState.result) {
      message.success(displayState.message);

      const response = displayState.result as CreatePetitionResponse;

      setPetitionId(response.id);
      setGeneratedPetition(response.content);
      setCurrentStep(2);
    } else if (displayState.status === "error") {
      if (displayState.message) {
        message.error(displayState.message);
      }
      setCurrentStep(0);
    }
  }, [
    displayState.status,
    displayState.message,
    displayState.result,
    message,
    onClose,
  ]);

  return (
    <Modal
      title={petition ? t("reviewAndEditPetition") : t("createWithAI")}
      open={isOpen}
      width={768}
      footer={getFooter()}
      destroyOnHidden
      closable={false}
      maskClosable={false}
      onCancel={() => onClose(false)}
    >
      {!petition && (
        <Steps
          current={currentStep}
          items={[
            { title: t("reviewPrompt") },
            { title: t("generating") },
            { title: t("finalize") },
          ]}
          className="mt-6"
        />
      )}

      <div className="min-h-[400px] flex flex-col">
        {currentStep === 0 && (
          <form id="create-petition-form" onSubmit={handleCreatePetition}>
            <input type="hidden" name="caseId" value={caseId} />
            <h3 className="text-theme-1 font-semibold text-slate-800 mb-2 mt-4 border-b border-slate-200">
              {t("editAIPrompt")}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {t("editAIPrompt.hint")}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel
                  htmlFor="petitionTypeId"
                  localizedLabel="petitionType"
                  required
                />
                <FormSelect
                  id="petitionTypeId"
                  options={petitionTypes}
                  value={selectedPetitionType}
                  onChange={(opt) => {
                    setSelectedPetitionType(opt);
                  }}
                />
                <FormError errors={displayState.errors?.petitionTypeId} />
              </div>

              <div className="col-span-2">
                <span className="font-bold text-danger">
                  *** Customized prompt will be implemented. ***
                </span>
                <FormLabel localizedLabel="prompt" htmlFor="prompt" required />
                <TextArea
                  id="prompt"
                  rows={12}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />

                <FormError errors={displayState.errors?.prompt} />
              </div>
            </div>
          </form>
        )}
        {currentStep === 1 && (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <Spin size="large" />
            <h3 className="font-semibold text-slate-800 mt-4">
              {t("aiWorking")}
            </h3>
            <p className="text-sm text-slate-500">{t("aiWorking.hint")}</p>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <input type="hidden" name="petitionId" value={petitionId} />
            {!petition && (
              <>
                <h3 className="text-theme-1 font-semibold text-slate-800 mb-2 mt-4 border-b border-slate-200">
                  {t("reviewGeneratedPetition")}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {t("reviewGeneratedPetition.hint")}
                </p>
              </>
            )}
            <FormTextEditor
              placeholder={t("managePetitionDetails")}
              rootClassName={twMerge([
                "max-h-[24rem] prose prose-sm overflow-auto mb-3",
                petition && "mt-4",
              ])}
              value={generatedPetition}
              onChange={setGeneratedPetition}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CreatePetitionModal;
