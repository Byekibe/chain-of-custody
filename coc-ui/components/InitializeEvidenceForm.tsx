"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetCustodiansQuery } from "@/lib/features/custodians/custodianApiSlice";
import { useInitializeEvidenceMutation } from "@/lib/features/evidence/evidenceApiSlice";
import NextLink from "next/link";

interface FormValues {
  description: string;
  initial_custodian: string;
}

const validationSchema = Yup.object({
  description: Yup.string().required("Description is required"),
  initial_custodian: Yup.string().required("Initial custodian is required"),
});

const InitializeEvidenceForm: React.FC = () => {
  const [initializeEvidence, { isLoading, isError, isSuccess, data }] =
    useInitializeEvidenceMutation();
  const {
    data: custodiansData,
    isLoading: custodiansLoading,
    error: custodiansError,
  } = useGetCustodiansQuery();

  const formik = useFormik({
    initialValues: {
      description: "",
      initial_custodian: "",
    },
    validationSchema,
    onSubmit: async (values: FormValues, { resetForm }) => {
      try {
        await initializeEvidence(values).unwrap();
        console.log("Evidence initialized successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to initialize evidence:", error);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description:
          </label>
          <input
            id="description"
            name="description"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className={`mt-1 block w-full px-3 py-2 border ${
              formik.errors.description && formik.touched.description
                ? "border-red-300"
                : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-sm text-red-500">
              {formik.errors.description}
            </div>
          ) : null}
        </div>
        <div className="mb-4">
          <label
            htmlFor="initial_custodian"
            className="block text-sm font-medium text-gray-700"
          >
            Initial Custodian:
          </label>
          <select
            id="initial_custodian"
            name="initial_custodian"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.initial_custodian}
            className={`mt-1 block w-full px-3 py-2 border ${
              formik.errors.initial_custodian &&
              formik.touched.initial_custodian
                ? "border-red-300"
                : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          >
            <option value="" label="Select custodian" />
            {custodiansData?.custodians.map((custodian) => (
              <option key={custodian.id} value={custodian.ethereum_address}>
                {custodian.name}
              </option>
            ))}
          </select>
          {formik.touched.initial_custodian &&
          formik.errors.initial_custodian ? (
            <div className="text-sm text-red-500">
              {formik.errors.initial_custodian}
            </div>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
          }`}
        >
          {isLoading ? "Initializing..." : "Initialize Evidence"}
        </button>
        {isError && (
          <p className="mt-2 text-sm text-red-500">
            Error initializing evidence
          </p>
        )}
        {isSuccess && (
          <p className="mt-2 text-sm text-green-500">
            Evidence initialized successfully! Transaction Hash: {data?.tx_hash}
          </p>
        )}
      </form>
      <div className="mt-3">
        Dont have a custodian?
        <NextLink href="/createCustodian"> Create Here</NextLink>
      </div>
    </div>
  );
};

export default InitializeEvidenceForm;
