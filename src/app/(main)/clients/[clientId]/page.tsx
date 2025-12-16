import { getClientCached } from "@/actions/cache/clients.cache";
import { getClientAction } from "@/actions/clients.actions";
import AddEditClient from "@/components/clients/AddEditClient";
import { getTranslationsCached } from "@/lib/i18n/server";
import { notFound } from "next/navigation";
import React from "react";

interface ClientPageProps {
  params: Promise<{
    clientId: string;
  }>;
}

export async function generateMetadata({ params }: ClientPageProps) {
  const { clientId } = await params;
  const { t } = await getTranslationsCached();

  const baseTitle = `Derdest AI | ${t("clients")}`;
  const response = await getClientCached(Number(clientId));

  if (!response.isSuccess || !response.result) {
    return { title: "" };
  }

  return {
    title: `${baseTitle} | ${response.result.firstName} ${response.result.lastName}`,
  };
}

const ClientPage = async ({ params }: ClientPageProps) => {
  const { clientId } = await params;

  if (clientId) {
    const response = await getClientAction(Number(clientId));

    if (response.isSuccess) {
      return <AddEditClient initialData={response.result} />;
    }
  }

  return notFound();
};

export default ClientPage;
