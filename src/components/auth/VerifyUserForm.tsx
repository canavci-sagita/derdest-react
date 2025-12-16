"use client";

import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { App, Alert, Input } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import { useActionForm } from "@/lib/hooks/useActionForm";
import { createFormState } from "@/lib/utils/form.utils";
import {
  VerifyUserRequest,
  verifyUserSchema,
} from "@/services/auth/auth.types";
import {
  resendVerificationCodeAction,
  verifyUserAction,
} from "@/actions/auth.actions";
import Button from "@/components/common/ui/Button";
import FormError from "@/components/common/forms/FormError";

const initialState = createFormState<VerifyUserRequest>();

export type VerifyUserFormProps = {
  onVerificationSuccess: (sessionUrl: string) => void;
};
const VerifyUserForm: React.FC<VerifyUserFormProps> = ({
  onVerificationSuccess,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { message } = App.useApp();
  const searchParams = useSearchParams();

  const [token, setToken] = useState<string>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [serverState, formAction] = useActionState(
    verifyUserAction,
    initialState
  );

  const { displayState, setDisplayState, clearFieldError, clearFormMessage } =
    useActionForm(serverState, initialState);

  const handleResendVerification = async () => {
    if (token) {
      const res = await resendVerificationCodeAction(token);

      if (res.isSuccess) {
        message.success(res.messages);
      } else {
        message.error(res.messages);
      }
    }
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    const dataToValidate = {
      token: token,
      otp: otp,
    };

    const localizedSchema = verifyUserSchema(t);
    const validation = localizedSchema.safeParse(dataToValidate);

    if (!validation.success) {
      setDisplayState({
        status: "error",
        errors: validation.error.format(),
        fields: dataToValidate,
      });
      return;
    }

    startTransition(() => {
      formAction(validation.data);
    });
  };

  useEffect(() => {
    const queryToken = searchParams.get("token");

    if (!queryToken) {
      message.error(t("noVerificationToken"));
      router.push("/auth/sign-up");
    } else {
      setToken(queryToken);
    }
  }, [router, message, t, searchParams]);

  useEffect(() => {
    if (displayState.status === "success") {
      setLoading(false);
      onVerificationSuccess(displayState.result as string);
    } else if (displayState.status === "error" && displayState.message) {
      setLoading(false);
      message.error(displayState.message as string);
      clearFormMessage();
    }
  }, [displayState, message, router, clearFormMessage, onVerificationSuccess]);

  return (
    <form autoComplete="off" className="mt-8" onSubmit={handleSubmit}>
      {displayState.status === "error" && displayState.message && (
        <Alert
          message={displayState.message}
          type="error"
          showIcon
          className="mb-4"
          onClose={clearFormMessage}
        />
      )}
      <div className="flex flex-col items-center">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("enterYourCode")}
        </label>
        <Input.OTP
          length={6}
          size="large"
          value={otp}
          onChange={(value) => {
            setOtp(value);
            clearFieldError("otp");
          }}
        />
        <FormError errors={displayState.errors?.otp} />
      </div>

      <div className="mt-8 text-center">
        <Button
          type="submit"
          className="w-full max-w-xs"
          variant="primary"
          rounded="lg"
          elevated
          loading={loading}
          disabled={loading || !token || otp.length !== 6}
          localizedLabel={loading ? "verifying" : "verify"}
        />
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-slate-500">{t("didntReceiveCode")} </span>
        <button
          type="button"
          className="font-medium text-primary hover:underline"
          disabled={loading}
          onClick={handleResendVerification}
        >
          {t("resend")}
        </button>
      </div>
    </form>
  );
};

export default VerifyUserForm;
