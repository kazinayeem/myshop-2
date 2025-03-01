import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    getorders: builder.query({
      query: () => "orders",
    }),
    getordersById: builder.query({
      query: (id) => `orders/${id}`,
    }),
    addorders: builder.mutation({
      query: (neworders) => ({
        url: "orders",
        method: "POST",
        body: neworders,
      }),
    }),
    updateorders: builder.mutation({
      query: ({ id, ...updatedorders }) => ({
        url: `orders/${id}`,
        method: "PUT",
        body: updatedorders,
      }),
      invalidatesTags: ["orders"],
    }),
    deleteorders: builder.mutation({
      query: (id) => ({
        url: `orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),
  }),
});

export const {
  useGetordersQuery,
  useGetordersByIdQuery,
  useAddordersMutation,
  useUpdateordersMutation,
  useDeleteordersMutation,
} = ordersApi;

export default ordersApi;
