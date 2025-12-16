import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import { getAllCasesSummary } from "@/services/cases/cases.service";
import { CaseSummaryGridDto } from "@/services/cases/cases.types";
import CaseViewRenderer from "@/components/cases/CaseListings/CaseViewRenderer";
import { cookies } from "next/headers";
import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";
import { CaseViewProvider } from "@/stores/CaseViewContext";
import { getTranslationsCached } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getTranslationsCached();
  return { title: `Derdest AI | ${t("cases")}` };
}

const CasesPage: React.FC = async () => {
  let initialData: PaginatedResponse<CaseSummaryGridDto> = {
    items: [],
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  };

  initialData = await getAllCasesSummary({
    pageNumber: 1,
    pageSize: 10,
    orderBy: ["date asc"],
  });

  const cookieStore = await cookies();
  const viewModeCookie = cookieStore.get(
    COOKIE_CONSTANTS.CASES_VIEW_MODE
  )?.value;
  const initialViewMode = viewModeCookie === "table" ? "table" : "list";

  return (
    <CaseViewProvider initialViewMode={initialViewMode}>
      <CaseViewRenderer initialData={initialData} />
    </CaseViewProvider>
  );
};

export default CasesPage;
