"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRegisterUserMutation } from "@/lib/features/auths/authsApiSlice"; // Adjust the import path accordingly
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

const RegisterForm = () => {
  const router = useRouter();
  const [registerUser, { isError, isLoading, isSuccess, data: user, error }] =
    useRegisterUserMutation();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await registerUser(values).unwrap();
        resetForm();
        router.push("/login");
      } catch (err) {
        console.error("Failed to register: ", err);
      }
    },
  });

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

  return (
    <div className="max-w-md mx-auto mt-10">
      {/* <h1 className="text-2xl font-bold mb-6">Register</h1> */}
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
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          ) : null}
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
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...formik.getFieldProps("confirmPassword")}
            className={`mt-1 block w-full p-2 border ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md shadow-sm`}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="text-red-500 text-sm">
              {formik.errors.confirmPassword}
            </div>
          ) : null}
        </div>

        <div>
          <button
            type="submit"
            className={`w-full p-2 rounded-md ${
              isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>

        {isError && (
          <div className="text-red-500 text-sm mt-2">
            Registration failed: {getErrorMessage(error)}
          </div>
        )}
        {isSuccess && (
          <div className="text-green-500 text-sm mt-2">
            Registration successful! Welcome, {user?.email}!
          </div>
        )}

        <p>
          Signed up? <NextLink href="/login">Login</NextLink>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
