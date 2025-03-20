import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const brandsApi = createApi({
  reducerPath: "brandsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_PORT,
  }),
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => "brands",
      providesTags: ["Brand"],
    }),
  }),
});

export const { useGetBrandsQuery } = brandsApi;

export default brandsApi;
