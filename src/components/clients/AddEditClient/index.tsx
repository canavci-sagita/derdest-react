"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { useTranslation } from "@/stores/TranslationContext";
import Button from "../../common/ui/Button";
import { useActionForm } from "@/lib/hooks/useActionForm";
import {
  AddEditClientDto,
  addEditClientSchema,
} from "@/services/clients/clients.types";
import { createFormState } from "@/lib/utils/form.utils";
import { addEditClientAction } from "@/actions/clients.actions";
import { unflattenObject } from "@/lib/utils/object.utils";
import { CompanyType } from "@/services/common/enums";
import ClientDetailsSection from "./ClientDetailsSection";
import CompanyDetailsSection from "./CompanyDetailsSection";
import ContactAddressSection from "./ContactAddressSection";
import ContractFilesSection from "./ContractFilesSection";
import { useRouter } from "next/navigation";
import { App } from "antd";
import { useCountryCity } from "@/lib/hooks/useCountryCity";
import { AddEditPhoneNoDto } from "@/services/common/AddEditPhoneNoDto";

const initialState = createFormState<AddEditClientDto>();

interface AddEditClientProps {
  initialData?: AddEditClientDto | null;
}

const AddEditClient: React.FC<AddEditClientProps> = ({ initialData }) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const router = useRouter();

  const { countries, cities, isLoadingCities, handleCountryChange } =
    useCountryCity();

  const [serverState, formAction, isPending] = useActionState(
    addEditClientAction,
    initialState
  );
  const { displayState, setDisplayState, clearFieldError } = useActionForm(
    serverState,
    initialState
  );

  const [selectedClientType, setSelectedClientType] = useState<CompanyType>(
    initialData?.clientType ?? CompanyType.Individual
  );

  const [selectValues, setSelectValues] = useState<{
    country: string | null;
    city: string | null;
    phoneNo: AddEditPhoneNoDto | null;
  }>({
    country: initialData?.address?.country || null,
    city: initialData?.address?.city || null,
    phoneNo: initialData?.phoneNo || null,
  });

  const onCountrySelect = (countryLabel: string | null) => {
    clearFieldError("address.country");
    clearFieldError("address.city");
    setSelectValues((prev) => ({ ...prev, country: countryLabel, city: null }));
    handleCountryChange(countryLabel);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const flatRawData = Object.fromEntries(formData);
    const combinedData = {
      ...flatRawData,
      "address.country": selectValues.country,
      "address.city": selectValues.city,
      "phoneNo.countryCode": selectValues.phoneNo?.countryCode,
      "phoneNo.value": selectValues.phoneNo?.value,
    };

    const nestedRawData = unflattenObject(combinedData);

    const localizedSchema = addEditClientSchema(t);
    const validation = localizedSchema.safeParse(nestedRawData);

    if (!validation.success) {
      setDisplayState({
        status: "error",
        errors: validation.error.format(),
        fields: nestedRawData,
      });
      return;
    }

    formData.set("address.country", selectValues.country || "");
    formData.set("address.city", selectValues.city || "");
    formData.set(
      "phoneNo.countryCode",
      selectValues.phoneNo?.countryCode || ""
    );
    formData.set("phoneNo.value", selectValues.phoneNo?.value || "");

    startTransition(() => formAction(formData));
  };

  useEffect(() => {
    if (initialData) {
      setSelectValues({
        country: initialData.address?.country || null,
        city: initialData.address?.city || null,
        phoneNo: initialData.phoneNo || null,
      });
      if (initialData.address?.country) {
        handleCountryChange(initialData.address.country);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (displayState.status === "success") {
      message.success(displayState.message);

      if (!!initialData) {
        router.push("/clients");
        return;
      }

      const newClientId = displayState.result;
      if (newClientId) {
        router.push(`/clients/${newClientId}`);
      } else {
        router.push("/clients");
      }
    } else if (displayState.status === "error" && displayState.message) {
      message.error(displayState.message);
    }
  }, [
    displayState.result,
    displayState.status,
    displayState.message,
    initialData,
    message,
    router,
  ]);

  return (
    <>
      <div className="mb-3 p-4 rounded-md shadow-md bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {t("addClient")}
            </h1>
            <p className="mt-1 text-slate-600">{t("fillInClientForm.add")}</p>
          </div>
          <Button
            type="button"
            variant="outline-primary"
            className="text-sm font-medium text-slate-600"
            localizedLabel="backToClients"
            iconDirection="left"
            icon="ArrowLeft"
            onClick={() => router.push("/clients")}
          />
        </div>
      </div>
      <main className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-24">
        <form
          id="client-form"
          className="lg:col-span-3"
          onSubmit={handleSubmit}
        >
          {initialData && (
            <input type="hidden" name="id" value={initialData.id} />
          )}
          <ClientDetailsSection
            initialData={initialData}
            selectedClientType={selectedClientType}
            displayState={displayState}
            clearFieldError={clearFieldError}
            setSelectedClientType={setSelectedClientType}
          />
          {(initialData?.clientType === CompanyType.Corporate ||
            selectedClientType === CompanyType.Corporate) && (
            <CompanyDetailsSection
              initialData={initialData}
              displayState={displayState}
              clearFieldError={clearFieldError}
            />
          )}
          <ContactAddressSection
            initialData={initialData}
            displayState={displayState}
            clearFieldError={clearFieldError}
            countries={countries}
            cities={cities}
            selectValues={selectValues}
            handleCountryChange={onCountrySelect}
            isLoadingCities={isLoadingCities}
            setSelectValues={setSelectValues}
          />
        </form>
        <ContractFilesSection
          initEmpty={!initialData}
          clientId={initialData?.id}
        />
      </main>

      <footer className="sticky bottom-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 bg-white/80 dark:bg-darkmode-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-darkmode-700 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] rounded-t-lg">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline-primary"
              localizedLabel="cancel"
              onClick={() => router.push("/clients")}
            />
            <Button
              type="submit"
              variant="primary"
              iconDirection="left"
              icon="Save"
              disabled={isPending}
              localizedLabel={isPending ? "saving" : "save"}
              form="client-form"
            />
          </div>
        </div>
      </footer>
    </>
  );
};

export default AddEditClient;
