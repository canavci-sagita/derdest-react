"use client";

import React from "react";

const PetitionCardSkeleton: React.FC = () => {
  return (
    <div className="isolate bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col relative before:content-[''] before:absolute before:w-full before:h-full before:bg-white before:rounded-lg before:border before:border-slate-200 before:shadow-sm before:inset-0 before:transform before:-translate-y-2 before:rotate-[1.5deg] before:z-[-1] animate-pulse">
      <div className="p-4 pr-2 pb-2 border-b border-slate-200 animate-pulse">
        <div className="flex justify-between items-center gap-4">
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-4 bg-slate-200 rounded w-20 flex-shrink-0"></div>
        </div>
        <div className="h-6 bg-slate-200 rounded w-48 mt-2"></div>
      </div>
      <div className="py-2 px-4 flex-grow space-y-4 text-sm animate-pulse">
        <div className="space-y-1">
          <div className="h-3 bg-slate-200 rounded w-16"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
        </div>
        <div className="space-y-1">
          <div className="h-3 bg-slate-200 rounded w-20"></div>
          <div className="h-3 bg-slate-200 rounded w-full"></div>
        </div>
      </div>
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs space-y-2 animate-pulse">
        <div className="flex justify-between">
          <div className="h-3 bg-slate-200 rounded w-1/4"></div>
          <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-slate-200 rounded w-1/3"></div>
          <div className="h-3 bg-slate-200 rounded w-1/4"></div>
        </div>
      </div>
      <div className="p-2 border-t border-slate-200 flex justify-between items-center gap-1 animate-pulse">
        <div className="flex space-x-1">
          <div className="h-6 w-6 bg-slate-200 rounded-md"></div>
          <div className="h-6 w-6 bg-slate-200 rounded-md"></div>
        </div>
        <div className="flex space-x-1">
          <div className="h-6 w-6 bg-slate-200 rounded-md"></div>
          <div className="h-6 w-6 bg-slate-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default PetitionCardSkeleton;
