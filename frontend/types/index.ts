export interface UploadResponse {
  success: boolean;
  message: string;
  data?: any;
  rowCount?: number;
}

export interface CsvRow {
  [key: string]: string | number;
}
