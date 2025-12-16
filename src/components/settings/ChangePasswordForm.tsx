"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { App } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import { useActionForm } from "@/lib/hooks/useActionForm";
import { changePasswordAction } from "@/actions/auth.actions";
import { createFormState } from "@/lib/utils/form.utils";
import {
  ChangePasswordRequest,
  changePasswordSchema,
} from "@/services/auth/auth.types";

import Button from "@/components/common/ui/Button";
import FormLabel from "@/components/common/forms/FormLabel";
import FormInput from "@/components/common/forms/FormInput";
import FormError from "@/components/common/forms/FormError";
import AppIcon from "@/components/common/ui/AppIcon";

const initialState = createFormState<ChangePasswordRequest>();

const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const formRef = useRef<HTMLFormElement>(null);

  const [serverState, formAction, isPending] = useActionState(
    changePasswordAction,
    initialState
  );

  const { displayState, setDisplayState, clearFieldError, clearFormMessage } =
    useActionForm(serverState, initialState);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = Object.fromEntries(formData) as ChangePasswordRequest;

    const localizedSchema = changePasswordSchema(t);
    const validation = localizedSchema.safeParse(data);

    if (!validation.success) {
      setDisplayState({
        status: "error",
        errors: validation.error.format(),
        fields: data,
      });
      return;
    }

    startTransition(() => formAction(data));
  };

  useEffect(() => {
    if (displayState.status === "success") {
      message.success(displayState.message as string);
      formRef.current?.reset();
      setDisplayState(initialState);
    } else if (displayState.status === "error" && displayState.message) {
      message.error(displayState.message as string);
      clearFormMessage();
    }
  }, [displayState, message, setDisplayState, clearFormMessage]);

  return (
    <div className="">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="p-1.5 bg-white border border-slate-200 rounded-md shadow-sm text-slate-500">
            <AppIcon icon="Lock" className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              {t("changePassword")}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t("changePassword.hint")}
            </p>
          </div>
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6 max-w-md">
            <div>
              <FormLabel
                htmlFor="currentPassword"
                localizedLabel="currentPassword"
                required
              />
              <FormInput
                id="currentPassword"
                type="password"
                onChange={() => clearFieldError("currentPassword")}
              />
              <FormError errors={displayState.errors?.currentPassword} />
            </div>
            <div>
              <FormLabel
                htmlFor="newPassword"
                localizedLabel="newPassword"
                required
              />
              <FormInput
                id="newPassword"
                type="password"
                onChange={() => clearFieldError("newPassword")}
              />
              <FormError errors={displayState.errors?.newPassword} />
            </div>
            <div>
              <FormLabel
                htmlFor="confirPassword"
                localizedLabel="confirmPassword"
                required
              />
              <FormInput
                id="confirmPassword"
                type="password"
                onChange={() => clearFieldError("confirmPassword")}
              />
              <FormError errors={displayState.errors?.confirmPassword} />
            </div>
            <div className="pt-1">
              <Button
                type="submit"
                variant="primary"
                loading={isPending}
                localizedLabel={isPending ? "saving" : "updatePassword"}
                icon="Save"
                iconDirection="left"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
