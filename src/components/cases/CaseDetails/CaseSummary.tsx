"use client";

import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { editCaseSummaryAction } from "@/actions/cases.actions";
import FormError from "@/components/common/forms/FormError";
import FormLabel from "@/components/common/forms/FormLabel";
import FormSelect from "@/components/common/forms/FormSelect";
import AppIcon from "@/components/common/ui/AppIcon";
import Button from "@/components/common/ui/Button";
import { useActionForm } from "@/lib/hooks/useActionForm";
import { createFormState } from "@/lib/utils/form.utils";
import {
  CaseSummaryDto,
  EditCaseSummaryDto,
  editCaseSummarySchema,
} from "@/services/cases/cases.types";
import { useTranslation } from "@/stores/TranslationContext";
import { App, DatePicker } from "antd";
import TextArea from "antd/lib/input/TextArea";
import dayjs from "dayjs";
import React from "react";
import { usePetitionTypes } from "@/lib/hooks/tanstack/usePetitionTypes";
import { useCaseTypes } from "@/lib/hooks/tanstack/useCaseTypes";

const initialState = createFormState<EditCaseSummaryDto>();

interface CaseSummaryProps {
  data: CaseSummaryDto;
}

const CaseSummary: React.FC<CaseSummaryProps> = ({ data }) => {
  const { summary, ...info } = data;
  const { t } = useTranslation();
  const { message } = App.useApp();

  const [formValues, setFormValues] = useState<Partial<EditCaseSummaryDto>>({
    ...summary,
    caseTypeId: summary.caseTypeId,
    petitionTypeId: summary.petitionTypeId,
  });

  const { data: caseTypes } = useCaseTypes();
  const { data: petitionTypes, isLoading: isLoadingPetitionTypes } =
    usePetitionTypes(formValues.caseTypeId);

  const initialCaseTypeOption = useMemo(
    () => [{ value: summary.caseTypeId, label: info.caseType }],
    [summary.caseTypeId, info.caseType]
  );

  const initialPetitionOption = useMemo(() => {
    return formValues.caseTypeId === summary.caseTypeId
      ? [{ value: summary.petitionTypeId, label: data.petitionType }]
      : [];
  }, [
    formValues.caseTypeId,
    summary.caseTypeId,
    summary.petitionTypeId,
    data.petitionType,
  ]);

  const [serverState, formAction, isPending] = useActionState(
    editCaseSummaryAction,
    initialState
  );

  const { displayState, setDisplayState, clearFieldError } = useActionForm(
    serverState,
    initialState
  );

  const isDirty = useMemo(() => {
    return (
      formValues.caseTypeId !== summary.caseTypeId ||
      formValues.petitionTypeId !== summary.petitionTypeId ||
      formValues.description !== summary.description ||
      dayjs(formValues.date).format("YYYY-MM-DD") !==
        dayjs(summary.date).format("YYYY-MM-DD")
    );
  }, [formValues, summary]);

  const handleInputChange = useCallback(
    (field: keyof EditCaseSummaryDto, value: string | number | null) => {
      clearFieldError(field);
      setFormValues((prev) => ({ ...prev, [field]: value }));
    },
    [clearFieldError]
  );

  const handleCaseTypeChange = (caseTypeId: number) => {
    clearFieldError("caseTypeId");
    clearFieldError("petitionTypeId");

    setFormValues((prev) => ({
      ...prev,
      caseTypeId,
      petitionTypeId: undefined,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isDirty) {
      return;
    }

    const dataToValidate = {
      ...formValues,
      id: summary.id,
    };

    const localizedSchema = editCaseSummarySchema(t);
    const validation = localizedSchema.safeParse(dataToValidate);

    if (!validation.success) {
      setDisplayState({
        status: "error",
        message: null,
        errors: validation.error.format(),
        fields: dataToValidate,
      });
      return;
    }

    const formData = new FormData();
    Object.entries(validation.data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        const val = value instanceof Date ? value.toISOString() : String(value);
        formData.append(key, val);
      }
    });

    startTransition(() => formAction(formData));
  };

  useEffect(() => {
    if (displayState.status === "success") {
      message.success(displayState.message);
    } else if (displayState.status === "error" && displayState.message) {
      message.error(displayState.message);
    }
  }, [displayState.status, displayState.message, message]);

  return (
    <div className="box box--stacked border border-slate-200 rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 border-b pb-4 mb-6">
        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-slate-100">
          <AppIcon
            className="h-5 w-5 text-slate-500 stroke-1"
            icon="FileText"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-md font-semibold text-slate-900">
            {t("summary")}
          </h3>
          <span className="text-slate-500">{t("caseSummaryExplanation")}</span>
        </div>
      </div>

      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        <div className="sm:col-span-1">
          <FormLabel htmlFor="date" localizedLabel="date" required />
          <DatePicker
            id="date"
            name="date"
            className="w-full"
            format={info.dateFormat.toUpperCase()}
            value={formValues.date ? dayjs(formValues.date) : null}
            onChange={(date) => handleInputChange("date", date?.toISOString())}
          />
          <FormError errors={displayState.errors?.date} />
        </div>
        <div className="sm:col-start-1">
          <FormLabel htmlFor="caseTypeId" localizedLabel="caseType" required />
          <FormSelect
            id="caseTypeId"
            options={caseTypes || initialCaseTypeOption}
            value={formValues.caseTypeId}
            onChange={(value) => handleCaseTypeChange(value as number)}
          />
          <FormError errors={displayState.errors?.caseTypeId} />
        </div>
        <div>
          <FormLabel
            htmlFor="petitionTypeId"
            localizedLabel="petitionType"
            required
          />
          <FormSelect
            id="petitionTypeId"
            options={petitionTypes || initialPetitionOption}
            value={formValues.petitionTypeId}
            disabled={!formValues.caseTypeId || isLoadingPetitionTypes}
            loading={isLoadingPetitionTypes}
            onChange={(value) => handleInputChange("petitionTypeId", value)}
          />
          <FormError errors={displayState.errors?.petitionTypeId} />
        </div>
        <div className="sm:col-span-2">
          <FormLabel
            htmlFor="description"
            localizedLabel="description"
            required
          />
          <TextArea
            id="description"
            name="description"
            rows={4}
            className="mt-1"
            value={formValues.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
          <FormError errors={displayState.errors?.description} />
        </div>

        <div className="sm:col-span-2 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={isPending || !isDirty}
            localizedLabel={isPending ? "saving" : "saveChanges"}
            icon="Save"
            iconDirection="left"
          />
        </div>
      </form>
    </div>
  );
};

export default CaseSummary;
