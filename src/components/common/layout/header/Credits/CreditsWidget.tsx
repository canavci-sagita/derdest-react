"use client";

import { useState } from "react";
import { Tooltip } from "antd";
import AppIcon from "@/components/common/ui/AppIcon";
import { useTranslation } from "@/stores/TranslationContext";
import BuyCreditsModal from "./BuyCreditsModal";
import { useCredits } from "@/lib/hooks/tanstack/useCredits";

const CreditsWidget = () => {
  const { t, currentLang } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: creditData, isLoading } = useCredits();

  const totalCredits = creditData
    ? creditData.subscriptionBalance + creditData.purchasedBalance
    : 0;

  return (
    <>
      <div className="hidden md:flex items-center bg-white/60 backdrop-blur border border-slate-200 rounded-full p-1 pr-2 shadow-sm ml-4 mr-auto">
        <div className="bg-slate-200 text-theme-1 rounded-full p-1.5 mr-2.5">
          <AppIcon icon="Wallet" className="w-4 h-4 stroke-[1.5]" />
        </div>
        <div className="flex flex-col leading-none mr-3">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            {t("credits")}
          </span>
          <span className="text-xs font-bold text-slate-700 tabular-nums">
            {isLoading ? (
              <span className="animate-pulse bg-slate-200 h-4 w-10 rounded inline-block align-middle"></span>
            ) : (
              <div className="flex items-center gap-1">
                <span>{totalCredits.toLocaleString(currentLang)}</span>
                <Tooltip
                  color="white"
                  title={
                    <div className="flex flex-col gap-1 text-xs text-theme-1">
                      <div className="flex justify-between gap-4">
                        <span className="opacity-80 font-bold">
                          {t("subscription")}:
                        </span>
                        <span className="font-mono font-semibold text-right">
                          {creditData?.subscriptionBalance.toLocaleString(
                            currentLang
                          )}
                        </span>
                      </div>
                      <hr />
                      <div className="flex justify-between gap-4">
                        <span className="opacity-80 font-bold">
                          {t("purchased")}:
                        </span>
                        <span className="font-mono font-semibold text-right">
                          {creditData?.purchasedBalance.toLocaleString(
                            currentLang
                          )}
                        </span>
                      </div>
                    </div>
                  }
                >
                  <AppIcon
                    icon="Info"
                    className="w-4 h-4 text-white fill-sky-600 stroke-[2.5]"
                  />
                </Tooltip>
              </div>
            )}
          </span>
        </div>
        <div className="h-6 w-px bg-slate-200 mx-1 mr-2"></div>
        <Tooltip title={t("addCredits")}>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-105 shadow-sm"
          >
            <AppIcon icon="Plus" className="w-4 h-4 stroke-[3]" />
          </button>
        </Tooltip>
      </div>
      <div className="md:hidden ml-auto mr-2 flex items-center">
        <button onClick={() => setIsModalOpen(true)} className="text-slate-600">
          <AppIcon icon="Wallet" className="w-5 h-5" />
        </button>
      </div>

      <BuyCreditsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CreditsWidget;
