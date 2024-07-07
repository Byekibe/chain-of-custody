import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface User {
  id: number;
  email: string;
  password: string;
  // other user properties
}

interface UserCred {
  email: string;
  password: string;
  // other credential properties
}

interface AccessToken {
  access_token: string;
  token: string;
}

export const authsApiSlice = createApi({
  reducerPath: "authsApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    // register user
    registerUser: build.mutation<User, UserCred>({
      query: (userCred) => ({
        url: "/register",
        method: "POST",
        body: userCred,
      }),
    }),

    loginUser: build.mutation<AccessToken, UserCred>({
      query: (userCred) => ({
        url: "/login",
        method: "POST",
        body: userCred,
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = authsApiSlice;
