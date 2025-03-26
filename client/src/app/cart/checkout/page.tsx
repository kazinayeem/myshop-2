"use client";
import { useGetAddressQuery } from "@/api/addressApi";
import { useAddordersMutation } from "@/api/orderApi";
import { useGetUserByIdQuery } from "@/api/userApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { clearCart } from "@/reducer/cartReducer";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

interface Address {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  division: string;
  district: string;
  upazilla: string;
  zipCode: string;
  phoneNumber: string;
  country?: string;
}
export default function CheckoutPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectAddress, setSelectAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [senderNumber, setSenderNumber] = useState<number>(0);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    items: cartItems,
    totalPrice,
    discountPrice,
    shippingPrice,
  } = useAppSelector((state: RootState) => state.cart);
  const user = useAppSelector((state) => state.auth.user);
  const { isLoading, isError } = useGetUserByIdQuery(user?.id);
  const { data: addresses } = useGetAddressQuery(user?.id);
  //  useAddordersMutation
  const [addorders, { isLoading: isAdding }] = useAddordersMutation();
  const submitOrder = async () => {
    try {
      const oderData = {
        userId: user?.id,
        products: cartItems,
        totalPrice: totalPrice - (discountPrice || 0) + (shippingPrice || 0),
        address: selectAddress,
        deliveryCharge: shippingPrice || 0,
        paidAmount: paymentMethod === "cash_on_delivery" ? 0 : totalPrice,
        paymentMethod: paymentMethod,
        dueAmount: paymentMethod === "bkash" && "nagad" ? 0 : totalPrice,
        transactionId: transactionId,
        number: senderNumber,
      };

      const response = await addorders(oderData).unwrap();

      if (response) {
        dispatch(clearCart());

        Swal.fire({
          title: "Order Placed!",
          text: "Your order has been placed successfully.",
          icon: "success",
        });
        setTimeout(() => {
          router.push("/user/order");
        }, 1000);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Swal.fire({
        title: "Error!",
        text:
          (error as { data: { message: string } }).data.message +
          " Please Login again.",
        icon: "error",
      });
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Show an error message if there is an issue fetching data
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading profile data. Please try again later.
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure order is placed?</AlertDialogTitle>
            <AlertDialogDescription>
              if you are sure, then click continue button. Otherwise, click
              cancel button.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={submitOrder}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>
      <div className="w-full max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Product</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Size/Variant</th>
              <th className="p-3 border">Color</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-600">
                  Your cart is empty.
                </td>
              </tr>
            ) : (
              cartItems.map((item) => (
                <tr key={item.productId} className="border">
                  <td className="p-3 border flex items-center gap-2">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                    )}
                    <span>{item.name.slice(0, 20)}...</span>
                  </td>
                  <td className="p-3 border">
                    {"\u09F3"}
                    {item.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                  <td className="p-3 border">{item.size}</td>
                  <td className="p-3 border">{item.color || "NO"}</td>
                  <td className="p-3 border">{item.quantity}</td>
                  <td className="p-3 border">
                    {"\u09F3"}
                    {(item.price * item.quantity)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* select address id */}
        <div className="mt-6">
          <label htmlFor="address" className="block text-lg font-semibold mb-2">
            Select Address:
          </label>
          {addresses?.length > 0 ? (
            <select
              id="address"
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(e) => setSelectAddress(e.target.value)}
            >
              <option value="">Select Address</option>
              {addresses.map((address: Address) => (
                <option key={address._id} value={address._id}>
                  {`${address.addressLine1}, ${address.division}, ${address.district}, ${address.upazilla}`}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex justify-between items-center p-4 border border-red-500 rounded-md bg-red-50 text-red-700">
              No address found. add address first.
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => router.push("/user/address")}
              >
                Add Address
              </span>
            </div>
          )}
        </div>
        {/* payment method */}
        <div className="mt-6">
          <label className="block text-lg font-semibold mb-2">
            Payment Method:
          </label>
          <select
            id="paymentMethod"
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select Payment Method</option>
            <option value="bkash">bkash</option>

            <option value="nagad">nagad</option>
            <option value="cash_on_delivery">cash_on_delivery</option>
          </select>
          {/* if select bkash or nagod show a two input box sender number and transtion id */}
          {paymentMethod === "bkash" && (
            <div className="mt-4">
              <label className="block text-lg font-semibold mb-2">
                Sender Account Number:
              </label>
              <input
                value={senderNumber}
                onChange={(e) => setSenderNumber(Number(e.target.value))}
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Sender Number"
              />

              <label className="block text-lg font-semibold mb-2">
                Transaction ID:
              </label>
              <input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Sender Number"
              />
            </div>
          )}
          {paymentMethod === "nagad" && (
            <div className="mt-4">
              <label className="block text-lg font-semibold mb-2">
                Sender Account Number:
              </label>
              <input
                value={senderNumber}
                onChange={(e) => setSenderNumber(Number(e.target.value))}
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Sender Number"
              />

              <label className="block text-lg font-semibold mb-2">
                Transaction ID:
              </label>
              <input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Sender Number"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row justify-between mt-6 border-t pt-4 gap-4">
          <div className="text-right w-full">
            <p className="text-lg font-semibold">
              Subtotal:{"\u09F3"}{" "}
              {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
            {discountPrice !== undefined && discountPrice < totalPrice && (
              <p className="text-lg font-semibold text-red-500">
                Discount: {"\u09F3"}{" "}
                {discountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </p>
            )}
            <p className="text-gray-600">
              Shipping: {"\u09F3"} {shippingPrice}
            </p>
            <p className="text-xl font-bold">
              Total:{"\u09F3"}{" "}
              {(totalPrice - (discountPrice || 0) + (shippingPrice || 0))
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
            <Button
              disabled={
                (!selectAddress && addresses?.length === 0) ||
                !paymentMethod ||
                (["bkash", "nagad"].includes(paymentMethod) && !transactionId)
              }
              onClick={() => setIsOpen(true)}
              className="bg-green-500 text-white w-full md:w-auto mt-2"
            >
              {isAdding ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
