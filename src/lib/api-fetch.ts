"use server";

import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";
import { cookies } from "next/headers";
import { HEADER_CONSTANTS } from "@/lib/constants/header.constants";
import { getSession } from "@/lib/session";

interface ApiFetchOptions extends RequestInit {
  skipSession?: boolean;
}

const getLanguage = async () => {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_CONSTANTS.LANGUAGE)?.value || "en";
  } catch {
    return "en";
  }
};

const buildHeaders = async (options: ApiFetchOptions) => {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!headers[HEADER_CONSTANTS.CONTENT_TYPE]) {
    headers[HEADER_CONSTANTS.CONTENT_TYPE] = "application/json";
  }

  if (!options.skipSession) {
    const session = await getSession();

    if (session) {
      if (session.token) {
        headers[HEADER_CONSTANTS.AUTHORIZATION] = `Bearer ${session.token}`;
      }

      if (session.user) {
        const tenantId = session.user?.tenantId;
        if (tenantId) {
          headers[HEADER_CONSTANTS.TENANT_ID] = tenantId.toString();
        }
      }
    }
  }

  const lang = await getLanguage();
  headers[HEADER_CONSTANTS.ACCEPT_LANGUAGE] = lang;

  return headers;
};

export const apiFetch = async (url: string, options: ApiFetchOptions = {}) => {
  const headers = await buildHeaders(options);

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `API request failed with status ${response.status}: ${errorBody}`
    );
  }

  const contentDisposition = response.headers.get("Content-Disposition");
  const isBlob =
    !!contentDisposition && contentDisposition.includes("attachment");

  if (isBlob) {
    return response.blob() as Promise<Blob>;
  } else {
    return response.json();
  }
};
