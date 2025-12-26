import { getUserProfileAction } from "@/actions/users.actions";
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

  return <ProfileForm user={userData} />;
};

export default ProfilePage;
