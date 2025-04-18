// slider api rtk
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sliderApi = createApi({
  reducerPath: "sliderApi",
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
  tagTypes: ["Sliders"],
  endpoints: (builder) => ({
    getSliders: builder.query({
      query: () => "/sliders?show=all",
      providesTags: ["Sliders"],
    }),
    getSliderById: builder.query({
      query: (id) => `/sliders/${id}`,
      providesTags: (result, error, id) => [{ type: "Sliders", id }],
    }),
    addSlider: builder.mutation({
      query: (newSlider) => ({
        url: "/sliders",
        method: "POST",
        body: newSlider,
      }),
      invalidatesTags: ["Sliders"],
    }),
    updateSlider: builder.mutation({
      query: ({ id, ...updatedSlider }) => ({
        url: `/sliders/${id}`,
        method: "PUT",
        body: updatedSlider,
      }),
      invalidatesTags: ["Sliders"],
    }),
    deleteSlider: builder.mutation({
      query: (id) => ({
        url: `/sliders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sliders"],
    }),
  }),
});

export const {
  useGetSlidersQuery,
  useGetSliderByIdQuery,
  useAddSliderMutation,
  useUpdateSliderMutation,
  useDeleteSliderMutation,
} = sliderApi;
