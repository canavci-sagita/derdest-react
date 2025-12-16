import { useTranslation } from "@/stores/TranslationContext";
import AppIcon from "../common/ui/AppIcon";
import { useQuery } from "@tanstack/react-query";
import { getClientStatsAction } from "@/actions/reports.actions";

const ClientsWidget: React.FC = () => {
  const { t } = useTranslation();

  const { data: stats } = useQuery({
    queryKey: ["client-stats"],
    queryFn: async () => {
      const response = await getClientStatsAction();
      if (response.isSuccess) {
        return response.result;
      }
    },
    staleTime: 1000 * 60 * 15,
  });

  return (
    <div className="box flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm h-full overflow-hidden">
      <div className="flex items-center justify-between p-5 pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-50 rounded-lg text-indigo-600">
            <AppIcon icon="Users" className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">{t("clients")}</h3>
        </div>
      </div>
      <div className="p-5 grid grid-cols-2 gap-4 flex-grow">
        <div className="col-span-2 bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              {t("totalClients")}
            </p>
            <h4 className="text-3xl font-bold text-slate-800">
              {stats?.totalClients}
            </h4>
          </div>
          <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
            <AppIcon icon="User" className="w-6 h-6" />
          </div>
        </div>
        <div className="col-span-1 bg-white rounded-xl p-4 border border-slate-100 flex flex-col justify-between shadow-sm hover:border-emerald-200 transition-colors group">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></div>
            <span className="text-xs font-semibold text-slate-600 group-hover:text-emerald-600 transition-colors">
              {t("active")}
            </span>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-800">
              {stats?.activeClients}
            </span>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${stats?.activeClientsPercentage || 0}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 text-right font-medium">
              {stats?.activeClientsPercentage}% of total
            </p>
          </div>
        </div>
        <div className="col-span-1 bg-white rounded-xl p-4 border border-slate-100 flex flex-col justify-between shadow-sm hover:border-blue-200 transition-colors group">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 ring-2 ring-blue-100"></div>
            <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">
              {t("newThisMonth")}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-800">
              +{stats?.newClientsThisMonth}
            </span>
            <div className="mb-1 text-emerald-500 bg-emerald-50 p-1 rounded-md">
              <AppIcon icon="TrendingUp" className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsWidget;
