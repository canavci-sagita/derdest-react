export enum CompanyType {
  Individual = 1,
  Corporate,
}

export enum NotificationType {
  Info = 1,
  Success,
  Warning,
  Error,
}

export enum FileStatus {
  NotUploaded = 1,
  Uploaded,
  WaitingForVerification,
  NotVerified,
  Verified,
}

export enum AIVerificationResult {
  Verified = 1,
  LawyerNameNotMatched,
  LawyerNotSigned,
  ClientNameNotMatched,
  ClientNationalIdNotMatched,
  ClientNotSigned,
  DateExpired,
}

export enum LanguageDirection {
  LTR = 1,
  RTL,
}

export enum ApprovalStatus {
  WaitingForApproval = 1,
  Approved,
  Rejected,
}

export enum PromptType {
  CreateCase = 1,
  CreatePetition,
  AnalyzePetitionFormat,
  TranscribeFile,
  FileVerification,
}

export enum PetitionFileType {
  DOCX = 1,
  PDF,
  UDF,
  HTML,
}
