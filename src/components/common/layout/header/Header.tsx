"use client";

import AppIcon from "@/components/common/ui/AppIcon";
import clsx from "clsx";
import UserMenu from "./UserMenu";
import { useSidebarMenu } from "@/stores/SidebarMenuContext";
import { fullscreenUtils } from "@/lib/utils/fullscreen.utils";
import { useLayoutPanels } from "@/stores/LayoutPanelsContext";
import { useEffect, useState } from "react";
import CreditsWidget from "./Credits/CreditsWidget";

const Header = () => {
  const { setActiveMobileMenu } = useSidebarMenu();
  const { setQuickSearchPanel, setNotificationsPanel } = useLayoutPanels();

  const [isCurrentlyFullscreen, setIsCurrentlyFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreen = () => {
      setIsCurrentlyFullscreen(fullscreenUtils.isFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreen);
    };
  }, []);

  return (
    <div
      className={clsx([
        "fixed h-[65px] transition-[margin] duration-100 xl:ml-[275px] group-[.side-menu--collapsed]:xl:ml-[90px] mt-3.5 inset-x-0 top-0",
        "before:content-[''] before:mx-5 before:absolute before:top-0 before:inset-x-0 before:-mt-[15px] before:h-[20px] before:backdrop-blur",
      ])}
    >
      <div
        className={clsx([
          "absolute left-0 xl:left-3.5 right-0 h-full mx-5 group transition-colors box ease-in-out duration-200",
          "before:content-[''] before:z-[-1] before:inset-x-4 before:shadow-sm before:h-full before:bg-slate-50 before:border before:border-slate-200 before:absolute before:rounded-lg before:mx-auto before:top-0 before:mt-3 before:dark:bg-darkmode-600/70 before:dark:border-darkmode-500/60",
        ])}
      >
        <div className="flex items-center w-full h-full transition-[padding] ease-in-out duration-300 px-5">
          {/* <div className="flex flex-col">
            <div className="font-medium text-xs">Arnold Schwarzenegger</div>
            <div className="text-xs opacity-70 text-xs">Backend Engineer</div>
          </div> */}
          <div className="flex items-center gap-1 xl:hidden">
            <a
              href=""
              onClick={(event) => {
                event.preventDefault();
                setActiveMobileMenu(true);
              }}
              className="p-2 rounded-full hover:bg-slate-100"
            >
              <AppIcon icon="AlignJustify" className="w-[18px] h-[18px]" />
            </a>
            <a
              href=""
              className="p-2 rounded-full hover:bg-slate-100"
              onClick={(e) => {
                e.preventDefault();
                setQuickSearchPanel(true);
              }}
            >
              <AppIcon icon="Search" className="w-[18px] h-[18px]" />
            </a>
          </div>
          <CreditsWidget />
          <div
            className="relative justify-center flex-1 hidden xl:flex"
            onClick={() => setQuickSearchPanel(true)}
          >
            <div className="bg-slate-50 border w-[350px] flex items-center py-2 px-3.5 rounded-[0.5rem] text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors duration-300 hover:duration-100 dark:bg-black/[0.5]">
              <AppIcon icon="Search" className="w-[18px] h-[18px]" />
              <div className="ml-2.5 mr-auto">Quick search...</div>
              <div>⌘K</div>
            </div>
          </div>
          <div className="flex items-center flex-1">
            <div className="flex items-center gap-1 ml-auto">
              <a
                className="cursor-pointer p-2 rounded-full hover:bg-slate-100 dark:hover:bg-darkmode-400"
                onClick={(e) => {
                  e.preventDefault();
                  setNotificationsPanel(true);
                }}
              >
                <AppIcon icon="Bell" className="w-[18px] h-[18px]" />
              </a>
              <a
                className="cursor-pointer p-2 rounded-full hover:bg-slate-100 dark:hover:bg-darkmode-400"
                onClick={() => fullscreenUtils.toggle()}
              >
                <AppIcon
                  icon={isCurrentlyFullscreen ? "Shrink" : "Expand"}
                  className="w-[18px] h-[18px]"
                />
              </a>
            </div>
            <UserMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
