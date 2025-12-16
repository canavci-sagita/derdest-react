import { addEditAddressSchema } from "../common/AddEditAddressDto";
import { addEditPhoneNoSchema } from "../common/AddEditPhoneNoDto";
import { datePartSchema } from "../common/DatePartDto";
import { ApprovalStatus, PetitionFileType } from "../common/enums";
import { FileUploadRequest } from "../common/FileUploadRequest";
import { FilterRequest } from "../common/FilterRequest";
import { LookupResponse } from "../common/LookupResponse";
import { PaginatedRequest } from "../common/PaginatedRequest";
import z from "zod";

export interface CaseFilterRequest extends FilterRequest {
  startDate?: Date;
  endDate?: Date;
  clientId?: number;
  caseTypeId?: number;
  petitionTypeId?: number;
}

export interface CaseSummaryGridDto {
  id: number;
  client: string;
  title: string;
  date: Date;
  description: string;
  caseType: string;
  timelineCount: number;
  evidenceCount: number;
  partyCount: number;
  lastModifiedOn?: Date;
}

export interface CaseGridDto {
  id: number;
  caseType: string;
  client: string;
  title: string;
  date: Date;
  description: string;
}

export interface GetAllCasesRequest
  extends PaginatedRequest,
    CaseFilterRequest {}

export interface CaseHeaderDto {
  id: number;
  title: string;
  date: Date;
  description: string;
}

export const transcribedCaseRequestSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    clientId: z.coerce.number().min(1, { message: t("required.client") }),
    text: z
      .string()
      .nonempty(t("required.case.text"))
      .refine((value) => value !== "<p><br></p>", {
        message: t("required.case.text"),
      }),
    sourceFileName: z
      .string()
      .max(60, t("maxLength.sourceFile", { maxLength: 60 }))
      .optional(),
  });

export type TranscribedCaseRequest = z.infer<
  ReturnType<typeof transcribedCaseRequestSchema>
>;

export interface CaseSummaryDto {
  title: string;
  client: string;
  dateFormat: string;
  caseType: string;
  petitionType: string;
  summary: EditCaseSummaryDto;
}

export const editCaseSummarySchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    id: z.coerce.number().min(1, { message: t("required.id") }),
    caseTypeId: z.preprocess((val) => {
      if (val === "" || val === undefined || val === null) return 0;
      return Number(val);
    }, z.number().min(1, { message: t("required.caseType") })),
    petitionTypeId: z.preprocess((val) => {
      if (val === "" || val === undefined || val === null) return 0;
      return Number(val);
    }, z.number().min(1, { message: t("required.petitionType") })),
    date: z.coerce
      .date({
        errorMap: () => {
          return { message: t("required.date") };
        },
      })
      .nullable()
      .refine((val) => val !== null, { message: t("required.date") }),
    description: z
      .string()
      .nonempty(t("required.description"))
      .max(500, { message: t("maxLength.description", { maxLength: 500 }) }),
  });

export type EditCaseSummaryDto = z.infer<
  ReturnType<typeof editCaseSummarySchema>
>;

export interface EvidenceFilterRequest extends FilterRequest {
  date?: Date;
}

export interface GetAllEvidencesRequest
  extends PaginatedRequest,
    EvidenceFilterRequest {
  caseId: number;
}

export interface EvidenceGridDto {
  id: number;
  title: string;
  timeline: LookupResponse;
  description: string;
  lastModifiedOn?: Date;
  filesCount: number;
}

export interface EvidenceFileDto {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdOn: Date;
  description: string;
}

export const addEditEvidenceSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    id: z.coerce.number().optional(),
    caseId: z.coerce.number().min(1, { message: t("required.caseId") }),
    timelineId: z.coerce.number().optional(),
    title: z
      .string()
      .nonempty(t("required.title"))
      .max(60, t("maxLength.title", { maxLength: 60 })),
    description: z
      .string()
      .nonempty(t("required.description"))
      .max(100, t("maxLength.description", { maxLength: 100 })),
  });

export type AddEditEvidenceDto = z.infer<
  ReturnType<typeof addEditEvidenceSchema>
>;

export const addEditTimelineSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    id: z.coerce.number().optional(),
    caseId: z.coerce.number().min(1, { message: t("required.case") }),
    date: datePartSchema(t),
    description: z
      .string()
      .nonempty(t("required.description"))
      .max(100, { message: t("maxLength.description", { maxLength: 100 }) }),
    evidences: z
      .array(z.object({ id: z.number(), title: z.string() }))
      .optional(),
  });

export type AddEditTimelineDto = z.infer<
  ReturnType<typeof addEditTimelineSchema>
>;

export type TimelineGridDto = {
  id: number;
  date: string;
  description: string;
  evidences: LookupResponse[];
};

export interface UploadEvidenceFileRequest extends FileUploadRequest {
  caseId: number;
  evidenceId: number;
}

export interface SetEvidenceFileDescriptionRequest {
  caseId: number;
  evidenceFileId: number;
  description: string;
}

export interface TranscribeEvidenceFileRequest {
  caseId: number;
  evidenceFileId: number;
  language: string;
}

export interface PartyFilterRequest extends FilterRequest {
  searchText?: string;
  partyTypeId?: number;
  country?: string;
  city?: string;
}

export interface GetAllPartiesRequest
  extends PaginatedRequest,
    PartyFilterRequest {
  caseId: number;
}

export interface PartyGridDto {
  id: number;
  partyType: string;
  fullName: string;
  nationalId: string;
  city: string;
  country: string;
}

export const addEditPartySchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    id: z.coerce.number().optional(),
    caseId: z.coerce.number().min(1, { message: t("required.caseId") }),
    partyTypeId: z.preprocess((val) => {
      if (val === "" || val === undefined || val === null) return 0;
      return Number(val);
    }, z.number().min(1, { message: t("required.partyType") })),
    nationalId: z
      .string()
      .max(20, t("maxLength.nationalId", { maxLength: 20 }))
      .optional(),
    fullName: z
      .string()
      .nonempty(t("required.fullName"))
      .max(40, t("maxLength.fullName", { maxLength: 40 })),
    email: z
      .string()
      .max(50, t("maxLength.email", { maxLength: 50 }))
      .optional(),
    phoneNo: addEditPhoneNoSchema(t).optional(),
    address: addEditAddressSchema(t, true).optional(),
  });

export type AddEditPartyDto = z.infer<ReturnType<typeof addEditPartySchema>>;

export interface PetitionGridDto {
  id: number;
  fileName: string;
  petitionType: string;
  template: string;
  prompt: string;
  createdBy: string;
  createdOn: Date;
  status: LookupResponse;
  approver: string;
  description: string;
}

export interface PetitionFilterRequest extends FilterRequest {
  petitionTypeId?: number;
  status?: ApprovalStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface GetAllPetitionsRequest
  extends PaginatedRequest,
    PetitionFilterRequest {
  caseId: number;
}

export const createPetitionSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    caseId: z.coerce.number().min(1, { message: t("required.caseId") }),
    petitionTypeId: z.coerce
      .number()
      .min(1, { message: t("required.petitionType") }),
    prompt: z.string().optional(),
  });

export type CreatePetitionRequest = z.infer<
  ReturnType<typeof createPetitionSchema>
>;

export interface CreatePetitionResponse {
  id: number;
  content: string;
  createdBy: number;
}

export const editPetitionSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    caseId: z.coerce.number().min(1, { message: t("required.caseId") }),
    petitionId: z.coerce.number().min(1, { message: t("required.petition") }),
    content: z.string().nonempty(t("required.petitionContent")),
  });

export type EditPetitionRequest = z.infer<
  ReturnType<typeof editPetitionSchema>
>;

export type GetPetitionResponse = {
  content: string;
  hasPermission: boolean;
  status: ApprovalStatus;
  createdBy: number;
};

export interface DownloadPetitionFileRequest {
  caseId: number;
  petitionId: number;
  fileType: PetitionFileType;
}

export interface GetAllDocumentsRequest extends DocumentFilterRequest {
  caseId: number;
  documentTypeId: number | null;
}

export interface DocumentFilterRequest extends FilterRequest {
  fileName?: string;
}

export interface DocumentDto {
  id: number;
  documentTypeId?: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdOn: Date;
}

export interface AddEditActivityDto {
  id: number;
  caseId: number;
  documentId?: number;
  fileName: string;
  startDate: Date;
  endDate?: Date;
  title: string;
  description: string;
}

export interface ActivityGridDto {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
}

export interface ScanDocumentResponse {
  documentId: number;
  timelines: TimelineGridDto[];
  evidences: EvidenceGridDto[];
  parties: PartyGridDto[];
  activities: ActivityGridDto[];
}

export interface UploadDocumentRequest extends FileUploadRequest {
  caseId: number;
}
