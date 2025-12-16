import FormError from "@/components/common/forms/FormError";
import FormLabel from "@/components/common/forms/FormLabel";
import FormSelect from "@/components/common/forms/FormSelect";
import AppIcon from "@/components/common/ui/AppIcon";
import Button from "@/components/common/ui/Button";
import { formatDate } from "@/lib/utils/date.utils";
import { LookupResponse } from "@/services/common/LookupResponse";
import {
  AddEditAssignmentDto,
  addEditAssignmentSchema,
} from "@/services/users/users.types";
import { useTranslation } from "@/stores/TranslationContext";
import { FieldErrors } from "@/types/form.types";
import { DatePicker, Popconfirm } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const emptyAssignment: Partial<AddEditAssignmentDto> = {
  tenantOrUserId: undefined,
  roleId: undefined,
  startDate: null,
  endDate: null,
};

type AddEditAssignmentProps = {
  data?: AddEditAssignmentDto;
  roles: LookupResponse[];
  lawFirms: LookupResponse[];
  onAddAssignment?: (assignment: AddEditAssignmentDto) => void;
  onRemoveAssignment?: (lawFirmId: number, roleId: number) => void;
  clearFieldError?: (name: string) => void;
};

const AddEditAssignment: React.FC<AddEditAssignmentProps> = ({
  data,
  roles,
  lawFirms,
  onAddAssignment,
  onRemoveAssignment,
  clearFieldError,
}) => {
  const { t, currentLang } = useTranslation();

  const [assignment, setAssignment] = useState<Partial<AddEditAssignmentDto>>(
    data || emptyAssignment
  );
  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors<AddEditAssignmentDto>>();

  const handleInputChange = (
    key: keyof AddEditAssignmentDto,
    value: string | number | Dayjs | null
  ) => {
    if (dayjs.isDayjs(value)) {
      value = value.toISOString();
    }
    setAssignment((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));

    clearFieldError?.(`assignments.${key}`);
  };

  const handleAddAssignment = () => {
    const validation = addEditAssignmentSchema(t, false).safeParse(assignment);

    if (!validation.success) {
      const errors =
        validation.error.format() as FieldErrors<AddEditAssignmentDto>;
      setFieldErrors(errors);
      return;
    }

    onAddAssignment?.(validation.data);

    setAssignment(emptyAssignment);
    setFieldErrors(undefined);
  };

  const handleRemoveAssignment = (tenantOrUserId: number, roleId: number) => {
    onRemoveAssignment?.(tenantOrUserId, roleId);
  };

  const getLawFirmLabel = (id: number) => {
    return lawFirms.find((f) => f.value === id)?.label || "";
  };

  const getRoleLabel = (id: number) => {
    return roles.find((f) => f.value === id)?.label || "";
  };

  return (
    <div
      className={twMerge([
        "col-span-2 grid grid-cols-5 gap-4",
        data && "border-t border-slate-200 p-2",
      ])}
    >
      {data ? (
        <div className="flex items-center">
          <AppIcon
            className="h-4 w-4 stroke-[1.7] text-slate-500"
            icon="Landmark"
          />
          <div className="ml-2">
            <span className="whitespace-nowrap font-medium text-xs text-slate-500">
              {t("lawFirm")}
            </span>
            <div className="whitespace-nowrap text-xs text-primary">
              {getLawFirmLabel(data.tenantOrUserId)}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <FormLabel htmlFor="lawFirmId" localizedLabel="lawFirm" required />
          <FormSelect
            id="lawFirmId"
            allowClear
            showSearch
            options={lawFirms}
            value={assignment?.tenantOrUserId}
            onChange={(value) => handleInputChange("tenantOrUserId", value)}
          />
          <FormError errors={fieldErrors?.tenantOrUserId} />
        </div>
      )}
      {data ? (
        <div className="flex items-center">
          <AppIcon
            className="h-4 w-4 stroke-[1.7] text-slate-500"
            icon="Building"
          />
          <div className="ml-2">
            <span className="whitespace-nowrap font-medium text-xs text-slate-500">
              {t("role")}
            </span>
            <div className="whitespace-nowrap text-xs text-primary">
              {getRoleLabel(data.roleId)}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <FormLabel htmlFor="roleId" localizedLabel="role" required />
          <FormSelect
            id="roleId"
            allowClear
            options={roles}
            value={assignment?.roleId}
            onChange={(value) => handleInputChange("roleId", value)}
          />
          <FormError errors={fieldErrors?.roleId} />
        </div>
      )}
      {data ? (
        <div className="flex items-center">
          <AppIcon
            className="h-4 w-4 stroke-[1.7] text-slate-500"
            icon="Calendar1"
          />
          <div className="ml-2">
            <span className="whitespace-nowrap font-medium text-xs text-slate-500">
              {t("startDate")}
            </span>
            <div className="whitespace-nowrap text-xs text-primary">
              {data.startDate
                ? formatDate(
                    currentLang,
                    dayjs(data.startDate).toDate(),
                    false,
                    false
                  )
                : "-"}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <FormLabel htmlFor="startDate" localizedLabel="startDate" />
          {/* TODO: Date format will be localized. */}
          <DatePicker
            id="startDate"
            className="w-full"
            //format={info.dateFormat.toUpperCase()}
            value={assignment?.startDate ? dayjs(assignment.startDate) : null}
            onChange={(v) => handleInputChange("startDate", v)}
          />
          <FormError errors={fieldErrors?.startDate} />
        </div>
      )}
      {data ? (
        <div className="flex items-center">
          <AppIcon
            className="h-4 w-4 stroke-[1.7] text-slate-500"
            icon="CalendarRange"
          />
          <div className="ml-2">
            <span className="whitespace-nowrap font-medium text-xs text-slate-500">
              {t("endDate")}
            </span>
            <div className="whitespace-nowrap text-xs text-primary">
              {data.endDate
                ? formatDate(
                    currentLang,
                    dayjs(data.endDate).toDate(),
                    false,
                    false
                  )
                : "-"}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <FormLabel htmlFor="endDate" localizedLabel="endDate" />
          {/* TODO: Date format will be localized. */}
          <DatePicker
            id="endDate"
            className="w-full"
            //format={info.dateFormat.toUpperCase()}
            value={assignment?.endDate ? dayjs(assignment.endDate) : null}
            onChange={(v) => handleInputChange("endDate", v)}
          />
          <FormError errors={fieldErrors?.endDate} />
        </div>
      )}
      <div className="flex">
        {data ? (
          <Popconfirm
            title={t("deleteConfirmation.title")}
            description={t("deleteConfirmation.text")}
            onConfirm={() =>
              handleRemoveAssignment(data.tenantOrUserId, data.roleId)
            }
            okText={t("yes")}
            cancelText={t("no")}
            okButtonProps={{ danger: true }}
          >
            <button
              type="button"
              className="cursor-pointer text-red-600 flex items-center p-2 rounded-md hover:bg-red-200/60"
            >
              <AppIcon className="h-4 w-4" icon="Trash2" />
            </button>
          </Popconfirm>
        ) : (
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-1/2 h-[32px] mt-4"
            localizedLabel="add"
            iconDirection="left"
            icon="Plus"
            size="sm"
            onClick={handleAddAssignment}
          />
        )}
      </div>
    </div>
  );
};

export default AddEditAssignment;
