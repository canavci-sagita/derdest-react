"use server";

import { PaginatedResponse } from "../common/PaginatedResponse";
import {
  AddEditClientDto,
  ClientGridDto,
  ContractFileDto,
  ContractFileUploadRequest,
  GetAllClientsRequest,
} from "./clients.types";
import { ApiResponse, ApiResponseOf } from "../common/ApiResponse";
import {
  apiFetchApiResponse,
  apiFetchBlob,
  apiFetchPaginated,
} from "@/lib/api-fetch";

const CLIENTS_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/Clients`;

/**
 * Fetches a paginated list of clients from the API.
 * @param request The query parameters for pagination and sorting.
 * @param filter "searchText": "string", "clientType": 1, "country": "string", "city": "string"
 * @returns A promise that resolves to the paginated response.
 */
export const getAllClients = async (
  request: GetAllClientsRequest
): Promise<PaginatedResponse<ClientGridDto>> => {
  const { pageNumber, pageSize, orderBy, ...filter } = request;
  const pagination = { pageNumber, pageSize, orderBy };

  return await apiFetchPaginated(`${CLIENTS_ENDPOINT}/GetAllClients`, {
    method: "POST",
    body: JSON.stringify({
      filter: filter,
      pagination: pagination,
    }),
  });
};

/**
 * Fetches a single client by its ID.
 * @param id The ID of the client.
 * @returns The detailed client object.
 */
export const getClient = async (
  id: number
): Promise<ApiResponseOf<AddEditClientDto>> => {
  const params = new URLSearchParams({ id: String(id) });
  return await apiFetchApiResponse(
    `${CLIENTS_ENDPOINT}/GetClient?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Calls the API to create or update a client.
 * @param data The data for the client.
 * @returns A promise that resolves to the API response.
 */
export const addEditClient = async (
  data: AddEditClientDto
): Promise<ApiResponseOf<number>> => {
  return await apiFetchApiResponse(`${CLIENTS_ENDPOINT}/AddEditClient`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Calls the API to delete a client by its ID.
 * @param id The ID of the client to delete.
 * @returns A promise that resolves to the API response.
 */
export const deleteClient = async (id: number): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${CLIENTS_ENDPOINT}/DeleteClient`, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
};

/**
 * Fetches contract files for the client by its ID for editing.
 * @param clientId The ID of the client.
 * @returns The detailed client object.
 */
export const getAllContractFiles = async (
  clientId: number
): Promise<ApiResponseOf<ContractFileDto[]>> => {
  const params = new URLSearchParams({
    clientId: String(clientId),
  });
  return await apiFetchApiResponse(
    `${CLIENTS_ENDPOINT}/GetAllContractFiles?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Calls the API to upload and verify a contract file for a client.
 * @param request The file upload request object.
 * @returns A promise that resolves to the API response containing the new ContractFileDto.
 */
export const uploadAndVerifyContractFile = async (
  request: ContractFileUploadRequest
): Promise<ApiResponseOf<ContractFileDto>> => {
  return await apiFetchApiResponse(
    `${CLIENTS_ENDPOINT}/UploadAndVerifyContractFile`,
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );
};

/**
 * Calls the API to delete a contract type by its ID.
 * @param clientId The ID of the client.
 * @param contractTypeId The ID of the contract type to delete.
 * @returns A promise that resolves to the API response.
 */
export const deleteContractFile = async (
  clientId: number,
  contractTypeId: number
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${CLIENTS_ENDPOINT}/DeleteContractFile`, {
    method: "POST",
    body: JSON.stringify({ clientId, contractTypeId }),
  });
};

/**
 * Calls the API to download a contract file.
 * @param clientId The ID of the client.
 * @param contractTypeId The ID of the contract type to download.
 * @returns A promise that resolves to a Blob on success, or an ApiResponse on failure.
 */
export const downloadContractFile = async (
  clientId: number,
  contractTypeId: number
): Promise<Blob | ApiResponse> => {
  const params = new URLSearchParams({
    clientId: String(clientId),
    contractTypeId: String(contractTypeId),
  });
  return await apiFetchBlob(
    `${CLIENTS_ENDPOINT}/DownloadContractFile?${params.toString()}`,
    {
      method: "GET",
    }
  );
};
