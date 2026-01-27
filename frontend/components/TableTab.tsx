"use client";

import { useState } from "react";

export default function TableTab({ csvData }: { csvData: any[] }) {
  const [visibleRows, setVisibleRows] = useState(10);
  const columns = Object.keys(csvData[0]);

  if (csvData.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10">
        No data available. Please upload a CSV file.
      </div>
    );
  }

  // Get analytics for each column
  const getColumnAnalytics = (col: string) => {
    const values = csvData.map((row) => row[col]);
    const numericValues = values.filter(
      (v) => !isNaN(v) && v !== "" && v !== null,
    );

    if (numericValues.length > 0) {
      const nums = numericValues.map(Number);
      const avg = (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2);
      const min = Math.min(...nums).toFixed(2);
      const max = Math.max(...nums).toFixed(2);
      return { type: "numeric", avg, min, max };
    }

    // For non-numeric, show unique count and most common
    const uniqueCount = new Set(values).size;
    const mostCommon = values
      .filter((v) => v !== "" && v !== null)
      .sort(
        (a, b) =>
          values.filter((v) => v === a).length -
          values.filter((v) => v === b).length,
      )
      .pop();

    return { type: "text", unique: uniqueCount, mostCommon };
  };

  // Pagination
  const displayedData = csvData.slice(0, visibleRows);

  return (
    <div className="space-y-4 mb-16">
      {/* Data Table */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700/50 border-b border-slate-600">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-200"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-600">
            <tr className="bg-slate-900/50 border-b border-slate-600">
              {columns.map((col) => {
                const analytics = getColumnAnalytics(col);
                return (
                  <td
                    key={`analytics-${col}`}
                    className="px-6 py-3 text-xs text-gray-400"
                  >
                    {analytics.type === "numeric" ? (
                      <div className="space-y-1">
                        <div>avg: {analytics.avg}</div>
                        <div>min: {analytics.min}</div>
                        <div>max: {analytics.max}</div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div>unique: {analytics.unique}</div>
                        <div className="truncate">
                          top: {analytics.mostCommon}
                        </div>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
            {displayedData.map((row, idx) => (
              <tr key={idx} className="transition hover:bg-slate-700/30">
                {columns.map((col) => (
                  <td key={`${idx}-${col}`} className="px-6 py-4 text-gray-300">
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show More Button */}
      {visibleRows < csvData.length && (
        <div className="flex justify-between px-10">
          <div className="text-center text-medium">
            Showing {visibleRows} of {csvData.length} rows
          </div>
          <button
            onClick={() => setVisibleRows(visibleRows + 10)}
            className="px-6 mt-1 text-sm text-blue-500 rounded-lg hover:text-blue-600 transition"
          >
            Show 10 More Rows...
          </button>
        </div>
      )}
    </div>
  );
}
