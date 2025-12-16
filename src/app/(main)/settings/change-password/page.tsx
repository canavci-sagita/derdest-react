import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
import { getTranslationsCached } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getTranslationsCached();
  return { title: `Derdest AI | ${t("changePassword")}` };
}

const ChangePasswordPage: React.FC = () => {
  return <ChangePasswordForm />;
};

export default ChangePasswordPage;
