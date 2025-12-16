import { redirect } from "next/navigation";

const SettingsDefault: React.FC = () => {
  redirect("/settings/profile");
};

export default SettingsDefault;
