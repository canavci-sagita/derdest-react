import AddEditUser from "@/components/users/AddEditUser";
import { getTranslationsCached } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getTranslationsCached();
  return { title: `Derdest AI | ${t("addUser")}` };
}

const NewUserPage = async () => {
  return <AddEditUser />;
};

export default NewUserPage;
