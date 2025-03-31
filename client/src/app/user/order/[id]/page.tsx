"use client";

import { useGetordersByIdQuery } from "@/api/orderApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
interface Product {
  _id: string;
  productId: {
    name: string;
  };
  variant?: string;
  color?: string;
  quantity: number;
  price: number;
}

export default function Page() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetordersByIdQuery(id);

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Failed to load order details.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Order ID:</strong> {data?._id}
          </p>
          <p>
            <strong>Status:</strong> {data?.status}
          </p>
          <p>
            <strong>Payment Status:</strong> {data?.paymentStatus}
          </p>
          <p>
            <strong>Paid Amount:</strong> {data?.paidAmount} Taka
          </p>
          <p>
            <strong>Due Amount:</strong> {data?.dueAmount} Taka
          </p>
          <p>
            <strong>Payment Method:</strong> {data?.paymentMethod}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ordered Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data?.products.map((product: Product) => (
            <div key={product._id} className="p-2 border rounded-lg">
              <p>
                <strong>Product:</strong> {product.productId.name}
              </p>
              <p>
                <strong>Price:</strong> {product.price} Taka
              </p>
              <p>
                <strong>Quantity:</strong> {product.quantity}
              </p>
              {product.color && (
                <p>
                  <strong>Color:</strong> {product.color}
                </p>
              )}
              {product.variant && (
                <p>
                  <strong>Variant:</strong> {product.variant}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
