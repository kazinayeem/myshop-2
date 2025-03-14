import { useState } from "react";
import Reactquill from "react-quill-new";
import { useAddProductMutation } from "../redux/Api/porductApi";
import { useGetCategoriesQuery } from "../redux/Api/categoryApi";
import { useGetSubCategoriesQuery } from "../redux/Api/subcategoryApi";
import "react-quill-new/dist/quill.snow.css";
const AddProduct = () => {
  // product rtk query
  const [addProduct, { isLoading, isError, isSuccess }] =
    useAddProductMutation();

  // category rtk query
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();
  const { data: subcategories, isLoading: isSubCategoriesLoading } =
    useGetSubCategoriesQuery();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    section: [],
    buyingPrice: "",
    price: "",
    discountedPrice: "",
    discountPercent: "",
    priceByVariant: [],
    image: [],
    video: "",
    category: "",
    subcategory: "",
    tags: [],
    bulkOrder: { minQuantity: "", discount: "" },
    stock: 0,
    brand: "",
    rating: 0,
    numReviews: 0,
    isFeatured: false,

    isDeleted: false,
    isBlocked: false,
    warranty: "",
    returnable: false,
    returnableDays: "",
    cod: false,
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle image input (comma-separated)
  const handleImageChange = (e) => {
    setProduct({
      ...product,
      image: e.target.value.split(","),
    });
  };

  // Handle multiple priceByVariant
  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...product.priceByVariant];
    updatedVariants[index][name] = value;
    setProduct({ ...product, priceByVariant: updatedVariants });
  };

  // Add new variant
  const addVariant = () => {
    setProduct({
      ...product,
      priceByVariant: [
        ...product.priceByVariant,
        {
          name: "",
          value: "",
          price: "",
          buyingPrice: "",
          stock: "",
          image: "",
        },
      ],
    });
  };

  // Remove a variant
  const removeVariant = (index) => {
    const updatedVariants = [...product.priceByVariant];
    updatedVariants.splice(index, 1);
    setProduct({ ...product, priceByVariant: updatedVariants });
  };

  // Handle bulk order input
  const handleBulkOrderChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      bulkOrder: { ...product.bulkOrder, [name]: value },
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct(product).unwrap();
    } catch (error) {
      console.error("Failed to add product", error);
    }
  };

  if (isError) {
    return <p className="text-red-500">Failed to add product.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      {isSuccess && (
        <p className="text-green-500 mb-4">Product added successfully!</p>
      )}
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <Reactquill
            theme="snow"
            value={product.description}
            onChange={(value) => setProduct({ ...product, description: value })}
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [
                  { list: "ordered" },
                  { list: "bullet" },
                  { indent: "-1" },
                  { indent: "+1" },
                ],
                ["link", "image"],
                ["clean"],
              ],
            }}
            formats={[
              "header",
              "font",
              "size",
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "list",
              "bullet",
              "indent",
              "link",
              "image",
              "color",
            ]}
          />
        </div>

        {/* stock */}
        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Price & Discount */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Discounted Price
            </label>
            <input
              type="number"
              name="discountedPrice"
              value={product.discountedPrice}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Discount Percent
            </label>
            <input
              type="number"
              name="discountPercent"
              value={product.discountPercent}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium">
            Image URLs (comma-separated)
          </label>
          <input
            type="text"
            name="image"
            value={product.image.join(",")}
            onChange={handleImageChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Variants */}
        <div>
          <label className="block text-sm font-medium">Price by Variant</label>
          {product.priceByVariant.map((variant, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                name="name"
                value={variant.name}
                onChange={(e) => handleVariantChange(index, e)}
                placeholder="Variant Name"
                className="p-2 border rounded-md w-1/4"
                required
              />
              <input
                type="text"
                name="value"
                value={variant.value}
                onChange={(e) => handleVariantChange(index, e)}
                placeholder="Value"
                className="p-2 border rounded-md w-1/4"
                required
              />
              <input
                type="number"
                name="price"
                value={variant.price}
                onChange={(e) => handleVariantChange(index, e)}
                placeholder="Price"
                className="p-2 border rounded-md w-1/4"
                required
              />
              <input
                type="number"
                name="buyingPrice"
                value={variant.buyingPrice}
                onChange={(e) => handleVariantChange(index, e)}
                placeholder="Buying Price"
                className="p-2 border rounded-md w-1/4"
                required
              />
              <input
                type="text"
                name="image"
                value={variant.image}
                onChange={(e) => handleVariantChange(index, e)}
                placeholder="Image URL"
                className="p-2 border rounded-md w-1/4"
                required
              />
              <input
                type="number"
                name="stock"
                value={variant.stock}
                onChange={(e) => handleVariantChange(index, e)}
                placeholder="Stock"
                className="p-2 border rounded-md w-1/4"
                required
              />
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="bg-red-500 text-white px-2 rounded"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            + Add Variant
          </button>
        </div>

        {/* Bulk Order */}
        <div>
          <label className="block text-sm font-medium">Bulk Order</label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="minQuantity"
              value={product.bulkOrder.minQuantity}
              onChange={handleBulkOrderChange}
              placeholder="Min Quantity"
              className="p-2 border rounded-md w-1/2"
            />
            <input
              type="number"
              name="discount"
              value={product.bulkOrder.discount}
              onChange={handleBulkOrderChange}
              placeholder="Discount (%)"
              className="p-2 border rounded-md w-1/2"
            />
          </div>
        </div>

        {/* Returnable & COD */}
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="returnable"
              checked={product.returnable}
              onChange={handleChange}
              className="mr-2"
            />
            Returnable
          </label>
          {product.returnable && (
            <input
              type="number"
              name="returnableDays"
              value={product.returnableDays}
              onChange={handleChange}
              placeholder="Return Days"
              className="p-2 border rounded-md w-1/4"
              required
            />
          )}
          <label className="flex items-center">
            <input
              type="checkbox"
              name="cod"
              checked={product.cod}
              onChange={handleChange}
              className="mr-2"
            />
            Cash on Delivery
          </label>
        </div>

        {/* category select box */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Category</option>
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
        </div>

        {/* Subcategory select box */}
        <div>
          <label className="block text-sm font-medium">Subcategory</label>
          <select
            name="subcategory"
            value={product.subcategory}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Subcategory</option>
            {isSubCategoriesLoading ? (
              <option>Loading subcategories...</option>
            ) : (
              subcategories?.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          {isLoading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
