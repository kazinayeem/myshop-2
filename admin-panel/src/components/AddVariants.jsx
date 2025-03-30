import React from "react";
import PropTypes from "prop-types";
function AddVariants({ recived }) {
  const [variant, setVariant] = React.useState({
    name: "",
    price: 0,
    stock: 0,
    image: "",
  });

  // Send variant to main component
  const send = () => {
    recived(variant);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add New Variant</h2>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="name" className="block text-gray-700 font-semibold">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={variant.name}
            onChange={(e) => setVariant({ ...variant, name: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="price" className="block text-gray-700 font-semibold">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={variant.price}
            onChange={(e) => setVariant({ ...variant, price: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="stock" className="block text-gray-700 font-semibold">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={variant.stock}
            onChange={(e) => setVariant({ ...variant, stock: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="image" className="block text-gray-700 font-semibold">
            Image
          </label>
          <input
            type="file"
            name="image"
            accept=".png, .jpg, .jpeg"
            onChange={(e) =>
              setVariant({ ...variant, image: e.target.files[0] })
            }
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={send}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Add Variant
          </button>
        </div>
      </div>
    </div>
  );
}

// props type recived: (variant: { name: string; price: number; stock: number; image: string }) => void
// props type recived: (variant: { name: string; price: number; stock: number; image: string }) => void

AddVariants.propTypes = {
  recived: PropTypes.func.isRequired,
};
export default AddVariants;
