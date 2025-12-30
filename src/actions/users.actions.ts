"use server";

import { ACCOUNT_TYPE_CONSTANTS } from "@/lib/constants/account-type.constants";
import { createLocalizedSchema } from "@/lib/utils/validation.utils";
import { ApiResponse, ApiResponseOf } from "@/services/common/ApiResponse";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import { AddEditLanguageDto } from "@/services/languages/languages.types";
import { SubscriptionDto } from "@/services/payments/payments.types";
import {
  changeEmailConfirmationStatus,
  changeActiveStatus,
  getAllUsers,
  getUserLanguagePreferences,
  getUserProfile,
  getUserProfileSummary,
  addEditUser,
  getUser,
  getRoleOrAssignments,
  getCredits,
  updateUserProfile,
  getSubscription,
  cancelSubscription,
  changeSubscription,
  subscribe,
  inviteUser,
  getAllTenantUsers,
  reinviteUser,
  getAllPetitionTemplates,
  uploadPetitionTemplate,
  downloadPetitionTemplate,
  deletePetitionTemplate,
} from "@/services/users/users.services";
import {
  AddEditUserDto,
  AddEditUserProfileDto,
  addEditUserProfileSchema,
  AddEditUserVM,
  addEditUserVMSchema,
  CreditBalanceResponse,
  GetAllUsersRequest,
  InviteUserRequest,
  inviteUserSchema,
  PetitionTemplateDto,
  RoleAssignmentDto,
  SubscribeRequest,
  TenantUserGridDto,
  UploadPetitionTemplateRequest,
  UserGridDto,
  UserProfileSummaryDto,
} from "@/services/users/users.types";
import { ActionFormState } from "@/types/form.types";
import { revalidatePath } from "next/cache";
import { getErrorMessage, getErrorResponse } from "@/lib/utils/error.utils";

export const getUserProfileAction = async (): Promise<
  ApiResponseOf<AddEditUserProfileDto>
> => {
  try {
    return await getUserProfile();
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export type UpdateProfileFormState = ActionFormState<AddEditUserProfileDto>;

export const updateProfileAction = async (
  prevState: UpdateProfileFormState,
  data: AddEditUserProfileDto
): Promise<UpdateProfileFormState> => {
  try {
    const localizedSchema = await createLocalizedSchema(
      addEditUserProfileSchema
    );
    const validation = localizedSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        message: "Please correct the errors below.",
        errors: validation.error.format(),
        fields: data,
      };
    }

    const response = await updateUserProfile(validation.data);

    if (!response.isSuccess) {
      return { status: "error", message: response.messages[0] };
    }

    revalidatePath("/settings/profile");

    return {
      status: "success",
      message: response.messages,
    };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return { status: "error", message: message };
  }
};

export const getUserLanguagePreferencesAction = async (): Promise<
  ApiResponseOf<AddEditLanguageDto>
> => {
  try {
    return await getUserLanguagePreferences();
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getAllUsersAction = async (
  request: GetAllUsersRequest
): Promise<PaginatedResponse<UserGridDto> | ApiResponse> => {
  try {
    return await getAllUsers(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const changeActiveStatusAction = async (
  appUserId: number,
  isActive: boolean
): Promise<ApiResponse> => {
  try {
    return await changeActiveStatus(appUserId, isActive);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const changeEmailConfirmationStatusAction = async (
  appUserId: number,
  emailConfirmed: boolean
): Promise<ApiResponse> => {
  try {
    return await changeEmailConfirmationStatus(appUserId, emailConfirmed);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getUserProfileSummaryAction = async (
  appUserId: number
): Promise<ApiResponseOf<UserProfileSummaryDto>> => {
  try {
    return await getUserProfileSummary(appUserId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

//TODO: Will be optimized.
export const getUserAction = async (
  appUserId: number
): Promise<ApiResponseOf<AddEditUserVM>> => {
  try {
    const response = await getUser(appUserId);

    if (!response.isSuccess) {
      return {
        isSuccess: false,
        messages: response.messages,
        result: null,
      };
    }

    const resultObj = response.result!;

    const accountType = resultObj.roleId
      ? ACCOUNT_TYPE_CONSTANTS.SINGLE_USER
      : resultObj.assignments && resultObj.assignments.length > 0
      ? ACCOUNT_TYPE_CONSTANTS.LAW_FIRM_USER
      : null;

    const returnObj: AddEditUserVM = {
      id: resultObj.id,
      accountDetails: {
        firstName: resultObj.firstName,
        lastName: resultObj.lastName,
        email: resultObj.email,
        isActive: resultObj.isActive,
        emailConfirmed: resultObj.emailConfirmed,
        nationalId: resultObj.profile.nationalId,
        barRegistrationNo: resultObj.profile.barRegistrationNo,
      },
      roleAssignments: {
        accountType: accountType,
        roleId: resultObj.roleId,
        assignments: resultObj.assignments || [],
      },
      contactAddress: {
        phoneNo: resultObj.phoneNo,
        address: resultObj.profile.address,
      },
      appSettings: {
        languageId: resultObj.profile.languageId,
        petitionLanguageId: resultObj.profile.petitionLanguageId,
        jurisdictionCountryId: resultObj.profile.jurisdictionCountryId,
      },
    };

    return { isSuccess: true, messages: response.messages, result: returnObj };
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export type AddEditUserFormValues = ActionFormState<AddEditUserVM>;

//TODO: Will be optimized.
export const addEditUserAction = async (
  prevState: AddEditUserFormValues,
  data: AddEditUserVM
): Promise<AddEditUserFormValues> => {
  try {
    const localizedSchema = await createLocalizedSchema(addEditUserVMSchema);
    const validation = localizedSchema.safeParse(data);
    if (!validation.success) {
      return {
        status: "error",
        errors: validation.error.format(),
        fields: data,
      };
    }

    const fields = validation.data;

    const request: AddEditUserDto = {
      id: validation.data.id,
      firstName: validation.data.accountDetails.firstName,
      lastName: validation.data.accountDetails.lastName,
      email: validation.data.accountDetails.email,
      password: validation.data.accountDetails.password,
      confirmPassword: validation.data.accountDetails.confirmPassword,
      isActive: validation.data.accountDetails.isActive,
      emailConfirmed: validation.data.accountDetails.emailConfirmed,
      phoneNo: validation.data.contactAddress.phoneNo,
      roleId: validation.data.roleAssignments.roleId,
      assignments: validation.data.roleAssignments.assignments,
      profile: {
        nationalId: validation.data.accountDetails.nationalId,
        barRegistrationNo: validation.data.accountDetails.barRegistrationNo,
        languageId: validation.data.appSettings.languageId,
        petitionLanguageId: validation.data.appSettings.petitionLanguageId,
        jurisdictionCountryId:
          validation.data.appSettings.jurisdictionCountryId,
        address: validation.data.contactAddress.address,
      },
    };

    const response = await addEditUser(request);

    if (!response.isSuccess) {
      return {
        status: "error",
        message: response.messages,
        fields: fields,
      };
    }

    revalidatePath("/users/new");

    return {
      status: "success",
      message: response.messages,
      fields: fields,
      result: response.result,
    };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return { status: "error", message: message };
  }
};

export const getRoleOrAssignmentsAction = async (
  appUserId: number
): Promise<ApiResponseOf<RoleAssignmentDto>> => {
  try {
    return await getRoleOrAssignments(appUserId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getCreditsAction = async (): Promise<
  ApiResponseOf<CreditBalanceResponse>
> => {
  try {
    return await getCredits();
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getSubscriptionAction = async (): Promise<
  ApiResponseOf<SubscriptionDto>
> => {
  try {
    return await getSubscription();
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const cancelSubscriptionAction = async (): Promise<ApiResponse> => {
  try {
    return await cancelSubscription();
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const changeSubscriptionAction = async (
  newPriceId: string
): Promise<ApiResponse> => {
  try {
    const response = await changeSubscription(newPriceId);

    revalidatePath("/settings/subscriptions");

    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const subscribeAction = async (
  request: SubscribeRequest
): Promise<ApiResponseOf<string>> => {
  try {
    return await subscribe(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export type InviteUserFormState = ActionFormState<InviteUserRequest>;

export const inviteUserAction = async (
  prevState: InviteUserFormState,
  data: InviteUserRequest
): Promise<InviteUserFormState> => {
  try {
    const localizedSchema = await createLocalizedSchema(inviteUserSchema);
    const validation = localizedSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.error.format(),
        fields: data,
      };
    }

    const response = await inviteUser(validation.data);

    if (!response.isSuccess) {
      return { status: "error", message: response.messages };
    }

    revalidatePath("/users");

    return {
      status: "success",
      message: response.messages,
    };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return { status: "error", message: message };
  }
};

export const getAllTenantUsersAction = async (
  request: GetAllUsersRequest
): Promise<PaginatedResponse<TenantUserGridDto> | ApiResponse> => {
  try {
    return await getAllTenantUsers(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const reinviteUserAction = async (
  appUserId: number
): Promise<ApiResponse> => {
  try {
    return await reinviteUser(appUserId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getAllPetitionTemplatesAction = async (
  petitionTypeId: number
): Promise<ApiResponseOf<PetitionTemplateDto[]>> => {
  try {
    return await getAllPetitionTemplates(petitionTypeId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const uploadPetitionTemplateAction = async (
  data: UploadPetitionTemplateRequest
): Promise<ApiResponseOf<PetitionTemplateDto>> => {
  try {
    const response = await uploadPetitionTemplate(data);

    if (response.isSuccess) {
      revalidatePath(`/settings/templates`);
    }

    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const downloadPetitionTemplateAction = async (
  templateFileId: number
): Promise<Blob | ApiResponse> => {
  try {
    return await downloadPetitionTemplate(templateFileId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const deletePetitionTemplateAction = async (
  petitionTemplateId: number
): Promise<ApiResponse> => {
  try {
    const response = await deletePetitionTemplate(petitionTemplateId);
    if (response.isSuccess) {
      revalidatePath(`/settings/templates`);
    }
    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};
