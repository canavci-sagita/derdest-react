"use client";

import { useState, useCallback, useMemo } from "react";
import { Spin, Timeline } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import {
  AddEditTimelineDto,
  addEditTimelineSchema,
} from "@/services/cases/cases.types";
import NoDataAvailable from "@/components/common/data-table/NoDataAvailable";
import AppIcon from "@/components/common/ui/AppIcon";
import Button from "@/components/common/ui/Button";
import TimelineItem from "./TimelineItem";
import TimelineEntryItem from "./TimelineEntryItem";
import FormLabel from "@/components/common/forms/FormLabel";
import FormError from "@/components/common/forms/FormError";
import { FieldErrors } from "@/types/form.types";
import { formatDatePart } from "@/lib/utils/date.utils";
import { DatePartDto } from "@/services/common/DatePartDto";
import FormDatePart from "@/components/common/forms/FormDatePart";
import { useTimelines } from "@/components/cases/CaseDetails/Timelines/useTimelines";

interface TimelinesProps {
  caseId: number;
}

const Timelines: React.FC<TimelinesProps> = ({ caseId }) => {
  const { t, currentLang } = useTranslation();

  const {
    timelines,
    isLoading,
    addEditTimeline,
    deleteTimeline,
    isSaving,
    isDeleting,
  } = useTimelines(caseId);

  const [isAdding, setIsAdding] = useState(false);
  const [editingTimelineId, setEditingTimelineId] = useState<number | null>(
    null
  );
  const [date, setDate] = useState<DatePartDto>({
    day: null,
    month: null,
    year: null,
  });
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<AddEditTimelineDto>
  >({});

  const resetForm = useCallback(() => {
    setFieldErrors({});
    setEditingTimelineId(null);
    setDate({ day: null, month: null, year: null });
    setIsAdding(false);
  }, []);

  const handleShowForm = useCallback(
    (id?: number, item?: AddEditTimelineDto) => {
      if (id && item) {
        setEditingTimelineId(id);
        setIsAdding(false);
        setDate({
          day: item.date!.day,
          month: item.date!.month,
          year: item.date!.year,
        });
      } else {
        setIsAdding(true);
        setEditingTimelineId(null);
        setDate({ day: null, month: null, year: null });
      }
    },
    []
  );

  const handleDateChange = useCallback((newDate: DatePartDto) => {
    setFieldErrors((prev) => ({ ...prev, date: undefined }));
    setDate(newDate);
  }, []);

  const handleSave = useCallback(
    (
      timelineId: number | undefined,
      data: { description: string; evidences: { id: number; title: string }[] }
    ) => {
      const rawData = {
        id: timelineId,
        caseId,
        date: date,
        description: data.description,
        evidences: data.evidences,
      };

      const validation = addEditTimelineSchema(t).safeParse(rawData);
      if (!validation.success) {
        setFieldErrors(
          validation.error.format() as FieldErrors<AddEditTimelineDto>
        );
        return;
      }

      addEditTimeline(rawData, {
        onSuccess: (response) => {
          if (response.isSuccess) {
            resetForm();
          }
        },
      });
    },
    [caseId, date, resetForm, t, addEditTimeline]
  );

  const itemsToRender = useMemo(() => {
    const items = timelines.map((item) => {
      const isEditing = item.id === editingTimelineId;

      return {
        key: item.id,
        label: isEditing ? (
          <div className="mt-4">
            <FormLabel htmlFor="date" localizedLabel="date" required />
            <FormDatePart value={date} onChange={handleDateChange} />
            <FormError errors={fieldErrors.date?.month} />
            <FormError errors={fieldErrors.date?.year} />
          </div>
        ) : (
          <span className="font-semibold">
            {formatDatePart(currentLang, item.date, false)}
          </span>
        ),
        dot: (
          <AppIcon icon="CircleDot" className="w-4 h-4 text-theme-2 stroke-2" />
        ),
        children: isEditing ? (
          <TimelineEntryItem
            submitting={isSaving}
            caseId={caseId}
            initialData={item}
            fieldErrors={fieldErrors}
            onCancel={resetForm}
            onSubmit={(e) => handleSave(item.id, e)}
          />
        ) : (
          <TimelineItem
            key={item.id}
            item={item}
            isDeleting={isDeleting}
            onDelete={deleteTimeline}
            onEdit={(id) => handleShowForm(id, item)}
          />
        ),
      };
    });

    if (isAdding) {
      items.unshift({
        key: 0,
        label: (
          <div className="mt-4">
            <FormLabel htmlFor="date" localizedLabel="date" required />
            <FormDatePart value={date} onChange={handleDateChange} />
            <div className="flex flex-col">
              <FormError errors={fieldErrors.date?.month} />
              <FormError errors={fieldErrors.date?.year} />
            </div>
          </div>
        ),
        dot: (
          <AppIcon
            icon="CirclePlus"
            className="w-4 h-4 text-theme-2 stroke-2"
          />
        ),
        children: (
          <TimelineEntryItem
            submitting={isSaving}
            caseId={caseId}
            fieldErrors={fieldErrors}
            onCancel={resetForm}
            onSubmit={(e) => handleSave(undefined, e)}
          />
        ),
      });
    }
    return items;
  }, [
    timelines,
    editingTimelineId,
    isAdding,
    date,
    fieldErrors,
    currentLang,
    isSaving,
    handleDateChange,
    handleShowForm,
    resetForm,
    deleteTimeline,
    caseId,
    handleSave,
    isDeleting,
  ]);

  return (
    <div className="box box--stacked border border-slate-200 rounded-lg shadow-sm p-6">
      <div className="flex sm:flex-row flex-col items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center space-x-2 mb-3 sm:mb-0">
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-slate-100">
            <AppIcon
              className="h-5 w-5 text-slate-500 stroke-1"
              icon="ChartNoAxesGantt"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-md font-semibold text-slate-900">
              {t("timelines")}
            </h3>
            <span className="text-slate-500">
              {t("caseTimelinesExplanation")}
            </span>
          </div>
        </div>
        <Button
          size="sm"
          variant="primary"
          localizedLabel="addTimeline"
          icon="CirclePlus"
          iconDirection="left"
          iconClassName="stroke-2 h-4 w-4"
          disabled={isAdding || !!editingTimelineId}
          onClick={() => handleShowForm()}
        />
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Spin />
        </div>
      ) : timelines.length === 0 && !isAdding ? (
        <NoDataAvailable />
      ) : (
        <Timeline mode="left" items={itemsToRender} />
      )}
    </div>
  );
};

export default Timelines;
