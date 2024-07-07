"use client";

import React from "react";
import { useFormik } from "formik";
import {
  useGetCustodiansQuery,
  useTransferCustodyMutation,
} from "@/lib/features/custodians/custodianApiSlice";

interface TransferCustodyFormValues {
  evidenceId: number;
  newCustodian: string;
}

const TransferCustodyForm: React.FC = () => {
  const { data: custodiansResponse, isLoading: custodiansLoading } =
    useGetCustodiansQuery();
  const [transferCustody, { isLoading: transferLoading }] =
    useTransferCustodyMutation();

  const formik = useFormik<TransferCustodyFormValues>({
    initialValues: {
      evidenceId: 0,
      newCustodian: "",
    },
    onSubmit: async (values) => {
      await transferCustody({
        evidence_id: values.evidenceId,
        new_custodian: values.newCustodian,
      }).unwrap();
      alert("Custody transferred successfully");
    },
  });

  if (custodiansLoading) {
    return <div>Loading custodians...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-6 rounded shadow-md"
      >
        <h2 className="text-xl font-bold mb-4">Transfer Custody</h2>

        <div className="mb-4">
          <label htmlFor="evidenceId" className="block text-gray-700">
            Evidence ID
          </label>
          <input
            id="evidenceId"
            name="evidenceId"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.evidenceId}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="newCustodian" className="block text-gray-700">
            New Custodian
          </label>
          <select
            id="newCustodian"
            name="newCustodian"
            onChange={formik.handleChange}
            value={formik.values.newCustodian}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          >
            <option value="" label="Select a custodian" />
            {custodiansResponse?.custodians.map((custodian) => (
              <option key={custodian.id} value={custodian.ethereum_address}>
                {custodian.name} ({custodian.ethereum_address})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={transferLoading}
        >
          {transferLoading ? "Transferring..." : "Transfer Custody"}
        </button>
      </form>
    </div>
  );
};

export default TransferCustodyForm;
