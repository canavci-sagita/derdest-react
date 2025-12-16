"use client";

import React, { useState } from "react";
import AppIcon, { icons } from "@/components/common/ui/AppIcon";
import { useTranslation } from "@/stores/TranslationContext";
import { Avatar, Radio, RadioChangeEvent, Space } from "antd";
import Button from "@/components/common/ui/Button";
import { useRouter } from "next/navigation";
import CaseSummary from "./CaseSummary";
import { CaseSummaryDto } from "@/services/cases/cases.types";
import Timelines from "./Timelines";
import Evidences from "./Evidences";
import Parties from "./Parties";
import Petitions from "./Petitions";
import Documents from "./Documents";

type CaseDetailTab =
  | "summary"
  | "timelines"
  | "evidences"
  | "parties"
  | "petitions"
  | "documents"
  | "logs";

interface CaseDetailsProps {
  initialData: CaseSummaryDto;
}

const CaseDetails: React.FC<CaseDetailsProps> = ({ initialData }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<CaseDetailTab>("summary");

  const tabs = [
    { id: "summary", label: t("summary"), icon: "FileText" },
    { id: "timelines", label: t("timelines"), icon: "ChartNoAxesGantt" },
    { id: "evidences", label: t("evidences"), icon: "FileJson" },
    { id: "parties", label: t("parties"), icon: "Users" },
    { id: "petitions", label: t("petitions"), icon: "ClipboardList" },
    { id: "documents", label: t("documents"), icon: "Folders" },
  ];

  const handleTabChange = (e: RadioChangeEvent) => {
    setActiveTab(e.target.value as CaseDetailTab);
  };

  return (
    <>
      <header className="mb-8">
        <div className="bg-white dark:bg-darkmode-800 border border-slate-200 dark:border-darkmode-700 rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 dark:bg-darkmode-700">
                  <AppIcon icon="FileKey2" className="w-5 h-5 text-slate-500" />
                </div>
                <div className="ml-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t("case")} {t("tableHeader.id")}
                  </p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    #{initialData.summary.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 dark:bg-darkmode-700">
                  <AppIcon icon="Captions" className="w-5 h-5 text-slate-500" />
                </div>
                <div className="ml-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t("tableHeader.title")}
                  </p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {initialData.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Avatar className="bg-primary" size={40}>
                  {initialData.client.split(" ")[0].substring(0, 1)}
                  {initialData.client.split(" ")[1].substring(0, 1)}
                </Avatar>
                <div className="ml-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t("tableHeader.client")}
                  </p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {initialData.client}
                  </p>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="outline-primary"
              className="text-sm font-medium text-slate-600"
              localizedLabel="backToCases"
              iconDirection="left"
              icon="ArrowLeft"
              onClick={() => router.push("/cases")}
            />
          </div>
        </div>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <Radio.Group
          value={activeTab}
          onChange={handleTabChange}
          className="w-full"
        >
          <Space direction="vertical" className="!w-full">
            {tabs.map((tab) => (
              <Radio.Button
                key={tab.id}
                value={tab.id}
                className="!h-auto !px-3 !py-2 !text-sm !font-medium !rounded-md w-full"
              >
                <span className="flex items-center">
                  <AppIcon
                    icon={tab.icon as keyof typeof icons}
                    className="w-5 h-5 mr-3"
                  />
                  {tab.label}
                </span>
              </Radio.Button>
            ))}
          </Space>
        </Radio.Group>
        <div className="md:col-span-4">
          {activeTab === "summary" && <CaseSummary data={initialData} />}
          {activeTab === "timelines" && (
            <Timelines caseId={initialData.summary.id} />
          )}
          {activeTab === "evidences" && (
            <Evidences caseId={initialData.summary.id} />
          )}
          {activeTab === "parties" && (
            <Parties caseId={initialData.summary.id} />
          )}
          {activeTab === "petitions" && (
            <Petitions caseId={initialData.summary.id} />
          )}
          {activeTab === "documents" && (
            <Documents caseId={initialData.summary.id} />
          )}
        </div>
      </main>
    </>
  );
};

export default CaseDetails;
