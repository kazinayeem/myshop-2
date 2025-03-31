interface ProductType {
  name: string;
  value: string;
  price: number;
  stock: number;
  _id: string;
}

interface ProductPriceProps extends ProductType {
  selectedProduct?: ProductType;
}

export default function ProductPrice({
  _id,
  name,
  value,
  price,
  stock,

  selectedProduct,
}: ProductPriceProps) {
  const product = selectedProduct?._id
    ? selectedProduct
    : { _id, name, value, price, stock };

  return (
    <div className="space-y-2">
      {/* Price Display */}
      <p className="text-2xl font-bold text-primary">
        ৳{product.price.toLocaleString()}
      </p>

      {/* Stock Status */}
      <p
        className={`text-sm ${
          product.stock > 0 ? "text-green-600" : "text-red-500"
        }`}
      >
        {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
      </p>
    </div>
  );
}
