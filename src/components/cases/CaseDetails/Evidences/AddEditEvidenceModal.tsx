"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, App, Modal } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import { useActionForm } from "@/lib/hooks/useActionForm";
import { createFormState } from "@/lib/utils/form.utils";
import {
  AddEditEvidenceDto,
  addEditEvidenceSchema,
} from "@/services/cases/cases.types";
import FormLabel from "@/components/common/forms/FormLabel";
import FormInput from "@/components/common/forms/FormInput";
import FormError from "@/components/common/forms/FormError";
import Button from "@/components/common/ui/Button";
import TextArea from "antd/lib/input/TextArea";
import AppIcon from "@/components/common/ui/AppIcon";
import FormSelect from "@/components/common/forms/FormSelect";
import { formatDatePart } from "@/lib/utils/date.utils";
import { useEvidences } from "@/components/cases/CaseDetails/Evidences/useEvidences";
import { useTimelines } from "@/components/cases/CaseDetails/Timelines/useTimelines";

interface AddEditEvidenceModalProps {
  isOpen: boolean;
  onClose: (shouldRefetch?: boolean, newEvidenceId?: number) => void;
  initialData?: AddEditEvidenceDto | null;
  caseId: number;
  preselectedTimelineLabel?: string | null;
  showTimeline?: boolean;
}

const initialState = createFormState<AddEditEvidenceDto>();

const AddEditEvidenceModal: React.FC<AddEditEvidenceModalProps> = ({
  isOpen,
  onClose,
  initialData,
  caseId,
  preselectedTimelineLabel,
  showTimeline,
}) => {
  const { t, currentLang } = useTranslation();
  const { message } = App.useApp();

  const isEditMode = !!initialData;

  const { timelinesLookup: timelines, isLoadingLookup: isLoadingTimelines } =
    useTimelines(caseId, isOpen);

  const { saveEvidence, isSaving } = useEvidences(caseId);

  const { displayState, setDisplayState, clearFieldError, clearFormMessage } =
    useActionForm(initialState, initialState);

  const [selectedTimelineId, setSelectedTimelineId] = useState<number | null>(
    initialData?.timelineId || null
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      if (selectedTimelineId) {
        formData.set("timelineId", String(selectedTimelineId));
      }

      const rawData = Object.fromEntries(formData);

      const localizedSchema = addEditEvidenceSchema(t);
      const validation = localizedSchema.safeParse(rawData);

      if (!validation.success) {
        setDisplayState({
          status: "error",
          errors: validation.error.format(),
          fields: rawData,
        });
        return;
      }
      const result = await saveEvidence(formData);

      if (result.status === "success") {
        onClose(true);
      } else {
        setDisplayState(result);
      }
    },
    [selectedTimelineId, t, saveEvidence, onClose, setDisplayState]
  );

  useEffect(() => {
    if (displayState.status === "success") {
      message.success(displayState.message);
      onClose(true, displayState.result as number);
    } else if (displayState.status === "error" && displayState.message) {
      message.error(displayState.message);
    }
  }, [displayState, onClose, message]);

  return (
    <Modal
      title={t(isEditMode ? "editEvidence" : "addEvidence")}
      open={isOpen}
      onCancel={() => onClose(false)}
      footer={null}
      destroyOnHidden
    >
      <form onSubmit={handleSubmit} className="">
        {displayState.status === "error" && displayState.message && (
          <Alert
            message={
              Array.isArray(displayState.message)
                ? displayState.message.map((m, i) => (
                    <p className="text-left" key={i}>
                      {m}
                    </p>
                  ))
                : displayState.message
            }
            type="error"
            showIcon
            className="mb-4"
            onClose={clearFormMessage}
          />
        )}
        {isEditMode && <input type="hidden" name="id" value={initialData.id} />}
        <input type="hidden" name="caseId" value={caseId} />
        <div className="space-y-6 mb-3">
          <div>
            <FormLabel htmlFor="title" localizedLabel="title" required />
            <FormInput
              id="title"
              type="text"
              defaultValue={initialData?.title || displayState.fields?.title}
              onChange={() => clearFieldError("title")}
            />
            <FormError errors={displayState.errors?.title} />
          </div>
          {showTimeline && (
            <div>
              <FormLabel htmlFor="timelineId" localizedLabel="timeline" />
              <FormSelect
                id="timelineId"
                options={timelines}
                allowClear
                labelInValue
                loading={isLoadingTimelines}
                optionRender={(option) => (
                  <div>
                    <p className="text-xs text-slate-400">
                      {formatDatePart(
                        currentLang,
                        {
                          day: option.data.day,
                          month: option.data.month,
                          year: option.data.year,
                        },
                        true
                      )}
                    </p>
                    <p className="font-medium">{option.data.label}</p>
                  </div>
                )}
                defaultValue={
                  selectedTimelineId && initialData
                    ? {
                        value: selectedTimelineId,
                        label: preselectedTimelineLabel,
                      }
                    : null
                }
                onChange={(opt) => {
                  setSelectedTimelineId(opt?.value);
                  clearFieldError("timelineId");
                }}
              />
              <FormError errors={displayState.errors?.timelineId} />
            </div>
          )}
          <div>
            <FormLabel
              htmlFor="description"
              localizedLabel="description"
              required
            />
            <TextArea
              id="description"
              name="description"
              rows={3}
              className="mt-1"
              defaultValue={
                initialData?.description || displayState.fields?.description
              }
              onChange={() => clearFieldError("description")}
            />
            <FormError errors={displayState.errors?.description} />
          </div>
        </div>
        {!!showTimeline && (
          <div className="rounded-md bg-sky-100 p-2 mt-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AppIcon
                  icon="Info"
                  className="h-5 w-5 stroke-2 text-sky-600"
                />
              </div>
              <div className="ml-3">
                <div className="font-medium text-xs text-sky-600">
                  {t("evidencesFormInfo")}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline-primary"
            localizedLabel="cancel"
            disabled={isSaving}
            onClick={() => onClose(false)}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
            loading={isSaving}
            localizedLabel={isSaving ? "saving" : "save"}
          ></Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditEvidenceModal;
