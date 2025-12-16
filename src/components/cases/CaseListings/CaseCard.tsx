"use client";

import { CaseSummaryGridDto } from "@/services/cases/cases.types";
import { useTranslation } from "@/stores/TranslationContext";
import AppIcon from "../../common/ui/AppIcon";
import { Avatar, Popconfirm } from "antd";
import Link from "next/link";
import { formatDate, formatRelativeTime } from "@/lib/utils/date.utils";
import cssClasses from "./CaseCard.module.css";
import { twMerge } from "tailwind-merge";

interface CaseCardProps {
  item: CaseSummaryGridDto;
  onDelete: (id: number) => void;
}

const CaseCard: React.FC<CaseCardProps> = ({ item, onDelete }) => {
  const { t, currentLang } = useTranslation();

  return (
    <div
      className={twMerge([
        "relative bg-white border border-slate-200 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col",
        cssClasses["case-card-container"],
      ])}
    >
      <Popconfirm
        title={t("deleteConfirmation.title")}
        description={t("deleteConfirmation.text")}
        onConfirm={() => onDelete(item.id)}
        okText={t("yes")}
        cancelText={t("no")}
        okButtonProps={{ danger: true }}
      >
        <button className="p-1 border bg-primary/20 flex items-center rounded-full hover:text-red-500 hover:bg-red-200/60">
          <AppIcon className="h-4 w-4 stroke-1.5" icon="X" />
        </button>
      </Popconfirm>
      <div className="p-5">
        <Link
          className="text-base text-theme-1 font-semibold hover:text-theme-1 hover:text-opacity-75"
          href={`/cases/${item.id}`}
        >
          {item.title}
        </Link>
        <div className="mt-1 flex items-baseline justify-between">
          <p className="text-sm text-slate-500 mt-1">
            {t("case")} {t("tableHeader.id")}: <b>#{item.id}</b>
          </p>
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-theme-2 text-amber-100">
            {item.caseType}
          </span>
        </div>
      </div>
      <div className="px-5 py-4 bg-slate-50 border-y border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="!bg-primary" size={40}>
              {item.client.split(" ")[0].substring(0, 1)}
              {item.client.split(" ")[1].substring(0, 1)}
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-semibold text-slate-700">
                {item.client}
              </p>
              {/* <p className="text-xs text-slate-500">{item.petitionType}</p> */}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">{t("date")}</p>
            <p className="text-xs font-medium text-slate-700">
              {formatDate(currentLang, item.date, false, false)}
            </p>
          </div>
        </div>
      </div>
      <div className="p-5">
        {/* <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-slate-700">
              Progress
            </span>
            <span className="text-sm font-medium text-slate-700">
              {(item.evidenceCount / 10) * 100;}%
            </span>
          </div>
          <Progress percent={(item.evidenceCount / 10) * 100;} showInfo={false} />
        </div> */}
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="flex items-center text-slate-600">
            <AppIcon
              icon="FileText"
              className="w-4 h-4 mr-2 text-slate-400 stroke-2"
            />
            {item.evidenceCount} {t("evidence_s")}
          </div>
          <div className="flex items-center text-slate-600">
            <AppIcon
              icon="List"
              className="w-4 h-4 mr-2 text-slate-400 stroke-2"
            />
            {item.timelineCount} {t("timeline_s")}
          </div>
          <div className="flex items-center text-slate-600">
            <AppIcon
              icon="Users"
              className="w-4 h-4 mr-2 text-slate-400 stroke-2"
            />
            {item.partyCount} {t("partie_s")}
          </div>
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-darkmode-800 border-t border-slate-200 dark:border-darkmode-700 flex items-center justify-between rounded-b-xl">
        <p className="text-xs text-slate-500">
          <b>{`${t("lastUpdated")}: `}</b>
          {formatRelativeTime(currentLang, item.lastModifiedOn)}
        </p>
        <Link
          href={`/cases/${item.id}`}
          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-md shadow-sm hover:bg-primary-700 hover:text-white [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90"
        >
          {t("viewDetails")}
        </Link>
      </div>
    </div>
  );
};

export default CaseCard;
