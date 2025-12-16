"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { COOKIE_CONSTANTS } from "../constants/cookie.constants";
import { fetchTranslations } from "@/services/localization.service";

type SchemaFactory<T extends z.ZodTypeAny> = (t: (key: string) => string) => T;

/**
 * Creates a localized Zod schema by fetching translations based on the user's language.
 * This should be used within Server Actions to get a schema for validation.
 * @param schemaFactory A function that takes a translator `t` and returns a Zod schema.
 * @returns A Promise that resolves to the localized Zod schema.
 */
export const createLocalizedSchema = async <T extends z.ZodTypeAny>(
  schemaFactory: SchemaFactory<T>
): Promise<T> => {
  const cookieStore = await cookies();
  const lang =
    cookieStore.get(COOKIE_CONSTANTS.LANGUAGE)?.value ||
    process.env.NEXT_PUBLIC_DEFAULT_CULTURE!;
  const translations = await fetchTranslations(lang);
  const t = (key: string) => translations[key] ?? key;

  return schemaFactory(t);
};
