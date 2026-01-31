"use client";

import { useState } from "react";
import { X, AlertCircle, Map } from "lucide-react";
import GlobeTab from "@/components/GlobeTab";
import { LocationData } from "@/types/location";
import { AnalyticalData } from "@/types/analytics";
import TableTab from "@/components/TableTab";
import AnalyticsTab from "@/components/AnalyticsTab";
import FileUpload from "@/components/FileUpload";

export default function LocationDashboard() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [analyticalData, setAnalyticalData] = useState<AnalyticalData | null>(
    null,
  );
  const [fileName, setFileName] = useState("");
  const [significantCol, setSignificantCol] = useState("");
  const [activeTab, setActiveTab] = useState<"globe" | "table" | "stats">(
    "globe",
  );

  const clearData = () => {
    setData([]);
    setLocations([]);
    setAnalyticalData(null);
    setFileName("");
    setSignificantCol("");
  };

  return (
    <div className="min-h-screen border-b border-slate-700 bg-slate-900/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-3 pt-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {fileName && (
              <div className="flex bg-slate-700/50 rounded-lg px-4 py-2 items-center gap-4">
                <span className="text-sm text-gray-300">
                  File:{" "}
                  <span className="font-medium text-white">{fileName}</span>
                </span>
                <button
                  onClick={clearData}
                  className="p-1 hover:bg-red-500/20 rounded-lg transition"
                  title="Clear data"
                >
                  <X className="w-5 h-5 text-red-400" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upload Section */}
        {data.length === 0 ? (
          <FileUpload
            setFileName={setFileName}
            setData={setData}
            setLocations={setLocations}
            setSignificantCol={setSignificantCol}
            setAnalyticalData={setAnalyticalData}
          />
        ) : (
          <>
            {/* Tabs */}
            <div className="flex justify-between mb-6 border-b border-slate-700">
              <div className="flex gap-4">
                {[
                  { id: "globe", label: "Globe View" },
                  { id: "table", label: "Data Table" },
                  { id: "stats", label: "Analytics" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 font-medium transition relative ${
                      activeTab === tab.id
                        ? "text-cyan-400 border-b-2 border-cyan-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="pb-8">
              {activeTab === "globe" && (
                <GlobeTab
                  locations={locations}
                  significantCol={significantCol}
                  analyticalData={analyticalData}
                />
              )}

              {activeTab === "table" && <TableTab csvData={data} />}

              {activeTab === "stats" && (
                <AnalyticsTab analyticsData={analyticalData} />
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
