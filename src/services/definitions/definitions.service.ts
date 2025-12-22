"use server";

import { PaginatedRequest } from "@/services/common/PaginatedRequest";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import {
  AddEditCaseTypeDto,
  CaseTypeGridDto,
  AddEditContractTypeDto,
  ContractTypeGridDto,
} from "./definitions.types";
import { ApiResponse, ApiResponseOf } from "../common/ApiResponse";
import { apiFetchApiResponse, apiFetchPaginated } from "@/lib/api-fetch";

const DEFINITIONS_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/Definitions`;

/**
 * Fetches a paginated list of case types from the API.
 * @param request The query parameters for pagination and sorting.
 * @returns A promise that resolves to the paginated response.
 */
export const getAllCaseTypes = async (
  request: PaginatedRequest
): Promise<PaginatedResponse<CaseTypeGridDto>> => {
  return await apiFetchPaginated(`${DEFINITIONS_ENDPOINT}/GetAllCaseTypes`, {
    method: "POST",
    body: JSON.stringify({ pagination: request }),
  });
};

/**
 * Fetches a single case type by its ID for editing.
 * @param id The ID of the case type.
 * @returns The detailed case type object.
 */
export const getCaseType = async (
  id: number
): Promise<ApiResponseOf<AddEditCaseTypeDto>> => {
  const params = new URLSearchParams({
    id: String(id),
  });
  return await apiFetchApiResponse(
    `${DEFINITIONS_ENDPOINT}/GetCaseType?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Calls the API to create or update a case type.
 * @param data The data for the case type.
 * @returns A promise that resolves to the API response.
 */
export const addEditCaseType = async (
  data: AddEditCaseTypeDto
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${DEFINITIONS_ENDPOINT}/AddEditCaseType`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Calls the API to delete a case type by its ID.
 * @param id The ID of the case type to delete.
 * @returns A promise that resolves to the API response.
 */
export const deleteCaseType = async (id: number): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${DEFINITIONS_ENDPOINT}/DeleteCaseType`, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
};

/**
 * Fetches a paginated list of contract types from the API.
 * @param request The query parameters for pagination and sorting.
 * @returns A promise that resolves to the paginated response.
 */
export const getAllContractTypes = async (
  request: PaginatedRequest
): Promise<PaginatedResponse<ContractTypeGridDto>> => {
  return await apiFetchPaginated(
    `${DEFINITIONS_ENDPOINT}/GetAllContractTypes`,
    {
      method: "POST",
      body: JSON.stringify({ pagination: request }),
    }
  );
};

/**
 * Fetches a single contract type by its ID for editing.
 * @param id The ID of the contract type.
 * @returns The detailed contract type object.
 */
export const getContractType = async (
  id: number
): Promise<ApiResponseOf<AddEditContractTypeDto>> => {
  const params = new URLSearchParams({
    id: String(id),
  });
  return await apiFetchApiResponse(
    `${DEFINITIONS_ENDPOINT}/GetContractType?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Calls the API to create or update a contract type.
 * @param data The data for the contract type.
 * @returns A promise that resolves to the API response.
 */
export const addEditContractType = async (
  data: AddEditContractTypeDto
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(
    `${DEFINITIONS_ENDPOINT}/AddEditContractType`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};

/**
 * Calls the API to delete a contract type by its ID.
 * @param id The ID of the contract type to delete.
 * @returns A promise that resolves to the API response.
 */
export async function deleteContractType(id: number): Promise<ApiResponse> {
  return await apiFetchApiResponse(
    `${DEFINITIONS_ENDPOINT}/DeleteContractType`,
    {
      method: "POST",
      body: JSON.stringify({ id }),
    }
  );
}
