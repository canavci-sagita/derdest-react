"use client";

import React from "react";

const DocumentCardSkeleton: React.FC = () => {
  return (
    <div className="shadow-sm rounded-md relative px-2 text-center overflow-hidden animate-pulse">
      <div className="h-10 w-8 bg-slate-200 rounded-md flex-shrink-0 mx-auto mt-[0.5]"></div>
      <div className="flex flex-col items-center space-y-2 mt-3">
        <p className="h-3 bg-slate-200 rounded w-2/3"></p>
        <p className="h-3 bg-slate-200 rounded w-1/3"></p>
      </div>
    </div>
  );
};

export default DocumentCardSkeleton;
