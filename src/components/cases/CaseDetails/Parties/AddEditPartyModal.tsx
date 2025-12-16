import FormError from "@/components/common/forms/FormError";
import FormInput from "@/components/common/forms/FormInput";
import FormLabel from "@/components/common/forms/FormLabel";
import FormPhone from "@/components/common/forms/FormPhone";
import FormSelect from "@/components/common/forms/FormSelect";
import Button from "@/components/common/ui/Button";
import { useActionForm } from "@/lib/hooks/useActionForm";
import { useCountryCity } from "@/lib/hooks/useCountryCity";
import { createFormState } from "@/lib/utils/form.utils";
import { unflattenObject } from "@/lib/utils/object.utils";
import {
  AddEditPartyDto,
  addEditPartySchema,
} from "@/services/cases/cases.types";
import { AddEditPhoneNoDto } from "@/services/common/AddEditPhoneNoDto";
import { useTranslation } from "@/stores/TranslationContext";
import { Alert, App, Modal } from "antd";
import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useParties } from "./useParties";
import { usePartyTypes } from "@/lib/hooks/tanstack/usePartyTypes";

interface AddEditPartyModalProps {
  isOpen: boolean;
  initialData?: AddEditPartyDto | null;
  caseId: number;
  preselectedTimelineLabel?: string | null;
  showTimeline?: boolean;
  partyType?: string;
  onClose: (shouldRefetch?: boolean, newPartyId?: number) => void;
}

const initialState = createFormState<AddEditPartyDto>();

const AddEditPartyModal: React.FC<AddEditPartyModalProps> = ({
  caseId,
  partyType,
  isOpen,
  initialData,
  onClose,
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const isEditMode = !!initialData;

  const { countries, cities, isLoadingCities, handleCountryChange } =
    useCountryCity();
  const { data: partyTypes } = usePartyTypes();

  const { saveParty, isSaving } = useParties(caseId);

  const { displayState, setDisplayState, clearFieldError, clearFormMessage } =
    useActionForm(initialState, initialState);

  const [selectValues, setSelectValues] = useState<{
    partyTypeId: number | null;
    country: string | null;
    city: string | null;
    phoneNo: AddEditPhoneNoDto | null;
  }>({
    partyTypeId: initialData?.partyTypeId || null,
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

  const handlePhoneInputChange = (value: AddEditPhoneNoDto | null) => {
    // const bestMatch = countries.reduce((match, country) => {
    //   const prefix = `+${country.phoneCode}`;
    //   if (
    //     fullPhoneNumber.startsWith(prefix) &&
    //     prefix.length > (match ? `+${match.phoneCode}`.length : 0)
    //   ) {
    //     return country;
    //   }
    //   return match;
    // }, null as any);

    // const phoneDto: AddEditPhoneNoDto = {
    //   countryCode: bestMatch ? `+${bestMatch.phoneCode}` : "",
    //   value: bestMatch
    //     ? fullPhoneNumber.substring(`+${bestMatch.phoneCode}`.length)
    //     : fullPhoneNumber,
    // };

    setSelectValues((prev) => ({ ...prev, phoneNo: value }));
    clearFieldError("phoneNo");
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const flatRawData = Object.fromEntries(formData);
      const combinedData = {
        ...flatRawData,
        partyTypeId: selectValues.partyTypeId,
        "address.country": selectValues.country,
        "address.city": selectValues.city,
        "phoneNo.countryCode": selectValues.phoneNo?.countryCode,
        "phoneNo.value": selectValues.phoneNo?.value || "",
      };

      const nestedRawData = unflattenObject(combinedData);

      const localizedSchema = addEditPartySchema(t);
      const validation = localizedSchema.safeParse(nestedRawData);

      if (!validation.success) {
        setDisplayState({
          status: "error",
          message: null,
          errors: validation.error.format(),
          fields: nestedRawData,
        });
        return;
      }

      formData.set("partyTypeId", selectValues.partyTypeId!.toString());
      formData.set("address.country", selectValues.country || "");
      formData.set("address.city", selectValues.city || "");
      formData.set(
        "phoneNo.countryCode",
        selectValues.phoneNo?.countryCode || ""
      );
      formData.set("phoneNo.value", selectValues.phoneNo?.value || "");

      const result = await saveParty(formData);

      if (result.status === "success") {
        onClose(true);
      } else {
        setDisplayState(result);
      }
    },
    [selectValues, t, saveParty, onClose, setDisplayState]
  );

  useEffect(() => {
    if (displayState.status === "success") {
      message.success(displayState.message);
      onClose(true);
    } else if (displayState.status === "error" && displayState.message) {
      message.error(displayState.message);
    }
  }, [displayState, message, onClose]);

  return (
    <Modal
      className="min-w-[720px]"
      title={t(isEditMode ? "editParty" : "addParty")}
      open={isOpen}
      onCancel={() => onClose(false)}
      footer={null}
      destroyOnHidden
    >
      <form onSubmit={handleSubmit} className="mt-6">
        {displayState.status === "error" && displayState.message && (
          <Alert
            message={
              Array.isArray(displayState.message)
                ? displayState.message.map((m, i) => (
                    <p className="text-left" key={i}>
                      {m}
                    </p>
                  ))
                : displayState.message
            }
            type="error"
            showIcon
            className="mb-4"
            onClose={clearFormMessage}
            closable
          />
        )}
        {isEditMode && (
          <input type="hidden" name="id" defaultValue={initialData?.id} />
        )}
        <input type="hidden" name="caseId" defaultValue={caseId} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <FormLabel
              htmlFor="partyType"
              localizedLabel="partyType"
              required
            />
            <FormSelect
              id="partyType"
              options={partyTypes}
              labelInValue
              defaultValue={
                initialData
                  ? {
                      value:
                        initialData?.partyTypeId ||
                        displayState.fields?.partyTypeId,
                      label: partyType,
                    }
                  : undefined
              }
              onChange={(e) => {
                clearFieldError("partyTypeId");
                setSelectValues((prev) => ({ ...prev, partyTypeId: e.value }));
              }}
            />
            <FormError errors={displayState.errors?.partyTypeId} />
          </div>
          <div className="col-start-1">
            <FormLabel htmlFor="fullName" localizedLabel="fullName" required />
            <FormInput
              id="fullName"
              type="text"
              className={twMerge(
                displayState.errors?.fullName && "border-red-500"
              )}
              defaultValue={
                initialData?.fullName || displayState.fields?.fullName
              }
              onChange={() => clearFieldError("fullName")}
            />
            <FormError errors={displayState.errors?.fullName} />
          </div>
          <div>
            <FormLabel htmlFor="nationalId" localizedLabel="nationalId" />
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
          <div>
            <FormLabel htmlFor="email" localizedLabel="email" />
            <FormInput
              id="email"
              type="email"
              className={twMerge(
                displayState.errors?.email && "border-red-500"
              )}
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
              value={initialData?.phoneNo || displayState.fields?.phoneNo}
              onChange={handlePhoneInputChange}
            />
            <FormError errors={displayState.errors?.phoneNo} />
          </div>
          <div className="sm:col-span-2">
            <FormLabel
              htmlFor="address.addressLine1"
              localizedLabel="addressLine1"
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
                displayState.fields?.address?.addressLine2
              }
              onChange={() => clearFieldError("address.addressLine2")}
            />
            <FormError errors={displayState.errors?.address?.addressLine2} />
          </div>
          <div>
            <FormLabel htmlFor="address.country" localizedLabel="country" />
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
              onChange={onCountrySelect}
            />
            <FormError errors={displayState.errors?.address?.country} />
          </div>
          <div>
            <FormLabel htmlFor="address.city" localizedLabel="city" />
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
                initialData?.address?.state ||
                displayState.fields?.address?.state
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
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline-dark"
            localizedLabel="cancel"
            disabled={isSaving}
            onClick={() => onClose(false)}
          />
          <Button
            type="submit"
            variant="primary"
            loading={isSaving}
            disabled={isSaving}
            localizedLabel={isSaving ? "saving" : "save"}
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddEditPartyModal;
