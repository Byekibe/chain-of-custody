"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGenerateCustodianMutation } from "@/lib/features/custodians/custodianApiSlice";
import CustodianTable from "./getAllCustodians";

interface FormValues {
  name: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
});

const GenerateCustodianForm: React.FC = () => {
  const [generateCustodian, { isLoading, isError }] =
    useGenerateCustodianMutation();
  const [successMessage, setSuccessMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await generateCustodian(values).unwrap();
        setSuccessMessage("Custodian generated successfully!");
        resetForm();

        // Clear the success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (error) {
        console.error("Failed to generate custodian:", error);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Generate Custodian</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={`mt-1 block w-full px-3 py-2 border ${
              formik.errors.name && formik.touched.name
                ? "border-red-300"
                : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-sm text-red-500">{formik.errors.name}</div>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
          }`}
        >
          {isLoading ? "Generating..." : "Generate Custodian"}
        </button>
        {isError && (
          <p className="mt-2 text-sm text-red-500">
            Error generating custodian
          </p>
        )}
      </form>
      {successMessage && (
        <div className="flash-success-message mt-4 p-2 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default GenerateCustodianForm;
