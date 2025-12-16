import { z } from "zod";
import { LookupResponse } from "../common/LookupResponse";
import { addEditPhoneNoSchema } from "../common/AddEditPhoneNoDto";

export const signInSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().nonempty(t("required.email")),
    password: z.string().nonempty(t("required.password")),
    rememberMe: z.boolean().optional(),
  });

export type SignInRequest = z.infer<ReturnType<typeof signInSchema>>;

export class SignInResponse {
  token: string;
  tenants: LookupResponse[] | null;

  constructor(token: string, tenants: LookupResponse[] | null = null) {
    this.token = token;
    this.tenants = tenants;
  }
}

export type RefreshTokenRequest = { token: string };

export const signUpSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z
    .object({
      productId: z
        .string({ required_error: t("required.product") })
        .nonempty(t("required.product"))
        .nullable(),
      isCompany: z.boolean(),
      countryId: z.coerce
        .number({ invalid_type_error: t("required.country") })
        .min(1, { message: t("required.country") }),
      phoneNo: addEditPhoneNoSchema(t).nullable().optional(),
      email: z
        .string()
        .nonempty(t("required.email"))
        .email(t("invalid.email"))
        .max(50, t("maxLength.email", { maxLength: 50 })),
      password: z.string().nonempty(t("required.password")),
      confirmPassword: z.string().nonempty(t("required.confirmPassword")),
      firstName: z
        .string()
        .nonempty(t("required.firstName"))
        .max(30, t("maxLength.firstName", { maxLength: 30 })),
      lastName: z
        .string()
        .nonempty(t("required.lastName"))
        .max(30, t("maxLength.email", { maxLength: 30 })),
      companyTitle: z
        .string()
        .max(60, t("maxLength.companyTitle", { maxLength: 60 }))
        .optional()
        .nullable(),
      nationalId: z
        .string()
        .max(20, t("maxLength.nationalId", { maxLength: 20 }))
        .optional()
        .nullable(),
      taxId: z
        .string()
        .max(20, t("maxLength.taxId", { maxLength: 20 }))
        .optional()
        .nullable(),
      companyEmail: z
        .string()
        .email(t("invalid.email"))
        .max(50, t("maxLength.email", { maxLength: 50 }))
        .optional()
        .nullable()
        .or(z.literal("")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    })
    .superRefine((data, ctx) => {
      if (data.nationalId && data.nationalId.length < 9) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("invalid.nationalId"),
          path: ["nationalId"],
        });
      }
      if (data.isCompany) {
        if (!data.companyTitle) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required.companyTitle"),
            path: ["companyTitle"],
          });
        }
      }
    });

export type SignUpRequest = z.infer<ReturnType<typeof signUpSchema>>;

export const verifyUserSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    token: z.string().nonempty(t("required.token")),
    otp: z
      .string({ required_error: t("required.otp") })
      .min(6, { message: t("invalid.otp.min", { length: 6 }) })
      .max(6, { message: t("invalid.otp.max", { length: 6 }) }),
  });

export type VerifyUserRequest = z.infer<ReturnType<typeof verifyUserSchema>>;

export type TokenResponse = {
  token: string;
};

export const changePasswordSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z
    .object({
      currentPassword: z.string().nonempty(t("required.currentPassword")),
      newPassword: z
        .string()
        .nonempty(t("required.newPassword"))
        .max(100, t("maxLength.newPassword", { maxLength: 100 })),
      confirmPassword: z.string().nonempty(t("required.confirmPassword")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    });

export type ChangePasswordRequest = z.infer<
  ReturnType<typeof changePasswordSchema>
>;

export type VerifyInvitationRequest = {
  invitation: string;
};

export type VerifyInvitationResponse = {
  appTenantId: number;
  appUserId: number;
  email: string;
  company: string;
};

export const completeInvitationSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    appUserId: z.coerce.number().min(1, { message: t("required.user") }),
    appTenantId: z.coerce.number().min(1, { message: t("required.lawFirm") }),
    password: z.string().nonempty(t("required.password")),
    confirmPassword: z.string().nonempty(t("required.confirmPassword")),
  });

export type CompleteInvitationRequest = z.infer<
  ReturnType<typeof completeInvitationSchema>
>;
