"use server";

import { getErrorMessage, getErrorResponse } from "@/lib/utils/error.utils";
import { unflattenObject } from "@/lib/utils/object.utils";
import { createLocalizedSchema } from "@/lib/utils/validation.utils";
import {
  addEditClient,
  deleteClient,
  deleteContractFile,
  downloadContractFile,
  getAllClients,
  getAllContractFiles,
  getClient,
  uploadAndVerifyContractFile,
} from "@/services/clients/clients.service";
import {
  AddEditClientDto,
  addEditClientSchema,
  ClientGridDto,
  ContractFileDto,
  ContractFileUploadRequest,
  GetAllClientsRequest,
} from "@/services/clients/clients.types";
import { ApiResponse, ApiResponseOf } from "@/services/common/ApiResponse";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import { ActionFormState } from "@/types/form.types";
import { revalidatePath } from "next/cache";

export const getAllClientsAction = async (
  request: GetAllClientsRequest
): Promise<PaginatedResponse<ClientGridDto> | ApiResponse> => {
  try {
    return await getAllClients(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getClientAction = async (
  id: number
): Promise<ApiResponseOf<AddEditClientDto>> => {
  try {
    return await getClient(id);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export type AddEditClientFormValues = ActionFormState<AddEditClientDto>;

export const addEditClientAction = async (
  prevState: AddEditClientFormValues,
  formData: FormData
): Promise<AddEditClientFormValues> => {
  try {
    const flatData = Object.fromEntries(formData);
    const nestedData = unflattenObject(flatData);

    const localizedSchema = await createLocalizedSchema(addEditClientSchema);
    const validation = localizedSchema.safeParse(nestedData);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.error.format(),
        fields: nestedData,
      };
    }

    const fields = validation.data;
    const response = await addEditClient(fields);
    if (!response.isSuccess) {
      return {
        status: "error",
        message: response.messages,
        fields: fields,
      };
    }

    revalidatePath("/clients/new");

    return {
      status: "success",
      message: response.messages,
      fields: nestedData,
      result: response.result,
    };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return { status: "error", message: message };
  }
};

export const deleteClientAction = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await deleteClient(id);
    if (response.isSuccess) {
      revalidatePath("/admin/clients");
    }
    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getAllContractFilesAction = async (
  clientId: number
): Promise<ApiResponseOf<ContractFileDto[]>> => {
  try {
    return await getAllContractFiles(clientId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const uploadAndVerifyContractFileAction = async (
  request: ContractFileUploadRequest
): Promise<ApiResponseOf<ContractFileDto>> => {
  try {
    return await uploadAndVerifyContractFile(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const deleteContractFileAction = async (
  clientId: number,
  contractTypeId: number
): Promise<ApiResponse> => {
  try {
    return await deleteContractFile(clientId, contractTypeId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const downloadContractFileAction = async (
  clientId: number,
  contractTypeId: number
): Promise<Blob | ApiResponse> => {
  try {
    return await downloadContractFile(clientId, contractTypeId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};
