import { useState } from "react";
import {
  useAddbrandsMutation,
  useDeletebrandsMutation,
  useGetbrandsQuery,
  useUpdatebrandsMutation,
} from "../redux/Api/brandApi";

export default function BrandPage() {
  const { data: brands, isLoading } = useGetbrandsQuery();
  const [addBrand] = useAddbrandsMutation();
  const [updateBrand] = useUpdatebrandsMutation();
  const [deleteBrand] = useDeletebrandsMutation();

  const brand = brands && brands.length > 0 ? brands[0] : null;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (brand) {
      await updateBrand({ id: brand._id, ...formData });
    } else {
      await addBrand(formData);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (brand) {
      await deleteBrand(brand._id);
      setFormData({ name: "", description: "", logo: "" });
    }
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {!brand ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Brand Name"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Description"
          />
          <input
            type="text"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Logo URL"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded"
          >
            Add Brand
          </button>
        </form>
      ) : (
        <div>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Brand Name"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Description"
              />
              <input
                type="text"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Logo URL"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded"
              >
                Save
              </button>
            </form>
          ) : (
            <div className="text-center">
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-24 h-24 mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold">{brand.name}</h2>
              <p className="text-gray-600">{brand.description}</p>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => {
                    setFormData(brand);
                    setIsEditing(true);
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
