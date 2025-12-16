"use client";

import { CaseSummaryGridDto } from "@/services/cases/cases.types";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import CaseList from "./CaseList";
import CaseTable from "./CaseTable";
import { useCaseView } from "@/stores/CaseViewContext";

const CaseViewRenderer = ({
  initialData,
}: {
  initialData: PaginatedResponse<CaseSummaryGridDto>;
}) => {
  const { viewMode } = useCaseView();

  return viewMode === "list" ? (
    <CaseList initialData={initialData} />
  ) : (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="w-full pb-10 overflow-hidden">
          <div className="flex flex-col w-full box box--stacked">
            <CaseTable initialData={initialData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseViewRenderer;
