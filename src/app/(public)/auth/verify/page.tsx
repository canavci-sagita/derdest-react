"use client";

import VerifyUserForm from "@/components/auth/VerifyUserForm";
import LoadingIcon from "@/components/common/ui/LoadingIcon";
import { useTranslation } from "@/stores/TranslationContext";
import { useState } from "react";

const VerifyPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleVerificationSuccess = async (sessionUrl: string) => {
    setLoading(true);
    window.location.href = sessionUrl;
  };

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center h-64">
        <LoadingIcon icon="rings" color="rgb(var(--color-theme-2))" />
        <p className="ml-2 font-semibold text-theme-1">
          {t("verification.success")}
        </p>
      </div>
    );
  }
  return (
    <div className="my-10 flex min-h-screen py-5 xl:my-0 xl:h-auto xl:py-0">
      <div className="relative p-5 before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md mx-auto my-auto w-full px-5 py-8 sm:w-3/4 sm:px-8 lg:w-2/4 xl:ml-40 xl:w-auto xl:before:hidden xl:after:hidden">
        <h3 className="text-center text-xl font-semibold xl:text-2xl">
          {t("checkYourEmail")}
        </h3>
        <p className="mt-2 text-center text-slate-500">
          {t("checkYourEmail.hint")}
        </p>
        <VerifyUserForm onVerificationSuccess={handleVerificationSuccess} />
      </div>
    </div>
  );
};

export default VerifyPage;
