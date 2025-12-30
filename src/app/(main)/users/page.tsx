import { getUserLimitAction } from "@/actions/products.actions";
import UserTable from "@/components/users/UserTable";
import { ROLE_CONSTANTS } from "@/lib/constants/role.constants";
import { getTranslationsCached } from "@/lib/i18n/server";
import { getAuthenticatedUser } from "@/lib/session";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import {
  getAllTenantUsers,
  getAllUsers,
} from "@/services/users/users.services";
import { TenantUserGridDto, UserGridDto } from "@/services/users/users.types";

export async function generateMetadata() {
  const { t } = await getTranslationsCached();
  return { title: `Derdest AI | ${t("users")}` };
}

const UsersPage: React.FC = async () => {
  let initialData: PaginatedResponse<UserGridDto | TenantUserGridDto> = {
    items: [],
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  };

  const currentUser = await getAuthenticatedUser();
  const fetch =
    currentUser?.role === ROLE_CONSTANTS.SUPER_ADMIN
      ? getAllUsers
      : getAllTenantUsers;

  initialData = await fetch({
    pageNumber: 1,
    pageSize: 10,
    orderBy: ["fullName asc"],
  });

  let userLimit = null;

  if (currentUser?.role != ROLE_CONSTANTS.SUPER_ADMIN) {
    userLimit = await getUserLimitAction();
  }

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="w-full pb-10 overflow-hidden">
          <div className="flex flex-col w-full box box--stacked">
            <UserTable
              initialData={initialData}
              role={currentUser?.role || ROLE_CONSTANTS.USER}
              userLimit={userLimit?.result}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
