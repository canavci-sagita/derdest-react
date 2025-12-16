"use client";

import { useCallback, useEffect, useState } from "react";
import { App, Tag, Table, Popconfirm } from "antd";
import type { TableProps } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import {
  cancelSubscriptionAction,
  getSubscriptionAction,
  subscribeAction,
} from "@/actions/users.actions";
import AppIcon from "@/components/common/ui/AppIcon";
import Button from "@/components/common/ui/Button";
import { formatDate } from "@/lib/utils/date.utils";
import {
  InvoiceDto,
  SubscriptionDto,
} from "@/services/payments/payments.types";
import { getAllPaymentsAction } from "@/actions/payments.actions";
import SubscriptionPlanModal from "./SubscriptionPlanModal";

const Subscriptions = () => {
  const { t, currentLang } = useTranslation();
  const { message } = App.useApp();

  const [subscription, setSubscription] = useState<SubscriptionDto | null>(
    null
  );
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [loadingSub, setLoadingSub] = useState(true);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const fetchSubscription = useCallback(async () => {
    setLoadingSub(true);
    const subResponse = await getSubscriptionAction();

    if (subResponse.isSuccess && subResponse.result) {
      setSubscription(subResponse.result);
    }
    setLoadingSub(false);
  }, []);

  const fetchPayments = useCallback(async () => {
    setLoadingInvoices(true);
    const paymentsResponse = await getAllPaymentsAction();
    if (paymentsResponse.isSuccess && paymentsResponse.result) {
      setInvoices(paymentsResponse.result);
    }
    setLoadingInvoices(false);
  }, []);

  const handleOpenPlan = () => {
    setIsPlanModalOpen(true);
  };

  const handlePlanConfirm = async (productId: string) => {
    const response = await subscribeAction({
      productId: productId,
      redirectUrl: "/settings/subscriptions",
    });

    if (response.isSuccess && response.result) {
      window.location.href = response.result;
    } else {
      message.error(response.messages);
    }
  };

  const handleCancelSubscription = async () => {
    setLoadingSub(true);
    const response = await cancelSubscriptionAction();
    setLoadingSub(false);

    if (response.isSuccess) {
      message.success(response.messages);
    } else {
      message.error(response.messages);
    }
  };

  const columns: TableProps<InvoiceDto>["columns"] = [
    {
      title: t("tableHeader.description"),
      dataIndex: "description",
      key: "description",
      responsive: ["md"],
    },
    {
      title: t("tableHeader.date"),
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => formatDate(currentLang, date, false, false),
    },
    {
      title: t("tableHeader.amount"),
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (amount, record) => (
        <span className="font-medium">
          {amount} {record.currency.toUpperCase()}
        </span>
      ),
    },
    {
      title: t("tableHeader.status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status.toLowerCase() === "paid" ? "success" : "warning";
        return <Tag color={color}>{t(`invoice.${status}`).toUpperCase()}</Tag>;
      },
    },
    {
      title: t("tableHeader.invoice"),
      key: "action",
      align: "center",
      render: (_, record) =>
        record.invoiceUrl ? (
          <div className="w-full flex justify-center">
            <a
              href={record.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-primary transition-colors"
              title={t("downloadInvoice")}
            >
              <AppIcon icon="Download" className="w-4 h-4" />
            </a>
          </div>
        ) : null,
    },
  ];

  useEffect(() => {
    fetchSubscription();
    fetchPayments();
  }, [fetchSubscription, fetchPayments]);

  return (
    <>
      <div className="space-y-2">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-1.5 bg-white border border-slate-200 rounded-md shadow-sm text-slate-500">
              <AppIcon icon="CreditCard" className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {t("currentSubscription")}
              </h3>
            </div>
          </div>

          <div className="p-8">
            {loadingSub ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 w-1/3 bg-slate-200 rounded"></div>
                <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
              </div>
            ) : subscription ? (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {t(
                        subscription.product.productName.match(
                          /\(([^)]+)\)/
                        )?.[1] ?? t(subscription.product.productName)
                      )}
                    </h2>
                    <Tag
                      color={
                        subscription.status === "active" ? "success" : "warning"
                      }
                    >
                      {t(`${t(subscription.status)}`).toUpperCase()}
                    </Tag>
                  </div>
                  <p className="text-slate-500">
                    {subscription.product.formattedPrice} /{" "}
                    {t(subscription.product.recurring)}
                  </p>
                  {subscription.daysUntilDue > 0 && (
                    <p className="text-xs text-amber-600 mt-2 font-medium flex items-center gap-1">
                      <AppIcon icon="Clock" className="w-3 h-3" />
                      {subscription.status === "active"
                        ? t("renewsInDays", {
                            count: subscription.daysUntilDue,
                          })
                        : t("endsInDays", { count: subscription.daysUntilDue })}
                    </p>
                  )}
                </div>

                {subscription ? (
                  <Popconfirm
                    title={t("cancelSubscriptionConfirmation.title")}
                    description={t("cancelSubscriptionConfirmation.text")}
                    onConfirm={() => handleCancelSubscription()}
                    okText={t("yes")}
                    cancelText={t("no")}
                    okButtonProps={{
                      danger: true,
                      loading: loadingSub,
                    }}
                  >
                    <Button
                      variant="outline-danger"
                      localizedLabel="cancelSubscription"
                      disabled={loadingSub}
                    />
                  </Popconfirm>
                ) : (
                  <Button
                    variant="primary"
                    localizedLabel="subscribe"
                    onClick={handleOpenPlan}
                  />
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AppIcon
                    icon="CircleAlert"
                    className="w-6 h-6 text-slate-400 stroke-2"
                  />
                </div>
                <p className="text-slate-900 font-medium">
                  {t("noActiveSubscription")}
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  {t("upgradeToUnlock")}
                </p>
                <Button
                  variant="primary"
                  localizedLabel="viewPlans"
                  onClick={handleOpenPlan}
                />
              </div>
            )}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-1.5 bg-white border border-slate-200 rounded-md shadow-sm text-slate-500">
              <AppIcon icon="FileText" className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {t("paymentHistory")}
              </h3>
            </div>
          </div>

          <Table
            dataSource={invoices}
            columns={columns}
            rowKey="id"
            loading={loadingInvoices}
            pagination={{ pageSize: 5, hideOnSinglePage: true }}
            className="p-2"
          />
        </div>
      </div>
      <SubscriptionPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        currentPlanId={subscription?.product?.id}
        isCompanyAccount={
          subscription?.product?.lookupKey?.startsWith("single") === false
        }
        onConfirm={handlePlanConfirm}
      />
    </>
  );
};

export default Subscriptions;
