import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../redux/Api/porductApi";
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

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVariantChange = (index, key, value) => {
    const updatedVariants = [...formData.priceByVariant];
    updatedVariants[index][key] = value;
    setFormData({ ...formData, priceByVariant: updatedVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      priceByVariant: [
        ...formData.priceByVariant,
        { name: "", value: "", price: 0, stock: 0 },
      ],
    });
  };

  const removeVariant = (index) => {
    const updatedVariants = formData.priceByVariant.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, priceByVariant: updatedVariants });
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

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
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
        {/* price */}

        <div>
          <label className="block text-gray-700 font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        {/* discount price */}

        <div>
          <label className="block text-gray-700 font-medium">
            Discount Price
          </label>
          <input
            type="number"
            name="discountedPrice"
            value={formData.discountedPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        {/* buy price */}
        <div>
          <label className="block text-gray-700 font-medium">
            Discount Price
          </label>
          <input
            type="number"
            name="buyingPrice"
            value={formData.buyingPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        {/* stock */}
        <div>
          <label className="block text-gray-700 font-medium">stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
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

        {/* Category & Subcategory */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category?.name || ""}
              readOnly
              className="w-full p-2 border rounded mt-1 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Subcategory
            </label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory?.name || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
        </div>

        {/* Variants (Size, Color, etc.) */}
        <h3 className="text-lg font-medium mt-4">Variants</h3>
        {formData.priceByVariant.map((variant, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 p-2 border rounded mb-2"
          >
            <input
              type="text"
              value={variant.name}
              onChange={(e) =>
                handleVariantChange(index, "name", e.target.value)
              }
              className="p-2 border rounded"
              placeholder="Type (e.g., Size)"
            />
            <input
              type="text"
              value={variant.value}
              onChange={(e) =>
                handleVariantChange(index, "value", e.target.value)
              }
              className="p-2 border rounded"
              placeholder="Value (e.g., Large)"
            />
            <input
              type="number"
              value={variant.price}
              onChange={(e) =>
                handleVariantChange(index, "price", e.target.value)
              }
              className="p-2 border rounded"
              placeholder="Price"
            />
            <input
              type="number"
              value={variant.stock}
              onChange={(e) =>
                handleVariantChange(index, "stock", e.target.value)
              }
              className="p-2 border rounded"
              placeholder="Stock"
            />
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

        {/* Product Images */}
        <h3 className="text-lg font-medium mt-4">Product Images</h3>
        <div className="grid grid-cols-2 gap-4">
          {formData.image.map((img, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={img}
                alt={`Product ${index}`}
                className="w-32 h-32 object-cover rounded shadow"
              />
              <input
                type="text"
                value={img}
                onChange={(e) => {
                  const updatedImages = [...formData.image];
                  updatedImages[index] = e.target.value;
                  setFormData({ ...formData, image: updatedImages });
                }}
                className="w-full p-2 border rounded mt-2 text-sm"
              />
            </div>
          ))}
        </div>

        {/* Toggle Switches */}
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-gray-700">Featured Product</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="cod"
            checked={formData.cod}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-gray-700">Cash on Delivery</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="returnable"
            checked={formData.returnable}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-gray-700">Returnable</span>
        </label>

        {/* Submit Button */}
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
