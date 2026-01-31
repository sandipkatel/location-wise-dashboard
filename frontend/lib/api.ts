// export default api;
import axios from "axios";

// For server-side API calls
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"; // Browser environment
// Create axios instance
const api = axios.create({
  baseURL: apiBaseUrl,
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

// Endpoints
export const apiPostData = ({ jsonData }: { jsonData: any }) =>
  api.post("dataset/", jsonData);

export default api;
