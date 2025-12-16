"use client";

import { useEffect, useState } from "react";
import { App, Modal, Switch, Spin } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import { StripeProductDto } from "@/services/products/products.types";
import { getAllSubscriptionPlansAction } from "@/actions/products.actions";
import Button from "@/components/common/ui/Button";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface SubscriptionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId?: string;
  isCompanyAccount?: boolean;
  onConfirm: (priceId: string) => Promise<void>;
}

const SubscriptionPlanModal: React.FC<SubscriptionPlanModalProps> = ({
  isOpen,
  currentPlanId,
  isCompanyAccount = false,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const [plans, setPlans] = useState<StripeProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!selectedPlanId) return;
    setSubmitting(true);
    await onConfirm(selectedPlanId);
    setSubmitting(false);
  };

  const visiblePlans = plans.filter(
    (p) => p.recurring === (isAnnual ? "year" : "month")
  );

  const handleToggleChange = (checked: boolean) => {
    setIsAnnual(checked);
    setSelectedPlanId(null);
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getAllSubscriptionPlansAction().then((res) => {
        if (res.isSuccess && res.result) {
          const relevantPlans = res.result.filter((p) => {
            const isSinglePlan = p.lookupKey.startsWith("single");
            return isCompanyAccount ? !isSinglePlan : isSinglePlan;
          });
          setPlans(relevantPlans);
        } else {
          message.error(res.messages[0]);
        }
        setLoading(false);
      });
    }
  }, [isOpen, isCompanyAccount, message]);

  return (
    <Modal
      title={t("selectPlan")}
      open={isOpen}
      onCancel={onClose}
      footer={
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button
            variant="outline-primary"
            onClick={onClose}
            localizedLabel="cancel"
            disabled={submitting}
          />
          <Button
            variant="primary"
            onClick={handleConfirm}
            icon="SquareCheck"
            iconDirection="left"
            loading={submitting}
            disabled={!selectedPlanId || submitting}
            localizedLabel={"subscribe"}
          />
        </div>
      }
      destroyOnHidden
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <div className="py-6 space-y-8">
          <div className="flex items-center justify-center gap-3">
            <span
              className={clsx(
                "text-sm font-medium",
                !isAnnual ? "text-slate-900" : "text-slate-500"
              )}
            >
              {t("monthly")}
            </span>
            <Switch checked={isAnnual} onChange={handleToggleChange} />
            <span
              className={clsx(
                "text-sm font-medium",
                isAnnual ? "text-primary" : "text-slate-500"
              )}
            >
              {t("annual")}{" "}
              <span className="text-xs font-normal text-slate-400">
                ({t("save20")})
              </span>
            </span>
          </div>
          <div
            className={clsx(
              "grid gap-4",
              visiblePlans.length === 1
                ? "max-w-xs mx-auto"
                : visiblePlans.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-3"
            )}
          >
            {visiblePlans.map((p) => {
              const isCurrent = p.id === currentPlanId;
              return (
                <label
                  key={p.id}
                  className={twMerge([
                    "relative border rounded-xl p-5 cursor-pointer transition-all flex flex-col h-full",
                    "hover:shadow-md",
                    selectedPlanId === p.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-slate-200 bg-white",
                    isCurrent &&
                      "opacity-70 cursor-default border-slate-300 bg-slate-50 hover:shadow-none",
                  ])}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={p.id}
                    className="peer sr-only"
                    checked={selectedPlanId === p.id}
                    onChange={() => !isCurrent && setSelectedPlanId(p.id)}
                    disabled={isCurrent}
                  />
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-slate-800">
                      {p.productName.match(/\(([^)]+)\)/)?.[1] || p.productName}
                    </h4>
                    {/* <p className="text-xs text-slate-500 mt-1 min-h-[2.5em]">
                            {p..Description || "Standard plan features"}
                        </p> */}
                  </div>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-slate-900">
                      {p.formattedPrice}
                    </span>
                    <span className="text-sm text-slate-500">
                      {" "}
                      / {t(p.recurring)}
                    </span>
                  </div>
                  {isCompanyAccount && (
                    <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside flex-grow mb-6">
                      <li>
                        {t("upToUsers", {
                          maxUsers: p.metadata?.["maxUsers"],
                        })}
                      </li>
                    </ul>
                  )}
                  <div className="mt-auto text-center">
                    {isCurrent ? (
                      <span className="inline-block w-full py-2 px-4 rounded-lg bg-slate-200 text-slate-500 font-medium text-sm">
                        {t("currentPlan")}
                      </span>
                    ) : (
                      <span
                        className={clsx(
                          "inline-block w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors",
                          selectedPlanId === p.id
                            ? "bg-theme-2 text-white"
                            : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                        )}
                      >
                        {selectedPlanId === p.id ? t("selected") : t("select")}
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SubscriptionPlanModal;
