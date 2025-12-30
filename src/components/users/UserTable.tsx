"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { App, Space, TableProps, Tooltip, Avatar, Switch, Popover } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import {
  changeEmailConfirmationStatusAction,
  changeActiveStatusAction,
  getAllUsersAction,
  getAllTenantUsersAction,
  reinviteUserAction,
} from "@/actions/users.actions";
import {
  UserGridDto,
  UserFilterRequest,
  TenantUserGridDto,
} from "@/services/users/users.types";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import { useDebounce } from "@/lib/hooks/useDebounce";

import { DataTable } from "@/components/common/data-table";
import AppIcon from "@/components/common/ui/AppIcon";
import Button from "@/components/common/ui/Button";
import FormInput from "@/components/common/forms/FormInput";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserTableFilters from "./UserTableFilters";
import UserProfileSummary from "./UserProfileSummary";
import { ROLE_CONSTANTS } from "@/lib/constants/role.constants";
import InviteUserModal from "./InviteUserModal";
import React from "react";
import { ColumnType } from "antd/es/table";
import { twMerge } from "tailwind-merge";
import LoadingIcon from "../common/ui/LoadingIcon";

interface UserTableProps {
  initialData: PaginatedResponse<UserGridDto | TenantUserGridDto>;
  role: string;
  userLimit?: number | null;
}

const UserTable: React.FC<UserTableProps> = ({
  initialData,
  role,
  userLimit,
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const router = useRouter();

  const [statusUpdates, setStatusUpdates] = useState<
    Record<number, Partial<Pick<UserGridDto, "isActive" | "emailConfirmed">>>
  >({});

  const [tableKey, setTableKey] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<UserFilterRequest>({
    searchText: "",
  });
  //TODO: Search Text will be handled in filters.searchText.
  //Also will be cleared on handleClearFilters.
  const [searchText, setSearchText] = useState("");
  const [loadingSwitchId, setLoadingSwitchId] = useState<string | null>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviting, setInviting] = useState(false);

  const debouncedSearchText = useDebounce(searchText, 500);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "searchText" && value != null
  ).length;

  const handleApplyFilters = (newFilters: UserFilterRequest) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFilters((prev) => ({ searchText: prev.searchText }));
    setIsFilterOpen(false);
  };

  //TODO: Will be checked and optimized if necessary.
  const handleStatusChange = useCallback(
    async (appUserId: number, isActive: boolean) => {
      setLoadingSwitchId(`status-${appUserId}`);
      const response = await changeActiveStatusAction(appUserId, isActive);
      setLoadingSwitchId(null);
      if (response.isSuccess) {
        setStatusUpdates((prev) => ({
          ...prev,
          [appUserId]: { ...prev[appUserId], isActive: isActive },
        }));
        message.success(response.messages);
      } else {
        message.error(response.messages);
      }
    },
    [message]
  );

  //TODO: Will be checked and optimized if necessary.
  const handleEmailConfirmationChange = useCallback(
    async (appUserId: number, emailConfirmed: boolean) => {
      setLoadingSwitchId(`email-${appUserId}`);
      const response = await changeEmailConfirmationStatusAction(
        appUserId,
        emailConfirmed
      );
      setLoadingSwitchId(null);
      if (response.isSuccess) {
        setStatusUpdates((prev) => ({
          ...prev,
          [appUserId]: { ...prev[appUserId], emailConfirmed: emailConfirmed },
        }));
        message.success(response.messages);
      } else {
        message.error(response.messages);
      }
    },
    [message]
  );

  const handleAddOrInvite = useCallback(async () => {
    if (role === ROLE_CONSTANTS.SUPER_ADMIN) {
      router.push("/users/new");
    } else {
      setIsModalOpen(true);
    }
  }, [role, router]);

  const handleCloseModal = useCallback((shouldRefetch?: boolean) => {
    setIsModalOpen(false);
    if (shouldRefetch) {
      setTableKey((prev) => prev + 1);
    }
  }, []);

  const handleReinviteUser = useCallback(
    async (appUserId: number) => {
      setInviting(true);
      const response = await reinviteUserAction(appUserId);
      setInviting(false);
      if (response.isSuccess) {
        message.success(response.messages);
      } else {
        message.error(response.messages);
      }
    },
    [message]
  );

  const mergedColumns = useMemo(() => {
    const baseColumns: TableProps<UserGridDto>["columns"] = [
      {
        title: t("tableHeader.id"),
        dataIndex: "id",
        key: "id",
        sorter: true,
      },
      {
        title: t("tableHeader.user"),
        dataIndex: "fullName",
        key: "fullName",
        sorter: true,
        render: (_, record) => {
          const fullName = `${record.firstName} ${record.lastName}`;
          const nameClasses =
            "font-bold whitespace-nowrap text-theme-1 hover:text-theme-1";
          const initials = `${record.firstName.substring(
            0,
            1
          )}${record.lastName.substring(0, 1)}`;

          return (
            <div className="flex items-center">
              <div className="w-9 h-9">
                <Avatar size={40}>{`${initials}`}</Avatar>
              </div>
              <div className="ml-3.5">
                {role === ROLE_CONSTANTS.SUPER_ADMIN ? (
                  <Link className={nameClasses} href={`/users/${record.id}`}>
                    {fullName}
                  </Link>
                ) : (
                  <span className={nameClasses}>{fullName}</span>
                )}
                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                  {record.email}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: t("tableHeader.nationalId"),
        dataIndex: "nationalId",
        key: "profile.nationalId",
        sorter: true,
      },
      {
        title: t("tableHeader.barRegistrationNo"),
        dataIndex: "barRegistrationNo",
        key: "barRegistrationNo",
        sorter: true,
      },
      {
        title: t("tableHeader.phoneNo"),
        dataIndex: "phoneNo",
        key: "phoneNo",
      },
      {
        title: t("tableHeader.status"),
        dataIndex: "isActive",
        key: "isActive",
        align: "center",
        sorter: true,
        render: (isActive: boolean, record) => {
          const currentChecked = statusUpdates[record.id]?.isActive ?? isActive;
          var tenantRecord = record as TenantUserGridDto;
          return (
            <Switch
              disabled={tenantRecord.isInvitationPending}
              size="small"
              checkedChildren={
                <AppIcon icon="Check" className="text-white w-4 h-4 stroke-2" />
              }
              unCheckedChildren={
                <AppIcon icon="X" className="text-white w-4 h-4 stroke-2" />
              }
              checked={currentChecked}
              loading={loadingSwitchId === `status-${tenantRecord.id}`}
              onChange={(checked) =>
                handleStatusChange(tenantRecord.id, checked)
              }
            />
          );
        },
      },
    ];

    const superAdminColumns: TableProps<UserGridDto>["columns"] = [
      {
        title: t("tableHeader.emailConfirmed"),
        dataIndex: "emailConfirmed",
        key: "emailConfirmed",
        align: "center",
        sorter: true,
        render: (emailConfirmed: boolean, record) => {
          const currentChecked =
            statusUpdates[record.id]?.emailConfirmed ?? emailConfirmed;
          return (
            <Switch
              size="small"
              checkedChildren={
                <AppIcon icon="Check" className="text-white w-4 h-4 stroke-2" />
              }
              unCheckedChildren={
                <AppIcon icon="X" className="text-white w-4 h-4 stroke-2" />
              }
              checked={currentChecked}
              loading={loadingSwitchId === `email-${record.id}`}
              onChange={(checked) =>
                handleEmailConfirmationChange(record.id, checked)
              }
            />
          );
        },
      },
      {
        title: t("tableHeader.actions"),
        key: "action",
        align: "center",
        render: (_, record) => (
          <Space size="small">
            <Tooltip title={t("edit")} placement="left">
              <Link
                href={`/users/${record.id}`}
                className="cursor-pointer text-gray-600 flex items-center p-2 rounded-md hover:bg-gray-200/60"
              >
                <AppIcon className="h-4 w-4" icon="SquarePen" />
              </Link>
            </Tooltip>
          </Space>
        ),
      },
    ];

    const roleColumn: ColumnType<UserGridDto> = {
      title: t("tableHeader.role"),
      dataIndex: "role",
      key: "role",
      align: "center",
      sorter: true,
      render: (_, record: UserGridDto | TenantUserGridDto) => {
        return (
          <span className="text-xs font-medium text-stone-800 p-0.5 px-1 border border-stone-300 bg-stone-300 rounded-md">
            {t((record as TenantUserGridDto).role)}
          </span>
        );
      },
    };

    const invitationStatusColumn: ColumnType<UserGridDto> = {
      title: t("tableHeader.invitationStatus"),
      dataIndex: "isInvitationPending",
      key: "isInvitationPending",
      align: "center",
      sorter: true,
      width: "270px",
      render: (_, record: UserGridDto | TenantUserGridDto) => {
        const isInvitationPending = (record as TenantUserGridDto)
          .isInvitationPending;
        return (
          <div
            className={twMerge([
              "flex items-center justify-center font-semibold",
              isInvitationPending ? "text-warning" : "text-lime-600",
            ])}
          >
            <AppIcon
              icon={isInvitationPending ? "CircleAlert" : "CircleCheck"}
              className="h-4 w-4 stroke-2"
            />
            <span className="ml-1 mb-0.5 whitespace-nowrap">
              {t(isInvitationPending ? "pending" : "accepted")}
            </span>
            {isInvitationPending && (
              <Tooltip title={t("resendInvitation")} placement="bottom">
                <button
                  disabled={inviting}
                  className="text-stone-600 ml-2"
                  onClick={() => handleReinviteUser(record.id)}
                >
                  {inviting ? (
                    <LoadingIcon
                      icon="tail-spin"
                      className="text-stone-600 h-4 w-4 stroke-2"
                    />
                  ) : (
                    <AppIcon icon="RotateCw" className="h-4 w-4 stroke-2" />
                  )}
                </button>
              </Tooltip>
            )}
          </div>
        );
      },
    };

    const base = baseColumns ?? [];
    const superAdmin = superAdminColumns ?? [];

    if (role === ROLE_CONSTANTS.SUPER_ADMIN) {
      return [...base, ...superAdmin];
    }

    return [
      ...base.slice(0, 2),
      roleColumn,
      ...base.slice(2),
      invitationStatusColumn,
    ];
  }, [
    role,
    t,
    statusUpdates,
    loadingSwitchId,
    inviting,
    handleStatusChange,
    handleEmailConfirmationChange,
    handleReinviteUser,
  ]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchText: debouncedSearchText }));
  }, [debouncedSearchText]);

  return (
    <>
      <DataTable<UserGridDto | TenantUserGridDto>
        reloadTrigger={tableKey}
        fetchAction={
          role === ROLE_CONSTANTS.SUPER_ADMIN
            ? getAllUsersAction
            : getAllTenantUsersAction
        }
        initialData={initialData}
        initialSort={["fullName asc"]}
        filters={filters}
      >
        <DataTable.Header>
          <Popover
            open={isFilterOpen}
            onOpenChange={setIsFilterOpen}
            content={
              <UserTableFilters
                role={role}
                appliedFilters={filters}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
              />
            }
            placement="bottomLeft"
            styles={{
              body: {
                width: 300,
                padding: 20,
              },
            }}
            arrow={false}
            trigger="click"
            destroyOnHidden={true}
          >
            <button className="text-xs px-2 mr-3 transition duration-200 border shadow-sm inline-flex items-center justify-center py-[0.425rem] rounded-md font-medium cursor-pointer focus-visible:outline-none [&amp;:hover:not(:disabled)]:bg-opacity-90 [&amp;:hover:not(:disabled)]:border-opacity-90 [&amp;:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed border-secondary text-slate-500 [&amp;:hover:not(:disabled)]:bg-secondary/20 w-full sm:w-auto">
              <AppIcon className="mr-2 h-4 w-4 stroke-[1.3]" icon="Funnel" />
              {t("filter")}
              <span className="ml-2 flex h-4 items-center justify-center rounded-full border bg-slate-100 px-1.5 text-xs font-medium">
                {activeFilterCount}
              </span>
            </button>
          </Popover>
          <FormInput
            className="w-full sm:w-72"
            icon="Search"
            placeholder={`${t("tableHeader.fullName")}, ${t(
              "tableHeader.email"
            )}, ${t("tableHeader.nationalId")}...`}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="text-lg font-bold text-primary mx-auto underline underline-offset-3 decoration-4 decoration-theme-2">
            {t("users")}
          </div>
          <Tooltip
            title={
              role == ROLE_CONSTANTS.SUPER_ADMIN
                ? null
                : !userLimit
                ? t("inviteUser.userLimitReached")
                : t("invitationLeft", { invitationCount: userLimit })
            }
          >
            <Button
              size="sm"
              variant="primary"
              disabled={role !== ROLE_CONSTANTS.SUPER_ADMIN && !userLimit}
              localizedLabel={
                role === ROLE_CONSTANTS.SUPER_ADMIN
                  ? "addUser"
                  : t("inviteUser") + (userLimit ? ` (${userLimit})` : "")
              }
              icon={
                role === ROLE_CONSTANTS.SUPER_ADMIN ? "CirclePlus" : "UserPlus"
              }
              iconDirection="left"
              iconClassName="stroke-[1.5]"
              onClick={handleAddOrInvite}
            />
          </Tooltip>
        </DataTable.Header>
        <DataTable.Grid
          columns={mergedColumns}
          expandable={
            role === ROLE_CONSTANTS.SUPER_ADMIN
              ? {
                  expandedRowKeys: expandedRowKeys,
                  onExpandedRowsChange: (keys) => {
                    setExpandedRowKeys(keys);
                  },
                  showExpandColumn: true,
                  expandedRowRender: (record) => (
                    <UserProfileSummary appUserId={record.id} />
                  ),
                  rowExpandable: () => true,
                  onExpand: (expanded, record) => {
                    setExpandedRowKeys([]);
                    const key = String(record.id);
                    setExpandedRowKeys(expanded ? [key] : []);
                  },
                }
              : undefined
          }
          rowKey="id"
        />
      </DataTable>
      {isModalOpen && (
        <InviteUserModal isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default UserTable;
