import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subCategoryApi = createApi({
  reducerPath: "subCategoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    getSubCategories: builder.query({
      query: () => "subcategories",
    }),
    getSubCategoryById: builder.query({
      query: (id) => `subcategories/${id}`,
    }),
    addSubCategory: builder.mutation({
      query: (newSubCategory) => ({
        url: "subcategories",
        method: "POST",
        body: newSubCategory,
      }),
    }),
    updateSubCategory: builder.mutation({
      query: ({ id, ...updatedSubCategory }) => ({
        url: `subcategories/${id}`,
        method: "PUT",
        body: updatedSubCategory,
      }),
    }),
    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `subcategories/${id}`,
        method: "DELETE",
      }),
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
