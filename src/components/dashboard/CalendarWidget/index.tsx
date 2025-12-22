"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
/* eslint-disable  @typescript-eslint/no-unused-vars */
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Popover } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import AppIcon from "@/components/common/ui/AppIcon";
import { useActivities } from "../../activities/useActivities";
import "./CalendarWidget.css";
import { formatDate } from "@/lib/utils/date.utils";
import Link from "next/link";
import { EventImpl } from "@fullcalendar/core/internal";
import dayjs from "dayjs";
import Button from "@/components/common/ui/Button";
import { EventContentArg } from "@fullcalendar/core/index.js";

const CalendarWidget: React.FC = () => {
  const { t, currentLang } = useTranslation();
  const { activities } = useActivities({
    startDate: null,
    endDate: null,
  });

  const [month, setMonth] = useState("");
  const calendarRef = useRef<FullCalendar>(null);

  const events = useMemo(() => {
    return activities.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      start: item.startDate,
      end: item.endDate,
      extendedProps: {
        client: item.client,
        caseTitle: item.caseTitle,
        description: item.description,
      },
      backgroundColor: "rgb(var(--color-theme-2))",
      borderColor: "rgb(var(--color-theme-2))", //"#3b82f6",
    }));
  }, [activities]);

  const renderPopoverContent = (event: EventImpl) => {
    const { extendedProps, start, end, title } = event;
    return (
      <div className="w-72">
        <div className="border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1.5">
            <AppIcon icon="Calendar" className="w-3.5 h-3.5" />
            <span>
              {formatDate(currentLang, start!, true, true)}
              {start !== end &&
                !!end &&
                ` - ${formatDate(currentLang, end, true, true)}`}
            </span>
          </div>
          <h4 className="text-base font-bold text-slate-800 leading-snug">
            {title}
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
                  href={`/cases/${extendedProps.caseId}`}
                  className="flex items-center space-x-2"
                >
                  <span>{extendedProps.caseTitle}</span>
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
              <p className="text-sm font-medium text-slate-700">
                {extendedProps.client}
              </p>
            </div>
          </div>
        </div>
        {extendedProps.description && (
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs text-slate-600 leading-relaxed">
            {extendedProps.description}
          </div>
        )}
      </div>
    );
  };

  const updateMonth = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    const currentMonth = api.formatDate(api.getDate(), { month: "long" });
    setMonth(currentMonth);
  };

  const handlePrev = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    api.prev();
    updateMonth();
  };

  const handleNext = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    api.next();
    updateMonth();
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const event = eventInfo.event as EventImpl;
    return (
      <Popover
        content={renderPopoverContent(event)}
        trigger="hover"
        classNames={{
          root: "[&_.ant-popover-inner]:p-4 [&_.ant-popover-inner]:rounded-xl",
        }}
      >
        <span className="flex items-center">
          <div className="text-[0.6rem]">
            {dayjs(event.start).format("HH:mm")}
          </div>
          <div className="text-[0.7rem] font-semibold ml-1 truncate">
            {event.title}
          </div>
        </span>
      </Popover>
    );
  };

  // const handleEventClick = (info: any) => {
  // };

  useEffect(() => {
    if (!month) {
      updateMonth();
    }
  }, [month]);

  return (
    <div className="box flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm h-full overflow-hidden">
      <div className="flex items-center justify-between p-5 pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2 w-full">
          <div className="bg-indigo-50 rounded-lg text-indigo-600">
            <AppIcon icon="CalendarClock" className="w-5 h-5" />
          </div>
          <div className="flex justify-between w-full">
            <h3 className="font-bold text-slate-800 text-base">
              {t("monthlyActivities")}
            </h3>
            <div className="flex items-center">
              <span className="font-semibold mr-2">{month}</span>
              <Button
                icon="ChevronLeft"
                className="shadow-none border-0 hover:bg-slate-200 p-0"
                iconClassName="mr-0"
                iconDirection="left"
                onClick={handlePrev}
              />
              <Button
                icon="ChevronRight"
                className="ml-1 shadow-none border-0 hover:bg-slate-200 p-0"
                iconClassName="ml-0"
                iconDirection="right"
                onClick={handleNext}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 flex-grow relative min-h-[300px]">
        <FullCalendar
          headerToolbar={false}
          ref={calendarRef}
          firstDay={1}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          locale={currentLang}
          noEventsContent={t("noActivitiesFound")}
          eventContent={renderEventContent}
          buttonText={{
            today: t("today"),
          }}
          fixedWeekCount={false}
          contentHeight={"auto"}
          moreLinkText={t("more")}
          dayMaxEvents={1}
        />
      </div>
    </div>
  );
};

export default CalendarWidget;
