"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/hooks";
import { addItem } from "@/reducer/cartReducer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";

interface Variant {
  name: string;
  value: string;
  price: number;
  stock: number;
  image?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  discountPercent: number;
  image: string[];
  stock: number;
  color?: string[];
  returnable: boolean;
  priceByVariant?: Variant[];
}

export default function ProductDetails({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: Variant;
  }>({});
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/products/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setCurrentImage(data.image?.[0] || null);

          if (data.priceByVariant && data.priceByVariant.length > 0) {
            const initialVariants: { [key: string]: Variant } = {};
            data.priceByVariant.forEach((variant: Variant) => {
              if (!initialVariants[variant.name]) {
                initialVariants[variant.name] = variant;
              }
            });
            setSelectedVariants(initialVariants);
            setCurrentImage(
              Object.values(initialVariants)[0]?.image || data.image[0]
            );
          }
        })
        .catch((error) => console.error("Error fetching product:", error));
    }
  }, [params.id]);

  if (!product) return <p className="text-center">Loading...</p>;

  const selectedVariantPrice = Object.values(selectedVariants).reduce(
    (sum, v) => sum + v.price,
    0
  );
  const finalPrice =
    selectedVariantPrice > 0 ? selectedVariantPrice : product.discountedPrice;
  const selectedStock = Object.values(selectedVariants).reduce(
    (minStock, v) => Math.min(minStock, v.stock),
    product.stock
  );

  const addtoCart = () => {
    const variantKey = Object.keys(selectedVariants)[0];
    const variantValue = selectedVariants[variantKey]?.value;
    console.log("Selected Variants:", variantValue);

    if (selectedStock <= 0) {
      alert("Out of stock");
      return;
    }

    dispatch(
      addItem({
        id: product._id,
        name: product.name,
        price: finalPrice,
        quantity: quantity,
        image: currentImage || product.image[0],
        variantsName: variantKey,
        size: variantValue,
        color: selectedColor || selectedVariants?.Color?.value,
      })
    );
  };

  const buyNow = () => {
    const productToBuy = {
      productId: product._id,
      quantity,
      selectedVariants,
      color: selectedColor,
    };
    console.log("Product to buy:", productToBuy);

    alert(JSON.stringify(productToBuy, null, 2));
  };

  return (
    <div className="container mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Side - Product Images */}
      <div className="flex flex-col items-center w-full">
        <div className="border rounded-lg p-4 w-full max-w-[400px]">
          {currentImage && (
            <Image
              layout="responsive"
              src={currentImage}
              width={400}
              height={400}
              alt={product.name}
              className="rounded-lg"
            />
          )}
        </div>
        <div className="flex gap-2 mt-4 overflow-auto">
          {product.image.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(img)}
              className="w-16"
            >
              <Image
                src={img}
                width={80}
                height={80}
                alt="Thumbnail"
                className={`rounded-lg border ${
                  currentImage === img ? "border-red-500" : ""
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Right Side - Product Details */}
      <div className="w-full">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="text-2xl font-semibold text-gray-900">
          ${finalPrice}{" "}
          {product.discountPercent > 0 && selectedVariantPrice === 0 && (
            <span className="text-gray-500 line-through text-lg">
              ${product.price}
            </span>
          )}
        </div>

        {/* Color Selection */}
        {product.color && product.color.length > 0 && (
          <div className="mt-4">
            <label className="block font-medium text-gray-700">COLOR:</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.color.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border ${
                    selectedColor === color
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                ></button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Variant Selection */}
        {product.priceByVariant && product.priceByVariant.length > 0 && (
          <div className="mt-4 space-y-4">
            {Array.from(new Set(product.priceByVariant.map((v) => v.name))).map(
              (variantType) => (
                <div key={variantType}>
                  <label className="block font-medium text-gray-700">
                    {variantType.toUpperCase()}:
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.priceByVariant &&
                      product.priceByVariant
                        .filter((variant) => variant.name === variantType)
                        .map((variant) => (
                          <button
                            key={`${variantType}-${variant.value}`}
                            onClick={() => {
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [variant.name]: variant,
                              }));
                              setCurrentImage(
                                variant.image || product.image[0]
                              );
                            }}
                            className={`p-2 border rounded-lg ${
                              selectedVariants[variant.name]?.value ===
                              variant.value
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            {variant.value}
                          </button>
                        ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <div className="flex items-center justify-center border p-2 rounded-lg w-40">
          <Button
            variant="ghost"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <ChevronLeft size={18} />
          </Button>
          <span className="px-4">{quantity}</span>
          <Button variant="ghost" onClick={() => setQuantity(quantity + 1)}>
            <ChevronRight size={18} />
          </Button>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <Button variant={"destructive"} onClick={buyNow}>
            Buy Now
          </Button>
          <Button variant={"secondary"} onClick={addtoCart}>
            Add to cart
          </Button>
        </div>
      </div>
      <div
        className="mt-4 text-gray-700"
        dangerouslySetInnerHTML={{ __html: product.description }}
      />
    </div>
  );
}
