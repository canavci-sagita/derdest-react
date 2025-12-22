"use server";

import { ApiResponse, ApiResponseOf } from "../common/ApiResponse";
import { PaginatedResponse } from "../common/PaginatedResponse";
import { AddEditLanguageDto } from "../languages/languages.types";
import {
  AddEditUserDto,
  AddEditUserProfileDto,
  CreditBalanceResponse,
  GetAllUsersRequest,
  InviteUserRequest,
  RoleAssignmentDto,
  SubscribeRequest,
  TenantUserGridDto,
  UserGridDto,
  UserProfileSummaryDto,
} from "./users.types";
import { SubscriptionDto } from "../payments/payments.types";
import { apiFetchApiResponse, apiFetchPaginated } from "@/lib/api-fetch";

const USERS_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/Users`;

/**
 * Fetches a profile details for auhenticated user.
 * @returns The user profile object.
 */
export const getUserProfile = async (): Promise<
  ApiResponseOf<AddEditUserProfileDto>
> => {
  return await apiFetchApiResponse(`${USERS_ENDPOINT}/GetUserProfile`, {
    method: "GET",
  });
};

/**
 * Updates the profile of the currently logged-in user.
 */
export const updateUserProfile = async (
  profileData: AddEditUserProfileDto
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${USERS_ENDPOINT}/UpdateUserProfile`, {
    method: "POST",
    body: JSON.stringify(profileData),
  });
};

/**
 * Fetches authenticated user's language preferences.
 * @returns A promise that resolves to the API response of language object.
 */
export const getUserLanguagePreferences = async (): Promise<
  ApiResponseOf<AddEditLanguageDto>
> => {
  return await apiFetchApiResponse(
    `${USERS_ENDPOINT}/GetUserLanguagePreferences`,
    {
      method: "GET",
    }
  );
};

/**
 * Fetches a paginated list of users.
 * @param request The request object containing PaginatedRequest.
 */
export const getAllUsers = async (
  request: GetAllUsersRequest
): Promise<PaginatedResponse<UserGridDto>> => {
  const { pageNumber, pageSize, orderBy, ...filter } = request;
  const pagination = { pageNumber, pageSize, orderBy };

  return await apiFetchPaginated(`${USERS_ENDPOINT}/GetAllUsers`, {
    method: "POST",
    body: JSON.stringify({
      filter: filter,
      pagination: pagination,
    }),
  });
};

/**
 * Sets user's activation status.
 * @param appUserId The ID of the user.
 * @param isActive Activation status
 * @returns A promise that resolves to the API response.
 */
export const changeActiveStatus = async (
  appUserId: number,
  isActive: boolean
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${USERS_ENDPOINT}/ChangeActiveStatus`, {
    method: "POST",
    body: JSON.stringify({ appUserId, isActive }),
  });
};

/**
 * Sets user's e-mail confirmation status.
 * @param appUserId The ID of the user.
 * @param emailConfirmed E-mail confirmation status
 * @returns A promise that resolves to the API response.
 */
export const changeEmailConfirmationStatus = async (
  appUserId: number,
  emailConfirmed: boolean
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(
    `${USERS_ENDPOINT}/ChangeEmailConfirmationStatus`,
    {
      method: "POST",
      body: JSON.stringify({ appUserId, emailConfirmed }),
    }
  );
};

/**
 * Fetches user profile summary.
 * @param appUserId The Id of the user.
 * @returns A promise that resolves to the API response of user profile object.
 */
export const getUserProfileSummary = async (
  appUserId: number
): Promise<ApiResponseOf<UserProfileSummaryDto>> => {
  const params = new URLSearchParams({
    appUserId: String(appUserId),
  });
  return await apiFetchApiResponse(
    `${USERS_ENDPOINT}/GetUserProfileSummary?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Fetches the details of a single user for editing.
 */
export const getUser = async (
  appUserId: number
): Promise<ApiResponseOf<AddEditUserDto>> => {
  const params = new URLSearchParams({
    appUserId: String(appUserId),
  });
  return await apiFetchApiResponse(
    `${USERS_ENDPOINT}/GetUser?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Creates or updates a user. Sends data as FormData.
 * @param formData The form data containing user details and assignments (as JSON string).
 */
export const addEditUser = async (
  data: AddEditUserDto
): Promise<ApiResponseOf<number>> => {
  return await apiFetchApiResponse(`${USERS_ENDPOINT}/AddEditUser`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Fetches the roleId or assignments of a single user.
 */
export const getRoleOrAssignments = async (
  appUserId: number
): Promise<ApiResponseOf<RoleAssignmentDto>> => {
  const params = new URLSearchParams({
    appUserId: String(appUserId),
  });
  return await apiFetchApiResponse(
    `${USERS_ENDPOINT}/GetRoleOrAssignments?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Fetches the current credit balance for the authenticated user.
 * This includes both credits from their active subscription and any
 * additional one-time purchased credits.
 *
 * @returns A promise resolving to the credit balance details.
 */
export const getCredits = async (): Promise<
  ApiResponseOf<CreditBalanceResponse>
> => {
  return await apiFetchApiResponse(`${USERS_ENDPOINT}/GetCredits`, {
    method: "GET",
    cache: "no-store",
  });
};

/**
 * Fetches the current user's subscription details.
 */
export const getSubscription = async (): Promise<
  ApiResponseOf<SubscriptionDto>
> => {
  return await apiFetchApiResponse(`${USERS_ENDPOINT}/GetSubscription`, {
    method: "GET",
    cache: "no-store",
  });
};

/**
 * Cancels current user's subscription.
 */
export const cancelSubscription = async (): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${USERS_ENDPOINT}/CancelSubscription`, {
    method: "POST",
  });
};

/**
 * Changes the user's subscription to a new plan (Price ID).
 * This usually happens immediately or at period end depending on backend logic.
 */
export const changeSubscription = async (
  newPriceId: string
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${USERS_ENDPOINT}/ChangeSubscription`, {
    method: "POST",
    body: JSON.stringify({ newPriceId }),
  });
};

/**
 * Subscribes user for the selected product
 */
export const subscribe = async (
  request: SubscribeRequest
): Promise<ApiResponseOf<string>> => {
  return await apiFetchApiResponse(`${USERS_ENDPOINT}/Subscribe`, {
    method: "POST",
    body: JSON.stringify(request),
  });
};

/**
 * Sends an invitation to a new user to join the tenant.
 */
export const inviteUser = async (
  request: InviteUserRequest
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${USERS_ENDPOINT}/InviteUser`, {
    method: "POST",
    body: JSON.stringify(request),
  });
};

/**
 * Fetches a paginated list of users for company admins.
 * @param request The request object containing PaginatedRequest.
 */
export const getAllTenantUsers = async (
  request: GetAllUsersRequest
): Promise<PaginatedResponse<TenantUserGridDto>> => {
  const { pageNumber, pageSize, orderBy, ...filter } = request;
  const pagination = { pageNumber, pageSize, orderBy };

  return await apiFetchPaginated(`${USERS_ENDPOINT}/GetAllTenantUsers`, {
    method: "POST",
    body: JSON.stringify({
      filter: filter,
      pagination: pagination,
    }),
  });
};

/**
 * Sends an invitation to a user to join the tenant.
 */
export const reinviteUser = async (appUserId: number): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${USERS_ENDPOINT}/ReinviteUser`, {
    method: "POST",
    body: JSON.stringify({ appUserId }),
  });
};
