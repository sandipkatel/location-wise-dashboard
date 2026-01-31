import {
  Upload,
  FileText,
  MapPin,
  Sparkles,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { apiPostData } from "@/lib/api";
import { AnalyticalData } from "@/types/analytics";

export default function FileUpload({
  setFileName,
  setData,
  setLocations,
  setSignificantCol,
  setAnalyticalData,
}: {
  setFileName: (name: string) => void;
  setData: (data: any[]) => void;
  setLocations: (data: any[]) => void;
  setSignificantCol: (col: string) => void;
  setAnalyticalData: (data: AnalyticalData | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      const response = await apiPostData({ jsonData });
      console.log("Response from server:", response);

      if (response && response.status === 200) {
        // Parse JSON strings from backend
        const parsedFullData =
          typeof response.data.full_data === "string"
            ? JSON.parse(response.data.full_data)
            : response.data.full_data;

        const parsedGlobeData =
          typeof response.data.globe_data === "string"
            ? JSON.parse(response.data.globe_data)
            : response.data.globe_data;

        console.log("Parsed full data:", parsedFullData);
        console.log("Parsed globe data:", parsedGlobeData);
        console.log("Analytical data:", response.data.analytical_data);

        setData(parsedFullData || []);
        setLocations(parsedGlobeData || []);
        setSignificantCol(response.data.significant_columns?.[0] || "");
        setAnalyticalData(response.data.analytical_data || null);
        setFileName(file.name);
      } else {
        setError(response.statusText || "Failed to process CSV file on server");
        setData([]);
        setLocations([]);
        setAnalyticalData(null);
        setFileName("");
      }
    } catch (err) {
      setError("Failed to process CSV file");
      setData([]);
      setLocations([]);
      setAnalyticalData(null);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Transform Your Location Data
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Upload your CSV file and get instant interactive globe visualizations
          with comprehensive analytics
        </p>
      </div>

      {/* Upload Area Wrapper */}
      <div className="relative mt-6">
        {/* Processing Overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400 mb-3" />
            <p className="text-gray-200 font-medium">Processing file...</p>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all
      ${loading ? "blur-sm opacity-60 pointer-events-none" : "cursor-pointer"}
      ${
        isDragging && !loading
          ? "border-cyan-400 bg-cyan-500/10 scale-[1.02]"
          : "border-slate-600 hover:border-cyan-400 hover:bg-slate-800/50"
      }`}
          onClick={() => !loading && fileInputRef.current?.click()}
          onDragOver={loading ? undefined : handleDragOver}
          onDragLeave={loading ? undefined : handleDragLeave}
          onDrop={loading ? undefined : handleDrop}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
              <Upload className="w-10 h-10 text-cyan-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              Upload Your CSV File
            </h2>

            <p className="text-gray-400 mb-6">
              Drag and drop your file here, or click to browse
            </p>

            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-300">CSV Format</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                <AlertCircle className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-300">Max 5MB</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-300">Max 50 Locations</span>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            disabled={loading}
            className="hidden"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* How It Works Section */}
      <div className="rounded-2xl p-8 border border-slate-700">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-bold text-white">How It Works?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Step 1 */}
          <div className="relative">
            <div className=" rounded-xl p-6 border border-slate-600 hover:border-cyan-500/50 transition-all h-full">
              <span className="text-white font-bold text-xl">1</span>
              <h3 className="text-white font-semibold mb-2">Upload CSV</h3>
              <p className="text-gray-400 text-sm">
                Upload your CSV file containing location data
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className=" rounded-xl p-6 border border-slate-600 hover:border-cyan-500/50 transition-all h-full">
              <span className="text-white font-bold text-xl">2</span>
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                Auto-Detection
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h3>
              <p className="text-gray-400 text-sm">
                AI automatically identifies your location column
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className=" rounded-xl p-6 border border-slate-600 hover:border-cyan-500/50 transition-all h-full">
              <span className="text-white font-bold text-xl">3</span>
              <h3 className="text-white font-semibold mb-2">
                Calculate Metrics
              </h3>
              <p className="text-gray-400 text-sm">
                Aggregates first numeric column as significant data
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className=" rounded-xl p-6 border border-slate-600 hover:border-cyan-500/50 transition-all h-full">
              <span className="text-white font-bold text-xl">4</span>
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                Processing
                <Clock className="w-4 h-4 text-cyan-400" />
              </h3>
              <p className="text-gray-400 text-sm">
                Geocoding and analysis (takes a few seconds)
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative">
            <div className=" rounded-xl p-6 border border-slate-600 hover:border-cyan-500/50 transition-all h-full">
              <span className="text-white font-bold text-xl">5</span>
              <h3 className="text-white font-semibold mb-2">Visualize</h3>
              <p className="text-gray-400 text-sm">
                Interactive globe with comprehensive analytics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
