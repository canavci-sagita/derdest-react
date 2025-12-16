"use server";

import { getUserCached } from "@/actions/cache/users.cache";
import { getAllRolesAction } from "@/actions/lookups.actions";
import { getUserAction } from "@/actions/users.actions";
import AddEditUser from "@/components/users/AddEditUser";
import { getTranslationsCached } from "@/lib/i18n/server";
import { notFound } from "next/navigation";
import React from "react";

interface ClientPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export async function generateMetadata({ params }: ClientPageProps) {
  const { userId } = await params;
  const { t } = await getTranslationsCached();

  const baseTitle = `Derdest AI | ${t("users")}`;
  const response = await getUserCached(Number(userId));

  if (!response.isSuccess || !response.result) {
    return { title: "" };
  }

  return {
    title: `${baseTitle} | ${response.result.accountDetails.firstName} ${response.result.accountDetails.lastName}`,
  };
}

const UserPage = async ({ params }: ClientPageProps) => {
  const { userId } = await params;
  if (userId) {
    const response = await getUserAction(Number(userId));

    if (response.isSuccess) {
      const roles = await getAllRolesAction(
        !!response.result?.roleAssignments.roleId
      );

      return <AddEditUser initialData={response.result} roles={roles} />;
    }
  }

  return notFound();
};

export default UserPage;
