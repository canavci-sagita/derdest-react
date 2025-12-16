"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "@/stores/TranslationContext";
import { Tag, Tooltip } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import AppIcon from "@/components/common/ui/AppIcon";
import FormInput from "@/components/common/forms/FormInput";
import FormLabel from "@/components/common/forms/FormLabel";
import { AddEditTimelineDto } from "@/services/cases/cases.types";
import FormSelect from "@/components/common/forms/FormSelect";
import { FieldErrors } from "@/types/form.types";
import FormError from "@/components/common/forms/FormError";
import AddEditEvidenceModal from "../Evidences/AddEditEvidenceModal";
import Button from "@/components/common/ui/Button";
import LoadingIcon from "@/components/common/ui/LoadingIcon";
import { useEvidencesLookup } from "@/lib/hooks/tanstack/useEvidencesLookup";

interface TimelineEntryItemProps {
  caseId: number;
  initialData?: AddEditTimelineDto;
  fieldErrors: FieldErrors<AddEditTimelineDto>;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (data: {
    description: string;
    evidences: { id: number; title: string }[];
  }) => void;
}

const TimelineEntryItem: React.FC<TimelineEntryItemProps> = ({
  caseId,
  initialData,
  fieldErrors,
  submitting,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: allEvidences = [], refetch } = useEvidencesLookup(caseId);

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [openEvidencesSelect, setOpenEvidencesSelect] = useState(false);

  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [selectedEvidences, setSelectedEvidences] = useState<
    { value: number; label: string }[]
  >(
    initialData?.evidences?.map((e) => ({
      value: e.id,
      label: e.title,
    })) || []
  );

  const [touchedErrors, setTouchedErrors] = useState<
    FieldErrors<AddEditTimelineDto>
  >({});

  const currentErrors = { ...fieldErrors, ...touchedErrors };

  const evidenceOptions = useMemo(() => {
    return allEvidences.map((e) => {
      const assignedToCurrent = initialData?.evidences?.some(
        (s) => s.id === e.value
      );
      const assignedElsewhere = !!e.timeline && !assignedToCurrent;

      return {
        label: e.label,
        value: e.value,
        disabled: assignedElsewhere,
        timeline: e.timeline,
      };
    });
  }, [allEvidences, initialData]);

  const handleCloseModal = async (
    shouldRefetch?: boolean,
    newEvidenceId?: number
  ) => {
    setIsEvidenceModalOpen(false);

    if (shouldRefetch) {
      const result = await refetch();
      if (newEvidenceId && result.data) {
        const newItem = result.data.find((e) => e.value === newEvidenceId);
        if (newItem) {
          setSelectedEvidences((prev) => [
            ...prev,
            { value: newItem.value, label: newItem.label },
          ]);
        }
      }
      queryClient.invalidateQueries({ queryKey: ["evidences-lookup", caseId] });
    }
  };

  const handleSubmit = () => {
    onSubmit({
      description,
      evidences: selectedEvidences.map((e) => ({
        id: e.value,
        title: e.label,
      })),
    });
  };

  const evidenceOptionsRender = useCallback(
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    (option: any) => {
      const isCurrent = selectedEvidences.some((e) => e.value === option.value);
      const isInInitialEvidences = initialData?.evidences?.some(
        (e) => e.id === option.value
      );

      return (
        <div
          key={option.value}
          className="flex justify-between items-center w-full"
        >
          <span className="font-medium truncate mr-2">{option.label}</span>
          <span className="text-xs shrink-0">
            {option.data.timeline && !isCurrent && !isInInitialEvidences && (
              <Tooltip
                color="rgb(var(--color-theme-2))"
                title={`${t("relatedTimeline")}: ${option.data.timeline}`}
              >
                <div className="flex items-center cursor-help">
                  <AppIcon icon="Info" className="text-slate-500 h-4 w-4" />
                </div>
              </Tooltip>
            )}
          </span>
        </div>
      );
    },
    [selectedEvidences, initialData, t]
  );

  useEffect(() => {
    setTouchedErrors({});
  }, [fieldErrors]);

  return (
    <>
      <div className="mb-8 p-4 bg-slate-50/50 rounded-lg border border-slate-100">
        <div className="space-y-4">
          <div>
            <FormLabel
              htmlFor="description"
              localizedLabel="description"
              required
            />
            <FormInput
              id="description"
              type="text"
              defaultValue={description}
              onChange={(e) => {
                setTouchedErrors((prev) => ({
                  ...prev,
                  description: undefined,
                }));
                setDescription(e.target.value);
              }}
            />
            <FormError errors={currentErrors.description} />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <FormLabel
                htmlFor="evidenceIds"
                localizedLabel="relatedEvidences"
              />
              <Tooltip title={t("addEvidence")}>
                <button
                  type="button"
                  onClick={() => setIsEvidenceModalOpen(true)}
                  className="p-1.5 rounded-full text-green-600 bg-green-100 hover:bg-green-200 transition-colors"
                >
                  <AppIcon icon="Plus" className="w-3.5 h-3.5 stroke-3" />
                </button>
              </Tooltip>
            </div>

            <p className="text-xs text-slate-500 mb-2">
              {t("selectOrAddEvidence")}
            </p>

            <FormSelect
              open={openEvidencesSelect}
              id="evidenceIds"
              className="w-full"
              placeholder={t("select")}
              mode="multiple"
              allowClear
              labelInValue
              options={evidenceOptions}
              optionRender={evidenceOptionsRender}
              value={selectedEvidences}
              onChange={setSelectedEvidences}
              onOpenChange={setOpenEvidencesSelect}
              popupRender={(menu) => (
                <>
                  {menu}
                  <div className="w-full flex justify-center border-t border-slate-200 mt-2 p-1">
                    <Button
                      type="button"
                      variant="outline-primary"
                      size="sm"
                      className="mt-1 min-w-[100px]"
                      localizedLabel="close"
                      onClick={() => setOpenEvidencesSelect(false)}
                    />
                  </div>
                </>
              )}
              tagRender={(props) => (
                <Tag
                  color="rgb(var(--color-theme-2))"
                  closable={true}
                  style={{ marginInlineEnd: 4 }}
                  onClose={props.onClose}
                >
                  {props.label}
                </Tag>
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-4">
          {submitting ? (
            <LoadingIcon icon="three-dots" className="p-2 mr-3" />
          ) : (
            <>
              <button
                type="button"
                onClick={onCancel}
                className="p-2 rounded-md text-red-500 hover:bg-red-100 transition-colors"
                title={t("cancel")}
              >
                <AppIcon icon="X" className="w-5 h-5 stroke-2" />
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="p-2 rounded-md text-emerald-600 hover:bg-emerald-100 transition-colors"
                title={t("save")}
              >
                <AppIcon icon="Check" className="w-5 h-5 stroke-2" />
              </button>
            </>
          )}
        </div>
      </div>
      {isEvidenceModalOpen && (
        <AddEditEvidenceModal
          caseId={caseId}
          isOpen={isEvidenceModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default TimelineEntryItem;
