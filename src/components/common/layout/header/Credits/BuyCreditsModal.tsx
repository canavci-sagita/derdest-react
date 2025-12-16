"use client";

import { App, Modal } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import Button from "@/components/common/ui/Button";
import AppIcon from "@/components/common/ui/AppIcon";
import { useCreditOptions } from "@/lib/hooks/tanstack/useCreditPrice";
import { twMerge } from "tailwind-merge";
import { buyCreditsAction } from "@/actions/payments.actions";
import { useState } from "react";

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);

  const { data: credits } = useCreditOptions();

  const handleBuy = async (quantity: number) => {
    setLoadingAmount(quantity);
    message.loading(t("redirectingToPayment"), 0);

    const response = await buyCreditsAction(quantity, window.location.pathname);

    if (response.isSuccess && response.result) {
      window.location.href = response.result;
    } else {
      message.destroy();
      setLoadingAmount(null);
      message.error(response.messages[0] || t("paymentInitFailed"));
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg">
          <div className="bg-slate-200 text-theme-1 rounded-full p-1.5">
            <AppIcon icon="Wallet" className="w-5 h-5 stroke-[1.5]" />
          </div>
          {t("addCredits")}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div className="py-3">
        <p className="text-slate-500 mb-2 text-center">{t("selectPackage")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {credits?.map((c) => (
            <div
              key={c.price}
              className={twMerge([
                "border rounded-xl p-4 text-center cursor-pointer transition-all hover:border-primary hover:shadow-md relative overflow-hidden",
                //c.popular ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200"
              ])}
            >
              {/* {c.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                  BEST VALUE
                </div>
              )} */}
              <h3 className="text-lg font-bold text-slate-700">
                {`${c.quantity} ${t("credits")}`}
              </h3>
              <p className="text-2xl font-bold text-primary my-2">{c.price}</p>
              <Button
                variant="outline-primary" //{pkg.popular ? "primary" : "outline-primary"}
                size="sm"
                className="w-full mt-2"
                iconDirection="left"
                icon="ShoppingCart"
                loading={loadingAmount === Number(c.quantity)}
                localizedLabel={
                  loadingAmount === Number(c.quantity) ? "pleaseWait" : "buyNow"
                }
                disabled={loadingAmount !== null}
                onClick={() => handleBuy(Number(c.quantity))}
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default BuyCreditsModal;
