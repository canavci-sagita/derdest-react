"use client";

import React from "react";

const DocumentFolderSkeleton: React.FC = () => {
  return (
    <div className="bg-white flex flex-col animate-pulse">
      <div className="h-8 bg-slate-200 rounded-md w-full"></div>
    </div>
  );
};

export default DocumentFolderSkeleton;
