"use client";

import React, { useEffect } from "react";
import { useGetAllEvidenceQuery } from "@/lib/features/evidence/evidenceApiSlice";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const EvidenceList: React.FC = () => {
  const { data: evidenceDict, error, isLoading } = useGetAllEvidenceQuery();

  useEffect(() => {
    // Optionally handle initial fetching of evidence data here
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    // Handle error based on its type
    let errorMessage = "An error occurred. Please try again later.";

    if (error && typeof error === "object") {
      if ("status" in error && "data" in error) {
        errorMessage = `Error: ${error.status} - ${JSON.stringify(error.data)}`;
      } else if ("message" in error && typeof error.message === "string") {
        errorMessage = `Error: ${error.message}`;
      }
    }

    return <div>{errorMessage}</div>;
  }

  // Extracting evidence array from the dictionary or defaulting to an empty array
  const evidence = evidenceDict?.evidence || [];

  console.log(`Evidence ---------------------$`);

  return (
    <div>
      <h2>Evidence List</h2>
      {evidence.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Custodian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Custody History
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {evidence.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.currentCustodian}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.custodyHistory.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No evidence found.</div>
      )}
    </div>
  );
};

export default EvidenceList;
