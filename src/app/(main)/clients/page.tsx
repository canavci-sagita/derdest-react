import ClientTable from "@/components/clients/ClientTable";
import { getTranslationsCached } from "@/lib/i18n/server";
import { getAllClients } from "@/services/clients/clients.service";
import { ClientGridDto } from "@/services/clients/clients.types";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";

export async function generateMetadata() {
  const { t } = await getTranslationsCached();
  return { title: `Derdest AI | ${t("clients")}` };
}

const ClientsPage: React.FC = async () => {
  let initialData: PaginatedResponse<ClientGridDto> = {
    items: [],
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  };

  initialData = await getAllClients({
    pageNumber: 1,
    pageSize: 10,
    orderBy: ["fullName asc"],
    searchText: "",
  });

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="w-full pb-10 overflow-hidden">
          <div className="flex flex-col w-full box box--stacked">
            <ClientTable initialData={initialData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
