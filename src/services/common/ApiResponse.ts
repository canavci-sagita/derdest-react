// src/api-models/common/ApiResponse.ts

// 1. Define the shapes with interfaces
export interface ApiResponse {
  isSuccess: boolean;
  messages: string[];
}

export interface ApiResponseOf<T> extends ApiResponse {
  result: T | null;
}

// 2. Create a factory object to build these plain objects
export const ApiResponseFactory = {
  /**
   * Creates a successful response object.
   */
  success<T>(): ApiResponseOf<T> {
    return {
      isSuccess: true,
      messages: [],
      result: null,
    };
  },

  /**
   * Creates a successful response object with a result.
   * @param result The data to include in the response.
   * @param message An optional success message.
   */
  successWithResult<T>(
    result: T,
    message?: string | string[]
  ): ApiResponseOf<T> {
    return {
      isSuccess: true,
      messages: message ? (Array.isArray(message) ? message : [message]) : [],
      result: result,
    };
  },

  /**
   * Creates a failed response object.
   */
  error<T>(): ApiResponseOf<T> {
    return {
      isSuccess: false,
      messages: [],
      result: null,
    };
  },

  /**
   * Creates a failed response object with an error message.
   * @param message The error message or messages.
   */
  errorWithMessage<T>(message: string | string[]): ApiResponseOf<T> {
    return {
      isSuccess: false,
      messages: Array.isArray(message) ? message : [message],
      result: null,
    };
  },
};
