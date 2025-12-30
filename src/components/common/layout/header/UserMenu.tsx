"use client";

import Image from "next/image";
import DropdownMenu from "@/components/common/ui/DropdownMenu";
import { useLayoutPanels } from "@/stores/LayoutPanelsContext";
import { signOutAction } from "@/actions/auth.actions";

import imgDefaultUser from "@/assets/images/default-user.png";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/stores/TranslationContext";
import { DropdownMenuEntry } from "@/types/dropdown-menu.types";
import { ROLE_CONSTANTS } from "@/lib/constants/role.constants";
import { eventBus } from "@/lib/eventBus";

const UserMenu = () => {
  const { t } = useTranslation();
  const { setSwitchAccountPanel } = useLayoutPanels();
  const router = useRouter();

  const handleMenuItemClick = async (key: string) => {
    switch (key) {
      case "switch":
        setSwitchAccountPanel(true);
        break;
      case "settings":
        router.push("/settings");
        break;
      case "templates":
        router.push("/settings/templates");
        break;
      case "subscriptions":
        router.push("/settings/subscriptions");
        break;
      case "reset":
        router.push("/settings/change-password");
        break;
      case "signOut":
        eventBus.emit("signout");
        await signOutAction();
        router.push("/auth/sign-in");
        router.refresh();
        break;
      default:
        break;
    }
  };

  const userDropdownMenu = [
    { type: "item", icon: "ToggleLeft", key: "switch", label: "switchAccount" },
    { type: "divider" },
    {
      type: "item",
      icon: "Settings",
      key: "settings",
      label: t("settings"),
    },
    {
      type: "item",
      icon: "FileArchive",
      key: "templates",
      label: t("templates"),
    },
    {
      type: "item",
      icon: "WalletCards",
      key: "subscriptions",
      label: t("subscriptions"),
      roles: [ROLE_CONSTANTS.SUPER_ADMIN, ROLE_CONSTANTS.TENANT_ADMIN],
    },
    {
      type: "item",
      icon: "Lock",
      key: "reset",
      label: t("changePassword"),
    },
    { type: "divider" },
    { type: "item", icon: "Power", key: "signOut", label: t("logout") },
  ] as DropdownMenuEntry[];

  return (
    <div className="relative ml-5">
      <DropdownMenu
        overlayClassName="p-2 dark:bg-darkmode-600 w-56 mt-1 !right-[0.8rem]"
        items={userDropdownMenu}
        trigger={["click"]}
        onItemClick={(item) => handleMenuItemClick(item.key!)}
      >
        <a className="cursor-pointer" onClick={(e) => e.preventDefault()}>
          <Image
            className="overflow-hidden rounded-full w-[36px] h-[36px] border-[3px] border-slate-200/70 image-fit"
            src={imgDefaultUser}
            alt="User Image"
          />
        </a>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
