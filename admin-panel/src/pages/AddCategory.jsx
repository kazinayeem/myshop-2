import { useState } from "react";
import { useAddCategoryMutation } from "../redux/Api/categoryApi";

export default function AddCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [addCategory, { isLoading, isError, isSuccess }] =
    useAddCategoryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim() || !imageUrl.trim()) return;

    try {
      await addCategory({ name: categoryName, imageUrl }).unwrap();
      setCategoryName(""); // Clear input after success
      setImageUrl("");
    } catch (error) {
      console.error("Failed to add category", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Add Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          {isLoading ? "Adding..." : "Add Category"}
        </button>
      </form>
      {isSuccess && (
        <p className="text-green-500 mt-2">Category added successfully!</p>
      )}
      {isError && <p className="text-red-500 mt-2">Failed to add category.</p>}
    </div>
  );
}
