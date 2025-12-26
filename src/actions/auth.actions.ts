"use server";

import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";
import { getErrorMessage, getErrorResponse } from "@/lib/utils/error.utils";
import { validateFormData } from "@/lib/utils/form.utils";
import { createLocalizedSchema } from "@/lib/utils/validation.utils";
import {
  changePassword,
  completeInvitation,
  resendVerificationCode,
  signIn,
  signUp,
  validateSignUpForm,
  verifyInvitation,
  verifyUser,
} from "@/services/auth/auth.service";
import {
  ChangePasswordRequest,
  changePasswordSchema,
  CompleteInvitationRequest,
  completeInvitationSchema,
  SignInRequest,
  signInSchema,
  SignUpRequest,
  signUpSchema,
  VerifyInvitationRequest,
  VerifyInvitationResponse,
  VerifyUserRequest,
  verifyUserSchema,
} from "@/services/auth/auth.types";
import { ApiResponseOf } from "@/services/common/ApiResponse";
import { ActionFormState } from "@/types/form.types";
import { jwtDecode } from "jwt-decode";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SignInFormState = ActionFormState<SignInRequest>;

export const signInAction = async (
  prevState: SignInFormState,
  formData: FormData
): Promise<SignInFormState> => {
  const returnUrl = (formData.get("returnUrl") as string) || "/";
  try {
    const localizedShema = await createLocalizedSchema(signInSchema);
    const validation = validateFormData(formData, localizedShema);

    if (!validation.success) {
      if (validation.fields.password) {
        delete validation.fields.password;
      }
      return {
        status: "error",
        errors: validation.errors,
        fields: validation.fields,
      };
    }

    const fields = validation.data;
    const response = await signIn(validation.data);

    if (!response.isSuccess) {
      return {
        status: "error",
        message: response.messages,
        fields: fields,
      };
    }

    if (response.result?.token) {
      const { token } = response.result;

      const decodedToken = jwtDecode<{ exp: number }>(token);
      const expiresAt = new Date(decodedToken.exp * 1000);

      const cookiesObj = await cookies();
      cookiesObj.set(COOKIE_CONSTANTS.AUTH_TOKEN, response.result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: expiresAt,
      });

      redirect(returnUrl);
    } else {
      return {
        status: "error",
        message: "Authentication failed, no token was provided.",
      };
    }
  } catch (error: unknown) {
    //TODO: Will be optimized.
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string" &&
      error.message.includes("NEXT_REDIRECT")
    ) {
      throw error;
    }
    return {
      status: "error",
      message: `An unexpected server error occurred. ${error}`,
    };
  }
};

export type SignUpFormState = ActionFormState<SignUpRequest>;

export const signUpAction = async (
  prevState: SignUpFormState,
  data: SignUpRequest
): Promise<SignUpFormState> => {
  try {
    const localizedSchema = await createLocalizedSchema(signUpSchema);
    const validation = localizedSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.error.format(),
        fields: data,
      };
    }

    const response = await signUp(validation.data);

    if (!response.isSuccess) {
      return {
        status: "error",
        message: response.messages,
        errors: undefined,
        fields: data,
      };
    }

    return {
      status: "success",
      message: response.messages,
      result: response.result,
    };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return { status: "error", message: message };
  }
};

export const validateSignupFormAction = async (
  prevState: SignUpFormState,
  data: SignUpRequest
): Promise<SignUpFormState> => {
  try {
    const localizedSchema = await createLocalizedSchema(signUpSchema);
    const validation = localizedSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.error.format(),
        fields: data,
      };
    }

    const response = await validateSignUpForm(validation.data);

    if (!response.isSuccess) {
      return {
        status: "error",
        message: response.messages,
        errors: undefined,
        fields: data,
      };
    }

    return {
      status: "success",
      message: response.messages,
    };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return { status: "error", message: message };
  }
};

export type VerifyUserFormState = ActionFormState<VerifyUserRequest>;

export const verifyUserAction = async (
  prevState: VerifyUserFormState,
  data: VerifyUserRequest
): Promise<VerifyUserFormState> => {
  try {
    const localizedSchema = await createLocalizedSchema(verifyUserSchema);
    const validation = localizedSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.error.format(),
        fields: data,
      };
    }

    const response = await verifyUser(validation.data);

    if (!response.isSuccess) {
      return {
        status: "error",
        message: response.messages,
        fields: validation.data,
      };
    }

    return {
      status: "success",
      result: response.result,
      message: response.messages,
    };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return { status: "error", message: message };
  }
};

export const resendVerificationCodeAction = async (
  token: string
): Promise<ApiResponseOf<string>> => {
  try {
    const response = await resendVerificationCode(token);
    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export type ChangePasswordFormState = ActionFormState<ChangePasswordRequest>;

export const changePasswordAction = async (
  prevState: ChangePasswordFormState,
  data: ChangePasswordRequest
): Promise<ChangePasswordFormState> => {
  try {
    const localizedSchema = await createLocalizedSchema(changePasswordSchema);
    const validation = localizedSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.error.format(),
        fields: data,
      };
    }

    const response = await changePassword(validation.data);

    if (!response.isSuccess) {
      return { status: "error", message: response.messages[0] };
    }

    return {
      status: "success",
      message: response.messages,
      fields: validation.data,
    };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return { status: "error", message: message };
  }
};

export const signOutAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_CONSTANTS.AUTH_TOKEN);
  cookieStore.delete(COOKIE_CONSTANTS.REFRESH_TOKEN);

  revalidatePath("/", "layout");

  return { success: true };
};

export const verifyInvitationAction = async (
  request: VerifyInvitationRequest
): Promise<ApiResponseOf<VerifyInvitationResponse>> => {
  try {
    return await verifyInvitation(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export type CompleteInvitationFormState =
  ActionFormState<CompleteInvitationRequest>;

export const completeInvitationAction = async (
  prevState: CompleteInvitationFormState,
  data: CompleteInvitationRequest
): Promise<CompleteInvitationFormState> => {
  try {
    const localizedSchema = await createLocalizedSchema(
      completeInvitationSchema
    );
    const validation = localizedSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.error.format(),
        fields: data,
      };
    }

    const response = await completeInvitation(validation.data);

    if (!response.isSuccess) {
      return { status: "error", message: response.messages };
    }

    const { token } = response.result!;

    const decodedToken = jwtDecode<{ exp: number }>(token);
    const expiresAt = new Date(decodedToken.exp * 1000);

    const cookiesObj = await cookies();
    cookiesObj.set(COOKIE_CONSTANTS.AUTH_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: expiresAt,
    });

    redirect("/");
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string" &&
      error.message.includes("NEXT_REDIRECT")
    ) {
      throw error;
    }
    const message = getErrorMessage(error);
    return { status: "error", message: message };
  }
};
