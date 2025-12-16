"use client";

import { startTransition, useEffect, useRef } from "react";
import { useActionState } from "react";
import { App, Modal } from "antd";
import { twMerge } from "tailwind-merge";

import { addEditContractTypeAction } from "@/actions/definitions/contract-types.actions";
import { useActionForm } from "@/lib/hooks/useActionForm";
import {
  addEditContractTypeSchema,
  type AddEditContractTypeDto,
} from "@/services/definitions/definitions.types";

import FormInput from "@/components/common/forms/FormInput";
import FormError from "@/components/common/forms/FormError";
import Button from "@/components/common/ui/Button";
import { createFormState } from "@/lib/utils/form.utils";
import FormLabel from "@/components/common/forms/FormLabel";
import { useTranslation } from "@/stores/TranslationContext";

interface AddEditContractTypeModalProps {
  isOpen: boolean;
  onClose: (shouldRefetch?: boolean) => void;
  initialData?: AddEditContractTypeDto | null;
}

const initialState = createFormState<AddEditContractTypeDto>();

const AddEditContractTypeModal = ({
  isOpen,
  onClose,
  initialData,
}: AddEditContractTypeModalProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const { t } = useTranslation();
  const { message } = App.useApp();
  const isEditMode = !!initialData;

  const [serverState, formAction, isPending] = useActionState(
    addEditContractTypeAction,
    initialState
  );

  const { displayState, setDisplayState, clearFieldError } = useActionForm(
    serverState,
    initialState
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData);

    const localizedSchema = addEditContractTypeSchema(t);
    const validation = localizedSchema.safeParse(rawData);

    if (!validation.success) {
      setDisplayState({
        status: "error",
        errors: validation.error.format(),
        fields: rawData,
      });
      return;
    }
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (displayState.status === "success") {
      message.success(displayState.message);
      onClose(true);
    } else if (displayState.status === "error" && displayState.message) {
      message.error(displayState.message);
    }
  }, [displayState.status, displayState.message, onClose, message]);

  return (
    <Modal
      title={t(isEditMode ? "editContractType" : "addContractType")}
      open={isOpen}
      onCancel={() => onClose(false)}
      footer={null}
      destroyOnHidden
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-8 grid grid-cols-1 gap-y-3"
      >
        {isEditMode && <input type="hidden" name="id" value={initialData.id} />}
        <div>
          <FormLabel htmlFor="title" localizedLabel="title" required />
          <FormInput
            id="title"
            type="text"
            className={twMerge(
              "w-full rounded-md border",
              displayState.errors?.title && "border-red-500"
            )}
            value={initialData?.title || displayState.fields?.title}
            onChange={() => clearFieldError("title")}
          />
          <FormError errors={displayState.errors?.title} />
        </div>
        <div>
          <FormLabel htmlFor="description" localizedLabel="description" />
          <FormInput
            id="description"
            type="text"
            className={twMerge(
              "w-full rounded-md border",
              displayState.errors?.description && "border-red-500"
            )}
            value={initialData?.description || displayState.fields?.description}
            onChange={() => clearFieldError("description")}
          />
          <FormError errors={displayState.errors?.description} />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline-dark"
            localizedLabel="cancel"
            onClick={() => onClose(false)}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            localizedLabel={isPending ? "saving" : "save"}
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddEditContractTypeModal;
