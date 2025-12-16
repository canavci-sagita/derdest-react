import { LookupResponse } from "@/services/common/LookupResponse";
import {
  AddEditAssignmentDto,
  RoleAssigmentsVM,
} from "@/services/users/users.types";
import { FieldErrors } from "@/types/form.types";
import { useEffect, useState } from "react";
import { useTranslation } from "@/stores/TranslationContext";
import {
  getAllLawFirmsForLookupAction,
  getAllRolesAction,
} from "@/actions/lookups.actions";
import FormError from "@/components/common/forms/FormError";
import FormLabel from "@/components/common/forms/FormLabel";
import FormSelect from "@/components/common/forms/FormSelect";
import { ACCOUNT_TYPE_CONSTANTS } from "@/lib/constants/account-type.constants";
import AddEditAssignment from "./AddEditAssignment";

interface RolesAndAssignmentsSectionProps {
  data: RoleAssigmentsVM;
  prepopulatedRoles?: LookupResponse[];
  fieldErrors: FieldErrors<RoleAssigmentsVM> | undefined;
  onChange: (data: RoleAssigmentsVM) => void;
  clearFieldError: (name: string) => void;
}
const RoleAssignmentsSection: React.FC<RolesAndAssignmentsSectionProps> = ({
  data,
  prepopulatedRoles = [],
  fieldErrors,
  onChange,
  clearFieldError,
}) => {
  const { t } = useTranslation();

  const [roles, setRoles] = useState<LookupResponse[]>(prepopulatedRoles);
  const [lawFirms, setLawFirms] = useState<LookupResponse[]>([]);

  const accountTypeOptions = [
    {
      label: t(ACCOUNT_TYPE_CONSTANTS.SINGLE_USER),
      value: ACCOUNT_TYPE_CONSTANTS.SINGLE_USER,
    },
    {
      label: t(ACCOUNT_TYPE_CONSTANTS.LAW_FIRM_USER),
      value: ACCOUNT_TYPE_CONSTANTS.LAW_FIRM_USER,
    },
  ];

  const handleInputChange = (
    key: keyof RoleAssigmentsVM,
    newValue: string | number | boolean
  ) => {
    const updatedData = { ...data, [key]: newValue };
    onChange(updatedData);
    clearFieldError(`roleAssignments.${key}`);

    if (key === "accountType") {
      clearFieldError("roleAssignments.roleId");
    }
  };

  const handleAddAssignment = (newAssignment: AddEditAssignmentDto) => {
    const updatedData = {
      ...data,
      assignments: [...data.assignments, newAssignment],
    };
    onChange(updatedData);
    clearFieldError("roleAssignments.assignments");
  };

  const handleRemoveAssignment = (lawFirmId: number, roleId: number) => {
    const updatedData = {
      ...data,
      assignments: data.assignments.filter(
        (a) => !(a.tenantOrUserId === lawFirmId && a.roleId === roleId)
      ),
    };
    onChange(updatedData);
  };

  useEffect(() => {
    if (data.accountType) {
      getAllRolesAction(
        data.accountType === ACCOUNT_TYPE_CONSTANTS.SINGLE_USER
      ).then((res) => {
        if (res) {
          setRoles(res);
        }
      });

      if (data.accountType === ACCOUNT_TYPE_CONSTANTS.LAW_FIRM_USER) {
        getAllLawFirmsForLookupAction().then((res) => setLawFirms(res));
      }
    }
  }, [data.accountType]);

  return (
    <section className="pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <FormLabel
            htmlFor="accountType"
            localizedLabel="accountType"
            required
          />
          <FormSelect
            id="accountType"
            allowClear
            options={accountTypeOptions}
            value={data.accountType}
            onChange={(v) => handleInputChange("accountType", v)}
          />
          <FormError errors={fieldErrors?.accountType} />
        </div>
        {data.accountType === ACCOUNT_TYPE_CONSTANTS.SINGLE_USER && (
          <div className="col-start-1">
            <FormLabel htmlFor="roleId" localizedLabel="role" required />
            <FormSelect
              id="roleId"
              allowClear
              options={roles}
              value={data.roleId}
              onChange={(v) => handleInputChange("roleId", v)}
            />
            <FormError errors={fieldErrors?.roleId} />
          </div>
        )}
        {data.accountType === ACCOUNT_TYPE_CONSTANTS.LAW_FIRM_USER && (
          <div className="col-span-2">
            <AddEditAssignment
              roles={roles}
              lawFirms={lawFirms}
              clearFieldError={clearFieldError}
              onAddAssignment={handleAddAssignment}
            />
          </div>
        )}
      </div>
      {data.accountType === ACCOUNT_TYPE_CONSTANTS.LAW_FIRM_USER && (
        <div className="mt-8">
          <FormError errors={fieldErrors?.assignments} />
          {data.assignments.map((a, i) => (
            <AddEditAssignment
              key={i}
              onRemoveAssignment={handleRemoveAssignment}
              lawFirms={lawFirms}
              data={a}
              roles={roles}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RoleAssignmentsSection;
