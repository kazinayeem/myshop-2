"use client";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import Image from "next/image";
import React from "react";

export default function Page() {
  const cartItem = useAppSelector((state: RootState) => state.cart.items);
  const totalQuantity = useAppSelector(
    (state: RootState) => state.cart.totalQuantity
  );
  const totalPrice = useAppSelector(
    (state: RootState) => state.cart.totalPrice
  );
  const totalItems = cartItem.reduce((acc, item) => acc + item.quantity, 0);
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-4">Shopping Cart</h1>
      <div className="flex flex-col items-center mt-8">
        {cartItem.length === 0 ? (
          <p className="text-lg">Your cart is empty.</p>
        ) : (
          cartItem.map((item) => (
            <div
              key={item.id}
              className="flex items-center mb-4 w-full max-w-md p-4 border rounded-lg shadow-md h-14 "
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
              )}
              <div className="ml-4">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-600">Price: ${item.price}</p>
                {item.size && (
                  <p className="text-gray-600">
                    {item.variantsName} {item.size}
                  </p>
                )}
                {item.color && (
                  <p className="text-gray-600">Color: {item.color}</p>
                )}
              </div>
            </div>
          ))
        )}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Total Items: {totalItems}</h2>
          <h2 className="text-lg font-semibold">Total Price: ${totalPrice}</h2>
          <h2 className="text-lg font-semibold">
            Total Quantity: {totalQuantity}
          </h2>
        </div>
      </div>
    </div>
  );
}
