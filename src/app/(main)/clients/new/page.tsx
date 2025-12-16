import AddEditClient from "@/components/clients/AddEditClient";
import { getTranslationsCached } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getTranslationsCached();
  return { title: `Derdest AI | ${t("addClient")}` };
}
const NewClientPage = () => {
  return <AddEditClient />;
};

export default NewClientPage;
