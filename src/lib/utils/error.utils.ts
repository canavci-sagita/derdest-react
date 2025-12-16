import {
  ApiResponseFactory,
  ApiResponseOf,
} from "@/services/common/ApiResponse";

export const getErrorResponse = <T>(error: unknown): ApiResponseOf<T> => {
  if (error instanceof Error) {
    return ApiResponseFactory.errorWithMessage(error.message);
  }

  //TODO: Will be localized.
  return ApiResponseFactory.errorWithMessage("An unexpected error occurred");
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  //TODO: Will be localized.
  return "An unexpected error occurred";
};
