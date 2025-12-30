"use server";

import { PaginatedResponse } from "../common/PaginatedResponse";
import {
  EditCaseSummaryDto,
  CaseHeaderDto,
  CaseSummaryGridDto,
  GetAllCasesRequest,
  TranscribedCaseRequest,
  AddEditTimelineDto,
  AddEditEvidenceDto,
  EvidenceGridDto,
  GetAllEvidencesRequest,
  EvidenceFileDto,
  CaseSummaryDto,
  UploadEvidenceFileRequest,
  SetEvidenceFileDescriptionRequest,
  TranscribeEvidenceFileRequest,
  PartyGridDto,
  GetAllPartiesRequest,
  AddEditPartyDto,
  GetAllPetitionsRequest,
  PetitionGridDto,
  CreatePetitionResponse,
  CreatePetitionRequest,
  EditPetitionRequest,
  GetPetitionResponse,
  DownloadPetitionFileRequest,
  DocumentDto,
  ScanDocumentResponse,
  UploadDocumentRequest,
  GetAllDocumentsRequest,
} from "./cases.types";
import { ApiResponse, ApiResponseOf } from "../common/ApiResponse";
import { FileUploadRequest } from "../common/FileUploadRequest";
import { PromptType } from "../common/enums";
import {
  apiFetchApiResponse,
  apiFetchBlob,
  apiFetchPaginated,
} from "@/lib/api-fetch";

const CASES_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/Cases`;

/**
 * Fetches a paginated summary of cases from the API.
 * @param request The query parameters for pagination and filtering.
 * @returns A promise that resolves to the paginated response of cases.
 */
export const getAllCasesSummary = async (
  request: GetAllCasesRequest
): Promise<PaginatedResponse<CaseSummaryGridDto>> => {
  const { pageNumber, pageSize, orderBy, ...filter } = request;
  const pagination = { pageNumber, pageSize, orderBy };

  return await apiFetchPaginated(`${CASES_ENDPOINT}/GetAllCasesSummary`, {
    method: "POST",
    body: JSON.stringify({
      filter: filter,
      pagination: pagination,
    }),
  });
};

/**
 * Calls the API to delete a case by its ID.
 * @param id The ID of the case to delete.
 * @returns A promise that resolves to the API response.
 */
export const deleteCase = async (id: number): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/DeleteCase`, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
};

/**
 * Calls the API to create a new case from transcribed text.
 * @param data The request object containing the client ID, transcribed text and source file name which is optional.
 * @returns A promise that resolves with the API response, containing the newly created case header DTO.
 */
export const createCaseFromTranscribedText = async (
  data: TranscribedCaseRequest
): Promise<ApiResponseOf<CaseHeaderDto[]>> => {
  return await apiFetchApiResponse(
    `${CASES_ENDPOINT}/CreateCaseFromTranscribedText`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};

/**
 * Calls the API to transcribe an audio file for a case.
 * @param request The request object containing the file details.
 * @returns A promise that resolves with the API response containing the transcribed text.
 */
export const transcribeAudioFile = async (
  request: FileUploadRequest
): Promise<ApiResponseOf<string>> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/TranscribeAudioFile`, {
    method: "POST",
    body: JSON.stringify(request),
  });
};

/**
 * Calls the API to transcribe an uploaded file for a case.
 * @param request The request object containing the file details and client ID.
 * @returns A promise that resolves with the API response containing the transcribed text.
 */
export const transcribeUploadedFile = async (
  request: FileUploadRequest
): Promise<ApiResponseOf<string>> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/TranscribeUploadedFile`, {
    method: "POST",
    body: JSON.stringify(request),
  });
};

/**
 * Fetches a case summary details by its ID.
 * @param id The ID of the case.
 * @returns The case summary object.
 */
export const getCaseSummary = async (
  id: number
): Promise<ApiResponseOf<CaseSummaryDto>> => {
  return await apiFetchApiResponse(
    `${CASES_ENDPOINT}/GetCaseSummary?id=${id}`,
    {
      method: "GET",
    }
  );
};

/**
 * Calls the API to update a case summary by ID.
 * @param data The data for the case summary.
 * @returns A promise that resolves to the API response.
 */
export const editCaseSummary = async (
  data: EditCaseSummaryDto
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/EditCaseSummary`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Fetches all timeline entries for a specific case.
 * @param caseId The ID of the case.
 * @returns A promise that resolves to an array of timeline DTOs.
 */
export const getAllTimelines = async (
  caseId: number
): Promise<ApiResponseOf<AddEditTimelineDto[]>> => {
  return await apiFetchApiResponse(
    `${CASES_ENDPOINT}/GetAllTimelines?caseId=${caseId}`,
    {
      method: "GET",
    }
  );
};

/**
 * Fetches evidences that are not yet linked to a specific timeline.
 * @param caseId The ID of the current case.
 * @param timelineId The ID of the current timeline, nullable if new timeline.
 * @returns A promise that resolves with the API response containing the unlinked evidences.
 */
export const getAllUnlinkedEvidences = async (
  caseId: number,
  timelineId?: number | null
): Promise<ApiResponseOf<AddEditEvidenceDto[]>> => {
  const params = new URLSearchParams({
    caseId: String(caseId),
  });
  if (timelineId) {
    params.append("timelineId", String(timelineId));
  }
  return await apiFetchApiResponse(
    `${CASES_ENDPOINT}/GetAllUnlinkedEvidences?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Calls the API to create or update a timeline entry.
 * @param data The data for the timeline entry.
 * @returns A promise that resolves to the API response.
 */
export const addEditTimeline = async (
  data: AddEditTimelineDto
): Promise<ApiResponseOf<number>> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/AddEditTimeline`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Calls the API to delete a timeline by its ID and related case ID.
 * @param caseId The ID of the case.
 * @param timelineId The ID of the timeline to delete.
 * @returns A promise that resolves to the API response.
 */
export const deleteTimeline = async (
  caseId: number,
  timelineId: number
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/DeleteTimeline`, {
    method: "POST",
    body: JSON.stringify({ caseId, timelineId }),
  });
};

/**
 * Fetches all evidence entries for a specific case.
 * @param request The request object which inherits PaginatedRequest.
 * @returns A promise that resolves to a paginated response of evidence DTOs.
 */
export const getAllEvidences = async (
  request: GetAllEvidencesRequest
): Promise<PaginatedResponse<EvidenceGridDto>> => {
  const { caseId, pageNumber, pageSize, orderBy, ...filter } = request;
  const pagination = { pageNumber, pageSize, orderBy };

  return await apiFetchPaginated(`${CASES_ENDPOINT}/GetAllEvidences`, {
    method: "POST",
    body: JSON.stringify({
      caseId: caseId,
      filter: filter,
      pagination: pagination,
    }),
  });
};

/**
 * Fetches a single evidence by its ID.
 * @param id The ID of the evidence.
 * @returns The detailed evidence object.
 */
export const getEvidence = async (
  id: number
): Promise<ApiResponseOf<AddEditEvidenceDto>> => {
  const params = new URLSearchParams({
    id: String(id),
  });
  return await apiFetchApiResponse(
    `${CASES_ENDPOINT}/GetEvidence?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Fetches all evidence files a specific evidence.
 * @param caseId The ID of the case.
 * @param evidenceId The ID of the selected evidence.
 * @returns A promise that resolves to a paginated response of evidence DTOs.
 */
export const getAllEvidenceFiles = async (
  caseId: number,
  evidenceId: number
): Promise<ApiResponseOf<EvidenceFileDto[]>> => {
  const params = new URLSearchParams({
    caseId: String(caseId),
    evidenceId: String(evidenceId),
  });
  return await apiFetchApiResponse(
    `${CASES_ENDPOINT}/GetAllEvidenceFiles?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Fetches the HTML description for a single evidence file.
 * @param evidenceFileId The ID of the evidence file.
 * @returns The description as an HTML string.
 */
export const getEvidenceFileDescription = async (
  caseId: number,
  evidenceFileId: number
): Promise<ApiResponseOf<string>> => {
  const params = new URLSearchParams({
    caseId: String(caseId),
    evidenceFileId: String(evidenceFileId),
  });
  return await apiFetchApiResponse(
    `${CASES_ENDPOINT}/GetEvidenceFileDescription?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Calls the API to create or update an evidence item.
 * @param data The data for the evidence.
 * @returns An ID of the evidence.
 */
export const addEditEvidence = async (
  data: AddEditEvidenceDto
): Promise<ApiResponseOf<number>> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/AddEditEvidence`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Calls the API to delete an evidence by its ID and related case ID.
 * @param data The request object containing the file details.
 * @returns A promise that resolves to the API response.
 */
export const deleteEvidence = async (
  caseId: number,
  evidenceId: number
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/DeleteEvidence`, {
    method: "POST",
    body: JSON.stringify({ caseId, evidenceId }),
  });
};

/**
 * Calls the API to upload evidence files by its ID and related case ID.
 * @param caseId The ID of the case.
 * @param evidenceId The ID of the evidence to upload the file.
 * @returns A response object containing ID, fileName and errors.
 */
export const uploadEvidenceFile = async (
  data: UploadEvidenceFileRequest
): Promise<ApiResponseOf<EvidenceFileDto>> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/UploadEvidenceFile`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Updates the description for a specific evidence file via an API call.
 * This function uses the central api-client to handle HTTP communication.
 * @param data The data for the evidence file description.
 * @returns A promise that resolves to the API response.
 */
export const setEvidenceFileDescription = async (
  data: SetEvidenceFileDescriptionRequest
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(
    `${CASES_ENDPOINT}/SetEvidenceFileDescription`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};

/**
 * Calls the API to delete an evidence file by its name, related case ID and evidence ID.
 * @param caseId The ID of the case.
 * @param evidenceId The ID of the evidence to delete.
 * @param fileName The name of the evidence file to delete.
 * @returns A promise that resolves to the API response.
 */
export const deleteEvidenceFile = async (
  caseId: number,
  evidenceId: number,
  fileName: string
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/DeleteEvidenceFile`, {
    method: "POST",
    body: JSON.stringify({ caseId, evidenceId, fileName }),
  });
};

/**
 * Calls the API to download an evidence file.
 * @param caseId The ID of the case.
 * @param evidenceId The ID of the evidence which file assigned to.
 * @param fileName The name of the file to download.
 * @returns A promise that resolves to a Blob on success, or an ApiResponse on failure.
 */
export const downloadEvidenceFile = async (
  caseId: number,
  evidenceId: number,
  fileName: string
): Promise<Blob | ApiResponse> => {
  const params = new URLSearchParams({
    caseId: String(caseId),
    evidenceId: String(evidenceId),
    fileName: fileName,
  });
  return await apiFetchBlob(
    `${CASES_ENDPOINT}/DownloadEvidenceFile?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Calls the API to transcribe the content of an evidence file.
 * This function handles the direct HTTP communication.
 * @param data The data for the transcription request, including IDs and language.
 * @returns A promise that resolves to the API response containing the transcribed HTML string.
 */
export const transcribeEvidenceFile = async (
  data: TranscribeEvidenceFileRequest
): Promise<ApiResponseOf<string>> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/TranscribeEvidenceFile`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Fetches all party entries for a specific case.
 * @param request The request object containing PaginatedRequest.
 * @returns A promise that resolves to a paginated response of party DTOs.
 */
export const getAllParties = async (
  request: GetAllPartiesRequest
): Promise<PaginatedResponse<PartyGridDto>> => {
  const { caseId, pageNumber, pageSize, orderBy, ...filter } = request;
  const pagination = { pageNumber, pageSize, orderBy };

  return await apiFetchPaginated(`${CASES_ENDPOINT}/GetAllParties`, {
    method: "POST",
    body: JSON.stringify({
      caseId: caseId,
      filter: filter,
      pagination: pagination,
    }),
  });
};

/**
 * Fetches a single party by its ID.
 * @param id The ID of the party.
 * @returns The detailed party object.
 */
export const getParty = async (
  id: number
): Promise<ApiResponseOf<AddEditPartyDto>> => {
  const params = new URLSearchParams({
    id: String(id),
  });
  return await apiFetchApiResponse(
    `${CASES_ENDPOINT}/GetParty?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Calls the API to create or update an party item.
 * @param data The data for the party.
 * @returns An ID of the party.
 */
export const addEditParty = async (
  data: AddEditPartyDto
): Promise<ApiResponseOf<number>> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/AddEditParty`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Calls the API to delete an party by its ID and related case ID.
 * @param caseId The ID of the case.
 * @param partyId The ID of the party to delete.
 * @returns A promise that resolves to the API response.
 */
export const deleteParty = async (
  caseId: number,
  partyId: number
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/DeleteParty`, {
    method: "POST",
    body: JSON.stringify({ caseId, partyId }),
  });
};

/**
 * Fetches a paginated list of petitions for a specific case.
 * @param request The request object containing PaginatedRequest.
 */
export const getAllPetitions = async (
  request: GetAllPetitionsRequest
): Promise<PaginatedResponse<PetitionGridDto>> => {
  const { caseId, pageNumber, pageSize, orderBy, ...filter } = request;
  const pagination = { pageNumber, pageSize, orderBy };

  return await apiFetchPaginated(`${CASES_ENDPOINT}/GetAllPetitions`, {
    method: "POST",
    body: JSON.stringify({
      caseId: caseId,
      filter: filter,
      pagination: pagination,
    }),
  });
};

/**
 * Calls the API to create a petition.
 * @param data The data for the petition request.
 * @returns A response object containing id, content and created user of the petition.
 */
export const createPetition = async (
  data: CreatePetitionRequest
): Promise<ApiResponseOf<CreatePetitionResponse>> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/CreatePetition`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Calls the API to edit a petition.
 * @param data The data for the petition request.
 * @returns A promise that resolves to the API response.
 */
export const editPetition = async (
  data: EditPetitionRequest
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/EditPetition`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Calls the API to get the default prompt for creating petition.
 * @param promptType The type of the prompt.
 * @returns The text of the prompt.
 */
export const getDefaultPrompt = async (
  promptType: PromptType
): Promise<ApiResponseOf<string>> => {
  const params = new URLSearchParams({
    promptType: promptType.toString(),
  });
  return await apiFetchApiResponse(
    `${CASES_ENDPOINT}/GetDefaultPrompt?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Calls the API to get the petition type ID of the relevant case.
 * @param caseId The ID of the case.
 * @returns The ID of the current petition type of the case.
 */
export const getCurrentPetitionTypeId = async (
  caseId: PromptType
): Promise<ApiResponseOf<number>> => {
  const params = new URLSearchParams({
    caseId: String(caseId),
  });
  return await apiFetchApiResponse(
    `${CASES_ENDPOINT}/GetCurrentPetitionTypeId?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Calls the API to get the petition details.
 * @param caseId The ID of the case.
 * @param petitionId The ID of the petition.
 * @returns A response object containing petition details.
 */
export const getPetition = async (
  caseId: number,
  petitionId: number
): Promise<ApiResponseOf<GetPetitionResponse>> => {
  const params = new URLSearchParams({
    caseId: String(caseId),
    petitionId: String(petitionId),
  });
  return await apiFetchApiResponse(
    `${CASES_ENDPOINT}/GetPetition?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Calls the API to download an petition file.
 * @param request The request object to download file.
 * @returns A promise that resolves to a Blob on success, or an ApiResponse on failure.
 */
export const downloadPetitionFile = async (
  request: DownloadPetitionFileRequest
): Promise<Blob | ApiResponse> => {
  const params = new URLSearchParams({
    caseId: String(request.caseId),
    petitionId: String(request.petitionId),
    petitionFileType: String(request.fileType),
  });
  return await apiFetchBlob(
    `${CASES_ENDPOINT}/DownloadPetitionFile?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Calls the API to download the attachments of a petition file.
 * @param caseId The ID of the case.
 * @returns A promise that resolves to a Blob on success, or an ApiResponse on failure.
 */
export const downloadPetitionAttachmentFile = async (
  caseId: number
): Promise<Blob | ApiResponse> => {
  const params = new URLSearchParams({
    caseId: String(caseId),
  });
  return await apiFetchBlob(
    `${CASES_ENDPOINT}/DownloadPetitionAttachmentFile?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Calls the API to get the default prompt for creating petition.
 * @param request The request object for filtering.
 * @returns The text of the prompt.
 */
export const getAllDocuments = async (
  request: GetAllDocumentsRequest
): Promise<ApiResponseOf<DocumentDto[]>> => {
  const { caseId, documentTypeId, ...filter } = request;

  return await apiFetchApiResponse(`${CASES_ENDPOINT}/GetAllDocuments`, {
    method: "POST",
    body: JSON.stringify({
      caseId: caseId,
      documentTypeId: documentTypeId === 0 ? null : documentTypeId,
      filter: filter,
    }),
  });
};

/**
 * Calls the API to download the specified document file of the case.
 * @param caseId The ID of the case.
 * @param documentId The ID of the document.
 * @returns A promise that resolves to a Blob on success, or an ApiResponse on failure.
 */
export const downloadDocument = async (
  caseId: number,
  documentId: number
): Promise<Blob | ApiResponse> => {
  const params = new URLSearchParams({
    caseId: String(caseId),
    documentId: String(documentId),
  });
  return await apiFetchBlob(
    `${CASES_ENDPOINT}/DownloadDocument?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

/**
 * Calls the API to delete a document by its ID and related case ID.
 * @param caseId The ID of the case.
 * @param documentId The ID of the document to delete.
 * @returns A promise that resolves to the API response.
 */
export const deleteDocument = async (
  caseId: number,
  documentId: number
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/DeleteDocument`, {
    method: "POST",
    body: JSON.stringify({ caseId, documentId }),
  });
};

/**
 * Calls the API to scan a document and extract related entities.
 * @param caseId The ID of the case.
 * @param documentId The ID of the document to scan.
 * @returns A response object with scanned document details.
 */
export const scanDocument = async (
  caseId: number,
  documentId: number
): Promise<ApiResponseOf<ScanDocumentResponse>> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/ScanDocument`, {
    method: "POST",
    body: JSON.stringify({ caseId, documentId }),
  });
};

/**
 * Calls the API to upload document related to the case.
 * @param data The request object containing the file details.
 * @returns A promise that resolves to the API response of uploaded file data.
 */
export const uploadDocument = async (
  data: UploadDocumentRequest
): Promise<ApiResponseOf<DocumentDto>> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/UploadDocument`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Calls the API to change document type of the document.
 * @param documentId The ID of the document.
 * @param documentTypeId The ID of the document type to change to.
 * @returns A promise that resolves to the API response.
 */
export const changeDocumentType = async (
  documentId: number,
  documentTypeId: number | null
): Promise<ApiResponseOf<ScanDocumentResponse>> => {
  return await apiFetchApiResponse(`${CASES_ENDPOINT}/ChangeDocumentType`, {
    method: "POST",
    body: JSON.stringify({ documentId, documentTypeId }),
  });
};
