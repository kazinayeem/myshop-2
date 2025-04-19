import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import {
  clearCart,
  removeItem,
  setDiscountPrice,
  updateItemQuantity,
} from "../redux/slice/cartSlice";

import Swal from "sweetalert2";
import { useAddordersMutation } from "../redux/Api/orderApi";
export default function CartModal({ onClose, refetch }) {
  const [addorders] = useAddordersMutation();

  const cartItems = useSelector((state) => state.cart.items);
  const { totalQuantity, totalPrice, discountPrice } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();

  const handleRemoveItem = (productId) => {
    dispatch(removeItem(productId));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    dispatch(updateItemQuantity({ id: productId, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleDiscountPrompt = async () => {
    const { value: discountPercent } = await Swal.fire({
      title: "Set Discount %",
      input: "number",
      inputLabel: "Enter discount percentage",
      inputPlaceholder: "e.g. 10",
      inputAttributes: {
        min: 0,
        max: 100,
        step: 0.01,
      },
      confirmButtonColor: "#2563EB",
      confirmButtonText: "Apply Discount",
      showCancelButton: true,
      cancelButtonColor: "#EF4444",
      cancelButtonText: "Cancel",
    });

    if (discountPercent !== undefined && !isNaN(discountPercent)) {
      const discountAmount = (parseFloat(discountPercent) / 100) * totalPrice;
      dispatch(setDiscountPrice(discountAmount));

      Swal.fire({
        icon: "success",
        title: "Discount Applied",
        text: `Discount: ${discountPercent}% (৳${discountAmount.toFixed(2)})`,
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const finalPrice = totalPrice - discountPrice;
  const buynow = () => {
    const oderData = {
      products: cartItems,
      totalPrice: totalPrice - discountPrice,
      posOrder: true,
      paidAmount: totalPrice,
      paymentMethod: "cash",
      transactionStatus: "success",
      transactionId: "POS",
      transactionDate: new Date(),
      bankTransactionId: "POS",
      paymentStatus: "paid",
      status: "delivered",
    };
    addorders(oderData)
      .unwrap()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Order Placed",
          text: "Your order has been placed successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        onClose();
        refetch();
        dispatch(clearCart());
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        Swal.fire({
          icon: "error",
          title: "Order Failed",
          text: "There was an error placing your order.",
          timer: 2000,
          showConfirmButton: false,
        });
      });
  };
  console.log(cartItems, "cartItems");

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 transition-all duration-300"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>

          <Dialog.Title className="text-xl font-bold mb-4">
            Cart ({totalQuantity} items)
          </Dialog.Title>

          <div className="text-sm font-normal mb-4 space-y-1">
            <div>
              <span className="font-medium text-gray-700">Total:</span>{" "}
              <span className="font-semibold text-black">
                ৳{totalPrice.toFixed(2)}
              </span>
            </div>

            {discountPrice > 0 && (
              <>
                <div className="text-red-500">
                  <span className="font-medium">Discount:</span> ৳
                  {discountPrice.toFixed(2)}
                </div>
                <div className="text-green-600 font-semibold">
                  Final Price: ৳{finalPrice.toFixed(2)}
                </div>
              </>
            )}
          </div>

          {cartItems.length > 0 ? (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-start p-4 border rounded shadow-sm"
                >
                  <div className="text-sm">
                    <h4 className="font-bold text-base">{item.name}</h4>
                    <p className="text-gray-500">ID: {item.productId}</p>
                    <p className="text-gray-700">Price: ৳{item.price}</p>
                    <p className="text-gray-700">Quantity:</p>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      className="w-16 text-center border rounded"
                      onChange={(e) =>
                        handleUpdateQuantity(
                          item.productId,
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                    {item.color && (
                      <p className="text-gray-700">Color: {item.color}</p>
                    )}
                    {item.size && (
                      <p className="text-gray-700">Size: {item.size}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap justify-between gap-2">
            <button
              onClick={handleClearCart}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
            >
              Clear All
            </button>
            <button
              onClick={handleDiscountPrompt}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Discount
            </button>
            <button
              onClick={buynow}
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
            >
              Checkout
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

CartModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};
