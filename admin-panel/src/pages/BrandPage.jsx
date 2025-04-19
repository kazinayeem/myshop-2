import { useState } from "react";
import {
  useAddbrandsMutation,
  useDeletebrandsMutation,
  useGetbrandsQuery,
} from "../redux/Api/brandApi";
import Swal from "sweetalert2";

export default function BrandPage() {
  const { data: brands, isLoading } = useGetbrandsQuery();
  const [addBrand] = useAddbrandsMutation();
  const [deleteBrand] = useDeletebrandsMutation();

  const brand = brands && brands.length > 0 ? brands[0] : null;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo" && files[0]) {
      setFormData({ ...formData, logo: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, logo: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.logo) {
      return Swal.fire("Missing Fields", "All fields are required.", "warning");
    }

    Swal.fire({ title: "Adding Brand...", didOpen: () => Swal.showLoading() });

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("logo", formData.logo);

    await addBrand(form);
    Swal.close();
    Swal.fire({
      icon: "success",
      title: "Brand Added",
      text: "Brand has been added successfully.",
      showConfirmButton: false,
      timer: 1500,
    });

    setFormData({ name: "", description: "", logo: null });
    setImagePreview(null);
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Deleting Brand...",
      didOpen: () => Swal.showLoading(),
    });

    if (brand) {
      await deleteBrand(brand._id);
      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Brand Deleted",
        text: "Brand has been deleted successfully.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  if (isLoading)
    return (
      <div className="text-center mt-10 text-lg text-gray-500">Loading...</div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4ff] to-[#e4f0ff] px-4 py-10">
      <div className="w-full max-w-md md:max-w-lg p-8 bg-white shadow-2xl rounded-2xl border border-gray-100 backdrop-blur-md">
        {!brand ? (
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
              Add New Brand
            </h2>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Brand Name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {imagePreview && (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover shadow-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove Image
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              Add Brand
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <img
              src={brand.logo}
              alt={brand.name}
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-100 shadow-sm"
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              {brand.name}
            </h2>
            <p className="text-gray-600">{brand.description}</p>
            <button
              onClick={handleDelete}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md"
            >
              Delete Brand
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
