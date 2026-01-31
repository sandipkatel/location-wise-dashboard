"use client";

import { useState } from "react";
import { AnalyticalData } from "@/types/analytics";
import {
  BarChart3,
  Database,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface Props {
  analyticsData: AnalyticalData | null;
}

export default function AnalyticsTab({ analyticsData }: Props) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "columns" | "quality"
  >("overview");
  const [selectedColumn, setSelectedColumn] = useState<string | null>(
    analyticsData ? Object.keys(analyticsData.columns)[0] : null,
  );

  if (!analyticsData) {
    return (
      <div className="bg-slate-800/50/20 rounded-xl p-12 text-center border border-slate-700">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-500" />
        <p className="text-gray-400">No analytical data available</p>
      </div>
    );
  }

  const getQualityColor = (score: number) => {
    if (score >= 90) return "bg-green-900/50";
    if (score >= 70) return "bg-yellow-900/50";
    return "bg-red-900/50";
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="rounded-xl border border-slate-700 overflow-hidden">
        <div className="flex border-b border-slate-700">
          {[
            { id: "overview", label: "Overview", icon: Database },
            { id: "columns", label: "Columns", icon: BarChart3 },
            { id: "quality", label: "Quality", icon: CheckCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? "bg-cyan-500 text-white"
                  : "text-gray-400 hover:bg-slate-700/20"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-900/50 rounded-lg p-6 text-white">
                  <div className="text-sm opacity-90 mb-1">Total Rows</div>
                  <div className="text-3xl font-bold">
                    {analyticsData.overview.total_rows.toLocaleString()}
                  </div>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-6 text-white">
                  <div className="text-sm opacity-90 mb-1">Columns</div>
                  <div className="text-3xl font-bold">
                    {analyticsData.overview.total_columns}
                  </div>
                </div>
                <div className="bg-cyan-900/50 rounded-lg p-6 text-white">
                  <div className="text-sm opacity-90 mb-1">Numeric Cols</div>
                  <div className="text-3xl font-bold">
                    {analyticsData.numeric_analysis.total_numeric_columns}
                  </div>
                </div>
                <div
                  className={`${getQualityColor(
                    analyticsData.data_quality.completeness_score,
                  )} rounded-lg p-6 text-white`}
                >
                  <div className="text-sm opacity-90 mb-1">Completeness</div>
                  <div className="text-3xl font-bold">
                    {analyticsData.data_quality.completeness_score}%
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {analyticsData.recommendations.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">
                    Recommendations
                  </h3>
                  {analyticsData.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="bg-cyan-500/20 rounded-lg p-4 border border-cyan-500/30 flex items-start gap-3"
                    >
                      <TrendingUp className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-300 text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Columns Tab */}
          {activeTab === "columns" && selectedColumn && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column List */}
              <div className="lg:col-span-1 space-y-2 max-h-[500px] overflow-y-auto">
                {Object.keys(analyticsData.columns).map((colName) => (
                  <button
                    key={colName}
                    onClick={() => setSelectedColumn(colName)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedColumn === colName
                        ? "bg-cyan-500 text-white"
                        : "border border-slate-100/20 text-gray-300 hover:bg-slate-600/20"
                    }`}
                  >
                    <div className="font-medium truncate">{colName}</div>
                    <div className="text-xs mt-1 opacity-80">
                      {analyticsData.columns[colName].data_type}
                    </div>
                  </button>
                ))}
              </div>

              {/* Column Details */}
              <div className="lg:col-span-2 border border-slate-100/20 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-6">
                  {selectedColumn}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-1">Data Type</div>
                    <div className="text-lg font-bold text-white">
                      {analyticsData.columns[selectedColumn].data_type}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-1">
                      Unique Values
                    </div>
                    <div className="text-lg font-bold text-white">
                      {analyticsData.columns[selectedColumn].unique_count}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-1">Non-Null</div>
                    <div className="text-lg font-bold text-green-400">
                      {analyticsData.columns[selectedColumn].non_null_count}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-1">Null %</div>
                    <div className="text-lg font-bold text-red-400">
                      {analyticsData.columns[selectedColumn].null_percentage}%
                    </div>
                  </div>
                </div>

                {/* Numeric Stats */}
                {analyticsData.columns[selectedColumn].numeric_stats && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-white">Statistics</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(
                        analyticsData.columns[selectedColumn].numeric_stats!,
                      ).map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-slate-800/50 rounded-lg p-3"
                        >
                          <div className="text-xs text-gray-400 mb-1 capitalize">
                            {key.replace(/_/g, " ")}
                          </div>
                          <div className="text-sm font-bold text-white">
                            {typeof value === "number"
                              ? value.toLocaleString()
                              : value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quality Tab */}
          {activeTab === "quality" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`${getQualityColor(
                    analyticsData.data_quality.completeness_score,
                  )} rounded-lg p-6 text-white`}
                >
                  <div className="text-sm opacity-90 mb-1">Completeness</div>
                  <div className="text-4xl font-bold mb-2">
                    {analyticsData.data_quality.completeness_score}%
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full"
                      style={{
                        width: `${analyticsData.data_quality.completeness_score}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <div className="text-sm text-gray-400 mb-1">Total Cells</div>
                  <div className="text-4xl font-bold text-white">
                    {analyticsData.data_quality.total_cells.toLocaleString()}
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                  <div className="text-sm text-red-400 mb-1">Duplicates</div>
                  <div className="text-4xl font-bold text-red-300">
                    {analyticsData.data_quality.duplicate_rows}
                  </div>
                </div>
              </div>

              {analyticsData.data_quality.columns_with_high_nulls.length >
                0 && (
                <div className="bg-yellow-500/20 rounded-lg p-6 border border-yellow-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-bold text-yellow-400">
                      High Missing Data (&gt;30%)
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analyticsData.data_quality.columns_with_high_nulls.map(
                      (col) => (
                        <span
                          key={col}
                          className="bg-yellow-500/30 px-3 py-1 rounded-full text-sm text-yellow-200"
                        >
                          {col}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
