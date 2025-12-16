import Dashboard from "@/components/dashboard";
import { getTranslationsCached } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getTranslationsCached();
  return { title: `Derdest AI | ${t("dashboard")}` };
}

const HomePage: React.FC = () => {
  return (
    <div>
      {/* <p>{t("lawFirm")}</p>
      <br />
      <p>
        {t("Current Language")}: {currentLang.toUpperCase()}
      </p>
      <br />
      <button onClick={() => switchLanguage("en")}>English</button>
      <button onClick={() => switchLanguage("tr")}>Türkçe</button>
      <button onClick={() => switchLanguage("et")}>Eesti</button> */}
      <Dashboard />
    </div>
  );
};

export default HomePage;
