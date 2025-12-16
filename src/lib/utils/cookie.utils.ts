import { cookies } from "next/headers";

export const getCurrentLanguage = async (): Promise<string> => {
  const cookieStore = await cookies();
  const lang =
    cookieStore.get("lang")?.value || process.env.NEXT_PUBLIC_DEFAULT_CULTURE!;

  return lang;
};
