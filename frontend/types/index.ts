export interface UploadResponse {
  success: boolean;
  message: string;
  data?: LocationData[];
  rowCount?: number;
}

export interface LocationData {
  country: string;
  city?: string;
  lat: number;
  lng: number;
  value?: number;
  count?: number;
}

export interface CsvRow {
  [key: string]: string | number;
}

export interface CountryStats {
  country: string;
  count: number;
  cities: string[];
}