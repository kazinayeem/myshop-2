import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/legacy/image";
import Link from "next/link";
import React, { Suspense } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  discountPercent: number;
  image: string[];
  category: {
    _id: string;
    name: string;
    image: string;
  };
  stock: number;
  rating: number;
}

export default async function Page() {
  const response = await fetch(
    "https://myshop-2-production.up.railway.app/api/products?limit=99"
  );
  const data = await response.json();
  const products: Product[] = data.products || [];

  return (
    <div className="container m-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <Suspense fallback={<div>Loading...</div>}>
        {products?.map((product: Product) => (
          <Card
            key={product._id}
            className="overflow-hidden h-full group relative"
          >
            <CardHeader className="p-0 relative">
              <Image
                loading="lazy"
                width={100}
                height={192}
                src={product.image?.[0] || "https://via.placeholder.com/200"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
             
            </CardHeader>
            <CardContent className="flex px-4 flex-col h-full justify-between">
              <div>
                <Link href={`/product/${product._id}`} className="block">
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
        </Suspense>
      </div>
    </div>
  );
}
