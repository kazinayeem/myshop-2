import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ startDate, endDate, orderId, limit , page  } = {}) => {
        const queryParams = new URLSearchParams();

        if (startDate && endDate) {
          queryParams.append("startDate", startDate);
          queryParams.append("endDate", endDate);
        }
        if (orderId) {
          queryParams.append("orderId", orderId);
        }
        queryParams.append("limit", limit);
        queryParams.append("page", page);

        return `orders?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result?.orders
          ? [
              ...result.orders.map(({ _id }) => ({ type: "Orders", id: _id })),
              "Orders",
            ]
          : ["Orders"],
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
      invalidatesTags: ["Orders"],
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
