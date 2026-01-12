const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const validateCsvFile = (
  file: File
): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }
  if (!file.name.endsWith(".csv")) {
    return { valid: false, error: "Please upload a CSV file" };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }
  return { valid: true };
};
