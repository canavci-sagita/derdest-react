"use client";

import { startTransition, useActionState } from "react";

import { twMerge } from "tailwind-merge";
import { Alert } from "antd";

import { useActionForm } from "@/lib/hooks/useActionForm";
import { createFormState } from "@/lib/utils/form.utils";

import Button from "../common/ui/Button";

import FormInput from "../common/forms/FormInput";
import FormError from "../common/forms/FormError";

import { signInAction } from "@/actions/auth.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { SignInRequest, signInSchema } from "@/services/auth/auth.types";
import { useTranslation } from "@/stores/TranslationContext";

const initialState = createFormState<SignInRequest>();

const SignInForm = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const [serverState, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );
  const { displayState, setDisplayState, clearFieldError, clearFormMessage } =
    useActionForm(serverState, initialState);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData);

    const localizedSchema = signInSchema(t);
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

  return (
    <form autoComplete="on" className="mt-8" onSubmit={handleSubmit}>
      <input type="hidden" name="returnUrl" value={returnUrl} />
      {displayState?.message && (
        <Alert
          message={displayState.message}
          type="error"
          showIcon
          className="mb-4"
          onClose={clearFormMessage}
        />
      )}
      <div className="flex flex-col gap-5">
        <div>
          <FormInput
            id="email"
            type="text"
            className={twMerge([
              "h-10 w-full rounded-md border bg-background ring-offset-background box block min-w-full px-5 py-6 xl:min-w-[28rem] hover:border-theme-1",
              displayState.errors?.email && "border-red-500",
            ])}
            formInputSize="lg"
            localizedPlaceholder="email"
            defaultValue={displayState.fields?.email}
            onChange={() => clearFieldError("email")}
          />
          <FormError errors={displayState.errors?.email} />
        </div>
        <div>
          <FormInput
            id="password"
            type="password"
            className={twMerge([
              "h-10 w-full rounded-md border bg-background ring-offset-background box block min-w-full px-5 py-6 xl:min-w-[28rem] hover:border-theme-1",
              displayState.errors?.password && "border-red-500",
            ])}
            formInputSize="lg"
            localizedPlaceholder="password"
            defaultValue={displayState.fields?.password}
            onChange={() => clearFieldError("password")}
          />
          <FormError errors={displayState.errors?.password} />
        </div>
        {/* <div className="flex text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 mr-auto">
            <FormCheck
              type="checkbox"
              name="rememberMe"
              localizedLabel="rememberMe"
              defaultChecked={!!displayState.fields?.rememberMe}
            />
          </div>
          <a className="opacity-70" href="">
            {t("forgotPassword")}
          </a>
        </div> */}
      </div>
      <div className="mt-5 text-center xl:mt-10 xl:text-left">
        <Button
          type="submit"
          className="w-full box"
          variant="primary"
          rounded="lg"
          elevated
          icon="LogIn"
          localizedLabel={isPending ? "loading" : "signIn"}
          iconDirection="left"
          loading={isPending}
          disabled={isPending}
        />
        <Button
          type="button"
          className="w-full box mt-4"
          variant="outline-primary"
          rounded="lg"
          elevated
          localizedLabel="signUp"
          onClick={() => router.push("/auth/sign-up")}
        />
      </div>
    </form>
  );
};

export default SignInForm;
