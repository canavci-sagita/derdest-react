import { useTranslation } from "@/stores/TranslationContext";
import AppIcon from "../common/ui/AppIcon";
import { getLatestCasesAction } from "@/actions/reports.actions";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { formatDate } from "@/lib/utils/date.utils";
import { Spin } from "antd";

const LatestCasesWidget: React.FC = () => {
  const { t, currentLang } = useTranslation();

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ["latest-cases"],
    queryFn: async () => {
      const response = await getLatestCasesAction();

      if (response.isSuccess && response.result) {
        return response.result;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="box flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm h-full min-h-[300px] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <AppIcon icon="Briefcase" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">
              {t("latestCases")}
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
    <div className="box flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm h-full overflow-hidden">
      <div className="flex items-center justify-between p-5 pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-50 rounded-lg text-indigo-600">
            <AppIcon icon="Briefcase" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              {t("latestCases")}
            </h3>
          </div>
        </div>
      </div>
      <div className="flex-grow relative min-h-[300px]">
        {cases.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {cases.map((item) => (
              <Link
                key={item.caseId}
                href={`/cases/${item.caseId}`}
                className="group flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                  <AppIcon icon="Briefcase" className="w-5 h-5 stroke-[1.5]" />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-slate-700 truncate group-hover:text-blue-700 transition-colors mb-0.5">
                      {item.title}
                    </h4>
                    <span className="text-xs text-slate-400 whitespace-nowrap ml-2 flex-shrink-0">
                      {formatDate(currentLang, item.date, false, false)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <AppIcon icon="User" className="w-3 h-3 text-slate-400" />
                    <span className="font-medium truncate">{item.client}</span>
                  </div>
                </div>

                <div className="flex-shrink-0 text-slate-300 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100">
                  <AppIcon icon="ChevronRight" className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
            <AppIcon icon="Briefcase" className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm">{t("noCasesFound")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestCasesWidget;
