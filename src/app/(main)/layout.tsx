import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import clsx from "clsx";
import LayoutWrapper from "@/components/common/layout/LayoutWrapper";
import { fetchTranslations } from "@/services/localization.service";
import { Providers } from "@/components/providers";

import "@/assets/css/app.css";
import "simplebar-core/dist/simplebar.css";
import { getCurrentLanguage } from "@/lib/utils/cookie.utils";
import { App } from "antd";
import AntdRegistry from "@/components/providers/AntdRegistry";
import { cookies } from "next/headers";
import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";
import NavigationMenu from "@/components/common/layout/navigation/NavigationMenu";
import { SignalRManager } from "@/stores/SignalRManager";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { getAuthenticatedUser } from "@/lib/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Derdest AI",
  description: "Your Legal AI Assistant",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthenticatedUser();

  const lang = await getCurrentLanguage();
  let translations: Record<string, string>;

  const cookieStore = await cookies();
  const compactMenuCookie = cookieStore.get(
    COOKIE_CONSTANTS.COMPACT_MENU
  )?.value;
  const initialCompactMenu = compactMenuCookie === "true";

  try {
    translations = await fetchTranslations(lang);
  } catch (error) {
    console.error("Failed to load initial translations:", error);
    translations = {};
  }

  return (
    <html className="derdest-main" lang={lang}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div
          className={clsx([
            "razor background min-h-screen",
            "before:content-[''] before:bg-gradient-to-b before:from-slate-100 before:to-slate-50 before:h-screen before:w-full before:fixed before:top-0 dark:before:from-darkmode-800 dark:before:to-darkmode-900",
            "after:content-[''] after:fixed after:inset-0 after:bg-[radial-gradient(rgb(0_0_0_/_10%)_1px,_transparent_0)] after:bg-[length:25px_25px]",
          ])}
        >
          <QueryProvider>
            <AntdRegistry>
              <Providers
                initialTranslations={translations}
                lang={lang}
                initialCompactMenu={initialCompactMenu}
              >
                <App>
                  <SignalRManager />
                  <LayoutWrapper user={user} navigation={<NavigationMenu />}>
                    {children}
                  </LayoutWrapper>
                </App>
              </Providers>
            </AntdRegistry>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
