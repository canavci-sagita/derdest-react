import AppIcon from "@/components/common/ui/AppIcon";

const ProfileLoading: React.FC = () => {
  return (
    <div className="space-y-2 animate-pulse">
      <div className=" flex flex-col">
        <div className="relative h-32 w-full rounded-[0.6rem] rounded-b-none bg-gradient-to-b from-theme-1/95 to-theme-2/95">
          <div className="w-full h-full relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-texture-white before:-mt-[50rem] after:content-[''] after:absolute after:inset-0 after:bg-texture-white after:-mt-[50rem]"></div>
          <div className="absolute inset-x-0 top-0 mx-auto mt-8 h-32 w-32">
            <div className="bg-slate-200 box image-fit h-full w-full overflow-hidden rounded-full border-[6px] border-white flex items-center justify-center shadow-md"></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-y-3 rounded-[0.6rem] rounded-t-none bg-slate-50 p-5 sm:flex-row sm:items-end sm:justify-between border !border-t-0 border-slate-200">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="h-8 w-48 bg-slate-200 rounded-lg mb-1"></span>
            <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm">
              <AppIcon icon="Mail" className="w-3.5 h-3.5 stroke-[1]" />
              <span className="h-4 w-32 bg-slate-200 rounded-lg"></span>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 mb-1">
            <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-500">
                <AppIcon icon="Briefcase" className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  accountDetails
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your official legal identification and registration.
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
                  appSettings
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Preferences for language and legal jurisdiction.
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
                  address
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your primary business or correspondence address.
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
    </div>
  );
};

export default ProfileLoading;
