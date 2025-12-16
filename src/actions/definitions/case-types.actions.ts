"use server";

import { revalidatePath } from "next/cache";
import {
  addEditCaseTypeSchema,
  AddEditCaseTypeDto,
  CaseTypeGridDto,
} from "@/services/definitions/definitions.types";
import {
  addEditCaseType,
  deleteCaseType,
  getAllCaseTypes,
  getCaseType,
} from "@/services/definitions/definitions.service";
import type { ActionFormState } from "@/types/form.types";
import { PaginatedRequest } from "@/services/common/PaginatedRequest";
import { ApiResponse, ApiResponseOf } from "@/services/common/ApiResponse";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import { createLocalizedSchema } from "@/lib/utils/validation.utils";
import { validateFormData } from "@/lib/utils/form.utils";
import { getErrorMessage, getErrorResponse } from "@/lib/utils/error.utils";

export const getAllCaseTypesAction = async (
  request: PaginatedRequest
): Promise<PaginatedResponse<CaseTypeGridDto> | ApiResponse> => {
  try {
    return await getAllCaseTypes(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getCaseTypeAction = async (
  id: number
): Promise<ApiResponseOf<AddEditCaseTypeDto> | ApiResponse> => {
  try {
    return await getCaseType(id);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const deleteCaseTypeAction = async (
  id: number
): Promise<ApiResponse> => {
  try {
    const response = await deleteCaseType(id);
    if (response.isSuccess) {
      revalidatePath("/admin/definitions/case-types");
    }
    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export type AddEditCaseTypeFormValues = ActionFormState<AddEditCaseTypeDto>;

export const addEditCaseTypeAction = async (
  prevState: AddEditCaseTypeFormValues,
  formData: FormData
): Promise<AddEditCaseTypeFormValues> => {
  try {
    const localizedSchema = await createLocalizedSchema(addEditCaseTypeSchema);
    const validation = validateFormData(formData, localizedSchema);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.errors,
        fields: validation.fields,
      };
    }

    const fields = validation.data;
    const response = await addEditCaseType(fields);

    if (!response.isSuccess) {
      return {
        status: "error",
        message: response.messages,
        fields: fields,
      };
    }

    revalidatePath("/admin/definitions/case-types");

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
