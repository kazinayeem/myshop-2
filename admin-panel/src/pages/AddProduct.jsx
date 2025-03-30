import { Button, Checkbox, Label, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import Reactquill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Swal from "sweetalert2";
import { useGetCategoriesQuery } from "../redux/Api/categoryApi";
import { useAddProductMutation } from "../redux/Api/porductApi";
import { useGetSubCategoriesQuery } from "../redux/Api/subcategoryApi";
const AddProduct = () => {
  const [addProduct, { isLoading, isError, isSuccess }] =
    useAddProductMutation();
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();
  const { data: subcategories, isLoading: isSubCategoriesLoading } =
    useGetSubCategoriesQuery();
  const [isVariant, setIsVariant] = useState(false);
  const [iscolor, setIsColor] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    section: [],
    buyingPrice: 0,
    price: 0,
    discountedPrice: 0,
    discountPercent: 0,
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
    isFeatured: false,
    color: [],
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
      const response = await addProduct(product).unwrap();

      if (response) {
        Swal.fire({
          title: "Success",
          text: "Product added successfully!",
          icon: "success",
        });
        setProduct({
          name: "",
          description: "",
          buyingPrice: 0,
          price: 0,
          discountedPrice: 0,
          discountPercent: 0,
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
          isFeatured: false,
          color: [],
          warranty: "",
          returnable: false,
          returnableDays: "",
          cod: false,
        });
        setIsVariant(false);
        setIsColor(false);
      }
    } catch (error) {
      console.error("Failed to add product:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to add product.",
        icon: "error",
      });
    }
  };

  if (isError) {
    return <p className="text-red-500">Failed to add product.</p>;
  }

  return (
    <div className="max-w-4xl min-w-full mx-auto bg-white shadow-lg rounded-lg p-6">
      {isSuccess && (
        <p className="text-green-500 mb-4">Product added successfully!</p>
      )}
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <Label className="block text-sm font-medium">Product Name</Label>
          <TextInput
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label className="block text-sm font-medium">Description</Label>
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

        <div className="flex items-center mb-4">
          <Checkbox
            type="checkbox"
            name="isVariant"
            checked={isVariant}
            onChange={(e) => {
              setIsVariant(e.target.checked);
            }}
          />
          <Label className="text-sm font-medium">Is Variant</Label>
        </div>

        {!isVariant && (
          <React.Fragment>
            <div>
              <Label className="block text-sm font-medium">Stock</Label>
              <TextInput
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label className="block text-sm font-medium">Buying Price</Label>
              <TextInput
                type="number"
                name="buyingPrice"
                value={product.buyingPrice}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="block text-sm font-medium">Price</Label>
                <TextInput
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">
                  Discounted Price
                </Label>
                <TextInput
                  type="number"
                  name="discountedPrice"
                  value={product.discountedPrice}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">
                  Discount Percent
                </Label>
                <TextInput
                  type="number"
                  name="discountPercent"
                  value={product.discountPercent}
                  onChange={handleChange}
                />
              </div>
            </div>
          </React.Fragment>
        )}

        {/* Image */}
        <div>
          <Label className="block text-sm font-medium">
            Image URLs (comma-separated)
          </Label>
          <TextInput
            type="text"
            name="image"
            value={product.image.join(",")}
            onChange={handleImageChange}
            required
          />
        </div>

        {/* video url */}
        <div>
          <Label className="block text-sm font-medium">Video URL</Label>
          <TextInput
            type="text"
            name="video"
            value={product.video}
            onChange={handleChange}
            placeholder="Video URL"
          />
        </div>

        {/* brand */}
        <div>
          <Label className="block text-sm font-medium">Brand</Label>
          <TextInput
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            placeholder="Brand Name"
          />
        </div>

        {/* Variants */}
        {isVariant && (
          <>
            {" "}
            <div>
              <Label className="block text-sm font-medium">
                Price by Variant
              </Label>
              {product.priceByVariant.map((variant, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <TextInput
                    type="text"
                    name="name"
                    value={variant.name}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Variant Name"
                    required
                  />
                  <TextInput
                    type="text"
                    name="value"
                    value={variant.value}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Value"
                    required
                  />
                  <TextInput
                    type="number"
                    name="price"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Price"
                    required
                  />
                  <TextInput
                    type="number"
                    name="buyingPrice"
                    value={variant.buyingPrice}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Buying Price"
                    required
                  />
                  <TextInput
                    type="text"
                    name="image"
                    value={variant.image}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Image URL"
                    required
                  />
                  <TextInput
                    type="number"
                    name="stock"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Stock"
                    required
                  />
                  <Button type="button" onClick={() => removeVariant(index)}>
                    X
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addVariant}>
                + Add Variant
              </Button>
            </div>
          </>
        )}

        {/* color */}
        <div className="flex items-center mb-4">
          <TextInput
            type="checkbox"
            name="iscolor"
            checked={iscolor}
            onChange={(e) => {
              setIsColor(e.target.checked);
            }}
          />
          <Label className="text-sm font-medium">Is Color</Label>
        </div>
        {iscolor && (
          <div>
            <Label className="block text-sm font-medium">Color</Label>
            <TextInput
              type="text"
              name="color"
              value={product.color.join(",")}
              onChange={(e) =>
                setProduct({
                  ...product,
                  color: e.target.value.split(","),
                })
              }
              placeholder="Comma-separated colors"
            />
          </div>
        )}

        {/* Bulk Order */}
        <div>
          <Label className="block text-sm font-medium">Bulk Order</Label>
          <div className="flex space-x-2">
            <TextInput
              type="number"
              name="minQuantity"
              value={product.bulkOrder.minQuantity}
              onChange={handleBulkOrderChange}
              placeholder="Min Quantity"
            />
            <TextInput
              type="number"
              name="discount"
              value={product.bulkOrder.discount}
              onChange={handleBulkOrderChange}
              placeholder="Discount (%)"
            />
          </div>
        </div>

        {/* Returnable & COD */}
        <div className="flex space-x-4">
          <Label className="flex items-center">
            <Checkbox
              type="checkbox"
              name="returnable"
              checked={product.returnable}
              onChange={handleChange}
            />
            Returnable
          </Label>
          {product.returnable && (
            <TextInput
              type="number"
              name="returnableDays"
              value={product.returnableDays}
              onChange={handleChange}
              placeholder="Return Days"
              required
            />
          )}
          <Label className="flex items-center">
            <Checkbox
              type="checkbox"
              name="cod"
              checked={product.cod}
              onChange={handleChange}
              className="mr-2"
            />
            Cash on Delivery
          </Label>
        </div>

        {/* category select box */}
        <div>
          <Label className="block text-sm font-medium">Category</Label>
          <Select
            name="category"
            value={product.category}
            onChange={handleChange}
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
          </Select>
        </div>

        {/* Subcategory select box */}
        <div>
          <Label className="block text-sm font-medium">Subcategory</Label>
          <Select
            name="subcategory"
            value={product.subcategory}
            onChange={handleChange}
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
          </Select>
        </div>

        {/* Submit Button */}
        <Button disabled={isLoading} type="submit">
          {isLoading ? "Adding..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
