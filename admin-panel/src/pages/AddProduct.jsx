import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import AddVariants from "../components/AddVariants";

export default function AddProduct() {
  const [product, setProduct] = React.useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    buyingPrice: 0,
    image: [],
    discountPercent: 0,
    discountedPrice: 0,
    section: [],
    variants: [],
    video: "",
    category: "",
    subCategory: "",
    tags: [],
    bulkOrder: {
      minQty: 0,
      discountPercent: 0,
    },
    brand: "",
    isFeatured: false,
    slug: "",
    isDeleted: false,
    isBlocked: false,
    warrenty: "",
    returnable: false,
    returnableDays: 0,
    cod: false,
  });

  //   varent state
  const [variantcount, setVariantCount] = React.useState(0);

  const onChangeHandler = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(product);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      {/* add vareint button */}

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-semibold">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={onChangeHandler}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-gray-700 font-semibold"
          >
            Description
          </label>
          <ReactQuill
            value={product.description}
            onChange={(value) => setProduct({ ...product, description: value })}
            className="bg-white"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-gray-700 font-semibold">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={onChangeHandler}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-gray-700 font-semibold">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={product.stock}
            onChange={onChangeHandler}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-gray-700 font-semibold">
            Image URLs
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={product.image}
            onChange={onChangeHandler}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              onChange={onChangeHandler}
              className="mr-2"
            />{" "}
            Featured
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="returnable"
              onChange={onChangeHandler}
              className="mr-2"
            />{" "}
            Returnable
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="cod"
              onChange={onChangeHandler}
              className="mr-2"
            />{" "}
            COD Available
          </label>
        </div>
        <button
          onClick={() => setVariantCount(variantcount + 1)}
          className="mb-4 p-2 bg-blue-500 text-white rounded"
        >
          Add Variant
        </button>
        {Array.from({ length: variantcount }, (_, index) => (
          <AddVariants
            key={index}
            recived={(e) => {
              product.variants.push(e);
              setProduct({ ...product });
            }}
          />
        ))}
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-lg"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
