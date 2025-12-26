import { cookies } from "next/headers";
import { fetchTranslations } from "@/services/localization.service";
import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";
import { cache } from "react";

/**
 * Retrieves a translation function 't' for use in Server Components.
 */
export async function getTranslations() {
  const cookieStore = await cookies();
  const lang = cookieStore.get(COOKIE_CONSTANTS.LANGUAGE)?.value || "en"; // Default language

  const translations = await fetchTranslations(lang);

  const t = (key: string, params?: Record<string, string | number>) => {
    let text = translations[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(
          new RegExp(`{{${paramKey}}}`, "g"),
          String(paramValue)
        );
      });
    }

    return text;
  };

  return { t, lang };
}

export const getTranslationsCached = cache(async () => {
  return await getTranslations();
});
