"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { App, Modal } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import { useActionForm } from "@/lib/hooks/useActionForm";
import {
  InviteUserRequest,
  inviteUserSchema,
} from "@/services/users/users.types";
import { createFormState } from "@/lib/utils/form.utils";
import { LookupResponse } from "@/services/common/LookupResponse";

import Button from "@/components/common/ui/Button";
import FormLabel from "@/components/common/forms/FormLabel";
import FormInput from "@/components/common/forms/FormInput";
import FormSelect from "@/components/common/forms/FormSelect";
import FormError from "@/components/common/forms/FormError";
import AppIcon from "@/components/common/ui/AppIcon";
import { inviteUserAction } from "@/actions/users.actions";
import { getAllRolesAction } from "@/actions/lookups.actions";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: (shouldRefetch?: boolean) => void;
}

const initialState = createFormState<InviteUserRequest>();

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const [serverState, formAction, isPending] = useActionState(
    inviteUserAction,
    initialState
  );
  const { displayState, setDisplayState, clearFieldError, clearFormMessage } =
    useActionForm(serverState, initialState);

  const [roles, setRoles] = useState<LookupResponse[]>([]);
  const [data, setData] = useState<InviteUserRequest>({
    firstName: "",
    lastName: "",
    email: "",
    roleId: undefined,
  });

  const handleInputChange = (key: keyof InviteUserRequest, value: unknown) => {
    setData((prev) => ({ ...prev, [key]: value }));
    clearFieldError(key);
  };

  const handleSubmit = () => {
    const validation = inviteUserSchema(t).safeParse(data);
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
    if (isOpen) {
      getAllRolesAction(false).then((res) => {
        if (res) setRoles(res);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (displayState.status === "success") {
      message.success(displayState.message as string);
      setData({
        firstName: "",
        lastName: "",
        email: "",
        roleId: undefined,
      });
      setDisplayState(initialState);
      onClose(true);
    } else if (displayState.status === "error" && displayState.message) {
      message.error(displayState.message as string);
      clearFormMessage();
    }
  }, [displayState, message, onClose, setDisplayState, clearFormMessage]);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <div className="bg-primary/10 p-2 rounded-full text-primary">
            <AppIcon icon="UserPlus" className="w-5 h-5" />
          </div>
          {t("inviteUser")}
        </div>
      }
      open={isOpen}
      onCancel={() => onClose(false)}
      width={500}
      footer={null}
      destroyOnHidden
    >
      <div className="py-4 space-y-5">
        <p className="text-slate-500 text-sm">{t("inviteUser.hint")}</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormLabel
              htmlFor="firstName"
              localizedLabel="firstName"
              required
            />
            <FormInput
              id="firstName"
              value={data.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              autoFocus
            />
            <FormError errors={displayState.errors?.firstName} />
          </div>
          <div>
            <FormLabel htmlFor="lastName" localizedLabel="lastName" required />
            <FormInput
              id="lastName"
              value={data.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
            <FormError errors={displayState.errors?.lastName} />
          </div>
        </div>

        <div>
          <FormLabel htmlFor="email" localizedLabel="email" required />
          <FormInput
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <FormError errors={displayState.errors?.email} />
        </div>

        <div>
          <FormLabel htmlFor="roleId" localizedLabel="role" required />
          <FormSelect
            id="roleId"
            options={roles}
            value={data.roleId}
            onChange={(val) => handleInputChange("roleId", val)}
          />
          <FormError errors={displayState.errors?.roleId} />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline-primary"
            localizedLabel="cancel"
            disabled={isPending}
            onClick={() => onClose(false)}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            loading={isPending}
            localizedLabel={isPending ? "sending" : "sendInvitation"}
            icon="Send"
            iconDirection="left"
            onClick={handleSubmit}
          ></Button>
        </div>
      </div>
    </Modal>
  );
};

export default InviteUserModal;
