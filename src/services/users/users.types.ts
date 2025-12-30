import z from "zod";
import { addEditAddressSchema } from "../common/AddEditAddressDto";
import { FilterRequest } from "../common/FilterRequest";
import { PaginatedRequest } from "../common/PaginatedRequest";
import {
  AddEditPhoneNoDto,
  addEditPhoneNoSchema,
} from "../common/AddEditPhoneNoDto";
import { ACCOUNT_TYPE_CONSTANTS } from "@/lib/constants/account-type.constants";
import { FileUploadRequest } from "../common/FileUploadRequest";

export interface AddEditUserDto {
  id?: number;
  roleId?: number | null;
  email: string;
  firstName: string;
  lastName: string;
  phoneNo?: AddEditPhoneNoDto;
  password?: string;
  confirmPassword?: string;
  emailConfirmed: boolean;
  isActive: boolean;
  assignments: AddEditAssignmentDto[];
  profile: AddEditUserProfileDto;
}

export const addEditUserProfileSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    languageId: z.number().nullable().optional(),
    petitionLanguageId: z.number().nullable().optional(),
    jurisdictionCountryId: z.number().nullable().optional(),
    nationalId: z
      .string()
      .max(20, t("maxLength.nationalId", { maxLength: 20 }))
      .nullable(),
    barRegistrationNo: z
      .string()
      .max(20, t("maxLength.barRegistrationNo", { maxLength: 20 }))
      .nullable(),
    address: addEditAddressSchema(t, true).optional(),
  });

export type AddEditUserProfileDto = z.infer<
  ReturnType<typeof addEditUserProfileSchema>
>;

export const addEditUserVMSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z
    .object({
      id: z.coerce.number().optional(),
      accountDetails: accountDetailsVMSchema(t),
      roleAssignments: roleAssigmentsVMSchema(t),
      contactAddress: userContactAddressVMSchema(t),
      appSettings: userAppSettingsVMSchema(),
    })
    .superRefine((data, ctx) => {
      if (data.roleAssignments.assignments.length === 0) {
        if (!data.roleAssignments.roleId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required.role"),
            path: ["roleAssignments.roleId"],
          });
        }
      } else {
        if (
          data.roleAssignments.assignments.filter((a) => !a.roleId).length > 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required.assignment"),
            path: ["roleAssignments.assignments"],
          });
        }
      }
      if (!data.id) {
        if (
          !data.accountDetails.password ||
          data.accountDetails.password === ""
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required.password"),
            path: ["accountDetails", "password"],
          });
        }
        if (!data.accountDetails.confirmPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required.confirmPassword"),
            path: ["accountDetails", "confirmPassword"],
          });
        }
      }
    });

export type AddEditUserVM = z.infer<ReturnType<typeof addEditUserVMSchema>>;

export const accountDetailsVMSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z
    .object({
      email: z
        .string()
        .nonempty(t("required.email"))
        .email(t("invalid.email"))
        .max(50, t("maxLength.email", { max: 50 })),
      firstName: z
        .string()
        .nonempty(t("required.firstName"))
        .max(30, t("maxLength.firstName", { maxLength: 30 })),
      lastName: z
        .string()
        .nonempty(t("required.lastName"))
        .max(30, t("maxLength.lastName", { maxLength: 30 })),
      password: z
        .string()
        .max(20, t("maxLength.password", { maxLength: 20 }))
        .optional(),
      confirmPassword: z.string().optional(),
      nationalId: z
        .string()
        .max(20, t("maxLength.nationalId", { maxLength: 20 }))
        .nullable(),
      barRegistrationNo: z
        .string()
        .max(20, t("maxLength.barRegistrationNo", { maxLength: 20 }))
        .nullable(),
      emailConfirmed: z.boolean().default(false),
      isActive: z.boolean().default(false),
    })
    .refine(
      (data) => {
        if (
          data.password &&
          data.confirmPassword &&
          data.password !== data.confirmPassword
        ) {
          return false;
        }
        return true;
      },
      {
        message: t("passwordMismatch"),
        path: ["confirmPassword"],
      }
    );

export type AccountDetailsVM = z.infer<
  ReturnType<typeof accountDetailsVMSchema>
>;

export const roleAssigmentsVMSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z
    .object({
      accountType: z
        .enum(
          [
            ACCOUNT_TYPE_CONSTANTS.SINGLE_USER,
            ACCOUNT_TYPE_CONSTANTS.LAW_FIRM_USER,
          ],
          {
            required_error: t("required.accountType"),
          }
        )
        .nullable()
        .refine(
          (data) => {
            if (!data) {
              return false;
            }
            return true;
          },
          {
            message: t("required.accountType"),
          }
        ),
      roleId: z.coerce.number().nullable().optional(),
      assignments: z
        .array(addEditAssignmentSchema(t, false))
        .optional()
        .default([]),
    })
    .superRefine((data, ctx) => {
      if (data.accountType === ACCOUNT_TYPE_CONSTANTS.SINGLE_USER) {
        if (!data.roleId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required.role"),
            path: ["roleId"],
          });
        }
      } else if (data.accountType === ACCOUNT_TYPE_CONSTANTS.LAW_FIRM_USER) {
        if (data.assignments.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required.assignments"),
            path: ["assignments"],
          });
        }
      }
    });

export type RoleAssigmentsVM = z.infer<
  ReturnType<typeof roleAssigmentsVMSchema>
>;

export const userContactAddressVMSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    phoneNo: addEditPhoneNoSchema(t).optional(),
    address: addEditAddressSchema(t, true).optional(),
  });

export type UserContactAddressVM = z.infer<
  ReturnType<typeof userContactAddressVMSchema>
>;

export const userAppSettingsVMSchema = () =>
  z.object({
    languageId: z.number().nullable().optional(),
    petitionLanguageId: z.number().nullable().optional(),
    jurisdictionCountryId: z.number().nullable().optional(),
  });

export type UserAppSettingsVM = z.infer<
  ReturnType<typeof userAppSettingsVMSchema>
>;

export interface UserFilterRequest extends FilterRequest {
  lawFirmId?: number;
  country?: string;
  city?: string;
  emailConfirmed?: boolean;
  isActive?: boolean;
}

export interface GetAllUsersRequest
  extends PaginatedRequest,
    UserFilterRequest {}

export interface UserGridDto {
  id: number;
  nationalId: string;
  barRegistrationNo: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  emailConfirmed: boolean;
  isActive: boolean;
}

export interface UserProfileSummaryDto {
  language: string;
  jurisdictionCountry: string;
  petitionLanguage: string;
  address1: string;
  address2: string;
  address3: string;
}

export const addEditAssignmentSchema = (
  t: (key: string) => string,
  isUserSelection: boolean
) =>
  z.object({
    tenantOrUserId: z.preprocess((val) => {
      if (val === "" || val === undefined || val === null) return 0;
      return Number(val);
    }, z.number().min(1, { message: t(`required.${isUserSelection ? "user" : "lawFirm"}`) })),
    // roleId: z.preprocess((val) => {
    //   if (val === "" || val === undefined || val === null) return 0;
    //   return Number(val);
    // }, z.number().min(1, { message: t("required.role") })),
    roleId: z.number({ invalid_type_error: t("required.role") }),
    startDate: z
      .string()
      .datetime({ message: t("invalid.date") })
      .nullable()
      .optional(),
    endDate: z
      .string()
      .datetime({ message: t("invalid.date") })
      .nullable()
      .optional(),
  });

export type AddEditAssignmentDto = z.infer<
  ReturnType<typeof addEditAssignmentSchema>
>;

export interface AccountStatuses {
  isActive: boolean;
  emailConfirmed: boolean;
}

export type AssignmentDto = {
  title: string;
  role: string;
  startDate: Date;
  endDate: Date;
};

export type RoleAssignmentDto = {
  role?: string;
  assignments: AssignmentDto[];
};

export type CreditBalanceResponse = {
  subscriptionBalance: number;
  purchasedBalance: number;
};

export type SubscribeRequest = {
  productId: string;
  redirectUrl: string;
};

export const inviteUserSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    firstName: z.string().nonempty(t("required.firstName")),
    lastName: z.string().nonempty(t("required.lastName")),
    email: z.string().email(t("invalid.email")).nonempty(t("required.email")),
    //TODO: All id properties will be converted like this rule.
    roleId: z.coerce
      .number({ invalid_type_error: t("required.role") })
      .min(1, { message: t("required.role") })
      .optional(),
  });

export type InviteUserRequest = z.infer<ReturnType<typeof inviteUserSchema>>;

export interface TenantUserGridDto extends UserGridDto {
  role: string;
  isInvitationPending: boolean;
}

export type PetitionTemplateDto = {
  id: number;
  petitionTypeId: number;
  fileName: string;
  fileSize: number;
  isDefault: boolean;
  createdOn: Date;
};

export interface UploadPetitionTemplateRequest extends FileUploadRequest {
  petitionTypeId: number;
}
