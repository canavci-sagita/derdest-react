"use client";

import FormLabel from "../../common/forms/FormLabel";
import FormInput from "../../common/forms/FormInput";
import FormSelect from "../../common/forms/FormSelect";
import FormError from "../../common/forms/FormError";
import { useTranslation } from "@/stores/TranslationContext";
import { twMerge } from "tailwind-merge";
import { LookupResponse } from "@/services/common/LookupResponse";
import FormPhone from "@/components/common/forms/FormPhone";
import { CountryLookupResponse } from "@/services/lookups/lookups.types";
import { AddEditClientDto } from "@/services/clients/clients.types";
import { AddEditPhoneNoDto } from "@/services/common/AddEditPhoneNoDto";
import { ActionFormState } from "@/types/form.types";

interface ContactAddressSectionProps {
  initialData?: AddEditClientDto | null;
  displayState: ActionFormState<AddEditClientDto>;
  countries: CountryLookupResponse[];
  cities: LookupResponse[];
  isLoadingCities: boolean;
  selectValues: {
    country: string | null;
    city: string | null;
    phoneNo: AddEditPhoneNoDto | null;
  };
  handleCountryChange: (countryLabel: string | null) => void;
  setSelectValues: React.Dispatch<
    React.SetStateAction<{
      country: string | null;
      city: string | null;
      phoneNo: AddEditPhoneNoDto | null;
    }>
  >;
  clearFieldError: (name: string) => void;
}

const ContactAddressSection: React.FC<ContactAddressSectionProps> = ({
  initialData,
  displayState,
  countries,
  cities,
  isLoadingCities,
  selectValues,
  handleCountryChange,
  setSelectValues,
  clearFieldError,
}) => {
  const { t } = useTranslation();

  const phoneValue =
    displayState.fields?.phoneNo || initialData?.phoneNo || null;

  return (
    <section className="box box--stacked relative p-6 mt-6 bg-white border border-slate-200 rounded-lg shadow-sm">
      <h2 className="text-md font-semibold border-b border-slate-200 mb-6">
        {t("contactAndAddress")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <FormLabel htmlFor="email" localizedLabel="email" required />
          <FormInput
            id="email"
            type="email"
            className={twMerge(displayState.errors?.email && "border-red-500")}
            defaultValue={initialData?.email || displayState.fields?.email}
            onChange={() => clearFieldError("email")}
          />
          <FormError errors={displayState.errors?.email} />
        </div>
        <div>
          <FormLabel htmlFor="phoneNo" localizedLabel="phoneNo" />
          <FormPhone
            className={twMerge(
              displayState.errors?.phoneNo && "border-red-500"
            )}
            value={phoneValue || undefined}
            onChange={(value: AddEditPhoneNoDto | null) => {
              setSelectValues((prev) => ({ ...prev, phoneNo: value }));
              clearFieldError("phoneNo");
            }}
          />
          <FormError errors={displayState.errors?.phoneNo} />
        </div>
        <div className="sm:col-span-2">
          <FormLabel
            htmlFor="address.addressLine1"
            localizedLabel="addressLine1"
            required
          />
          <FormInput
            id="address.addressLine1"
            type="text"
            className={twMerge(
              displayState.errors?.address?.addressLine1 && "border-red-500"
            )}
            defaultValue={
              initialData?.address?.addressLine1 ||
              displayState.fields?.address?.addressLine1
            }
            onChange={() => clearFieldError("address.addressLine1")}
          />
          <FormError errors={displayState.errors?.address?.addressLine1} />
        </div>
        <div className="sm:col-span-2">
          <FormLabel
            htmlFor="address.addressLine2"
            localizedLabel="addressLine2"
          />
          <FormInput
            id="address.addressLine2"
            type="text"
            className={twMerge(
              displayState.errors?.address?.addressLine2 && "border-red-500"
            )}
            defaultValue={
              initialData?.address?.addressLine2 ||
              displayState.fields?.address?.addressLine2 ||
              undefined
            }
            onChange={() => clearFieldError("address.addressLine2")}
          />
          <FormError errors={displayState.errors?.address?.addressLine2} />
        </div>
        <div>
          <FormLabel
            htmlFor="address.country"
            localizedLabel="country"
            required
          />
          <FormSelect
            id="address.country"
            className={twMerge(
              displayState.errors?.address?.country && "border-red-500"
            )}
            options={countries}
            fieldNames={{ value: "label" }}
            showSearch
            allowClear
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            value={selectValues.country}
            onChange={handleCountryChange}
          />
          <FormError errors={displayState.errors?.address?.country} />
        </div>
        <div>
          <FormLabel htmlFor="address.city" localizedLabel="city" required />
          <FormSelect
            id="address.city"
            className={twMerge(
              displayState.errors?.address?.city && "border-red-500"
            )}
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
            disabled={!selectValues.country || isLoadingCities}
            value={selectValues.city}
            onChange={(value) =>
              setSelectValues((prev) => ({ ...prev, city: value }))
            }
          />
          <FormError errors={displayState.errors?.address?.city} />
        </div>
        <div>
          <FormLabel htmlFor="address.state" localizedLabel="state" />
          <FormInput
            id="address.state"
            type="text"
            className={twMerge(
              displayState.errors?.address?.state && "border-red-500"
            )}
            defaultValue={
              initialData?.address?.state || displayState.fields?.address?.state
            }
            onChange={() => clearFieldError("address.state")}
          />
          <FormError errors={displayState.errors?.address?.state} />
        </div>
        <div>
          <FormLabel htmlFor="address.zipCode" localizedLabel="zipCode" />
          <FormInput
            id="address.zipCode"
            type="text"
            className={twMerge(
              displayState.errors?.address?.zipCode && "border-red-500"
            )}
            defaultValue={
              initialData?.address?.zipCode ||
              displayState.fields?.address?.zipCode
            }
            onChange={() => clearFieldError("address.zipCode")}
          />
          <FormError errors={displayState.errors?.address?.zipCode} />
        </div>
      </div>
    </section>
  );
};

export default ContactAddressSection;
