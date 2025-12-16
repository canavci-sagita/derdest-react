"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { App, Tabs, TabsProps, Tooltip } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import { useActionForm } from "@/lib/hooks/useActionForm";
import { addEditUserAction } from "@/actions/users.actions";
import {
  AccountDetailsVM,
  AddEditUserVM,
  addEditUserVMSchema,
  RoleAssigmentsVM,
  UserAppSettingsVM,
  UserContactAddressVM,
} from "@/services/users/users.types";
import { createFormState } from "@/lib/utils/form.utils";
import { unflattenObject } from "@/lib/utils/object.utils";
import { LookupResponse } from "@/services/common/LookupResponse";
import Button from "@/components/common/ui/Button";
import { useRouter } from "next/navigation";
import AccountDetailsSection from "./AccountDetailsSection";
import AppSettingsSection from "./AppSettingsSection";
import ContactAddressSection from "./ContactAddressSection";
import { ACCOUNT_TYPE_CONSTANTS } from "@/lib/constants/account-type.constants";
import RoleAssignmentsSection from "./RoleAssignmentsSection";
import { twMerge } from "tailwind-merge";
import AppIcon from "@/components/common/ui/AppIcon";
import { collectAllErrorMessages } from "@/lib/utils/form.utils";
import { FieldErrors } from "@/types/form.types";

const emptyUser: AddEditUserVM = {
  accountDetails: {
    barRegistrationNo: "",
    email: "",
    emailConfirmed: false,
    firstName: "",
    isActive: false,
    lastName: "",
    nationalId: "",
    confirmPassword: "",
    password: "",
  },
  appSettings: {
    jurisdictionCountryId: null,
    languageId: null,
    petitionLanguageId: null,
  },
  contactAddress: {
    phoneNo: {
      countryCode: null,
      value: "",
    },
    address: {
      city: null,
      country: null,
      addressLine1: "",
      addressLine2: "",
      state: "",
      zipCode: "",
    },
  },
  roleAssignments: {
    accountType: null,
    assignments: [],
    roleId: null,
  },
  id: undefined,
};

const TAB_KEYS = {
  ACCOUNT_DETAILS: "account--details",
  ROLE_ASSIGNMENTS: "role-assignments",
  CONTACT_ADDRESS: "contact-address",
  APP_SETTINGS: "app-settings",
};

interface AddEditUserProps {
  initialData?: AddEditUserVM | null;
  roles?: LookupResponse[];
}

const renderTabLabel = (title: string, fieldErrors: FieldErrors<unknown>) => {
  const hasError = !!fieldErrors;
  const errors = collectAllErrorMessages(fieldErrors);
  return (
    <div className="flex items-center">
      <span className={twMerge(hasError && "text-red-500")}>{title}</span>
      {hasError && (
        <Tooltip
          title={errors.map((m, i) => (
            <p key={i}>{m}</p>
          ))}
          color="red"
        >
          <AppIcon
            className="w-4 h-4 text-red-500 stroke-[1.5] ml-1"
            icon="Info"
          />
        </Tooltip>
      )}
    </div>
  );
};

const initialState = createFormState<AddEditUserVM>();

const AddEditUser: React.FC<AddEditUserProps> = ({ initialData, roles }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { message } = App.useApp();

  const isEditMode = !!initialData;

  const [serverState, formAction, isPending] = useActionState(
    addEditUserAction,
    initialState
  );
  const { displayState, setDisplayState, clearFieldError, setFieldError } =
    useActionForm(serverState, initialState);

  const [activeTab, setActiveTab] = useState(TAB_KEYS.ACCOUNT_DETAILS);
  const [data, setData] = useState<AddEditUserVM>(initialData || emptyUser);

  const handleAccountDetailsChange = (accountDetails: AccountDetailsVM) => {
    setData((prev) => ({
      ...prev,
      accountDetails: accountDetails,
    }));
  };

  const handleRoleAssignmentsChange = (roleAssignments: RoleAssigmentsVM) => {
    setData((prev) => ({
      ...prev,
      roleAssignments: roleAssignments,
    }));
  };

  const handleContactAddressChange = (contactAddress: UserContactAddressVM) => {
    setData((prev) => ({
      ...prev,
      contactAddress: contactAddress,
    }));
  };

  const handleAppSettingsChange = (appSettings: UserAppSettingsVM) => {
    setData((prev) => ({
      ...prev,
      appSettings: appSettings,
    }));
  };

  //TODO: All form submit will be converted to this logic. Form and data will be handled like this.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = addEditUserVMSchema(t).safeParse(data);

    if (!validation.success) {
      setDisplayState({
        status: "error",
        errors: validation.error.format(),
        fields: data,
      });
      return;
    }

    switch (data.roleAssignments.accountType) {
      case ACCOUNT_TYPE_CONSTANTS.SINGLE_USER:
        data.roleAssignments.assignments = [];
        break;
      case ACCOUNT_TYPE_CONSTANTS.LAW_FIRM_USER:
        data.roleAssignments.roleId = null;
        break;
    }

    const nestedRawData = unflattenObject(data);
    const formData = new FormData();
    Object.entries(nestedRawData).forEach(([key, value]) => {
      if (key !== "assignments" && value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });

    startTransition(() => formAction(data));
  };

  const items: TabsProps["items"] = [
    {
      key: TAB_KEYS.ACCOUNT_DETAILS,
      label: renderTabLabel(
        t("accountDetails"),
        displayState?.errors?.accountDetails
      ),
      children: (
        <AccountDetailsSection
          data={data?.accountDetails}
          isEditMode={!!initialData?.id}
          fieldErrors={displayState.errors?.accountDetails}
          onChange={handleAccountDetailsChange}
          setFieldError={(f, m) => setFieldError(f, m)}
          clearFieldError={clearFieldError}
        />
      ),
    },
    {
      key: TAB_KEYS.ROLE_ASSIGNMENTS,
      label: renderTabLabel(
        t("roleOrAssignments"),
        displayState?.errors?.roleAssignments
      ),
      children: (
        <RoleAssignmentsSection
          data={data?.roleAssignments ?? []}
          prepopulatedRoles={roles}
          fieldErrors={displayState?.errors?.roleAssignments}
          onChange={handleRoleAssignmentsChange}
          clearFieldError={clearFieldError}
        />
      ),
    },
    {
      key: "contact-address",
      label: renderTabLabel(
        t("contactAndAddress"),
        displayState?.errors?.contactAddress
      ),
      children: (
        <ContactAddressSection
          data={data?.contactAddress}
          fieldErrors={displayState?.errors?.contactAddress}
          onChange={handleContactAddressChange}
          clearFieldError={clearFieldError}
        />
      ),
    },
    {
      key: "app-settings",
      label: renderTabLabel(
        t("appSettings"),
        displayState?.errors?.appSettings
      ),
      children: (
        <AppSettingsSection
          data={data.appSettings}
          fieldErrors={displayState?.errors?.appSettings}
          onChange={handleAppSettingsChange}
          clearFieldError={clearFieldError}
        />
      ),
    },
  ];

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (displayState.status === "success") {
      message.success(displayState.message);
      router.push("/users");
    } else if (displayState.status === "error" && displayState.message) {
      message.error(displayState.message);
    }
  }, [displayState, message, router]);

  return (
    <form onSubmit={handleSubmit}>
      {isEditMode && (
        <input type="hidden" name="id" defaultValue={initialData?.id ?? ""} />
      )}
      <main className="box box--stacked p-4">
        <div className="grid grid-cols-3 md:min-h-[422px]">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items}
            className="pb-4 col-span-2"
          />
        </div>
        <div className="grid grid-cols-3 mt-4">
          <div className="col-start-2 p-4 py-0 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline-primary"
              localizedLabel="cancel"
              onClick={() => router.back()}
            />
            <Button
              type="submit"
              variant="primary"
              loading={isPending}
              localizedLabel={isPending ? t("saving") : t("save")}
              iconDirection="left"
              icon="Save"
            />
          </div>
        </div>
      </main>
    </form>
  );
};

export default AddEditUser;
