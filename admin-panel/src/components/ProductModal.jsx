import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/slice/cartSlice";

export default function ProductModal({ isOpen, onClose, product }) {
  const hasVariants = product?.priceByVariant?.length > 0;

  const defaultVariant = useMemo(
    () =>
      hasVariants
        ? product.priceByVariant[0]
        : {
            _id: product._id,
            price: product?.price,
            stock: product?.stock,
          },
    [hasVariants, product]
  );

  const [selectedProduct, setSelectedProduct] = useState(defaultVariant);
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    setSelectedProduct(defaultVariant);
    setSelectedColor(defaultVariant?.color || null);
  }, [defaultVariant, product]);

  const dispatch = useDispatch();

  const handleAddToOrder = () => {
    const cartData = {
      productId: product._id,
      name: product.name,
      image: selectedProduct.image || product.image[0],
      price: selectedProduct.price,
      quantity: 1,
      size: selectedProduct.value || "",
      color: selectedColor || "",
      variantsName: selectedProduct.value || "",
    };
    dispatch(addItem(cartData));
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Product Title */}
          <Dialog.Title className="text-xl font-bold mb-2">
            {product.name}
          </Dialog.Title>

          {/* Variant Selector */}
          {hasVariants && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Variant
              </label>
              <select
                value={selectedProduct?._id}
                onChange={(e) => {
                  const selected = product.priceByVariant.find(
                    (item) => item._id === e.target.value
                  );
                  setSelectedProduct(selected);
                  setSelectedColor(selected.color);
                }}
                className="w-full border rounded px-4 py-2"
              >
                {product.priceByVariant.map((variant) => (
                  <option key={variant._id} value={variant._id}>
                    {variant.name} {variant.value} — ৳{variant.price} (
                    {variant.stock} in stock)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Color Selector */}
          {product.color && product.color.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Color
              </label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full border rounded px-4 py-2"
              >
                {product.color.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Price & Stock */}
          <div className="mt-2 mb-6">
            <p className="text-gray-700">
              Price:{" "}
              <span className="text-blue-600 font-bold">
                ৳{selectedProduct?.price}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Stock: {selectedProduct?.stock}
            </p>
          </div>

          {/* Add to Order Button */}
          <button
            onClick={handleAddToOrder}
            disabled={selectedProduct?.stock < 1}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {selectedProduct?.stock > 0 ? "Add to Order" : "Out of Stock"}
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// ✅ PropTypes for safety
ProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    price: PropTypes.number,
    stock: PropTypes.number,
    priceByVariant: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        stock: PropTypes.number.isRequired,
        color: PropTypes.string,
        image: PropTypes.string,
      })
    ),
    color: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
