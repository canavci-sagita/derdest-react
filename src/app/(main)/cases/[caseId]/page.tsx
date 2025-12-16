import { getCaseSummaryCached } from "@/actions/cache/cases.cache";
import CaseDetails from "@/components/cases/CaseDetails";
import { getTranslationsCached } from "@/lib/i18n/server";
import { notFound } from "next/navigation";

interface CasePageProps {
  params: Promise<{
    caseId: string;
  }>;
}

export async function generateMetadata({ params }: CasePageProps) {
  const { caseId } = await params;
  const { t } = await getTranslationsCached();

  const baseTitle = `Derdest AI | ${t("cases")}`;
  const response = await getCaseSummaryCached(Number(caseId));

  if (!response.isSuccess || !response.result) {
    return { title: "" };
  }

  return { title: `${baseTitle} | ${response.result.title}` };
}

export default async function CasePage({ params }: CasePageProps) {
  const { caseId } = await params;
  if (caseId) {
    const response = await getCaseSummaryCached(Number(caseId));

    if (response.isSuccess && response.result) {
      return <CaseDetails initialData={response.result} />;
    }
  }

  return notFound();
}
