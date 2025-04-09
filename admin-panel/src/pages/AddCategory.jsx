import { useState } from "react";
import { useAddCategoryMutation } from "../redux/Api/categoryApi";
import InputText from "../components/InputText";
import { Button } from "flowbite-react";
import Swal from "sweetalert2";
export default function AddCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [addCategory, { isLoading, isError, isSuccess }] =
    useAddCategoryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Adding Category",
      text: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("imageUrl", imageUrl);
    try {
      await addCategory(formData).unwrap();
      Swal.close();
      Swal.fire({
        title: "Success",
        text: "Category added successfully!",
        icon: "success",
      });
      setCategoryName("");
      setImageUrl(null);
    } catch (error) {
      Swal.close();
      Swal.fire({
        title: "Error",
        text: "Failed to add category",
        icon: "error",
      });
      setCategoryName("");
      setImageUrl(null);
      setImagePreview(null);
      console.error("Failed to add category", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Add Category</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <InputText
          label={"Category Name"}
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {imagePreview && (
          <>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "200px", height: "auto", objectFit: "cover" }}
            />
            <Button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setImageUrl(null);
              }}
              className="mt-2 text-red-500"
            >
              Remove Image
            </Button>
          </>
        )}
        <label className="block text-gray-700 mb-2">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setImageUrl(file);
              const reader = new FileReader();
              reader.onloadend = () => {
                setImagePreview(reader.result); // base64 URL
              };
              reader.readAsDataURL(file);
            }
          }}
          placeholder="Enter image URL"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          // disabled={isLoading}
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
