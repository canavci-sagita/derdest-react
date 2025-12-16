"use server";

import { LookupResponse } from "@/services/common/LookupResponse";
import {
  getAllApprovalStatuses,
  getAllCaseTypesForLookup,
  getAllCities,
  getAllClientsForLookup,
  getAllCompanyTypes,
  getAllContractTypesForLookup,
  getAllCountries,
  getAllDocumentTypesForLookup,
  getAllEvidencesForLookup,
  getAllLanguages,
  getAllLawFirmsForLookup,
  getAllPartyTypesForLookup,
  getAllPetitionTypesForLookup,
  getAllRoles,
  getAllTimelinesForLookup,
} from "@/services/lookups/lookups.service";
import {
  CountryLookupResponse,
  EvidenceLookupResponse,
  TimelineLookupResponse,
} from "@/services/lookups/lookups.types";

//TODO: try/catch will be implemented to all functions.

export const getAllCompanyTypesAction = async (): Promise<LookupResponse[]> => {
  return await getAllCompanyTypes();
};

export const getAllCountriesAction = async (): Promise<
  CountryLookupResponse[]
> => {
  return await getAllCountries();
};

export const getAllCitiesAction = async (
  countryId: number
): Promise<LookupResponse[]> => {
  return await getAllCities(countryId);
};

export const getAllCaseTypesForLookupAction = async (): Promise<
  LookupResponse[]
> => {
  return await getAllCaseTypesForLookup();
};

export const getAllContractTypesForLookupAction = async (): Promise<
  LookupResponse[]
> => {
  return await getAllContractTypesForLookup();
};

export const getAllPetitionTypesForLookupAction = async (
  caseTypeId?: number,
  mainPetitionTypeId?: number
): Promise<LookupResponse[]> => {
  return await getAllPetitionTypesForLookup(caseTypeId, mainPetitionTypeId);
};

export const getAllClientsForLookupAction = async (): Promise<
  LookupResponse[]
> => {
  return await getAllClientsForLookup();
};

export const getAllTimelinesForLookupAction = async (
  caseId: number
): Promise<TimelineLookupResponse[]> => {
  return await getAllTimelinesForLookup(caseId);
};

export const getAllEvidencesForLookupAction = async (
  caseId: number
): Promise<EvidenceLookupResponse[]> => {
  return await getAllEvidencesForLookup(caseId);
};

export const getAllPartyTypesForLookupAction = async (): Promise<
  LookupResponse[]
> => {
  return await getAllPartyTypesForLookup();
};

export const getAllApprovalStatusesAction = async (): Promise<
  LookupResponse[]
> => {
  return await getAllApprovalStatuses();
};

export const getAllDocumentTypesForLookupAction = async (): Promise<
  LookupResponse[]
> => {
  return await getAllDocumentTypesForLookup();
};

export const getAllLawFirmsForLookupAction = async (): Promise<
  LookupResponse[]
> => {
  return await getAllLawFirmsForLookup();
};

export const getAllRolesAction = async (
  forSingleUser: boolean
): Promise<LookupResponse[]> => {
  return await getAllRoles(forSingleUser);
};

export const getAllLanguagesAction = async (): Promise<LookupResponse[]> => {
  return await getAllLanguages();
};
