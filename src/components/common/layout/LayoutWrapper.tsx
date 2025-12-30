"use client";

import { useSidebarMenu } from "@/stores/SidebarMenuContext";
import clsx from "clsx";
import Header from "./header/Header";
import LeftSideBar from "./navigation/LeftSideBar";
import { LayoutPanelsContextProvider } from "@/stores/LayoutPanelsContext";
import QuickSearchPanel from "./panels/QuickSearchPanel";
import NotificationsPanel from "./panels/NotificationsPanel";
import SwitchAccountPanel from "./panels/SwitchAccountPanel";
import { ConfigProvider } from "antd";
import enUS from "antd/lib/locale/en_US";
import trTR from "antd/lib/locale/tr_TR";
import etEE from "antd/lib/locale/et_EE";
import { useTranslation } from "@/stores/TranslationContext";

//TODO: Additional languages will be added here.
import "dayjs/locale/tr";
import "dayjs/locale/en";
import "dayjs/locale/et";
import NoDataAvailable from "../data-table/NoDataAvailable";
import { CurrentUser } from "@/types/user.types";

//TODO: Additional languages will be added here.
const antdLocales = {
  en: enUS,
  tr: trTR,
  et: etEE,
};

const LayoutWrapper = ({
  user,
  children,
  navigation,
}: Readonly<{
  user: CurrentUser | null;
  children: React.ReactNode;
  navigation: React.ReactNode;
}>) => {
  const { currentLang } = useTranslation();
  const { compactMenu, activeMobileMenu, compactMenuOnHover } =
    useSidebarMenu();

  const currentAntdLocale =
    antdLocales[currentLang as keyof typeof antdLocales] || enUS;

  return (
    <ConfigProvider
      renderEmpty={() => <NoDataAvailable />}
      locale={currentAntdLocale}
      theme={{
        token: {
          colorPrimary: "rgb(var(--color-theme-1))",
          colorPrimaryBorder: "rgb(var(--color-theme-1))",
          colorLink: "rgb(var(--color-theme-1))",
        },
        components: {
          Avatar: {
            colorTextPlaceholder: "rgb(var(--color-theme-1))",
          },
          Table: {
            headerBorderRadius: 0,
          },
          Select: {
            optionSelectedColor: "#ffffff",
            activeOutlineColor: "0 0 0 0 transparent",
            fontSize: 12,
          },
          Collapse: {
            paddingSM: 0,
            borderlessContentPadding: 22,
          },
          Steps: {
            colorPrimary: "rgb(var(--color-theme-1))",
            controlItemBgActive: "rgb(var(--color-theme-2))",
          },
          Switch: {
            colorPrimary: "oklch(64.8% 0.2 131.684)",
            colorPrimaryHover: "oklch(53.2% 0.157 131.589)",
          },
          Tooltip: {
            fontSize: 11,
            colorBgSpotlight: "rgb(var(--color-theme-2))",
          },
          Calendar: {
            colorPrimary: "#65a30d",
            colorText: "rgb(var(--color-theme-1))",
            itemActiveBg: "rgba(101, 163, 13, 0.2)",
          },
        },
      }}
    >
      <div
        className={clsx([
          "xl:ml-0 shadow-xl transition-[margin] duration-300 xl:shadow-none fixed top-0 left-0 z-50 side-menu group inset-y-0 xl:py-3.5 xl:pl-3.5",
          "after:content-[''] after:fixed after:inset-0 after:bg-black/80 after:xl:hidden",
          { "side-menu--collapsed": compactMenu },
          { "side-menu--on-hover": compactMenuOnHover },
          { "ml-0 after:block": activeMobileMenu },
          { "-ml-[275px] after:hidden": !activeMobileMenu },
        ])}
      >
        <LeftSideBar>{navigation}</LeftSideBar>
        <LayoutPanelsContextProvider>
          <Header user={user} />
          <QuickSearchPanel />
          <NotificationsPanel />
          <SwitchAccountPanel />
        </LayoutPanelsContextProvider>
      </div>
      <div
        className={clsx([
          "transition-[margin,width] duration-100 xl:pl-3.5 pt-[65px] pb-16 relative z-10",
          { "xl:ml-[275px]": !compactMenu },
          { "xl:ml-[91px]": compactMenu },
        ])}
      >
        <div className="px-5 mt-14">
          <div id="main-container" className="container">
            {children}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LayoutWrapper;
