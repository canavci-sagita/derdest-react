import CaseTypeTable from "@/components/definitions/case-types/CaseTypeTable";
import { getTranslationsCached } from "@/lib/i18n/server";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import { getAllCaseTypes } from "@/services/definitions/definitions.service";
import { CaseTypeGridDto } from "@/services/definitions/definitions.types";

export async function generateMetadata() {
  const { t } = await getTranslationsCached();
  return { title: `Derdest AI | ${t("caseTypes")}` };
}

export const dynamic = "force-dynamic";

const CaseTypePage: React.FC = async () => {
  let initialData: PaginatedResponse<CaseTypeGridDto> = {
    items: [],
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  };

  try {
    initialData = await getAllCaseTypes({
      pageNumber: 1,
      pageSize: 10,
      orderBy: ["title asc"],
    });
  } catch (error) {
    console.error("Failed to fetch initial case types:", error);
  }

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="w-full pb-10 overflow-hidden">
          <div className="flex flex-col w-full box box--stacked">
            <CaseTypeTable initialData={initialData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseTypePage;
