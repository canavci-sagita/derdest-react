"use server";

import { unflattenObject } from "@/lib/utils/object.utils";
import { createLocalizedSchema } from "@/lib/utils/validation.utils";
import { validateFormData } from "@/lib/utils/form.utils";
import {
  getAllCasesSummary,
  deleteCase,
  createCaseFromTranscribedText,
  transcribeAudioFile,
  transcribeUploadedFile,
  getCaseSummary,
  editCaseSummary,
  getAllTimelines,
  getAllUnlinkedEvidences,
  addEditTimeline,
  deleteTimeline,
  getAllEvidences,
  getAllEvidenceFiles,
  getEvidenceFileDescription,
  addEditEvidence,
  deleteEvidence,
  uploadEvidenceFile,
  setEvidenceFileDescription,
  deleteEvidenceFile,
  downloadEvidenceFile,
  transcribeEvidenceFile,
  getAllParties,
  addEditParty,
  getParty,
  deleteParty,
  getAllPetitions,
  createPetition,
  getDefaultPrompt,
  getCurrentPetitionTypeId,
  editPetition,
  getPetition,
  downloadPetitionFile,
  downloadPetitionAttachmentFile,
  getAllDocuments,
  downloadDocument,
  deleteDocument,
  scanDocument,
  uploadDocument,
  changeDocumentType,
  getEvidence,
} from "@/services/cases/cases.service";
import {
  AddEditEvidenceDto,
  addEditEvidenceSchema,
  AddEditTimelineDto,
  CaseSummaryDto,
  CaseSummaryGridDto,
  EditCaseSummaryDto,
  editCaseSummarySchema,
  EvidenceFileDto,
  UploadEvidenceFileRequest,
  EvidenceGridDto,
  GetAllCasesRequest,
  GetAllEvidencesRequest,
  TranscribedCaseRequest,
  transcribedCaseRequestSchema,
  SetEvidenceFileDescriptionRequest,
  TranscribeEvidenceFileRequest,
  GetAllPartiesRequest,
  PartyGridDto,
  AddEditPartyDto,
  addEditPartySchema,
  GetAllPetitionsRequest,
  PetitionGridDto,
  CreatePetitionRequest,
  createPetitionSchema,
  EditPetitionRequest,
  editPetitionSchema,
  GetPetitionResponse,
  DownloadPetitionFileRequest,
  DocumentDto,
  UploadDocumentRequest,
  GetAllDocumentsRequest,
  ScanDocumentResponse,
} from "@/services/cases/cases.types";
import { ApiResponse, ApiResponseOf } from "@/services/common/ApiResponse";
import { PromptType } from "@/services/common/enums";
import { FileUploadRequest } from "@/services/common/FileUploadRequest";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import { ActionFormState } from "@/types/form.types";
import { revalidatePath } from "next/cache";
import { getErrorMessage, getErrorResponse } from "@/lib/utils/error.utils";

export const getAllCasesSummaryAction = async (
  request: GetAllCasesRequest
): Promise<PaginatedResponse<CaseSummaryGridDto> | ApiResponse> => {
  try {
    return await getAllCasesSummary(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const deleteCaseAction = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await deleteCase(id);
    if (response.isSuccess) {
      revalidatePath("/cases");
    }
    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export type TranscribedCaseRequestFormValues =
  ActionFormState<TranscribedCaseRequest>;

export const createCaseFromTranscribedTextAction = async (
  prevState: TranscribedCaseRequestFormValues,
  formData: FormData
): Promise<TranscribedCaseRequestFormValues> => {
  try {
    const localizedSchema = await createLocalizedSchema(
      transcribedCaseRequestSchema
    );
    const validation = validateFormData(formData, localizedSchema);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.errors,
        fields: validation.fields,
      };
    }

    const fields = validation.data;
    const response = await createCaseFromTranscribedText(fields);
    if (!response.isSuccess) {
      return {
        status: "error",
        message: response.messages,
        fields: fields,
      };
    }

    revalidatePath("/cases/new");

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

export const transcribeAudioFileAction = async (
  request: FileUploadRequest
): Promise<ApiResponseOf<string>> => {
  try {
    return await transcribeAudioFile(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const transcribeUploadedFileAction = async (
  request: FileUploadRequest
): Promise<ApiResponseOf<string>> => {
  try {
    return await transcribeUploadedFile(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getCaseSummaryAction = async (
  id: number
): Promise<ApiResponseOf<CaseSummaryDto>> => {
  try {
    return await getCaseSummary(id);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export type EditCaseSummaryFormValues = ActionFormState<EditCaseSummaryDto>;

export const editCaseSummaryAction = async (
  prevState: EditCaseSummaryFormValues,
  formData: FormData
): Promise<EditCaseSummaryFormValues> => {
  try {
    const rawData = Object.fromEntries(formData);

    const localizedSchema = await createLocalizedSchema(editCaseSummarySchema);
    const validation = localizedSchema.safeParse(rawData);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.error.format(),
        fields: rawData,
      };
    }

    const fields = validation.data;
    const response = await editCaseSummary(fields);
    if (!response.isSuccess) {
      return {
        status: "error",
        message: response.messages,
        fields: fields,
      };
    }

    revalidatePath(`/cases/${rawData.id}`);

    return {
      status: "success",
      message: response.messages,
      fields: rawData,
    };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return { status: "error", message: message };
  }
};

export const getAllTimelinesAction = async (
  id: number
): Promise<ApiResponseOf<AddEditTimelineDto[]>> => {
  try {
    return await getAllTimelines(id);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getAllUnlinkedEvidencesAction = async (
  caseId: number,
  timelineId?: number | null
): Promise<ApiResponseOf<AddEditEvidenceDto[]>> => {
  try {
    return await getAllUnlinkedEvidences(caseId, timelineId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const addEditTimelineAction = async (
  data: AddEditTimelineDto
): Promise<ApiResponse> => {
  try {
    const response = await addEditTimeline(data);

    if (response.isSuccess) {
      revalidatePath(`/cases/${data.caseId}`);
    }
    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const deleteTimelineAction = async (
  caseId: number,
  timelineId: number
): Promise<ApiResponse> => {
  try {
    const response = await deleteTimeline(caseId, timelineId);
    if (response.isSuccess) {
      revalidatePath(`/cases/${caseId}`);
    }
    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getAllEvidencesAction = async (
  request: GetAllEvidencesRequest
): Promise<PaginatedResponse<EvidenceGridDto> | ApiResponse> => {
  try {
    return await getAllEvidences(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getEvidenceAction = async (
  evidenceId: number
): Promise<ApiResponseOf<AddEditEvidenceDto>> => {
  try {
    return await getEvidence(evidenceId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getAllEvidenceFilesAction = async (
  caseId: number,
  evidenceId: number
): Promise<ApiResponseOf<EvidenceFileDto[]>> => {
  try {
    return await getAllEvidenceFiles(caseId, evidenceId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getEvidenceFileDescriptionAction = async (
  caseId: number,
  evidenceFileId: number
): Promise<ApiResponseOf<string>> => {
  try {
    return await getEvidenceFileDescription(caseId, evidenceFileId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export type AddEditEvidenceFormValues = ActionFormState<AddEditEvidenceDto>;

export const addEditEvidenceAction = async (
  prevState: AddEditEvidenceFormValues,
  formData: FormData
): Promise<AddEditEvidenceFormValues> => {
  try {
    const localizedSchema = await createLocalizedSchema(addEditEvidenceSchema);
    const validation = validateFormData(formData, localizedSchema);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.errors,
        fields: validation.fields,
      };
    }

    const fields = validation.data;
    const response = await addEditEvidence(fields);
    if (!response.isSuccess) {
      return {
        status: "error",
        message: response.messages,
        fields: fields,
      };
    }

    revalidatePath(`/cases/${fields.caseId}`);

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

export const deleteEvidenceAction = async (
  caseId: number,
  evidenceId: number
): Promise<ApiResponse> => {
  try {
    const response = await deleteEvidence(caseId, evidenceId);
    if (response.isSuccess) {
      revalidatePath(`/cases/${caseId}`);
    }
    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const uploadEvidenceFileAction = async (
  data: UploadEvidenceFileRequest
): Promise<ApiResponseOf<EvidenceFileDto>> => {
  try {
    const response = await uploadEvidenceFile(data);

    if (response.isSuccess) {
      revalidatePath(`/cases/${data.caseId}`);
    }

    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const setEvidenceFileDescriptionAction = async (
  data: SetEvidenceFileDescriptionRequest
): Promise<ApiResponse> => {
  try {
    const response = await setEvidenceFileDescription(data);

    if (response.isSuccess) {
      revalidatePath(`/cases/${data.caseId}`);
    }

    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const deleteEvidenceFileAction = async (
  caseId: number,
  evidenceId: number,
  fileName: string
): Promise<ApiResponse> => {
  try {
    const response = await deleteEvidenceFile(caseId, evidenceId, fileName);
    if (response.isSuccess) {
      revalidatePath(`/cases/${caseId}`);
    }
    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const downloadEvidenceFileAction = async (
  caseId: number,
  evidenceId: number,
  fileName: string
): Promise<Blob | ApiResponse> => {
  try {
    return await downloadEvidenceFile(caseId, evidenceId, fileName);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const transcribeEvidenceFileAction = async (
  data: TranscribeEvidenceFileRequest
): Promise<ApiResponseOf<string>> => {
  try {
    const response = await transcribeEvidenceFile(data);

    if (response.isSuccess) {
      revalidatePath(`/cases/${data.caseId}`);
    }

    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getAllPartiesAction = async (
  request: GetAllPartiesRequest
): Promise<PaginatedResponse<PartyGridDto> | ApiResponse> => {
  try {
    return await getAllParties(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getPartyAction = async (
  partyId: number
): Promise<ApiResponseOf<AddEditPartyDto>> => {
  try {
    return await getParty(partyId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export type AddEditPartyFormValues = ActionFormState<AddEditPartyDto>;

export const addEditPartyAction = async (
  prevState: AddEditPartyFormValues,
  formData: FormData
): Promise<AddEditPartyFormValues> => {
  try {
    const flatData = Object.fromEntries(formData);
    const nestedData = unflattenObject(flatData);

    const localizedSchema = await createLocalizedSchema(addEditPartySchema);
    const validation = localizedSchema.safeParse(nestedData);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.error.format(),
        fields: nestedData,
      };
    }

    const fields = validation.data;

    const response = await addEditParty(fields);
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
      result: response.result,
    };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return { status: "error", message: message };
  }
};

export const deletePartyAction = async (
  caseId: number,
  partyId: number
): Promise<ApiResponse> => {
  try {
    const response = await deleteParty(caseId, partyId);
    if (response.isSuccess) {
      revalidatePath(`/cases/${caseId}`);
    }
    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getAllPetitionsAction = async (
  request: GetAllPetitionsRequest
): Promise<PaginatedResponse<PetitionGridDto> | ApiResponse> => {
  try {
    return await getAllPetitions(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export type CreatePetitionFormValues = ActionFormState<CreatePetitionRequest>;

export const createPetitionAction = async (
  prevState: CreatePetitionFormValues,
  formData: FormData
): Promise<CreatePetitionFormValues> => {
  try {
    const localizedSchema = await createLocalizedSchema(createPetitionSchema);
    const validation = validateFormData(formData, localizedSchema);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.errors,
        fields: validation.fields,
      };
    }

    const fields = validation.data;
    const response = await createPetition(fields);
    if (!response.isSuccess) {
      return {
        status: "error",
        message: response.messages,
        fields: fields,
      };
    }

    revalidatePath(`/cases/${fields.caseId}`);

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

export type EditPetitionFormValues = ActionFormState<EditPetitionRequest>;

export const editPetitionAction = async (
  prevState: EditPetitionFormValues,
  formData: FormData
): Promise<EditPetitionFormValues> => {
  try {
    const localizedSchema = await createLocalizedSchema(editPetitionSchema);
    const validation = validateFormData(formData, localizedSchema);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.errors,
        fields: validation.fields,
      };
    }

    const fields = validation.data;
    const response = await editPetition(fields);
    if (!response.isSuccess) {
      return {
        status: "error",
        message: response.messages,
        fields: fields,
      };
    }

    revalidatePath(`/cases/${fields.caseId}`);

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

export const getDefaultPromptAction = async (
  promptType: PromptType
): Promise<ApiResponseOf<string>> => {
  try {
    return await getDefaultPrompt(promptType);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getCurrentPetitionTypeIdAction = async (
  caseId: number
): Promise<ApiResponseOf<number>> => {
  try {
    return await getCurrentPetitionTypeId(caseId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getPetitionAction = async (
  caseId: number,
  petitionId: number
): Promise<ApiResponseOf<GetPetitionResponse>> => {
  try {
    return await getPetition(caseId, petitionId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const downloadPetitionFileAction = async (
  request: DownloadPetitionFileRequest
): Promise<Blob | ApiResponse> => {
  try {
    return await downloadPetitionFile(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const downloadPetitionAttachmentFileAction = async (
  caseId: number
): Promise<Blob | ApiResponse> => {
  try {
    return await downloadPetitionAttachmentFile(caseId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getAllDocumentsAction = async (
  request: GetAllDocumentsRequest
): Promise<ApiResponseOf<DocumentDto[]>> => {
  try {
    return await getAllDocuments(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const downloadDocumentAction = async (
  caseId: number,
  documentId: number
): Promise<Blob | ApiResponse> => {
  try {
    return await downloadDocument(caseId, documentId);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const deleteDocumentAction = async (
  caseId: number,
  documentId: number
): Promise<ApiResponse> => {
  try {
    const response = await deleteDocument(caseId, documentId);
    if (response.isSuccess) {
      revalidatePath(`/cases/${caseId}`);
    }
    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const scanDocumentAction = async (
  caseId: number,
  documentId: number
): Promise<ApiResponseOf<ScanDocumentResponse>> => {
  try {
    const response = await scanDocument(caseId, documentId);
    if (response.isSuccess) {
      revalidatePath(`/cases/${caseId}`);
    }
    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const uploadDocumentAction = async (
  data: UploadDocumentRequest
): Promise<ApiResponseOf<DocumentDto>> => {
  try {
    const response = await uploadDocument(data);
    if (response.isSuccess) {
      revalidatePath(`/cases/${data.caseId}`);
    }
    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const changeDocumentTypeAction = async (
  caseId: number,
  documentId: number,
  documentTypeId: number | null
): Promise<ApiResponseOf<ScanDocumentResponse>> => {
  try {
    const response = await changeDocumentType(documentId, documentTypeId);
    if (response.isSuccess) {
      revalidatePath(`/cases/${caseId}`);
    }
    return response;
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};
