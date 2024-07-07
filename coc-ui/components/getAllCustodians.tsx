"use client";

import React from "react";
import { useGetCustodiansQuery } from "@/lib/features/custodians/custodianApiSlice";

interface Custodian {
  id: number;
  name: string;
  ethereum_address: string;
}

const CustodianTable: React.FC = () => {
  const { data, error, isLoading } = useGetCustodiansQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching custodians</div>;

  const custodians = data?.custodians || [];

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Custodians List</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {custodians.map((custodian: Custodian) => (
            <tr key={custodian.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {custodian.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {custodian.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {custodian.ethereum_address}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustodianTable;
