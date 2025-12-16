"use client";

import { useTranslation } from "@/stores/TranslationContext";
import { SignUpRequest } from "@/services/auth/auth.types";
import { Switch } from "antd";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { StripeProductDto } from "@/services/products/products.types";
import { twMerge } from "tailwind-merge";
import { AddEditPhoneNoDto } from "@/services/common/AddEditPhoneNoDto";

interface Step2_ChoosePlanProps {
  value: SignUpRequest;
  products: StripeProductDto[];
  onChange: (
    key: keyof SignUpRequest,
    value: string | number | boolean | AddEditPhoneNoDto | null
  ) => void;
}

const Step2_ChoosePlan: React.FC<Step2_ChoosePlanProps> = ({
  value,
  products,
  onChange,
}) => {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(false);

  const visiblePlans = products.filter(
    (p) => p.recurring === (isAnnual ? "year" : "month")
  );

  const handleToggleChange = (annual: boolean) => {
    setIsAnnual(annual);
    const newPlans = products.filter(
      (p) => p.recurring === (annual ? "year" : "month")
    );

    if (newPlans.length > 0) {
      onChange("productId", newPlans[0].id);
    } else {
      onChange("productId", null);
    }
  };

  useEffect(() => {
    if (!value.productId && visiblePlans.length === 1) {
      onChange("productId", visiblePlans[0].id);
    }
  }, [visiblePlans, value.productId, onChange]);

  const handlePlanChange = (id: string) => {
    onChange("productId", id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3">
        <span
          className={clsx(
            "text-sm font-medium",
            !isAnnual ? "text-slate-700" : "text-slate-500"
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
          {t("annual")} {t("savePercent", { percent: 20 })}
        </span>
      </div>
      <fieldset>
        <div
          className={clsx(
            "grid gap-4",
            visiblePlans.length === 1
              ? "max-w-xs mx-auto"
              : `grid-cols-1 sm:grid-cols-${visiblePlans.length}`
          )}
        >
          {visiblePlans.map((p) => (
            <label
              key={p.id}
              htmlFor={p.id}
              className={twMerge([
                "radio-card-label border shadow-md text-center rounded-lg p-4 cursor-pointer flex flex-col",
                p.id === value.productId && "border-2 border-theme-1 shadow-lg",
              ])}
            >
              <input
                type="radio"
                id={p.id}
                name="subscription-plan"
                value={p.id}
                className="peer sr-only"
                defaultChecked={visiblePlans.length === 1}
                onChange={(e) => handlePlanChange(e.target.value)}
              />
              <h4 className="text-lg font-semibold text-slate-800">
                {t(p.productName.match(/\(([^)]+)\)/)?.[1] ?? t(p.productName))}
              </h4>
              <p>
                <span className="text-xl font-bold text-slate-900">
                  {p.formattedPrice}
                </span>
                <span className="text-slate-500 text-xs">{` / ${t(
                  p.recurring
                )}`}</span>
              </p>
              {value.isCompany && (
                <ul className="space-y-2 mt-4 text-xs text-slate-600 list-disc list-inside flex-grow">
                  <li>
                    {t("upToUsers", { maxUsers: p.metadata["maxUsers"] })}
                  </li>
                </ul>
              )}

              <span className="mt-6 text-center font-semibold text-primary py-2 px-4 rounded-full transition-colors peer-checked:bg-primary peer-checked:text-white peer-checked:hidden">
                {t("selectPlan")}
              </span>
              <span className="hidden mt-6 text-center font-semibold text-primary py-2 px-4 rounded-full transition-colors peer-checked:bg-theme-2 peer-checked:text-white peer-checked:inline">
                {t("selected")}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default Step2_ChoosePlan;
