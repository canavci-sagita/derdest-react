type ApiTranslationEntry = {
  key: string;
  value: string;
};

/**
 * Fetches UI translations for a given culture code from the backend API.
 * This function is designed to be called from Server Components or API routes.
 *
 * @param cultureCode The culture code for the desired language (e.g., 'en').
 * @returns A promise that resolves to a key-value record of translations.
 * @throws An error if the network request fails or the API returns a non-ok status.
 */
export const fetchTranslations = async (
  cultureCode: string
): Promise<Record<string, string>> => {
  //TODO: Will be checked and optimized.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("API URL is not configured in environment variables.");
  }

  const url = `${apiUrl}/localization/gettranslations?cultureCode=${cultureCode}&location=&scope=ui`;

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch translations. Status: ${res.status}`);
  }

  const entries: ApiTranslationEntry[] = await res.json();

  return entries.reduce((acc, entry) => {
    acc[entry.key] = entry.value;
    return acc;
  }, {} as Record<string, string>);
};
