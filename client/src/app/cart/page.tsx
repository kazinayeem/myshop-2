"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import {
  removeItem,
  setDiscountPrice,
  setShippingPrice,
  updateItemQuantity,
} from "@/reducer/cartReducer";
import { Minus, Plus } from "lucide-react";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CiSquareRemove } from "react-icons/ci";

export default function Page() {
  const [copun, setCopun] = useState<string>("");
  const [Shipping, setShipping] = useState<number>(0);

  const {
    items: cartItems,
    totalPrice,
    discountPrice: afterDiscountPrice,
  } = useAppSelector((state: RootState) => state.cart);

  const dispatch = useAppDispatch();

  const updateCart = (id: string, quantity: number) => {
    if (quantity >= 1) {
      dispatch(updateItemQuantity({ id, quantity }));
    }
  };

  const removeItemCart = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCopun(e.target.value);
  };

  const handleApplyCoupon = () => {
    if (copun === "DISCOUNT10") {
      const discount = totalPrice * 0.1;
      const discountedPrice = totalPrice - discount;
      dispatch(setDiscountPrice(discountedPrice));
    } else if (copun === "DISCOUNT20") {
      const discount = totalPrice * 0.2;
      const discountedPrice = totalPrice - discount;
      dispatch(setDiscountPrice(discountedPrice));
    } else {
      alert("Invalid coupon code");
    }
  };

  const router = useRouter();
  const processToCheckout = () => {
    if (cartItems.length === 0) {
      alert(
        "Your cart is empty. Please add items to your cart before checking out."
      );
      return;
    }
    if (Shipping === 0) {
      alert("Please select a shipping option.");
      return;
    }
    router.push("/cart/checkout");
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>
      <div className="w-full max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Product</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Size/Variant</th>
              <th className="p-3 border">Color</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Subtotal</th>
              <th className="p-3 border">Remove</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-600">
                  Your cart is empty.
                </td>
              </tr>
            ) : (
              cartItems.map((item) => (
                <tr key={item.productId} className="border">
                  <td className="p-3 border flex items-center gap-2">
                    {item.image && (
                      <Link href={`/product/${item.productId}`} passHref>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover cursor-pointer"
                        />
                      </Link>
                    )}
                    <Link href={`/product/${item.productId}`} passHref>
                      <span className="cursor-pointer hover:underline">
                        {item.name.slice(0, 20)}...
                      </span>
                    </Link>
                  </td>
                  <td className="p-3 border">{item.price}</td>
                  <td className="p-3 border">{item.size}</td>
                  <td className="p-3 border">{item.color || "NO"}</td>
                  <td className="p-3 border">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateCart(item.productId, item.quantity - 1)
                        }
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="text-lg font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateCart(item.productId, item.quantity + 1)
                        }
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </td>

                  <td className="p-3 border">
                    {(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItemCart(item.productId)}
                    >
                      <CiSquareRemove size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex flex-col md:flex-row justify-between mt-6 border-t pt-4 gap-4">
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <Input
              value={copun}
              onChange={handleCouponChange}
              type="text"
              placeholder="Coupon Code"
              className="border p-2 rounded flex-grow md:max-w-xs"
            />
            <Button
              disabled={cartItems.length === 0 || copun.length === 0}
              variant="outline"
              onClick={handleApplyCoupon}
              className="bg-red-500 text-white w-full md:w-auto"
            >
              Apply Coupon
            </Button>
          </div>
          {/* give ints copun */}

          <div className="text-right">
            <p className="text-lg font-semibold">
              Subtotal: {totalPrice.toFixed(2)}
            </p>
            {/* if copund show this */}
            {afterDiscountPrice !== undefined &&
              afterDiscountPrice < totalPrice && (
                <p className="text-lg font-semibold text-red-500">
                  Discount: {afterDiscountPrice.toFixed(2)}
                </p>
              )}

            {/* select shipping fees option if dhaka 60 and outside dhaak 120 */}
            <Select
              defaultValue="0"
              onValueChange={(value) => {
                setShipping(Number(value));
                dispatch(setShippingPrice(Number(value)));
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Select Shipping</SelectItem>
                <SelectItem value="60">Inside Dhaka - 60</SelectItem>
                <SelectItem value="120">Outside Dhaka - 120</SelectItem>
              </SelectContent>
            </Select>

            <p className="text-lg font-semibold mt-2">Shipping: {Shipping}</p>

            <p className="text-xl font-bold">
              Total:{" "}
              {afterDiscountPrice
                ? afterDiscountPrice.toFixed(2)
                : totalPrice.toFixed(2)}
            </p>
            {/* price with shipping charge */}
            <p className="text-lg font-semibold mt-2">
              Total with Shipping:{" "}
              {afterDiscountPrice
                ? (afterDiscountPrice + Shipping).toFixed(2)
                : (totalPrice + Shipping).toFixed(2)}
            </p>

            <Button
              onClick={processToCheckout}
              disabled={cartItems.length === 0}
              className="bg-red-500 text-white w-full md:w-auto mt-2"
            >
              Process to checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
