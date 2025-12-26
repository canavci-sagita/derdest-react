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
    <div className="col-span-12">
      <div className="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-0 overflow-hidden">
        {/* Horizontal Layout Container */}
        <div className="flex flex-row items-center gap-1 p-2 overflow-x-auto w-full">
          {tabMenu.map((m, i) => {
            const isActive = pathname === m.href;
            return (
              <Link
                key={i}
                href={`${m.href}`}
                className={twMerge([
                  "flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap text-sm",
                  "text-slate-600 hover:text-primary hover:bg-slate-50/50",
                  isActive && "text-theme-1 font-semibold bg-primary/5",
                  m.separate &&
                    "rounded-s-none rounded-e-lg ml-auto border-l border-slate-200 pl-4",
                ])}
              >
                <AppIcon
                  icon={m.icon}
                  className={twMerge([
                    "stroke-[1.5] mr-2 size-4 transition-colors",
                    isActive
                      ? "text-theme-1 stroke-theme-1 fill-theme-1/10"
                      : "text-slate-400",
                  ])}
                />
                {m.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
