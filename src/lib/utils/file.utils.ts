/**
 * Converts a File object to a base64 encoded string.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 string.
 */
export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export const isImageFile = (fileType: string | null | undefined) => {
  if (fileType) {
    const imageTypes = ["jpg", "jpeg", "png", "bmp", "gif"];
    return imageTypes.indexOf(fileType.toLowerCase()) > -1;
  }
  return false;
};

export const getFileTypeFromFileName = (fileName: string): string => {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
};
