"use server";

import { apiFetchLookup } from "@/lib/api-fetch";
import { LookupResponse } from "../common/LookupResponse";
import { CountryLookupResponse, TimelineLookupResponse } from "./lookups.types";

const LOOKUPS_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/Lookups`;

/**
 * Fetches a list of company types from the API.
 * @returns A promise that resolves to the LookupResponse.
 */
export const getAllCompanyTypes = async (): Promise<LookupResponse[]> => {
  return await apiFetchLookup(`${LOOKUPS_ENDPOINT}/GetAllCompanyTypes`, {
    method: "GET",
  });
};

/**
 * Fetches a list of countries from the API.
 * @returns A promise that resolves to the LookupResponse.
 */
export const getAllCountries = async (): Promise<CountryLookupResponse[]> => {
  const response = await apiFetchLookup(`${LOOKUPS_ENDPOINT}/GetAllCountries`, {
    method: "GET",
  });

  return response as CountryLookupResponse[];
};

/**
 * Fetches a list of countries from the API.
 * @param countryId The id of the country.
 * @returns A promise that resolves to the LookupResponse.
 */
export const getAllCities = async (
  countryId: number
): Promise<LookupResponse[]> => {
  const params = new URLSearchParams({
    countryId: String(countryId),
  });
  return await apiFetchLookup(
    `${LOOKUPS_ENDPOINT}/GetAllCities?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Fetches a list of case types from the API.
 * @returns A promise that resolves to the LookupResponse.
 */
export const getAllCaseTypesForLookup = async (): Promise<LookupResponse[]> => {
  return await apiFetchLookup(`${LOOKUPS_ENDPOINT}/GetAllCaseTypesForLookup`, {
    method: "GET",
  });
};

/**
 * Fetches a list of contract types from the API.
 * @returns A promise that resolves to the LookupResponse.
 */
export const getAllContractTypesForLookup = async (): Promise<
  LookupResponse[]
> => {
  return await apiFetchLookup(
    `${LOOKUPS_ENDPOINT}/GetAllContractTypesForLookup`,
    {
      method: "GET",
    }
  );
};

/**
 * Fetches a list of petition types from the API.
 * @param caseTypeId The case type ID <optional>
 * @param  mainPetitionTypeId The main petition type ID <optional>
 * @returns A promise that resolves to the LookupResponse.
 */
export const getAllPetitionTypesForLookup = async (
  caseTypeId?: number,
  mainPetitionTypeId?: number
): Promise<LookupResponse[]> => {
  const params = new URLSearchParams();
  if (caseTypeId) {
    params.append("caseTypeId", String(caseTypeId));
  }
  if (mainPetitionTypeId) {
    params.append("mainPetitionTypeId", String(mainPetitionTypeId));
  }

  return await apiFetchLookup(
    `${LOOKUPS_ENDPOINT}/GetAllPetitionTypesForLookup?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Fetches a list of clients from the API.
 * @returns A promise that resolves to the LookupResponse.
 */
export const getAllClientsForLookup = async (): Promise<LookupResponse[]> => {
  return await apiFetchLookup(`${LOOKUPS_ENDPOINT}/GetAllClientsForLookup`, {
    method: "GET",
  });
};

/**
 * Fetches a list of timelines from the API.
 * @param caseId The ID of the realted case.
 * @returns A promise that resolves to the LookupResponse.
 */
export const getAllTimelinesForLookup = async (
  caseId: number
): Promise<TimelineLookupResponse[]> => {
  const params = new URLSearchParams({
    caseId: String(caseId),
  });
  const response = await apiFetchLookup(
    `${LOOKUPS_ENDPOINT}/GetAllTimelinesForLookup?${params.toString()}`,
    {
      method: "GET",
    }
  );

  return response as TimelineLookupResponse[];
};

/**
 * Fetches a list of evidences from the API.
 * @param caseId The ID of the realted case.
 * @returns A promise that resolves to the LookupResponse.
 */
export const getAllEvidencesForLookup = async (
  caseId: number
): Promise<TimelineLookupResponse[]> => {
  const params = new URLSearchParams({
    caseId: String(caseId),
  });
  return await apiFetchLookup(
    `${LOOKUPS_ENDPOINT}/GetAllEvidencesForLookup?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Fetches a list of party types from the API.
 * @returns A promise that resolves to the LookupResponse.
 */
export const getAllPartyTypesForLookup = async (): Promise<
  LookupResponse[]
> => {
  return await apiFetchLookup(`${LOOKUPS_ENDPOINT}/GetAllPartyTypesForLookup`, {
    method: "GET",
  });
};

/**
 * Fetches a list of approval statuses from the API.
 * @returns A promise that resolves to the LookupResponse.
 */
export const getAllApprovalStatuses = async (): Promise<LookupResponse[]> => {
  return await apiFetchLookup(`${LOOKUPS_ENDPOINT}/GetAllApprovalStatuses`, {
    method: "GET",
  });
};

/**
 * Fetches a list of document types from the API.
 * @returns A promise that resolves to the LookupResponse.
 */
export const getAllDocumentTypesForLookup = async (): Promise<
  LookupResponse[]
> => {
  return await apiFetchLookup(
    `${LOOKUPS_ENDPOINT}/GetAllDocumentTypesForLookup`,
    {
      method: "GET",
    }
  );
};

/**
 * Fetches a list of law firms from the API.
 * @returns A promise that resolves to the LookupResponse.
 */
export const getAllLawFirmsForLookup = async (): Promise<LookupResponse[]> => {
  return await apiFetchLookup(`${LOOKUPS_ENDPOINT}/GetAllLawFirmsForLookup`, {
    method: "GET",
  });
};

/**
 * Fetches a list of roles from the API.
 * @returns A promise that resolves to the LookupResponse.
 */
export const getAllRoles = async (
  forSingleUser: boolean
): Promise<LookupResponse[]> => {
  const params = new URLSearchParams({
    forSingleUser: String(forSingleUser),
  });
  return await apiFetchLookup(
    `${LOOKUPS_ENDPOINT}/GetAllRoles?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Fetches a list of languages from the API.
 * @returns A promise that resolves to the LookupResponse.
 */
export const getAllLanguages = async (): Promise<LookupResponse[]> => {
  return await apiFetchLookup(`${LOOKUPS_ENDPOINT}/GetAllLanguages`, {
    method: "GET",
  });
};
