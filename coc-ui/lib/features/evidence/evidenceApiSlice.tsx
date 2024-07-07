import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface InitializeEvidenceResponse {
  tx_hash: string;
  evidenceId: number;
}

interface GetEvidenceResponse {
  evidence: Evidence[]; // Define the structure of each evidence item
}

interface Evidence {
  id: number;
  description: string;
  currentCustodian: string;
  custodyHistory: string[]; // Assuming custodyHistory is an array of strings (addresses)
}

interface InitializeEvidenceRequest {
  description: string;
  initial_custodian: string;
}

export const evidenceApiSlice = createApi({
  reducerPath: "evidenceApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["evidence"],
  endpoints: (build) => ({
    getAllEvidence: build.query<GetEvidenceResponse, void>({
      query: () => "/get_all_evidence",
    }),
    initializeEvidence: build.mutation<
      InitializeEvidenceResponse,
      InitializeEvidenceRequest
    >({
      query: (data) => ({
        url: "/initialize_evidence",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["evidence"],
    }),

    // more endpoints here
  }),
});

export const { useInitializeEvidenceMutation, useGetAllEvidenceQuery } =
  evidenceApiSlice;
