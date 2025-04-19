import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const brandsApi = createApi({
  reducerPath: "brandsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "same-origin",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    getbrands: builder.query({
      query: () => "brands",
      providesTags: ["Brand"],
    }),

    addbrands: builder.mutation({
      query: (newbrands) => ({
        url: "brands",
        method: "POST",
        body: newbrands,
      }),
      invalidatesTags: ["Brand"],
    }),
    updatebrands: builder.mutation({
      query: ({ id, ...updatedbrands }) => ({
        url: `brands/${id}`,
        method: "PUT",
        body: updatedbrands,
      }),
      invalidatesTags: ["Brand"],
    }),
    deletebrands: builder.mutation({
      query: (id) => ({
        url: `brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  useGetbrandsQuery,
  useAddbrandsMutation,
  useUpdatebrandsMutation,
  useDeletebrandsMutation,
} = brandsApi;

export default brandsApi;
