"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/common/ui/Button";
import AppIcon from "@/components/common/ui/AppIcon";
import { useTranslation } from "@/stores/TranslationContext";

export default function CheckoutCancelPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 xl:ml-40">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center max-w-md w-full">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AppIcon icon="X" className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {t("paymentCanceled")}
        </h1>
        <p className="text-slate-600 mb-8">{t("paymentCanceled.hint")}</p>
        <div className="space-y-3">
          <Button
            variant="primary"
            className="w-full justify-center"
            onClick={() => router.push("/auth/sign-in")}
            localizedLabel="returnToSignIn"
          />
        </div>
      </div>
    </div>
  );
}
