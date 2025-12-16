import { FileUploadRequest } from "./FileUploadRequest";

export interface FileUploadStatus extends FileUploadRequest {
  progress: number;
  error?: string;
}
