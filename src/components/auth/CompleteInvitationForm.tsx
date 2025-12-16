"use client";

import {
  CompleteInvitationRequest,
  completeInvitationSchema,
  VerifyInvitationResponse,
} from "@/services/auth/auth.types";
import FormError from "../common/forms/FormError";
import FormInput from "../common/forms/FormInput";
import FormLabel from "../common/forms/FormLabel";
import { createFormState } from "@/lib/utils/form.utils";

import { completeInvitationAction } from "@/actions/auth.actions";
import { useActionForm } from "@/lib/hooks/useActionForm";
import Button from "../common/ui/Button";
import { startTransition, useActionState, useEffect } from "react";
import { useTranslation } from "@/stores/TranslationContext";
import { App } from "antd";
import AppIcon from "../common/ui/AppIcon";
import { useRouter } from "next/navigation";

const initialState = createFormState<CompleteInvitationRequest>();

type CompleteInvitationFormProps = {
  verification: VerifyInvitationResponse;
};

const CompleteInvitationForm: React.FC<CompleteInvitationFormProps> = ({
  verification,
}) => {
  const { t, tHtml } = useTranslation();
  const { message } = App.useApp();
  const router = useRouter();

  const [serverState, formAction, isPending] = useActionState(
    completeInvitationAction,
    initialState
  );
  const { displayState, setDisplayState, clearFormMessage } = useActionForm(
    serverState,
    initialState
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      appUserId: verification.appUserId,
      appTenantId: verification.appTenantId,
      password: formData.get("password")!.toString(),
      confirmPassword: formData.get("confirmPassword")!.toString(),
    };

    const localizedSchema = completeInvitationSchema(t);
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
      setDisplayState(initialState);
      router.replace("/");
    } else if (displayState.status === "error" && displayState.message) {
      message.error(displayState.message as string);
      clearFormMessage();
    }
  }, [displayState, message, setDisplayState, clearFormMessage, router]);

  return (
    <div className="sm:ml-36 w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-slate-50/50 border-b border-slate-100 p-6 text-center">
        <div className="mx-auto w-12 h-12 bg-theme-1/50 text-theme1 rounded-full flex items-center justify-center mb-3">
          <AppIcon icon="User" className="w-6 h-6 stroke-2" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">
          {t("invitationWelcome")}
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          {tHtml("invitationWelcome.hint", {
            company: (
              <span className="font-bold text-slate-700">
                {verification.company}
              </span>
            ),
          })}
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          {verification.email}
        </div>
      </div>
      <div className="p-6 md:p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <FormLabel
              htmlFor="password"
              localizedLabel="createPassword"
              required
            />
            <div className="relative">
              <FormInput type="password" id="password" placeholder="••••••••" />
              {/*
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <AppIcon icon="EyeOff" className="stroke-[1.5]" />
              </button> */}
            </div>
            {/* 
            TODO: Password security will be implemented.
            <div className="mt-2 flex gap-1 h-1">
              <div className="flex-1 bg-emerald-500 rounded-full"></div>
              <div className="flex-1 bg-emerald-500 rounded-full"></div>
              <div className="flex-1 bg-slate-200 rounded-full"></div>
              <div className="flex-1 bg-slate-200 rounded-full"></div>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              Use 8+ characters with a mix of letters & numbers.
            </p> */}
            <FormError errors={displayState.errors?.password} />
          </div>
          <div>
            <FormLabel
              htmlFor="confirmPassword"
              localizedLabel="confirmPassword"
              required
            />
            <FormInput
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
            />
            <FormError errors={displayState.errors?.confirmPassword} />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full btn-primary mt-2"
            loading={isPending}
            localizedLabel={isPending ? "saving" : "setPassword"}
            icon="LockKeyhole"
            iconDirection="left"
          />
        </form>
      </div>

      <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
        <p className="text-xs text-slate-400">
          {tHtml("continueToAgreeTerms", {
            terms: (
              <a href="#" className="hover:text-slate-600 hover:underline">
                {t("termsOfService")}
              </a>
            ),
          })}
          .
        </p>
      </div>
    </div>
  );
};

export default CompleteInvitationForm;
