// custodianApiSlice.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface Custodian {
  id: number;
  name: string;
  ethereum_address: string;
}

interface CustodiansResponse {
  custodians: Custodian[];
}

interface TransferCustodyRequest {
  evidence_id: number;
  new_custodian: string;
}

export const custodianApiSlice = createApi({
  reducerPath: "custodianApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["custodians"], // Optional: If you plan to use tagging
  endpoints: (build) => ({
    getCustodians: build.query<CustodiansResponse, void>({
      query: () => "/custodians",
    }),
    generateCustodian: build.mutation<Custodian, Partial<Custodian>>({
      query: (newCustodian) => ({
        url: "/generate_custodian",
        method: "POST",
        body: newCustodian,
      }),
    }),
    transferCustody: build.mutation<void, TransferCustodyRequest>({
      query: (transferData) => ({
        url: "/transfer_custody",
        method: "POST",
        body: transferData,
      }),
    }),
    // More endpoints here
  }),
});

export const {
  useGetCustodiansQuery,
  useGenerateCustodianMutation,
  useTransferCustodyMutation,
} = custodianApiSlice;
