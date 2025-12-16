"use client";

import { useTranslation } from "@/stores/TranslationContext";
import { AccountDetailsVM } from "@/services/users/users.types";
import { FieldErrors } from "@/types/form.types";
import FormLabel from "@/components/common/forms/FormLabel";
import FormInput from "@/components/common/forms/FormInput";
import FormError from "@/components/common/forms/FormError";
import { Switch } from "antd";

interface AccountDetailsSectionProps {
  data: AccountDetailsVM;
  isEditMode: boolean;
  fieldErrors: FieldErrors<AccountDetailsVM> | undefined;
  onChange: (data: AccountDetailsVM) => void;
  setFieldError: (fieldName: string, message: string) => void;
  clearFieldError: (name: string) => void;
}

const AccountDetailsSection: React.FC<AccountDetailsSectionProps> = ({
  data,
  isEditMode,
  fieldErrors,
  onChange,
  setFieldError,
  clearFieldError,
}) => {
  const { t } = useTranslation();

  const updateData = (
    key: keyof AccountDetailsVM,
    newValue: string | number | boolean
  ) => {
    const updatedData = { ...data, [key]: newValue };
    onChange(updatedData);
  };

  const handleInputChange = (
    key: keyof AccountDetailsVM,
    newValue: string | number | boolean
  ) => {
    updateData(key, newValue);
    clearFieldError(`accountDetails.${key}`);
  };

  const handlePasswordCompare = () => {
    const { password, confirmPassword } = data;
    if (password !== confirmPassword) {
      setFieldError("accountDetails.confirmPassword", t("passwordMismatch"));
    } else {
      clearFieldError("accountDetails.confirmPassword");
    }
  };

  return (
    <section className="pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <FormLabel htmlFor="firstName" localizedLabel="firstName" required />
          <FormInput
            id="firstName"
            type="text"
            defaultValue={data.firstName}
            onBlur={(e) => handleInputChange("firstName", e.target.value)}
            onChange={() => clearFieldError("firstName")}
          />
          <FormError errors={fieldErrors?.firstName} />
        </div>
        <div>
          <FormLabel htmlFor="lastName" localizedLabel="lastName" required />
          <FormInput
            id="lastName"
            type="text"
            defaultValue={data.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
          <FormError errors={fieldErrors?.lastName} />
        </div>
        <div>
          <FormLabel htmlFor="email" localizedLabel="email" required />
          <FormInput
            id="email"
            name="email"
            type="email"
            defaultValue={data.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <FormError errors={fieldErrors?.email} />
        </div>
        {!isEditMode && (
          <>
            <div className="sm:col-start-1">
              <FormLabel
                htmlFor="password"
                localizedLabel="password"
                required
              />
              <FormInput
                id="password"
                name="password"
                type="password"
                defaultValue={data.password || ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
              <FormError errors={fieldErrors?.password} />
            </div>
            <div>
              <FormLabel
                htmlFor="confirmPassword"
                localizedLabel="confirmPassword"
                required
              />
              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                defaultValue={data.confirmPassword || ""}
                onBlur={handlePasswordCompare}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
              />
              <FormError errors={fieldErrors?.confirmPassword} />
            </div>
          </>
        )}
        <div className="col-start-1">
          <FormLabel htmlFor="nationalId" localizedLabel="nationalId" />
          <FormInput
            id="nationalId"
            name="nationalId"
            type="text"
            defaultValue={data.nationalId || ""}
            onChange={(e) => handleInputChange("nationalId", e.target.value)}
          />
          <FormError errors={fieldErrors?.nationalId} />
        </div>
        <div>
          <FormLabel
            htmlFor="barRegistrationNo"
            localizedLabel="barRegistrationNo"
          />
          <FormInput
            id="barRegistrationNo"
            name="barRegistrationNo"
            type="text"
            defaultValue={data.barRegistrationNo || ""}
            onChange={(e) =>
              handleInputChange("barRegistrationNo", e.target.value)
            }
          />
          <FormError errors={fieldErrors?.barRegistrationNo} />
        </div>
        <div className="sm:col-span-2 grid grid-cols-2 gap-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {t("accountStatus")}
            </span>
            <Switch
              checked={data?.isActive}
              checkedChildren={t("active")}
              unCheckedChildren={t("passive")}
              onChange={(e) => handleInputChange("isActive", e)}
            />
          </div>
          <div className="col-start-1 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {t("emailConfirmed")}
            </span>
            <Switch
              checked={data?.emailConfirmed}
              checkedChildren={t("yes")}
              unCheckedChildren={t("no")}
              onChange={(e) => handleInputChange("emailConfirmed", e)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountDetailsSection;
