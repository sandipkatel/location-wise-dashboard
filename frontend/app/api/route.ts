// export default api;
import axios from "axios";

// For server-side API calls
const apiBaseUrl = process.env.NEXT_BACKEND_URL // Browser environment

// Create axios instance
const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle response errors
api.interceptors.response.use(
  (response) => response.data,
  (error: any) => {
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    const customError = new Error(errorMessage) as any;

    // Add the original response data and status to the error object
    if (error.response) {
      customError.status = error.response.status;
      customError.data = error.response.data;
      customError.originalError = error;
    }

    return Promise.reject(customError);
  },
);

// Metadata endpoints
export const apiSetMetadata = ({
  dataset_name,
  dataset_description,
}: {
  dataset_name: any;
  dataset_description: any;
}) => api.post("metadata", { dataset_name, dataset_description });
export const apiGetMetadata = ({ datasetID }: { datasetID: any }) =>
  api.get(`metadata/${datasetID}`);
export const apiGetFieldsByAI = ({ description }: { description: any }) =>
  api.get("generate/AI-fields/", { params: { description } });

export default api;
