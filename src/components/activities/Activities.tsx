"use client";

import React from "react";
import { Calendar, Popover, theme } from "antd";
import type { Dayjs } from "dayjs";
import { useTranslation } from "@/stores/TranslationContext";
import { formatDate } from "@/lib/utils/date.utils";
import AppIcon from "@/components/common/ui/AppIcon";
import { useActivities } from "./useActivities";
import { ActivityCalendarItemDto } from "@/services/activities/activities.types";
import Link from "next/link";

const ActivitiesCalendar: React.FC = () => {
  const { token } = theme.useToken();
  const { t, currentLang } = useTranslation();
  const { activitiesByDate } = useActivities({
    startDate: null,
    endDate: null,
  });

  const getListData = (value: Dayjs) => {
    const dateKey = value.format("YYYY-MM-DD");
    return activitiesByDate.get(dateKey) || [];
  };

  const renderPopoverContent = (item: ActivityCalendarItemDto) => (
    <div className="w-72">
      <div className="border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1.5">
          <AppIcon icon="Calendar" className="w-3.5 h-3.5" />
          <span>
            {formatDate(currentLang, item.startDate, true, true)}
            {item.startDate !== item.endDate &&
              ` - ${formatDate(currentLang, item.endDate, true, true)}`}
          </span>
        </div>
        <h4 className="text-base font-bold text-slate-800 leading-snug">
          {item.title}
        </h4>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-1.5 bg-slate-50 rounded-md text-lime-600">
            <AppIcon icon="Briefcase" className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t("case")}
            </p>
            <p className="text-sm font-medium text-slate-700">
              <Link
                href={`/cases/${item.caseId}`}
                className="flex items-center space-x-2"
              >
                <span>{item.caseTitle}</span>
                <AppIcon icon="ExternalLink" className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-1.5 bg-slate-50 rounded-md text-lime-600">
            <AppIcon icon="User" className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t("client")}
            </p>
            <p className="text-sm font-medium text-slate-700">{item.client}</p>
          </div>
        </div>
      </div>
      {item.description && (
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs text-slate-600 leading-relaxed">
          {item.description}
        </div>
      )}
    </div>
  );

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);

    if (listData.length === 0) return null;

    return (
      <ul className="m-0 p-0 list-none space-y-1 mt-1 pr-2">
        {listData.map((item) => (
          <li key={item.id}>
            <Popover
              content={renderPopoverContent(item)}
              trigger="hover"
              placement="rightTop"
              classNames={{
                root: "[&_.ant-popover-inner]:p-4 [&_.ant-popover-inner]:rounded-xl",
              }}
            >
              <div className="group relative flex items-center gap-2 px-2 py-1 bg-white border-l-[4px] border-l-lime-600 border-y border-r border-slate-200 rounded-md shadow-sm hover:shadow-md hover:bg-blue-50/50 hover:border-l-theme-2 transition-all duration-200 cursor-pointer overflow-hidden">
                <span className="text-xs font-medium text-slate-600 group-hover:text-theme-2 truncate select-none transition-colors">
                  {item.title}
                </span>
              </div>
            </Popover>
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (
    current: Dayjs,
    info: { type: string; originNode: React.ReactNode }
  ) => {
    if (info.type === "date") {
      return dateCellRender(current);
    }
    return null;
  };

  return (
    <div
      className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm"
      style={{ border: `1px solid ${token.colorBorderSecondary}` }}
    >
      <Calendar cellRender={cellRender} />
    </div>
  );
};

export default ActivitiesCalendar;
