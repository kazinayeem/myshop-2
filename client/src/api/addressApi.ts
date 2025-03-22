import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_PORT,
  }),
  tagTypes: ["address"],
  endpoints: (builder) => ({
    getAddress: builder.query({
      query: (userId) => `addresses/user/${userId}`,
      providesTags: (result, error, userId) =>
        result ? [{ type: "address", id: userId }] : [],
    }),

    addAddress: builder.mutation({
      query: (newAddress) => ({
        url: "addresses",
        method: "POST",
        body: newAddress,
      }),
      invalidatesTags: ["address"],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["address"],
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...updatedAddress }) => ({
        url: `addresses/${id}`,
        method: "PUT",
        body: updatedAddress,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "address", id },
        "address",
      ],
    }),
  }),
});

export const {
  useGetAddressQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} = addressApi;

export default addressApi;
