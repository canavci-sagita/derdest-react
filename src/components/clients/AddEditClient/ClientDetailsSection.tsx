"use client";

import FormLabel from "../../common/forms/FormLabel";
import FormInput from "../../common/forms/FormInput";
import FormCheck from "../../common/forms/FormCheck";
import FormError from "../../common/forms/FormError";
import { CompanyType } from "@/services/common/enums";
import { useTranslation } from "@/stores/TranslationContext";
import { twMerge } from "tailwind-merge";
import { AddEditClientDto } from "@/services/clients/clients.types";
import { ActionFormState } from "@/types/form.types";

interface ClientDetailsSectionProps {
  initialData?: AddEditClientDto | null;
  displayState: ActionFormState<AddEditClientDto>;
  selectedClientType: CompanyType;
  clearFieldError: (name: string) => void;
  setSelectedClientType: (type: CompanyType) => void;
}

const ClientDetailsSection: React.FC<ClientDetailsSectionProps> = ({
  initialData,
  displayState,
  selectedClientType,
  clearFieldError,
  setSelectedClientType,
}) => {
  const { t } = useTranslation();

  return (
    <section className="box box--stacked relative p-6 mt-6bg-white border border-slate-200 rounded-lg shadow-sm">
      <h2 className="text-md font-semibold border-b border-slate-200 mb-6">
        {t("clientDetails")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
          <FormLabel
            htmlFor="clientType"
            localizedLabel="clientType"
            required
          />
          <div className="flex items-center gap-6 mt-1">
            <FormCheck
              type="radio"
              id={CompanyType[CompanyType.Individual]}
              name="clientType"
              localizedLabel="individual"
              checked={selectedClientType === CompanyType.Individual}
              value={CompanyType.Individual}
              onChange={(e) => setSelectedClientType(Number(e.target.value))}
            />
            <FormCheck
              type="radio"
              id={CompanyType[CompanyType.Corporate]}
              name="clientType"
              localizedLabel="corporate"
              checked={selectedClientType === CompanyType.Corporate}
              value={CompanyType.Corporate}
              onChange={(e) => setSelectedClientType(Number(e.target.value))}
            />
          </div>
          <FormError errors={displayState.errors?.clientType} />
        </div>
        <div>
          <FormLabel htmlFor="firstName" localizedLabel="firstName" required />
          <FormInput
            id="firstName"
            type="text"
            className={twMerge(
              displayState.errors?.firstName && "border-red-500"
            )}
            defaultValue={
              initialData?.firstName || displayState.fields?.firstName
            }
            onChange={() => clearFieldError("firstName")}
          />
          <FormError errors={displayState.errors?.firstName} />
        </div>
        <div>
          <FormLabel htmlFor="lastName" localizedLabel="lastName" required />
          <FormInput
            id="lastName"
            type="text"
            className={twMerge(
              displayState.errors?.lastName && "border-red-500"
            )}
            defaultValue={
              initialData?.lastName || displayState.fields?.lastName
            }
            onChange={() => clearFieldError("lastName")}
          />
          <FormError errors={displayState.errors?.lastName} />
        </div>
        <div>
          <FormLabel
            htmlFor="nationalId"
            localizedLabel="nationalId"
            required
          />
          <FormInput
            id="nationalId"
            type="text"
            className={twMerge(
              displayState.errors?.nationalId && "border-red-500"
            )}
            defaultValue={
              initialData?.nationalId || displayState.fields?.nationalId
            }
            onChange={() => clearFieldError("nationalId")}
          />
          <FormError errors={displayState.errors?.nationalId} />
        </div>
      </div>
    </section>
  );
};

export default ClientDetailsSection;
