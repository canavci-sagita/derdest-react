import z from "zod";
import { AIVerificationResult, CompanyType, FileStatus } from "../common/enums";
import { FilterRequest } from "../common/FilterRequest";
import { PaginatedRequest } from "../common/PaginatedRequest";
import { addEditAddressSchema } from "../common/AddEditAddressDto";
import { addEditPhoneNoSchema } from "../common/AddEditPhoneNoDto";
import { FileUploadRequest } from "../common/FileUploadRequest";

export interface ClientFilterRequest extends FilterRequest {
  clientType?: CompanyType;
  country?: string;
  city?: string;
}

export interface ClientGridDto {
  id: number;
  clientType: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  companyTitle: string;
  taxOffice: string;
  email: string;
  phoneNo: string;
  country: string;
  city: string;
}

export interface GetAllClientsRequest
  extends PaginatedRequest,
    ClientFilterRequest {}

export const addEditClientSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z
    .object({
      id: z.coerce.number().optional(),
      clientType: z.coerce.number().pipe(
        z.nativeEnum(CompanyType, {
          message: t("required.clientType"),
        })
      ),
      nationalId: z
        .string()
        .nonempty(t("required.nationalId"))
        .max(20, t("maxLength.nationalId", { maxLength: 20 })),
      firstName: z
        .string()
        .nonempty(t("required.firstName"))
        .max(30, t("maxLength.firstName", { maxLength: 30 })),
      lastName: z
        .string()
        .nonempty(t("required.lastName"))
        .max(30, t("maxLength.lastName", { maxLength: 30 })),
      companyTitle: z
        .string()
        .max(50, t("maxLength.companyTitle", { maxLength: 50 }))
        .optional(),
      taxOffice: z
        .string()
        .max(50, t("maxLength.taxOffice", { maxLength: 50 }))
        .optional(),
      email: z
        .string()
        .nonempty(t("required.email"))
        .email(t("invalid.email"))
        .max(50, t("maxLength.email", { maxLength: 50 })),
      phoneNo: addEditPhoneNoSchema(t).optional(),
      address: addEditAddressSchema(t),
    })
    .superRefine((data, ctx) => {
      if (data.clientType === CompanyType.Corporate) {
        if (!data.companyTitle) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required.companyTitle"),
            path: ["companyTitle"],
          });
        }
        if (!data.taxOffice) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required.taxOffice"),
            path: ["taxOffice"],
          });
        }
      }
    });

export type AddEditClientDto = z.infer<ReturnType<typeof addEditClientSchema>>;

export interface ContractFileDto {
  contractTypeId: number;
  fileName: string | null;
  fileType: string | null;
  fileSize: number;
  description: string | null;
  createdOn?: Date | null;
  status: FileStatus;
  verificationResult: AIVerificationResult | null;
  summary: ContractFileSummaryDto | null;
}

export interface ContractFileSummaryDto {
  lawyerName: string;
  lawyerIsSigned: boolean;
  clientName: string;
  clientNationalId: string;
  clientIsSigned: boolean;
}

export interface ContractFileUploadRequest extends FileUploadRequest {
  clientId: number;
  contractTypeId: number;
}
