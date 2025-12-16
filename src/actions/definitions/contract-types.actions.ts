"use server";

import { revalidatePath } from "next/cache";
import {
  addEditContractTypeSchema,
  AddEditContractTypeDto,
  ContractTypeGridDto,
} from "@/services/definitions/definitions.types";
import {
  addEditContractType,
  deleteContractType,
  getAllContractTypes,
  getContractType,
} from "@/services/definitions/definitions.service";
import type { ActionFormState } from "@/types/form.types";
import { PaginatedRequest } from "@/services/common/PaginatedRequest";
import { ApiResponse, ApiResponseOf } from "@/services/common/ApiResponse";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import { createLocalizedSchema } from "@/lib/utils/validation.utils";
import { validateFormData } from "@/lib/utils/form.utils";
import { getErrorMessage, getErrorResponse } from "@/lib/utils/error.utils";

export const getAllContractTypesAction = async (
  request: PaginatedRequest
): Promise<PaginatedResponse<ContractTypeGridDto> | ApiResponse> => {
  try {
    return await getAllContractTypes(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getContractTypeAction = async (
  id: number
): Promise<ApiResponseOf<AddEditContractTypeDto> | ApiResponse> => {
  try {
    return await getContractType(id);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const deleteContractTypeAction = async (
  id: number
): Promise<ApiResponse> => {
  try {
    const response = await deleteContractType(id);
    if (response.isSuccess) {
      revalidatePath("/admin/definitions/contract-types");
    }
    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export type AddEditContractTypeFormValues =
  ActionFormState<AddEditContractTypeDto>;

export const addEditContractTypeAction = async (
  prevState: AddEditContractTypeFormValues,
  formData: FormData
): Promise<AddEditContractTypeFormValues> => {
  try {
    const localizedSchema = await createLocalizedSchema(
      addEditContractTypeSchema
    );
    const validation = validateFormData(formData, localizedSchema);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.errors,
        fields: validation.fields,
      };
    }

    const fields = validation.data;
    const response = await addEditContractType(fields);

    if (!response.isSuccess) {
      return {
        status: "error",
        message: response.messages,
        fields: fields,
      };
    }

    revalidatePath("/admin/definitions/contract-types");

    return {
      status: "success",
      message: response.messages,
      fields: fields,
    };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return { status: "error", message: message };
  }
};
