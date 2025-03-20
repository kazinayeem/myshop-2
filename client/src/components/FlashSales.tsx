"use client";

import { useGetProductsQuery } from "@/api/productApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/lib/types";
import Image from "next/legacy/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductsList() {
  const [countdown, setCountdown] = useState<number>(3600);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const {
    data: { products } = {},
    isLoading,
    isError,
  } = useGetProductsQuery({
    limit: 10,
    page: 1,
    search: "",
  });

  // Format countdown to HH:MM:SS
  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  if (isLoading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[...Array(10)].map((_, index) => (
          <Skeleton key={index} className="w-full h-64 rounded-md" />
        ))}
      </div>
    );

  if (isError)
    return (
      <p className="text-red-500 text-center">Error: Something went wrong!</p>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Countdown Timer */}
      <div className="text-center mb-6 flex flex-row items-center justify-between">
        <h2 className="text-2xl font-bold text-center mb-6">Flash Sales</h2>
        <p className="text-lg font-semibold">
          Time Left: {formatCountdown(countdown)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product: Product) => (
          <Card
            key={product._id}
            className="overflow-hidden h-full group relative"
          >
            <CardHeader className="p-0 relative w-full h-full">
              <Image
                loading="lazy"
                layout="responsive"
                width={400}
                height={300}
                src={product?.image?.[0] || "https://via.placeholder.com/200"}
                alt={product?.name || "Placeholder Image"}
                className="object-cover"
              />
            </CardHeader>
            <CardContent className="flex px-4 flex-col h-full justify-between">
              <div>
                <Link
                  href={`/product/${product._id}`}
                  className="block hover:underline"
                >
                  <CardTitle className="text-lg font-semibold truncate">
                    {product.name}
                  </CardTitle>
                </Link>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-red-500 font-bold">
                    ${product.discountedPrice.toFixed(2)}{" "}
                    <span className="line-through text-gray-400">
                      ${product.price.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-sm">⭐ {product.rating} / 5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View All Product Button */}
      <div className="flex justify-center mt-8">
        <Button variant="destructive" className="w-full max-w-xs">
          <Link href="/product" className="w-full max-w-xs">
            View All Products
          </Link>
        </Button>
      </div>
    </div>
  );
}
