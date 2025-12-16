"use client";

import { UserAppSettingsVM } from "@/services/users/users.types";
import FormLabel from "@/components/common/forms/FormLabel";
import FormSelect from "@/components/common/forms/FormSelect";
import FormError from "@/components/common/forms/FormError";
import { FieldErrors } from "@/types/form.types";
import { useCountries } from "@/lib/hooks/tanstack/useCountries";
import { useLanguages } from "@/lib/hooks/tanstack/useLanguages";

interface AppSettingsSectionProps {
  data: UserAppSettingsVM;
  fieldErrors: FieldErrors<UserAppSettingsVM>;
  onChange: (data: UserAppSettingsVM) => void;
  clearFieldError: (name: string) => void;
}

const AppSettingsSection: React.FC<AppSettingsSectionProps> = ({
  data,
  fieldErrors,
  onChange,
  clearFieldError,
}) => {
  const { data: countries } = useCountries();
  const { data: languages } = useLanguages();

  const handleInputChange = (
    key: keyof UserAppSettingsVM,
    newValue: number
  ) => {
    const updatedData = { ...data, [key]: newValue };
    onChange(updatedData);
    clearFieldError(`appSettings.${key}`);
  };

  return (
    <section className="pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <FormLabel htmlFor="languageId" localizedLabel="language" />
          <FormSelect
            id="languageId"
            options={languages}
            allowClear
            showSearch
            value={data.languageId}
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            onChange={(value) => handleInputChange("languageId", value)}
          />
          <FormError errors={fieldErrors?.languageId} />
        </div>
        <div className="col-start-1">
          <FormLabel
            htmlFor="petitionLanguageId"
            localizedLabel="petitionLanguage"
          />
          <FormSelect
            id="petitionLanguageId"
            options={languages}
            allowClear
            showSearch
            value={data.petitionLanguageId}
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            onChange={(value) => handleInputChange("petitionLanguageId", value)}
          />
          <FormError errors={fieldErrors?.petitionLanguageId} />
        </div>
        <div className="col-start-1">
          <FormLabel
            htmlFor="jurisdictionCountryId"
            localizedLabel="jurisdictionCountry"
          />
          <FormSelect
            id="jurisdictionCountryId"
            options={countries}
            allowClear
            showSearch
            value={data.jurisdictionCountryId}
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            onChange={(value) =>
              handleInputChange("jurisdictionCountryId", value)
            }
          />
          <FormError errors={fieldErrors?.jurisdictionCountryId} />
        </div>
      </div>
    </section>
  );
};

export default AppSettingsSection;
