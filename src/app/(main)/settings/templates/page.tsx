import PetitionTemplates from "@/components/settings/PetitionTemplates";
import { getTranslationsCached } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getTranslationsCached();
  return { title: `Derdest AI | ${t("templates")}` };
}

const TemplatesPage: React.FC = () => {
  return <PetitionTemplates />;
};

export default TemplatesPage;
