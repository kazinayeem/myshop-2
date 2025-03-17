import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ startDate, endDate, orderId } = {}) => {
        let queryParams = "";

        if (startDate && endDate) {
          queryParams = `?startDate=${startDate}&endDate=${endDate}`;
        }
        if (orderId) {
          queryParams = queryParams
            ? `${queryParams}&orderId=${orderId}`
            : `?orderId=${orderId}`;
        }

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
      // Invalidate the updated order and refetch the list of orders
      invalidatesTags: (result, error, { id }) => [
        { type: "Orders", id }, // Invalidate the specific updated order
        "Orders", // Invalidate the list of orders so it's refetched
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
