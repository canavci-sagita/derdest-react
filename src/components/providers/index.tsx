"use client";

import { SidebarMenuContextProvider } from "@/stores/SidebarMenuContext";
import TranslationProvider from "@/stores/TranslationContext";
import { LayoutPanelsContextProvider } from "@/stores/LayoutPanelsContext";

type ProvidersProps = {
  children: React.ReactNode;
  initialTranslations: Record<string, string>;
  lang: string;
  initialCompactMenu: boolean;
};

export function Providers({
  initialTranslations,
  lang,
  children,
  initialCompactMenu,
}: ProvidersProps) {
  return (
    <TranslationProvider initialTranslations={initialTranslations} lang={lang}>
      <SidebarMenuContextProvider initialCompactMenu={initialCompactMenu}>
        <LayoutPanelsContextProvider>{children}</LayoutPanelsContextProvider>
      </SidebarMenuContextProvider>
    </TranslationProvider>
  );
}
