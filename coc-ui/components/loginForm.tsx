"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginUserMutation } from "@/lib/features/auths/authsApiSlice";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useRouter } from "next/navigation";
import NextLink from 'next/link'

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginUser, { isError, error }] = useLoginUserMutation();
  const router = useRouter();

  const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError | undefined
  ): string => {
    if (!error) return "Unknown error occurred";
    if ("status" in error) {
      return `Error: ${error.status} - ${JSON.stringify(error.data)}`;
    } else if ("message" in error) {
      return `Error: ${error.message}`;
    }
    return "Unknown error occurred";
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsSubmitting(true);
        const result = await loginUser(values).unwrap();
        if (result.access_token) {
          localStorage.setItem("coc_token", result.access_token);
          router.push("/initializeEvidence");
          resetForm();
        }
      } catch (err) {
        console.error("Failed to login: ", err);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...formik.getFieldProps("email")}
            className={`mt-1 block w-full p-2 border ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md shadow-sm`}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...formik.getFieldProps("password")}
            className={`mt-1 block w-full p-2 border ${
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md shadow-sm`}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          )}
        </div>

        <div>
          <button
            type="submit"
            className={`w-full p-2 rounded-md ${
              isSubmitting ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>
        {isError && (
          <div className="text-red-500 text-sm mt-2">
            Login failed: {getErrorMessage(error)}
          </div>
        )}
      </form>

      <div className="mt-4" >Dont have an account? <NextLink href="/register">Sign Up</NextLink></div>
    </div>
  );
};

export default LoginForm;
