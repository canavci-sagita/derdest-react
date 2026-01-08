"use client";

import AppIcon from "@/components/common/ui/AppIcon";
import { useTranslation } from "@/stores/TranslationContext";

const ProfileLoading: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-2 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-500">
              <AppIcon icon="Briefcase" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {t("accountDetails")}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t("accountDetails.hint")}
              </p>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="h-4 w-20 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 w-full bg-slate-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-20 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 w-full bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-500">
              <AppIcon icon="Settings" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {t("appSettings")}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t("appSettings.hint")}
              </p>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <div className="h-4 w-20 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 w-full bg-slate-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-20 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 w-full bg-slate-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-20 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 w-full bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-500">
              <AppIcon icon="MapPin" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {t("address")}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t("address.hint")}
              </p>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 w-full bg-slate-200 rounded"></div>
            </div>
            <div className="md:col-span-2">
              <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 w-full bg-slate-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-16 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 w-full bg-slate-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-16 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 w-full bg-slate-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-16 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 w-full bg-slate-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-20 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 w-full bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLoading;
