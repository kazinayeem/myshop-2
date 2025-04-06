import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  discountPercent: number;
  priceByVariant: {
    _id: string;
    variant: string;
    price: number;
  }[];
  image: string[];
  category: {
    _id: string;
    name: string;
    image: string;
  };
  stock: number;
  rating: number;
}

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Fetch category details using the id
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_PORT}/categories/${id}`,
    {
      cache: "no-store",
    }
  );
  const data = await response.json();

  if (!data) {
    return <div>Category not found</div>;
  }
  if (!data.product || data.product.length === 0) {
    return (
      <div className="container m-auto px-4 py-8 text-center text-gray-500">
        No products found in this category
      </div>
    );
  }

  return (
    <div className="container m-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{data.name}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {data?.product?.map((product: Product) => (
          <Card
            key={product._id}
            className="overflow-hidden h-full group relative"
          >
            <CardHeader className="p-0 relative w-full h-full">
              <div className="relative w-full h-48">
                <Image
                  src={product?.image?.[0] || "https://via.placeholder.com/200"}
                  alt={product?.name || "Placeholder Image"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>
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
                    {"\u09F3"}{" "}
                    {product?.priceByVariant?.[0]?.price
                      ? product.priceByVariant[0].price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : product.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    <span className="line-through text-gray-400">
                      {"\u09F3"}
                      {product?.priceByVariant?.[0]?.price
                        ? product.priceByVariant[0].price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : product.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                  </p>
                  <p className="text-sm">⭐ {product.rating} / 5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
