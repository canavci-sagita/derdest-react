import Activities from "@/components/activities/Activities";
import { getTranslationsCached } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getTranslationsCached();
  return { title: `Derdest AI | ${t("calendar")}` };
}

const ActivitiesPage: React.FC = async () => {
  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="w-full pb-10 overflow-hidden">
          <div className="flex flex-col w-full box box--stacked">
            <Activities />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
