"use client";

import Link from "next/link";
import AppIcon from "../common/ui/AppIcon";
import { useTranslation } from "@/stores/TranslationContext";
import { icons } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

type TabMenuItem = {
  label: string;
  href: string;
  icon: keyof typeof icons;
  separate?: boolean;
};

const SettingsTab: React.FC = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  const tabMenu: TabMenuItem[] = [
    {
      label: t("personalInformation"),
      href: "/settings/profile",
      icon: "AppWindow",
    },
    {
      label: t("petitionTemplates"),
      href: "/settings/templates",
      icon: "FileArchive",
    },
    {
      label: t("subscriptions"),
      href: "/settings/subscriptions",
      icon: "WalletCards",
    },
    {
      label: t("changePassword"),
      href: "/settings/change-password",
      icon: "LockKeyhole",
      separate: true,
    },
  ];

  return (
    <div className="sticky top-[104px]">
      <div className="col-span-12 flex flex-col-reverse lg:col-span-4 lg:block 2xl:col-span-3">
        <div className="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-0">
          <div className="flex flex-col gap-5 p-5">
            {tabMenu.map((m, i) => {
              const isActive = pathname === m.href;
              return (
                <Link
                  key={i}
                  href={`${m.href}`}
                  className={twMerge([
                    "text-slate-600 [&.active]:text-theme-1 text-slate-500 flex items-center [&.active]:font-semibold hover:text-primary/70",
                    m.separate && "border-t pt-5",
                    isActive && "active",
                  ])}
                >
                  <AppIcon
                    icon={m.icon}
                    className="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 mr-2 size-4"
                  />
                  {m.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
