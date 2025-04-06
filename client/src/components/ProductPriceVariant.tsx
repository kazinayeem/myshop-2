"use client";

import { CheckCircle, ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface ProductPriceVariantProps {
  priceByVariant: {
    _id: string;
    name: string;
    value: string;
    price: number;
    stock: number;
    image: string;
  }[];
  selectedProduct: {
    _id: string;
    name: string;
    value: string;
    price: number;
    stock: number;
    image: string;
  };
  setSelectedProduct: (product: {
    _id: string;
    name: string;
    value: string;
    price: number;
    stock: number;
    image: string;
  }) => void;
}

export default function ProductPriceVariant({
  priceByVariant,
  selectedProduct,
  setSelectedProduct,
}: ProductPriceVariantProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {priceByVariant.length > 0 &&
        priceByVariant.map((d) => (
          <Card
            key={d._id}
            className={`relative p-3 border-2 rounded-lg cursor-pointer transition duration-200 ease-in-out ${
              selectedProduct._id === d._id
                ? "border-blue-500"
                : "border-gray-300"
            }`}
            onClick={() => setSelectedProduct(d)}
          >
            {selectedProduct._id === d._id && (
              <div className="absolute top-2 right-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
              </div>
            )}

            <div className="flex flex-col items-center">
              {d.image ? (
                <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <ImageIcon className="w-16 h-16 text-gray-400" />
              )}
              <div className="mt-2 text-center">
                <p className="text-sm font-semibold">{d.name}</p>
                <p className="text-sm text-blue-500">{d.value}</p>
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
}
