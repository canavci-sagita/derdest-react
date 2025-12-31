"use server";

import { ApiResponse, ApiResponseOf } from "@/services/common/ApiResponse";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import { LookupResponse } from "@/services/common/LookupResponse";
import { cookies } from "next/headers";
import { COOKIE_CONSTANTS } from "./constants/cookie.constants";
import { HEADER_CONSTANTS } from "./constants/header.constants";
import { getAuthenticatedUser } from "./session";
import { requireAuth } from "@/actions/auth.actions";

const getLanguage = async () => {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_CONSTANTS.LANGUAGE)?.value || "en";
  } catch {
    return "en";
  }
};

export async function buildHeaders(
  init?: RequestInit
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  };

  const lang = await getLanguage();
  headers[HEADER_CONSTANTS.ACCEPT_LANGUAGE] = lang;

  if (!headers[HEADER_CONSTANTS.CONTENT_TYPE]) {
    headers[HEADER_CONSTANTS.CONTENT_TYPE] = "application/json";
  }

  const cookieStore = await cookies();
  const authToken = cookieStore.get(COOKIE_CONSTANTS.AUTH_TOKEN)?.value;

  if (authToken) {
    headers[HEADER_CONSTANTS.AUTHORIZATION] = `Bearer ${authToken}`;

    const currentUser = await getAuthenticatedUser();

    if (currentUser?.tenantId) {
      headers[HEADER_CONSTANTS.TENANT_ID] = currentUser.tenantId.toString();
    }
  }

  return headers;
}

export const apiFetchRaw = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  await requireAuth();
  const headers = await buildHeaders(init);

  return fetch(input, {
    ...init,
    credentials: "include",
    cache: "no-store",
    headers: headers,
  });
};

export const apiFetchApiResponse = async <T = void>(
  input: RequestInfo,
  init?: RequestInit
): Promise<ApiResponseOf<T>> => {
  const res = await apiFetchRaw(input, init);
  return (await res.json()) as ApiResponseOf<T>;
};

export const apiFetchPaginated = async <T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<PaginatedResponse<T>> => {
  const res = await apiFetchRaw(input, init);
  return (await res.json()) as PaginatedResponse<T>;
};

export const apiFetchLookup = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<LookupResponse[]> => {
  const res = await apiFetchRaw(input, init);
  return (await res.json()) as LookupResponse[];
};

export const apiFetchBlob = async (
  input: RequestInfo,
  init: RequestInit
): Promise<Blob> => {
  const res = await apiFetchRaw(input, init);

  if (!res.ok) {
    const text = await res.text();
    try {
      const error = JSON.parse(text) as ApiResponse;
      throw new Error(error.messages?.[0]);
    } catch {
      throw new Error("Download failed");
    }
  }

  return await res.blob();
};
