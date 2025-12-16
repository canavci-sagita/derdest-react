"use client";

import { useTranslation } from "@/stores/TranslationContext";
import AppIcon from "./ui/AppIcon";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";

const WelcomeAboard: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center max-w-md w-full xl:ml-40">
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <AppIcon icon="Check" className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {t("welcomeAboard")}
        </h1>
        <p className="text-slate-600 mb-8">{t("welcomeAboard.hint")}</p>
        <Button
          variant="primary"
          className="w-full justify-center"
          onClick={() => router.push("/")}
          localizedLabel="goToDashboard"
        />
      </div>
    </div>
  );
};

export default WelcomeAboard;
