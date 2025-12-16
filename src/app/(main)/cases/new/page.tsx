import CreateCase from "@/components/cases/CreateCase";
import { getTranslationsCached } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getTranslationsCached();
  return { title: `Derdest AI | ${t("createNewCase")}` };
}

const NewCasePage: React.FC = () => {
  return <CreateCase />;
};

export default NewCasePage;
