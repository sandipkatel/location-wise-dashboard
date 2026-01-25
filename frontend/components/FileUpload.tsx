import { Upload } from "lucide-react";
import { useRef } from "react";

export default function FileUpload({
  setError,
  setLocations,
  setFileName,
  setLoading,
}: {
  setError: (msg: string) => void;
  setLocations: (data: any[]) => void;
  setFileName: (name: string) => void;
  setLoading: (loading: boolean) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      // Placeholder: Replace with actual backend API call
      const formData = new FormData();
      formData.append("file", file);

      // const response = await fetch("/api/upload-csv", {
      //   method: "POST",
      //   body: formData,
      // });
      // const data = await response.json();
      // setLocations(data.locations);

      // Mock data for demo
      setTimeout(() => {
        const mockData = [
          { name: "New York", lat: 40.7128, lng: -74.006 },
          { name: "London", lat: 51.5074, lng: -0.1278 },
          { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
        ];
        setLocations(mockData);
        setFileName(file.name);
      }, 500);
    } catch (err) {
      setError("Failed to process CSV file");
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
