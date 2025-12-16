"use client";

import FormLabel from "../../common/forms/FormLabel";
import FormInput from "../../common/forms/FormInput";
import FormError from "../../common/forms/FormError";
import { useTranslation } from "@/stores/TranslationContext";
import { twMerge } from "tailwind-merge";
import { AddEditClientDto } from "@/services/clients/clients.types";
import { ActionFormState } from "@/types/form.types";

interface CompanyDetailsSectionProps {
  initialData?: AddEditClientDto | null;
  displayState: ActionFormState<AddEditClientDto>;
  clearFieldError: (name: string) => void;
}

const CompanyDetailsSection: React.FC<CompanyDetailsSectionProps> = ({
  initialData,
  displayState,
  clearFieldError,
}) => {
  const { t } = useTranslation();

  return (
    <section className="box box--stacked relative p-6 mt-6 bg-white border border-slate-200 rounded-lg shadow-sm">
      <h2 className="text-md font-semibold border-b border-slate-200 mb-6">
        {t("companyDetails")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <FormLabel
            htmlFor="companyTitle"
            localizedLabel="companyTitle"
            required
          />
          <FormInput
            id="companyTitle"
            type="text"
            className={twMerge(
              displayState.errors?.companyTitle && "border-red-500"
            )}
            defaultValue={
              initialData?.companyTitle || displayState.fields?.companyTitle
            }
            onChange={() => clearFieldError("companyTitle")}
          />
          <FormError errors={displayState.errors?.companyTitle} />
        </div>
        <div>
          <FormLabel htmlFor="taxOffice" localizedLabel="taxOffice" required />
          <FormInput
            id="taxOffice"
            type="text"
            className={twMerge(
              displayState.errors?.taxOffice && "border-red-500"
            )}
            defaultValue={
              initialData?.taxOffice || displayState.fields?.taxOffice
            }
            onChange={() => clearFieldError("taxOffice")}
          />
          <FormError errors={displayState.errors?.taxOffice} />
        </div>
      </div>
    </section>
  );
};

export default CompanyDetailsSection;
