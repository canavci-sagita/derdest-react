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

const getInitials = (fullName: string) => {
  const nameArr = fullName.split(" ");
  let initials = "";
  nameArr.forEach((n) => {
    initials += n.charAt(0).toUpperCase();
  });

  return initials;
};

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

  const initials = getInitials(user.fullName);
  return (
    <div className="space-y-2">
      <div className=" flex flex-col">
        <div className="relative h-32 w-full rounded-[0.6rem] rounded-b-none bg-gradient-to-b from-theme-1/95 to-theme-2/95">
          <div className="w-full h-full relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-texture-white before:-mt-[50rem] after:content-[''] after:absolute after:inset-0 after:bg-texture-white after:-mt-[50rem]"></div>
          <div className="absolute inset-x-0 top-0 mx-auto mt-8 h-32 w-32">
            <div className="box image-fit h-full w-full overflow-hidden rounded-full border-[6px] border-white bg-white flex items-center justify-center shadow-md">
              <span className="text-4xl font-medium text-slate-700">
                {initials}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-y-3 rounded-[0.6rem] rounded-t-none bg-slate-50 p-5 sm:flex-row sm:items-end sm:justify-between border !border-t-0 border-slate-200">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              {user.fullName}
            </h2>
            <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm">
              <AppIcon icon="Mail" className="w-3.5 h-3.5 stroke-[2]" />
              {user.email}
            </div>
          </div>
          <div className="mt-4 sm:mt-0 mb-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-sm uppercase tracking-wide">
              {t(user.role)}
            </span>
          </div>
        </div>
      </div>
      <ProfileForm user={userData} />
    </div>
  );
};

export default ProfilePage;
