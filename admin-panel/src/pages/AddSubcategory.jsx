import { useState } from "react";
import { useAddSubCategoryMutation } from "../redux/Api/subcategoryApi";
import { useGetCategoriesQuery } from "../redux/Api/categoryApi";
export default function AddSubCategory() {
  const [subCategoryName, setSubCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [addSubCategory, { isLoading, isError, isSuccess }] =
    useAddSubCategoryMutation();
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subCategoryName.trim() || !imageUrl.trim() || !categoryId) return;

    try {
      await addSubCategory({
        name: subCategoryName,
        image: imageUrl,
        categoryid: categoryId,
      }).unwrap();
      setSubCategoryName("");
      setImageUrl("");
      setCategoryId("");
    } catch (error) {
      console.error("Failed to add subcategory", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Add SubCategory
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={subCategoryName}
          onChange={(e) => setSubCategoryName(e.target.value)}
          placeholder="Enter subcategory name"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select Category
          </option>
          {isCategoriesLoading ? (
            <option>Loading categories...</option>
          ) : (
            categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))
          )}
        </select>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          {isLoading ? "Adding..." : "Add SubCategory"}
        </button>
      </form>
      {isSuccess && (
        <p className="text-green-500 mt-2">SubCategory added successfully!</p>
      )}
      {isError && (
        <p className="text-red-500 mt-2">Failed to add subcategory.</p>
      )}
    </div>
  );
}
