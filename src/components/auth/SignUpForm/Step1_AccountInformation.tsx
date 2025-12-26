"use client";

import { useTranslation } from "@/stores/TranslationContext";
import { SignUpRequest } from "@/services/auth/auth.types";
import { FieldErrors } from "@/types/form.types";
import { CountryLookupResponse } from "@/services/lookups/lookups.types";
import FormLabel from "@/components/common/forms/FormLabel";
import FormInput from "@/components/common/forms/FormInput";
import FormError from "@/components/common/forms/FormError";
import FormPhone from "@/components/common/forms/FormPhone";
import FormSelect from "@/components/common/forms/FormSelect";
import { twMerge } from "tailwind-merge";
import AppIcon from "@/components/common/ui/AppIcon";
import { ACCOUNT_TYPE_CONSTANTS } from "@/lib/constants/account-type.constants";
import { AddEditPhoneNoDto } from "@/services/common/AddEditPhoneNoDto";

interface Step1_AccountInformationProps {
  data: SignUpRequest;
  errors: FieldErrors<SignUpRequest> | undefined;
  countries: CountryLookupResponse[];
  clearFieldError: (name: string) => void;
  onChange: (
    key: keyof SignUpRequest,
    value: string | number | boolean | AddEditPhoneNoDto | null
  ) => void;
}

const Step1_AccountInformation: React.FC<Step1_AccountInformationProps> = ({
  data,
  errors,
  onChange,
  clearFieldError,
  countries,
}) => {
  const { t } = useTranslation();

  const handleAccountTypeChange = (isCompany: boolean) => {
    onChange("isCompany", isCompany);
  };

  const handleInputChange = (
    field: keyof SignUpRequest,
    value: string | number | AddEditPhoneNoDto | null
  ) => {
    onChange(field, value);
    clearFieldError(field);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <input
            type="radio"
            id="singleUser"
            name="account-type"
            className="peer sr-only"
            checked={!data.isCompany}
            onChange={() => handleAccountTypeChange(false)}
          />
          <label
            htmlFor="singleUser"
            className="px-2 py-3 block rounded-lg cursor-pointer border border-slate-200 peer-checked:border-theme-1 peer-checked:shadow-lg peer-checked:shadow-theme-1/50"
          >
            <div className="flex justify-between">
              <span className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full">
                <AppIcon icon="User" className="w-5 h-5 text-slate-600" />
              </span>
              <span className="">
                <span className="block font-semibold text-slate-800">
                  {t(ACCOUNT_TYPE_CONSTANTS.SINGLE_USER)}
                </span>
                <span className="block text-xs text-slate-500">
                  {t("singleUser.hint")}
                </span>
              </span>
            </div>
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="lawFirm"
            name="account-type"
            className="peer sr-only"
            checked={data.isCompany}
            onChange={() => handleAccountTypeChange(true)}
          />
          <label
            htmlFor="lawFirm"
            className="px-2 py-3 block rounded-lg cursor-pointer border border-slate-200 peer-checked:border-theme-1 peer-checked:shadow-lg peer-checked:shadow-theme-1/50"
          >
            <div className="flex justify-between">
              <span className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full">
                <AppIcon icon="Landmark" className="w-5 h-5 text-slate-600" />
              </span>
              <span className="">
                <span className="block font-semibold text-slate-800">
                  {t("lawFirm")}
                </span>
                <span className="block text-xs text-slate-500">
                  {t("lawFirm.hint")}
                </span>
              </span>
            </div>
          </label>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.isCompany && (
          <>
            <div className="col-span-2">
              <FormLabel
                htmlFor="companyTitle"
                localizedLabel="companyTitle"
                required
              />
              <FormInput
                id="companyTitle"
                value={data.companyTitle || ""}
                onBlur={(e) =>
                  handleInputChange("companyTitle", e.target.value)
                }
              />
              <FormError errors={errors?.companyTitle} />
            </div>
            <div>
              <FormLabel htmlFor="taxNo" localizedLabel="taxNo" />
              <FormInput
                id="taxNo"
                value={data.taxId || ""}
                onBlur={(e) => handleInputChange("taxId", e.target.value)}
              />
              <FormError errors={errors?.taxId} />
            </div>
          </>
        )}
        {!data.isCompany && (
          <div>
            <FormLabel htmlFor="nationalId" localizedLabel="nationalId" />
            <FormInput
              id="nationalId"
              defaultValue={data.nationalId || ""}
              onBlur={(e) => handleInputChange("nationalId", e.target.value)}
            />
            <FormError errors={errors?.nationalId} />
          </div>
        )}
        <div className="col-start-1">
          <FormLabel htmlFor="firstName" localizedLabel="firstName" required />
          <FormInput
            id="firstName"
            defaultValue={data.firstName}
            onBlur={(e) => handleInputChange("firstName", e.target.value)}
          />
          <FormError errors={errors?.firstName} />
        </div>
        <div>
          <FormLabel htmlFor="lastName" localizedLabel="lastName" required />
          <FormInput
            id="lastName"
            defaultValue={data.lastName}
            onBlur={(e) => handleInputChange("lastName", e.target.value)}
          />
          <FormError errors={errors?.lastName} />
        </div>
        <div className="col-start-1">
          <FormLabel htmlFor="email" localizedLabel="email" required />
          <FormInput
            id="email"
            type="email"
            defaultValue={data.email}
            onBlur={(e) => handleInputChange("email", e.target.value)}
          />
          <FormError errors={errors?.email} />
        </div>
        <div className="col-start-1">
          <FormLabel htmlFor="password" localizedLabel="password" required />
          <FormInput
            id="password"
            type="password"
            defaultValue={data.password}
            onBlur={(e) => handleInputChange("password", e.target.value)}
          />
          <FormError errors={errors?.password} />
        </div>
        <div>
          <FormLabel
            htmlFor="confirmPassword"
            localizedLabel="confirmPassword"
            required
          />
          <FormInput
            id="confirmPassword"
            type="password"
            defaultValue={data.confirmPassword}
            onBlur={(e) => handleInputChange("confirmPassword", e.target.value)}
          />
          <FormError errors={errors?.confirmPassword} />
        </div>
        <div>
          <FormLabel htmlFor="country" localizedLabel="country" required />
          <FormSelect
            id="country"
            options={countries}
            fieldNames={{ label: "label", value: "value" }}
            value={data.countryId || null}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            onChange={(v) => handleInputChange("countryId", v)}
          />
          <FormError errors={errors?.countryId} />
        </div>
        <div>
          <FormLabel htmlFor="phone" localizedLabel="phoneNo" />
          <FormPhone
            value={data.phoneNo}
            className={twMerge(errors?.phoneNo && "border-red-500")}
            onChange={(v) => handleInputChange("phoneNo", v)}
          />
          <FormError errors={errors?.phoneNo} />
        </div>
      </div>
    </div>
  );
};

export default Step1_AccountInformation;
