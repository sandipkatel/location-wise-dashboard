import { Upload } from "lucide-react";
import { useRef } from "react";
import { apiPostData } from "@/lib/api";

export default function FileUpload({
  setError,
  setFileName,
  setLoading,
  setData,
  setLocations,
}: {
  setError: (msg: string) => void;
  setFileName: (name: string) => void;
  setLoading: (loading: boolean) => void;
  setData: (data: any[]) => void;
  setLocations: (data: any[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (file.type !== "text/csv") {
      setError("Please upload a valid CSV file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Parse CSV file in frontend
      const text = await file.text();
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());
      const jsonData = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        return headers.reduce(
          (obj, header, index) => {
            obj[header] = values[index];
            return obj;
          },
          {} as Record<string, string>,
        );
      });
      const response = await apiPostData({ csvData: jsonData });
      setData(jsonData); // TODO: Parsed backend instead
      console.log("Geocoded response:", response);
      setLocations(JSON.parse(response.data.location_data));
      setFileName(file.name);
      // Mock data for demo
    } catch (err) {
      setError("Failed to process CSV file");
      setData([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };
  return (
    <div className="h-96 flex items-center justify-center">
      <div
        className="border-2 border-dashed border-slate-600 rounded-lg p-12 w-full max-w-md text-center cursor-pointer hover:border-cyan-400 hover:bg-slate-800/30 transition"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Upload CSV File
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Drag and drop your CSV file here or click to select
        </p>
        <p className="text-gray-500 text-xs">
          Your CSV file should have atleast one location data
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
