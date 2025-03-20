import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const sliderApi = createApi({
  reducerPath: "sliderApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_SERVER_PORT }),
  tagTypes: ["sliderApi"],
  endpoints: (builder) => ({
    getSliders: builder.query({
      query: () => "sliders",
      providesTags: ["sliderApi"],
    }),
  }),
});

export const { useGetSlidersQuery } = sliderApi;
export default sliderApi;
