import Dashboard from "@/components/dashboard";
import { getTranslationsCached } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getTranslationsCached();
  return { title: `Derdest AI | ${t("dashboard")}` };
}

const HomePage: React.FC = () => {
  return <Dashboard />;
};

export default HomePage;
