import { useState } from "react";
import { useAddSubCategoryMutation } from "../redux/Api/subcategoryApi";
import { useGetCategoriesQuery } from "../redux/Api/categoryApi";
import Swal from "sweetalert2";
import { Button } from "flowbite-react";
export default function AddSubCategory() {
  const [subCategoryName, setSubCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [addSubCategory, { isLoading, isError, isSuccess }] =
    useAddSubCategoryMutation();
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Adding SubCategory",
      text: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const formData = new FormData();
    formData.append("name", subCategoryName);
    formData.append("categoryid", categoryId);
    formData.append("imageUrl", imageUrl);

    try {
      await addSubCategory(formData).unwrap();
      setSubCategoryName("");
      setImageUrl(null);
      setCategoryId(null);
      setImagePreview(null);

      Swal.close();
      Swal.fire({
        title: "Success",
        text: "SubCategory added successfully!",
        icon: "success",
      });
    } catch (error) {
      Swal.close();
      Swal.fire({
        title: "Error",
        text: "Failed to add subcategory",
        icon: "error",
      });
      setSubCategoryName("");
      setImageUrl(null);
      setCategoryId(null);
      setImagePreview(null);
      console.error("Failed to add subcategory", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Add SubCategory
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <input
          type="text"
          required
          value={subCategoryName}
          onChange={(e) => setSubCategoryName(e.target.value)}
          placeholder="Enter subcategory name"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {imagePreview && (
          <>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <Button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setImageUrl(null);
              }}
              className="text-red-500 text-sm mb-2"
            >
              Remove Image
            </Button>
          </>
        )}

        <label className="block text-gray-700 mb-2">Upload Image</label>

        <input
          type="file"
          required
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setImageUrl(file);
              const reader = new FileReader();
              reader.onloadend = () => {
                setImagePreview(reader.result);
              };
              reader.readAsDataURL(file);
            }
          }}
          placeholder="Enter image URL"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          required
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
