"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { App } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import { useActionForm } from "@/lib/hooks/useActionForm";
import {
  AddEditUserProfileDto,
  addEditUserProfileSchema,
} from "@/services/users/users.types";
import { createFormState } from "@/lib/utils/form.utils";
import { useCountryCity } from "@/lib/hooks/useCountryCity";

import Button from "@/components/common/ui/Button";
import FormLabel from "@/components/common/forms/FormLabel";
import FormInput from "@/components/common/forms/FormInput";
import FormSelect from "@/components/common/forms/FormSelect";
import FormError from "@/components/common/forms/FormError";
import AppIcon from "@/components/common/ui/AppIcon";
import { AddEditAddressDto } from "@/services/common/AddEditAddressDto";
import { updateProfileAction } from "@/actions/users.actions";
import { useLanguages } from "@/lib/hooks/tanstack/useLanguages";

interface ProfileFormProps {
  user: {
    fullName: string;
    email: string;
    role: string;
    profile: AddEditUserProfileDto;
  };
}

const initialState = createFormState<AddEditUserProfileDto>();

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const {
    countries,
    cities,
    isLoadingCountries,
    isLoadingCities,
    handleCountryChange,
  } = useCountryCity();
  const { data: languages = [], isLoading: isLoadingLanguages } =
    useLanguages();

  const [serverState, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );
  const { displayState, setDisplayState, clearFieldError } = useActionForm(
    serverState,
    initialState
  );

  const [data, setData] = useState<AddEditUserProfileDto>(user.profile);

  const onCountrySelect = (countryLabel: string | null) => {
    clearFieldError("address.country");
    clearFieldError("address.city");

    handleAddressChange("country", countryLabel);
    handleAddressChange("city", undefined);
    handleCountryChange(countryLabel);
  };

  const handleInputChange = (
    key: keyof AddEditUserProfileDto,
    value: unknown
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
    clearFieldError(key);
  };

  const handleAddressChange = (
    key: keyof AddEditAddressDto,
    value: unknown
  ) => {
    setData((prev) => ({
      ...(prev || {}),
      address: {
        ...(prev?.address ?? {}),
        [key]: value,
      } as AddEditAddressDto,
    }));
    clearFieldError(`address.${String(key)}`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = addEditUserProfileSchema(t).safeParse(data);

    if (!validation.success) {
      setDisplayState({
        status: "error",
        errors: validation.error.format(),
        fields: data,
      });
      return;
    }

    startTransition(() => formAction(validation.data));
  };

  useEffect(() => {
    if (countries.length > 0 && data?.address?.country) {
      handleCountryChange(data.address.country);
    }
  }, [countries, data?.address?.country]);

  useEffect(() => {
    if (displayState.status === "success") {
      message.success(displayState.message);
    } else if (displayState.status === "error" && displayState.message) {
      message.error(displayState.message);
    }
  }, [displayState, message]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-500">
              <AppIcon icon="Briefcase" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {t("accountDetails")}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t("accountDetails.hint")}
              </p>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <FormLabel htmlFor="nationalId" localizedLabel="nationalId" />
              <FormInput
                id="nationalId"
                defaultValue={data?.nationalId || ""}
                onBlur={(e) => handleInputChange("nationalId", e.target.value)}
                onChange={() => clearFieldError("nationalId")}
              />
              <FormError errors={displayState.errors?.nationalId} />
            </div>
            <div>
              <FormLabel
                htmlFor="barRegistrationNo"
                localizedLabel="barRegistrationNo"
              />
              <FormInput
                id="barRegistrationNo"
                defaultValue={data?.barRegistrationNo || ""}
                onBlur={(e) =>
                  handleInputChange("barRegistrationNo", e.target.value)
                }
                onChange={() => clearFieldError("barRegistrationNo")}
              />
              <FormError errors={displayState.errors?.barRegistrationNo} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-500">
              <AppIcon icon="Settings" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {t("appSettings")}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t("appSettings.hint")}
              </p>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <FormLabel htmlFor="languageId" localizedLabel="language" />
              <FormSelect
                id="languageId"
                options={languages}
                value={data?.languageId}
                allowClear
                showSearch
                loading={isLoadingLanguages}
                onChange={(v) => handleInputChange("languageId", v)}
              />
              <FormError errors={displayState.errors?.languageId} />
            </div>
            <div>
              <FormLabel
                htmlFor="jurisdictionCountryId"
                localizedLabel="jurisdictionCountry"
              />
              <FormSelect
                id="jurisdictionCountryId"
                options={countries}
                fieldNames={{ label: "label", value: "value" }}
                value={data?.jurisdictionCountryId}
                showSearch
                allowClear
                loading={isLoadingCountries}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={(val) =>
                  handleInputChange("jurisdictionCountryId", val)
                }
              />
              <FormError errors={displayState.errors?.jurisdictionCountryId} />
            </div>
            <div>
              <FormLabel
                htmlFor="petitionLanguageId"
                localizedLabel="petitionLanguage"
              />
              <FormSelect
                id="petitionLanguageId"
                options={languages}
                value={data?.petitionLanguageId}
                showSearch
                allowClear
                loading={isLoadingLanguages}
                onChange={(val) => handleInputChange("petitionLanguageId", val)}
              />
              <FormError errors={displayState.errors?.petitionLanguageId} />
            </div>
          </div>
        </div>
        <div className="col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-500">
              <AppIcon icon="MapPin" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {t("address")}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t("address.hint")}
              </p>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <FormLabel htmlFor="addressLine1" localizedLabel="addressLine1" />
              <FormInput
                id="addressLine1"
                defaultValue={data?.address?.addressLine1 || ""}
                onBlur={(e) =>
                  handleAddressChange("addressLine1", e.target.value)
                }
                onChange={() => clearFieldError("address.addressLine1")}
              />
              <FormError errors={displayState.errors?.address?.addressLine1} />
            </div>
            <div className="md:col-span-2">
              <FormLabel htmlFor="addressLine2" localizedLabel="addressLine2" />
              <FormInput
                id="addressLine2"
                defaultValue={data?.address?.addressLine2 || ""}
                onBlur={(e) =>
                  handleAddressChange("addressLine2", e.target.value)
                }
                onChange={() => clearFieldError("address.addressLine2")}
              />
              <FormError errors={displayState.errors?.address?.addressLine2} />
            </div>
            <div className="col-start-1">
              <FormLabel htmlFor="country" localizedLabel="country" />
              <FormSelect
                id="country"
                options={countries}
                fieldNames={{ label: "label", value: "label" }}
                value={data?.address?.country}
                showSearch
                allowClear
                loading={isLoadingCountries}
                onChange={onCountrySelect}
              />
              <FormError errors={displayState.errors?.address?.country} />
            </div>
            <div>
              <FormLabel htmlFor="city" localizedLabel="city" />
              <FormSelect
                id="city"
                options={cities}
                fieldNames={{ value: "label" }}
                showSearch
                allowClear
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                disabled={!data?.address?.country || isLoadingCities}
                value={data?.address?.city || null}
                loading={isLoadingCities}
                onChange={(v) => handleAddressChange("city", v)}
              />
              <FormError errors={displayState.errors?.address?.city} />
            </div>
            <div>
              <FormLabel htmlFor="state" localizedLabel="state" />
              <FormInput
                id="state"
                defaultValue={data?.address?.state || ""}
                onBlur={(e) => handleAddressChange("state", e.target.value)}
                onChange={() => clearFieldError("address.state")}
              />
              <FormError errors={displayState.errors?.address?.state} />
            </div>
            <div>
              <FormLabel htmlFor="zipCode" localizedLabel="zipCode" />
              <FormInput
                id="zipCode"
                defaultValue={data?.address?.zipCode || ""}
                onBlur={(e) => handleAddressChange("zipCode", e.target.value)}
                onChange={() => clearFieldError("address.zipCode")}
              />
              <FormError errors={displayState.errors?.address?.zipCode} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          className="w-full sm:w-auto px-8"
          loading={isPending}
          localizedLabel={isPending ? "saving" : "saveChanges"}
          icon="Save"
          iconDirection="left"
        />
      </div>
    </form>
  );
};

export default ProfileForm;
