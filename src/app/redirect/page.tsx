"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spin } from "antd";
import AppIcon from "@/components/common/ui/AppIcon";
import { useTranslation } from "@/stores/TranslationContext";

export default function RedirectPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"success" | "cancel" | null>();

  useEffect(() => {
    //const returnUrl = searchParams.get("u") || "/";
    const operation = searchParams.get("o");

    setStatus(operation === "success" ? "success" : "cancel");

    //TODO: Decide if it will stay or not?
    // const timer = setTimeout(() => {
    //   router.replace(returnUrl);
    // }, 1000);
  }, [searchParams, router]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50">
      <div className="text-center p-8">
        <div className="flex flex-col items-center">
          {status === "success" && (
            <>
              <AppIcon
                icon="CircleCheck"
                className="text-emerald-600 w-8 h-8 stroke-[2]"
              />
              <h2 className="text-xl font-bold text-emerald-600">
                {t("success")}
              </h2>
            </>
          )}
          {status === "cancel" && (
            <>
              <Spin size="large" />
              <h2 className="text-xl font-semibold text-slate-800 mt-6">
                {t("processingYourRequest")}
              </h2>
            </>
          )}
          <p className="text-slate-600 mt-2">{t("redirecting")}</p>
        </div>
      </div>
    </div>
  );
}
