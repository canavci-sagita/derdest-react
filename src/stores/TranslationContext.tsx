"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";
import Cookies from "js-cookie";
import { fetchTranslations } from "@/services/localization.service";
import { useRouter } from "next/navigation";
import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";

type TranslationContextType = {
  t: (key: string, params?: Record<string, string | number | null>) => string;
  tHtml: (key: string, params?: Record<string, ReactNode>) => ReactNode;
  switchLanguage: (newLang: string) => Promise<void>;
  currentLang: string;
};

const TranslationContext = createContext<TranslationContextType>({
  t: (key) => key,
  tHtml: (key) => key,
  switchLanguage: async () => {},
  currentLang: process.env.NEXT_PUBLIC_DEFAULT_CULTURE!,
});

export const useTranslation = () => useContext(TranslationContext);

type Props = {
  children: React.ReactNode;
  initialTranslations: Record<string, string>;
  lang: string;
};

export default function TranslationProvider({
  children,
  initialTranslations,
  lang,
}: Props) {
  const router = useRouter();
  const [translations, setTranslations] = useState(initialTranslations);
  const [currentLang, setCurrentLang] = useState(lang);

  const t = (
    key: string,
    params?: Record<string, string | number | null>
  ): string => {
    let translation = translations?.[key] ?? key;
    // if (params) {
    //   Object.keys(params).forEach((paramKey) => {
    //     const regex = new RegExp(`{${paramKey}}`, "g");
    //     translation = translation.replace(regex, String(params[paramKey]));
    //   });
    // }
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        const regex = new RegExp(`{${paramKey}}`, "g");
        translation = translation.replace(regex, String(params[paramKey]));
      });

      const paramValues = Object.values(params);
      paramValues.forEach((value, index) => {
        const regex = new RegExp(`\\{${index}\\}`, "g");
        translation = translation.replace(regex, String(value));
      });
    }
    return translation;
  };

  const tHtml = (
    key: string,
    params?: Record<string, ReactNode>
  ): ReactNode => {
    const translation = translations?.[key] ?? key;

    if (!params) {
      return translation;
    }

    const parts = translation.split(/({[^}]+})/).filter(Boolean);

    return parts.map((part, index) => {
      if (part.startsWith("{") && part.endsWith("}")) {
        const paramKey = part.slice(1, -1);
        return (
          <React.Fragment key={`${paramKey}-${index}`}>
            {params[paramKey]}
          </React.Fragment>
        );
      }
      return part;
    });
  };

  const switchLanguage = async (newLang: string) => {
    try {
      const translations = await fetchTranslations(newLang);

      setTranslations(translations);
      setCurrentLang(newLang);

      Cookies.set(COOKIE_CONSTANTS.LANGUAGE, newLang, {
        expires: 365,
        path: "/",
      });

      router.refresh();
    } catch (error) {
      console.error("Failed to switch language:", error);
    }
  };

  return (
    <TranslationContext.Provider
      value={{ t, tHtml, switchLanguage, currentLang }}
    >
      {children}
    </TranslationContext.Provider>
  );
}
