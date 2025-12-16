import Subscriptions from "@/components/settings/Subscriptions";
import { getTranslationsCached } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { t } = await getTranslationsCached();
  return { title: `Derdest AI | ${t("subscriptions")}` };
}

const SubscriptionsPage: React.FC = () => {
  return <Subscriptions />;
};

export default SubscriptionsPage;
