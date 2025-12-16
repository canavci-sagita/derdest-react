const DocumentsWidgetSkeleton: React.FC = () => {
  return (
    <div className="max-w-md bg-white overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b border-slate-50 animate-pulse">
        <div className="flex-shrink-0">
          <div className="w-9 h-9 bg-slate-200 rounded"></div>
        </div>
        <div className="flex-grow min-w-0 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded w-32"></div>
            <div className="h-3 bg-slate-200 rounded w-12"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
              <div className="h-3 bg-slate-200 rounded w-24"></div>
            </div>
            <div className="h-3 bg-slate-200 rounded w-16"></div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 border-b border-slate-50 animate-pulse delay-75">
        <div className="flex-shrink-0">
          <div className="w-9 h-9 bg-slate-200 rounded"></div>
        </div>
        <div className="flex-grow min-w-0 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded w-40"></div>
            <div className="h-3 bg-slate-200 rounded w-10"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
              <div className="h-3 bg-slate-200 rounded w-20"></div>
            </div>
            <div className="h-3 bg-slate-200 rounded w-14"></div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 animate-pulse delay-150">
        <div className="flex-shrink-0">
          <div className="w-9 h-9 bg-slate-200 rounded"></div>
        </div>
        <div className="flex-grow min-w-0 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded w-24"></div>
            <div className="h-3 bg-slate-200 rounded w-14"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
              <div className="h-3 bg-slate-200 rounded w-28"></div>
            </div>
            <div className="h-3 bg-slate-200 rounded w-12"></div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsWidgetSkeleton;
