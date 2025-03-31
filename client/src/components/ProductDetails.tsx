"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/hooks";
import { addItem } from "@/reducer/cartReducer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: Variant;
  }>({});
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<number>(0);

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
            setSelectedStock(Object.values(initialVariants)[0]?.stock || 0);
            setCurrentImage(
              Object.values(initialVariants)[0]?.image || data.image[0]
            );
          } else {
            setSelectedStock(data.stock);
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

  const addToCart = () => {
    if (selectedStock <= 0) {
      alert("Out of stock");
      return;
    }
    const variantKey = Object.keys(selectedVariants)[0];
    const variantValue = selectedVariants[variantKey]?.value;
    dispatch(
      addItem({
        productId: product._id,
        name: product.name,
        price: finalPrice,
        quantity: quantity,
        image: currentImage || product.image[0],
        variantsName: variantValue,
        size: variantValue,
        color: selectedColor || selectedVariants?.Color?.value,
      })
    );
  };

  const buynow = () => {
    if (selectedStock <= 0) {
      alert("Out of stock");
      return;
    }
    addToCart();
    router.push("/cart");
  };

  return (
    <div className="container mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <div className="w-full">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="text-2xl font-semibold text-gray-900">
          {"\u09F3"}{" "}
          {finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          {product.discountPercent > 0 && selectedVariantPrice === 0 && (
            <span className="text-gray-500 line-through text-lg">
              {"\u09F3"}{" "}
              {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </span>
          )}
        </div>

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
                              setSelectedStock(variant.stock);
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

        <p
          className={`mt-2 ${
            selectedStock > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          In stock: {selectedStock} items
        </p>
        <div className="flex items-center justify-center border p-2 rounded-lg w-40">
          <Button
            variant="ghost"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <ChevronLeft size={18} />
          </Button>
          <span className="px-4">{quantity}</span>
          <Button
            variant="ghost"
            onClick={() => {
              setQuantity((prev) => {
                if (prev < 10) {
                  return prev + 1;
                } else {
                  alert("Maximum quantity is 10!");
                  return prev;
                }
              });
            }}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <Button
            variant={"destructive"}
            onClick={buynow}
            disabled={selectedStock <= 0}
          >
            Buy Now
          </Button>
          <Button
            variant={"secondary"}
            onClick={addToCart}
            disabled={selectedStock <= 0}
          >
            Add to cart
          </Button>
        </div>
        {/* product description as a html parse */}
      </div>
      <div className="mt-4 text-gray-700 w-full flex justify-center items-center">
        <div className="w-full max-w-3xl px-4 sm:px-6 md:px-8">
          <h2 className="text-lg font-semibold text-center">Description:</h2>
          <div className="w-full flex justify-center">
            <p
              className="m-auto text-sm text-gray-600 text-justify max-w-3xl"
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></p>
          </div>
        </div>
      </div>
    </div>
  );
}
