"use client";

import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import GlobeTab from "@/components/GlobeTab";
import { LocationData } from "@/types/location";
import TableTab from "@/components/TableTab";
import AnalyticsTab from "@/components/AnalyticsTab";
import FileUpload from "@/components/FileUpload";

export default function LocationDashboard() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [significantCol, setSignificantCol] = useState("");
  const [activeTab, setActiveTab] = useState<"globe" | "table" | "stats">(
    "globe",
  );

  const clearData = () => {
    setData([]);
    setLocations([]);
    setFileName("");
    setError("");
  };

  return (
    <div className="max-w-7xl mx-auto px-3 pt-4">
      {/* Upload Section */}
      {data.length === 0 ? (
        <FileUpload
          setError={setError}
          setFileName={setFileName}
          setLoading={setLoading}
          setData={setData}
          setLocations={setLocations}
          setSignificantCol={setSignificantCol}
        />
      ) : (
        <>
          {/* Tabs */}
          <div className="flex justify-between mb-6 border-b border-slate-700">
            <div className="flex gap-4">
              {["globe", "table", "stats"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-3 font-medium transition ${
                    activeTab === tab
                      ? "text-cyan-400 border-b-2 border-cyan-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab === "globe" && "Globe"}
                  {tab === "table" && "Table"}
                  {tab === "stats" && "Statistics"}
                </button>
              ))}
            </div>
            <div className="m-0 p-0">
              {fileName && (
                <div className="flex bg-gray-500/20 rounded-lg px-1 items-center gap-4">
                  <span className="text-sm text-gray-300">
                    File: {fileName}
                  </span>
                  <button
                    onClick={clearData}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "globe" && <GlobeTab locations={locations} />}

          {activeTab === "table" && <TableTab csvData={data} />}

          {activeTab === "stats" && <AnalyticsTab locations={locations} />}
        </>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-gap gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {loading && (
        <div className="mt-6 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <p className="text-gray-400 mt-2">Processing file...</p>
          </div>
        </div>
      )}
    </div>
  );
}
