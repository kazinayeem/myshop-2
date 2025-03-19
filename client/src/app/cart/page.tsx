"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import {
  removeItem,
  setDiscountPrice,
  updateItemQuantity,
} from "@/reducer/cartReducer";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { CiSquareRemove } from "react-icons/ci";

export default function Page() {
  const [copun, setCopun] = useState<string>("");

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
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>
      <div className="w-full max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Product</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Size</th>
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
                <tr key={item.id} className="border">
                  <td className="p-3 border flex items-center gap-2">
                    {item.image && (
                      <Link href={`/product/${item.id}`} passHref>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover cursor-pointer"
                        />
                      </Link>
                    )}
                    <Link href={`/product/${item.id}`} passHref>
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
                        onClick={() => updateCart(item.id, item.quantity - 1)}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="text-lg font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateCart(item.id, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </td>

                  <td className="p-3 border">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItemCart(item.id)}
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
            <input
              value={copun}
              onChange={handleCouponChange}
              type="text"
              placeholder="Coupon Code"
              className="border p-2 rounded flex-grow md:max-w-xs"
            />
            <Button
              onClick={handleApplyCoupon}
              className="bg-red-500 text-white w-full md:w-auto"
            >
              Apply Coupon
            </Button>
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold">
              Subtotal: ${totalPrice.toFixed(2)}
            </p>
            {/* if copund show this */}
            {afterDiscountPrice !== undefined && afterDiscountPrice < totalPrice && (
              <p className="text-lg font-semibold text-red-500">
                 Discount: {afterDiscountPrice.toFixed(2)}
              </p>
            )}
            <p className="text-gray-600">Shipping: Free</p>
            <p className="text-xl font-bold">
              Total: {afterDiscountPrice ? afterDiscountPrice.toFixed(2) : totalPrice.toFixed(2)}
            </p>
            <Button className="bg-red-500 text-white w-full md:w-auto mt-2">
              Process to checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
