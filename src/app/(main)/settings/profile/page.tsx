import { getUserProfileAction } from "@/actions/users.actions";
import AppIcon from "@/components/common/ui/AppIcon";
import ProfileForm from "@/components/settings/ProfileForm";
import { getTranslationsCached } from "@/lib/i18n/server";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const { t } = await getTranslationsCached();
  return { title: `Derdest AI | ${t("personalInformation")}` };
}

const ProfilePage: React.FC = async () => {
  const { t } = await getTranslationsCached();

  const session = await getSession();

  if (!session || !session.user) {
    return notFound();
  }

  const user = session.user;
  const profileResponse = await getUserProfileAction();

  const userData = {
    fullName: user.fullName || "",
    email: user.email || "",
    role: user.role || "",
    profile: profileResponse.result!,
  };

  if (!user) {
    return (
      <div className="space-y-2 animate-pulse">
        <div className=" flex flex-col">
          <div className="relative h-32 w-full rounded-[0.6rem] rounded-b-none bg-gradient-to-b from-theme-1/95 to-theme-2/95">
            <div className="w-full h-full relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-texture-white before:-mt-[50rem] after:content-[''] after:absolute after:inset-0 after:bg-texture-white after:-mt-[50rem]"></div>
            <div className="absolute inset-x-0 top-0 mx-auto mt-8 h-32 w-32">
              <div className="bg-slate-200 box image-fit h-full w-full overflow-hidden rounded-full border-[6px] border-white flex items-center justify-center shadow-md"></div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-3 rounded-[0.6rem] rounded-t-none bg-slate-50 p-5 sm:flex-row sm:items-end sm:justify-between border !border-t-0 border-slate-200">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="h-8 w-48 bg-slate-200 rounded-lg mb-1"></span>
              <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm">
                <AppIcon icon="Mail" className="w-3.5 h-3.5 stroke-[1]" />
                <span className="h-4 w-32 bg-slate-200 rounded-lg"></span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 mb-1">
              <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <ProfileForm user={userData} />;
};

export default ProfilePage;
