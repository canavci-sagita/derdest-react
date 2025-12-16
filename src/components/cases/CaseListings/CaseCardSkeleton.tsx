"use client";

const CaseCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col animate-pulse">
      <div className="p-5">
        <div className="h-5 bg-slate-200 rounded w-3/4"></div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-5 bg-slate-200 rounded-full w-20"></div>
        </div>
      </div>
      <div className="px-5 py-4 bg-slate-50 border-y border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-slate-200"></div>
            <div className="ml-3 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-24"></div>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="h-3 bg-slate-200 rounded w-12 ml-auto"></div>
            <div className="h-4 bg-slate-200 rounded w-20 ml-auto"></div>
          </div>
        </div>
      </div>
      <div className="p-5 flex-grow">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
        </div>
      </div>
      <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between rounded-b-xl">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-8 bg-slate-200 rounded-md w-24"></div>
      </div>
    </div>
  );
};

export default CaseCardSkeleton;
