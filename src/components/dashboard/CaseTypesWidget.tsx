"use client";

import React from "react";
import { useTranslation } from "@/stores/TranslationContext";
import AppIcon from "@/components/common/ui/AppIcon";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  TooltipContentProps,
} from "recharts";
import { getCaseTypeStatsAction } from "@/actions/reports.actions";

export type CaseTypeStatDto = {
  name: string;
  count: number;
};

interface CaseTypePieDto extends CaseTypeStatDto {
  color: string;
  percentage: number;
  [key: string]: unknown;
}

const COLORS = [
  "#3b82f6", // Blue 500
  "#10b981", // Emerald 500
  "#8b5cf6", // Violet 500
  "#f59e0b", // Amber 500
  "#f43f5e", // Rose 500
  "#06b6d4", // Cyan 500
  "#f97316", // Orange 500
  "#d946ef", // Fuchsia 500
  "#84cc16", // Lime 500
  "#6366f1", // Indigo 500
  "#14b8a6", // Teal 500
  "#ec4899", // Pink 500
  "#64748b", // Slate 500
  "#0ea5e9", // Sky 500
];

const CaseTypesPieChartWidget: React.FC = () => {
  const { t } = useTranslation();

  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ["case-type-stats"],
    queryFn: async () => {
      const response = await getCaseTypeStatsAction();

      if (response.isSuccess && response.result) {
        return response.result;
      }
      return [];
    },
    select: (data: CaseTypeStatDto[]): CaseTypePieDto[] => {
      const total = data.reduce((acc, item) => acc + item.count, 0);

      return data.map((item, index) => ({
        ...item,
        percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
        color: COLORS[index % COLORS.length],
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
  const CustomTooltip = ({
    active,
    payload,
  }: TooltipContentProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-lg text-xs z-50">
          <p className="font-bold text-slate-700 mb-1">{data.name}</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span className="font-bold text-sm" style={{ color: data.color }}>
              {data.count}
            </span>
            <span>
              {t("case_s")} ({data.percentage}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="box flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm h-full min-h-[350px] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <AppIcon icon="ChartPie" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">
              {t("casesByType")}
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
            <AppIcon icon="ChartPie" className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            {t("casessByType")}
          </h3>
        </div>
      </div>
      {chartData.length > 0 ? (
        <div className="flex-grow flex flex-col sm:flex-row items-center justify-between">
          <div className="w-full sm:w-3/5 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="count" isAnimationActive={true}>
                  {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}{" "}
                </Pie>
                <Tooltip content={CustomTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full sm:w-2/5 flex flex-col justify-center pr-4">
            <ul className="space-y-3">
              {chartData.map((item, index) => (
                <li
                  key={index}
                  className="border-b flex items-center justify-between text-xs group cursor-default"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shadow-sm ring-1 ring-white"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="font-bold text-xs"
                      style={{ color: item.color }}
                    >
                      {item.count}
                    </span>
                    <span className="text-xs text-slate-400 w-8 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
          <AppIcon icon="ChartPie" className="w-10 h-10 mb-2 opacity-20" />
          <p className="text-sm">{t("noCasesFound")}</p>
        </div>
      )}
    </div>
  );
};

export default CaseTypesPieChartWidget;
