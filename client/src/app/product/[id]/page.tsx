"use client";
import { useGetProductByIdQuery } from "@/api/productApi";
import ImageCarosel from "@/components/ImageCarosel";
import ProductColor from "@/components/ProductColor";
import ProductPrice from "@/components/ProductPrice";
import ProductPriceVariant from "@/components/ProductPriceVariant";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/lib/hooks";
import { addItem } from "@/reducer/cartReducer";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState({
    name: "",
    value: "",
    price: 0,
    stock: 0,
    image: "",
    _id: "",
  });
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading, isError } = useGetProductByIdQuery(id as string);

  useEffect(() => {
    if (data?.priceByVariant?.length > 0) {
      setSelectedProduct(data.priceByVariant[0]);
    }
  }, [data]);

  const addToCart = () => {
    dispatch(
      addItem({
        productId: data._id,
        name: data.name,
        price: selectedProduct._id ? selectedProduct.price : data.price,
        quantity: quantity,
        image: data.image[0],
        variantsName: selectedProduct.value || "",
        size: selectedProduct.value || "",
        color: selectedColor || "",
      })
    );
  };

  const buyNow = () => {
    addToCart();
    router.push("/cart");
  };

  if (!id || isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-bold text-red-500">
        Product Loading...
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-bold text-red-500">
        Product Not Found
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Image Carousel */}
        <div className="w-full">
          <ImageCarosel data={data} />
        </div>

        {/* Right: Product Details */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{data.name}</h1>

          {/* Variant Selection */}
          <ProductPriceVariant
            priceByVariant={data.priceByVariant}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />

          {/* Color Selection */}
          <ProductColor
            colorOptions={data.color}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />

          {/* Product Price */}
          <ProductPrice
            _id={data._id}
            name={data.name}
            value={selectedProduct.value || ""}
            price={selectedProduct.price || data.price}
            stock={selectedProduct.stock || data.stock}
          />

          {/* Quantity Selector */}
          <div className="flex items-center space-x-3">
            <span className="text-lg font-semibold">Quantity:</span>
            <Input
              type="number"
              min="1"
              max={selectedProduct.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 text-center"
            />
          </div>

          {/* Add to Cart Button */}
          <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
            {/* Add to Cart Button */}
            <Button
              onClick={addToCart}
              className="w-full sm:w-auto py-3 px-6 text-lg font-semibold"
              disabled={
                (selectedProduct._id ? selectedProduct.stock : data.stock) <= 0
              }
            >
              {(selectedProduct._id ? selectedProduct.stock : data.stock) > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </Button>

            {/* Buy Now Button */}
            <Button
              variant="outline"
              onClick={buyNow}
              className="w-full sm:w-auto py-3 px-6 text-lg font-semibold border-gray-400 hover:bg-gray-100 transition duration-200"
              disabled={
                (selectedProduct._id ? selectedProduct.stock : data.stock) <= 0
              }
            >
              {(selectedProduct._id ? selectedProduct.stock : data.stock) > 0
                ? "Buy Now"
                : "Out of Stock"}
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 text-gray-700 text-center max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold mb-2">Description:</h2>
        <p
          className="text-sm text-gray-600 text-justify"
          dangerouslySetInnerHTML={{ __html: data?.description }}
        ></p>
      </div>
    </div>
  );
}
