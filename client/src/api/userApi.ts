import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_SERVER_PORT }),
  tagTypes: ["user"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/users/register",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: "/users/login",
        method: "POST",
        body: userData,
      }),
    }),
    // reset password
    resetPassword: builder.mutation({
      query: (userData) => ({
        url: "/users/reset-password",
        method: "POST",
        body: userData,
      }),
    }),
    // send otp
    sendOtp: builder.mutation({
      query: (userData) => ({
        url: "/users/send-otp",
        method: "POST",
        body: userData,
      }),
    }),
    //  verify otp
    verifyOtp: builder.mutation({
      query: (userData) => ({
        url: "/users/verify-otp",
        method: "POST",
        body: userData,
      }),
    }),
    // change password
    changePassword: builder.mutation({
      query: (userData) => ({
        url: "/users/change-password",
        method: "POST",
        body: userData,
      }),
    }),
    loginwithGoogle: builder.mutation({
      query: (userData) => ({
        url: "/users/google/login",
        method: "POST",
        body: userData,
      }),
    }),

    getUserById: builder.query({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: "user", id }],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...updatedUser }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "user", id }],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useLoginMutation,
  useRegisterMutation,
  useLoginwithGoogleMutation,
  useResetPasswordMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useChangePasswordMutation,
} = userApi;

export default userApi;
