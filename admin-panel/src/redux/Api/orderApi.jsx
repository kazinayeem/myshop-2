import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getorders: builder.query({
      query: () => "orders",
      providesTags: ["Orders"], // Ensure case consistency
    }),

    getordersById: builder.query({
      query: (id) => `orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }], // Correcting to `providesTags`
    }),

    addorders: builder.mutation({
      query: (neworders) => ({
        url: "orders",
        method: "POST",
        body: neworders,
      }),
      invalidatesTags: ["Orders"], // Ensure case consistency
    }),

    updateorders: builder.mutation({
      query: ({ id, ...updatedorders }) => ({
        url: `orders/${id}`,
        method: "PUT",
        body: updatedorders,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Orders", id },
        "Orders",
      ], // Invalidate specific order and list
    }),

    deleteorders: builder.mutation({
      query: (id) => ({
        url: `orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"], // Ensure case consistency
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
