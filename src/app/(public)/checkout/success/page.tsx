"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/common/ui/Button";
import AppIcon from "@/components/common/ui/AppIcon";
import { verifyPaymentAction } from "@/actions/payments.actions";
import { Spin, App } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import WelcomeAboard from "@/components/common/Welcome";
import { getErrorMessage } from "@/lib/utils/error.utils";

export default function CheckoutSuccessPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { message } = App.useApp();

  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const verifyCalled = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get("sid");

    if (!sessionId) {
      setIsVerifying(false);
      return;
    }

    if (verifyCalled.current) return;
    verifyCalled.current = true;

    const verify = async () => {
      try {
        const response = await verifyPaymentAction(sessionId);

        if (response.isSuccess && response.result) {
          setIsSuccess(true);
          setTimeout(() => {
            router.push("/");
            //redirect("/");
          }, 2000);
        } else {
          message.error(response.messages);
        }
      } catch (error: unknown) {
        message.error(getErrorMessage(error));
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [searchParams, router, message]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-lg shadow-sm border border-slate-200 text-center max-w-md w-full xl:ml-40">
          <Spin size="large" />
          <h2 className="text-xl font-semibold text-slate-800 mt-6">
            {t("finalizingAccount")}
          </h2>
          <p className="text-slate-500 mt-2">{t("finalizingAccount.hint")}</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return <WelcomeAboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center max-w-md w-full xl:ml-40">
        <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
          <AppIcon icon="TriangleAlert" className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {t("verificationIssue")}
        </h1>
        <p className="text-slate-600 mb-8">{t("verificationIssue.hint")}</p>
        <Button
          variant="outline-primary"
          className="w-full justify-center"
          onClick={() => router.push("/auth/sign-in")}
          localizedLabel="returnToSignIn"
        />
      </div>
    </div>
  );
}
