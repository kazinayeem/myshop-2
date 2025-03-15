// File: src/pages/EditProduct.jsx

import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router";
import Loading from "../components/Loading";
import { useGetCategoriesQuery } from "../redux/Api/categoryApi";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../redux/Api/porductApi";
import { useGetSubCategoriesQuery } from "../redux/Api/subcategoryApi";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductByIdQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // Get categories & subcategories
  const { data: categories } = useGetCategoriesQuery();
  const { data: subcategories } = useGetSubCategoriesQuery();

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    }
  }, [product]);

  // General Input Handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Fix: Update only the changed variant inside the array
  const handleVariantChange = (index, key, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      priceByVariant: prevFormData.priceByVariant.map((variant, i) =>
        i === index ? { ...variant, [key]: value } : variant
      ),
    }));
  };

  // Add a new variant
  const addVariant = () => {
    setFormData({
      ...formData,
      priceByVariant: [
        ...formData.priceByVariant,
        { name: "", value: "", price: 0, stock: 0, buyingPrice: 0, image: "" },
      ],
    });
  };

  // Remove a variant
  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      priceByVariant: prev.priceByVariant.filter((_, i) => i !== index),
    }));
  };
  const handleCategoryChange = (e) => {
    const selectedCategory = categories?.find(
      (cat) => cat._id === e.target.value
    );
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory || null, // Ensure valid object
    }));
  };

  const handleSubcategoryChange = (e) => {
    const selectedSubcategory = subcategories?.find(
      (sub) => sub._id === e.target.value
    );
    setFormData((prev) => ({
      ...prev,
      subcategory: selectedSubcategory || null, // Ensure valid object
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({ id, ...formData }).unwrap();
      alert("Product updated successfully!");
      navigate("/dashboard/show-product");
    } catch {
      alert("Failed to update product!");
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-red-500 text-center py-10">
        Error: {error?.message}
      </div>
    );
  if (!formData)
    return <div className="text-center py-10">No product found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-gray-700 font-medium">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <ReactQuill
            value={formData.description}
            onChange={(value) =>
              setFormData({ ...formData, description: value })
            }
            className="bg-white"
          />
        </div>

        {/* Price, Discount, Buying Price, Stock */}
        {["price", "discountedPrice", "buyingPrice", "stock"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 font-medium">
              {field.replace(/([A-Z])/g, " $1").trim()}
            </label>
            <input
              type="number"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
        ))}

        {/* Category & Subcategory */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Category</label>
            <select
              name="category"
              value={formData.category?._id || ""}
              onChange={handleCategoryChange}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="">Select Category</option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Subcategory
            </label>
            <select
              name="subcategory"
              value={formData.subcategory?._id || ""}
              onChange={handleSubcategoryChange}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="">Select Subcategory</option>
              {subcategories?.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ✅ Variants */}
        <h3 className="text-lg font-medium mt-4">Variants</h3>
        {formData.priceByVariant.map((variant, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-2 p-2 border rounded mb-2"
          >
            {["name", "value", "price", "stock", "buyingPrice", "image"].map(
              (key) => (
                <input
                  key={key}
                  type={
                    key === "price" || key === "stock" || key === "buyingPrice"
                      ? "number"
                      : "text"
                  }
                  value={variant[key]}
                  onChange={(e) =>
                    handleVariantChange(index, key, e.target.value)
                  }
                  placeholder={key}
                  className="p-2 border rounded"
                />
              )
            )}
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addVariant}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Variant
        </button>

        {/* Toggle Switches */}
        {["isFeatured", "cod", "returnable"].map((key) => (
          <label key={key} className="flex items-center">
            <input
              type="checkbox"
              name={key}
              checked={formData[key]}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-gray-700">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </span>
          </label>
        ))}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
