"use client";

import { UserContactAddressVM } from "@/services/users/users.types";
import { FieldErrors } from "@/types/form.types";
import FormLabel from "@/components/common/forms/FormLabel";
import FormInput from "@/components/common/forms/FormInput";
import FormError from "@/components/common/forms/FormError";
import FormPhone from "@/components/common/forms/FormPhone";
import { AddEditPhoneNoDto } from "@/services/common/AddEditPhoneNoDto";
import { twMerge } from "tailwind-merge";
import FormSelect from "@/components/common/forms/FormSelect";
import { useCountryCity } from "@/lib/hooks/useCountryCity";
import { AddEditAddressDto } from "@/services/common/AddEditAddressDto";
import { useEffect } from "react";

interface ContactAddressSectionProps {
  data: UserContactAddressVM;
  fieldErrors: FieldErrors<UserContactAddressVM> | undefined;
  onChange: (data: UserContactAddressVM) => void;
  clearFieldError: (name: string) => void;
}

const ContactAddressSection: React.FC<ContactAddressSectionProps> = ({
  data,
  fieldErrors,
  onChange,
  clearFieldError,
}) => {
  const { countries, cities, isLoadingCities, handleCountryChange } =
    useCountryCity();

  const updateData = (key: keyof AddEditAddressDto, newValue: string) => {
    const updatedAddress = { ...data.address, [key]: newValue };
    const updatedData = { ...data, address: updatedAddress };

    onChange(updatedData);

    if (key === "country") {
      updatedAddress.city = null;
      handleCountryChange(newValue);
    }
  };

  const handleAddressInputChange = (
    key: keyof AddEditAddressDto,
    newValue: string
  ) => {
    updateData(key, newValue);
    clearFieldError(`contactAddress.address.${key}`);
  };

  const handleAddressInputOnBlur = (
    key: keyof AddEditAddressDto,
    newValue: string
  ) => {
    updateData(key, newValue);
  };

  const handlePhoneNoChange = (newValue: AddEditPhoneNoDto | null) => {
    const updatedData = { ...data, phoneNo: newValue ?? undefined };

    onChange(updatedData);
    clearFieldError("contactAddress.phoneNo");
  };

  useEffect(() => {
    if (data.address?.country && countries.length > 0) {
      handleCountryChange(data.address.country);
    }
  }, [countries, data.address?.country, handleCountryChange]);

  return (
    <section className="pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <FormLabel htmlFor="phoneNo" localizedLabel="phoneNo" />
          <FormPhone
            className={twMerge(fieldErrors?.phoneNo && "border-red-500")}
            value={data.phoneNo || undefined}
            onChange={(value: AddEditPhoneNoDto | null) => {
              handlePhoneNoChange(value);
            }}
          />
          <FormError errors={fieldErrors?.phoneNo} />
        </div>
        <div className="sm:col-span-2">
          <FormLabel htmlFor="addressLine1" localizedLabel="addressLine1" />
          <FormInput
            id="addressLine1"
            name="address.addressLine1"
            type="text"
            defaultValue={data.address?.addressLine1}
            onBlur={(e) =>
              handleAddressInputOnBlur("addressLine1", e.target.value)
            }
            onChange={() =>
              clearFieldError("contactAddress.address.addressLine2")
            }
          />
          <FormError errors={fieldErrors?.address?.addressLine1} />
        </div>
        <div className="sm:col-span-2">
          <FormLabel htmlFor="addressLine2" localizedLabel="addressLine2" />
          <FormInput
            id="addressLine2"
            name="address.addressLine2"
            type="text"
            defaultValue={data.address?.addressLine2}
            onBlur={(e) =>
              handleAddressInputOnBlur("addressLine2", e.target.value)
            }
            onChange={() =>
              clearFieldError("contactAddress.address.addressLine2")
            }
          />
          <FormError errors={fieldErrors?.address?.addressLine2} />
        </div>
        <div>
          <FormLabel htmlFor="country" localizedLabel="country" />
          <FormSelect
            id="address.country"
            className={twMerge(
              fieldErrors?.address?.country && "border-red-500"
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
            value={data.address?.country || null}
            onChange={(v) => handleAddressInputChange("country", v)}
          />
          <FormError errors={fieldErrors?.address?.country} />
        </div>
        <div>
          <FormLabel htmlFor="city" localizedLabel="city" />
          <FormSelect
            id="address.city"
            className={twMerge(fieldErrors?.address?.city && "border-red-500")}
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
            disabled={!data.address?.country || isLoadingCities}
            value={data.address?.city || null}
            onChange={(v) => handleAddressInputChange("city", v)}
          />
          <FormError errors={fieldErrors?.address?.city} />
        </div>
        <div>
          <FormLabel htmlFor="state" localizedLabel="state" />
          <FormInput
            id="state"
            name="address.state"
            type="text"
            defaultValue={data.address?.state}
            onBlur={(e) => handleAddressInputOnBlur("state", e.target.value)}
            onChange={() => clearFieldError("contactAddress.address.state")}
          />
          <FormError errors={fieldErrors?.address?.state} />
        </div>
        <div>
          <FormLabel htmlFor="zipCode" localizedLabel="zipCode" />
          <FormInput
            id="zipCode"
            name="address.zipCode"
            type="text"
            defaultValue={data.address?.zipCode}
            onBlur={(e) => handleAddressInputOnBlur("zipCode", e.target.value)}
            onChange={() => clearFieldError("contactAddress.address.zipCode")}
          />
          <FormError errors={fieldErrors?.address?.zipCode} />
        </div>
      </div>
    </section>
  );
};

export default ContactAddressSection;
