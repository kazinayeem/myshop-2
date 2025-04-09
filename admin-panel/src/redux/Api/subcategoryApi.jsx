import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subCategoryApi = createApi({
  reducerPath: "subCategoryApi",
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
  endpoints: (builder) => ({
    getSubCategories: builder.query({
      query: () => "subcategories",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "SubCategory", id })),
              { type: "SubCategory", id: "LIST" },
            ]
          : [{ type: "SubCategory", id: "LIST" }],
      invalidateTags: (result, error, id) => [{ type: "SubCategory", id }],
    }),
    getSubCategoryById: builder.query({
      query: (id) => `subcategories/${id}`,
      providesTags: (result, error, id) => [{ type: "SubCategory", id }],
      invalidatesTags: (result, error, id) => [{ type: "SubCategory", id }],
    }),
    addSubCategory: builder.mutation({
      query: (newSubCategory) => ({
        url: "subcategories",
        method: "POST",
        body: newSubCategory,
      }),
      invalidatesTags: [{ type: "SubCategory", id: "LIST" }],
    }),
    updateSubCategory: builder.mutation({
      query: ({ _id, ...updatedSubCategory }) => ({
        url: `subcategories/${_id}`,
        method: "PUT",
        body: updatedSubCategory,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "SubCategory", id }],
      providesTags: (result, error, id) => [{ type: "SubCategory", id }],
    }),
    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `subcategories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "SubCategory", id: "LIST" }],
      providesTags: (result, error, id) => [{ type: "SubCategory", id }],
    }),
  }),
});

export const {
  useGetSubCategoriesQuery,
  useGetSubCategoryByIdQuery,
  useAddSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApi;

export default subCategoryApi;
