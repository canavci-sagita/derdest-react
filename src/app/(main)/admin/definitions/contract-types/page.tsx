import ContractTypeTable from "@/components/definitions/contract-types/ContractTypeTable";
import { getTranslationsCached } from "@/lib/i18n/server";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import { getAllContractTypes } from "@/services/definitions/definitions.service";
import { ContractTypeGridDto } from "@/services/definitions/definitions.types";

export async function generateMetadata() {
  const { t } = await getTranslationsCached();
  return { title: `Derdest AI | ${t("contractTypes")}` };
}

export const dynamic = "force-dynamic";

const ContractTypePage: React.FC = async () => {
  let initialData: PaginatedResponse<ContractTypeGridDto> = {
    items: [],
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  };

  try {
    initialData = await getAllContractTypes({
      pageNumber: 1,
      pageSize: 10,
      orderBy: ["title asc"],
    });
  } catch (error) {
    console.error("Failed to fetch initial contract types:", error);
  }

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="w-full pb-10 overflow-hidden">
          <div className="flex flex-col w-full box box--stacked">
            <ContractTypeTable initialData={initialData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractTypePage;
