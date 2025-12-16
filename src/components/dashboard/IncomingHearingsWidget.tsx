"use client";

import React from "react";
import { Spin } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import AppIcon from "@/components/common/ui/AppIcon";
import { useQuery } from "@tanstack/react-query";

// Fake Data Model
interface HearingDto {
  id: number;
  date: Date;
  caseTitle: string;
  type: string;
  location: string;
  time: string;
  status: "upcoming" | "urgent" | "completed";
}

const IncomingHearingsWidget: React.FC = () => {
  const { t } = useTranslation();

  const { data: hearings = [], isLoading } = useQuery({
    queryKey: ["incoming-hearings"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      return [
        {
          id: 1,
          date: new Date(new Date().setDate(new Date().getDate() + 2)),
          caseTitle: "Yılmaz vs. Demir (İş Davası)",
          type: "Duruşma",
          location: "İstanbul 12. İş Mahkemesi",
          time: "09:30",
          status: "urgent",
        },
        {
          id: 2,
          date: new Date(new Date().setDate(new Date().getDate() + 5)),
          caseTitle: "ABC Lojistik - Alacak Davası",
          type: "Bilirkişi İncelemesi",
          location: "Ankara 3. Asliye Ticaret",
          time: "14:00",
          status: "upcoming",
        },
        {
          id: 3,
          date: new Date(new Date().setDate(new Date().getDate() + 12)),
          caseTitle: "Boşanma Davası (K.T. - M.T.)",
          type: "Tanık Dinleme",
          location: "İzmir 5. Aile Mahkemesi",
          time: "10:15",
          status: "upcoming",
        },
        {
          id: 4,
          date: new Date(new Date().setDate(new Date().getDate() + 20)),
          caseTitle: "Gayrimenkul Ortaklığın Giderilmesi",
          type: "Keşif",
          location: "Bursa Sulh Hukuk",
          time: "11:00",
          status: "upcoming",
        },
      ] as HearingDto[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const getDateParts = (date: Date) => {
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("tr-TR", { month: "short" }).toUpperCase(),
    };
  };

  if (isLoading) {
    return (
      <div className="box flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm h-full overflow-hidden min-h-[350px]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <AppIcon icon="Gavel" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">
              {t("incomingHearings")}
            </h3>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <Spin />
        </div>
      </div>
    );
  }

  return (
    <div className="box flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm h-full overflow-hidden min-h-[350px]">
      <div className="flex items-center justify-between p-5 pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-50 rounded-lg text-indigo-600">
            <AppIcon icon="Gavel" className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            {t("incomingHearings")}
          </h3>
        </div>
      </div>
      <div className="flex-grow relative">
        {hearings.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
            <AppIcon icon="Gavel" className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm">{t("noHearingsFound")}</p>
          </div>
        )}
        <div className="divide-y divide-slate-50">
          {hearings.length > 0 &&
            hearings.map((item) => {
              const dateParts = getDateParts(item.date);
              const isUrgent = item.status === "urgent";
              return (
                <div
                  key={item.id}
                  className="group flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center border ${
                      isUrgent
                        ? "bg-rose-50 text-rose-600 border-rose-100"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    <span className="text-[10px] font-bold leading-none mb-0.5">
                      {dateParts.month}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {dateParts.day}
                    </span>
                  </div>
                  <div className="flex-grow min-w-0 pt-0.5">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-slate-700 truncate group-hover:text-purple-700 transition-colors mb-1">
                        {item.caseTitle}
                      </h4>
                      {isUrgent && (
                        <span className="flex-shrink-0 px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold uppercase rounded-full">
                          {t("urgent")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <AppIcon icon="Clock" className="w-3 h-3" />
                        <span className="font-medium">{item.time}</span>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <AppIcon icon="MapPin" className="w-3 h-3" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                    <div className="mt-1.5 inline-flex items-center gap-1.5">
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default IncomingHearingsWidget;
