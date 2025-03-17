import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ startDate, endDate } = {}) => {
        const queryParams =
          startDate && endDate
            ? `?startDate=${startDate}&endDate=${endDate}`
            : "";
        return `orders${queryParams}`;
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Order", id: _id })), "Order"]
          : ["Order"],
    }),

    getordersById: builder.query({
      query: (id) => `orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }], 
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
      ],
    }),

    deleteorders: builder.mutation({
      query: (id) => ({
        url: `orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"], 
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetordersByIdQuery,
  useAddordersMutation,
  useUpdateordersMutation,
  useDeleteordersMutation,
} = ordersApi;

export default ordersApi;
