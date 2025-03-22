"use client";
import { useGetBrandsQuery } from "@/api/BrandApi";
import { useGetOrdersQuery } from "@/api/orderApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generateInvoicePDF } from "@/lib/generateInvoice";
import { useAppSelector } from "@/lib/hooks";
import { format } from "date-fns";
import Link from "next/link";

interface Order {
  _id: string;
  status: string;
  totalPrice: number;
  products: Product[];
  paymentStatus: string;
  createdAt: string;
  paymentMethod: string;
  deliveryCharge: number;
  transactionId?: string;
  address: {
    addressLine1: string;
    division: string;
    district: string;
    upazilla: string;
    union: string;
    zipCode: string;
    country: string;
    phoneNumber: string;
  };
}
interface Product {
  _id: string;
  productId: {
    _id: string;
    name: string;
  };
  variant?: string;
  color?: string;
  quantity: number;
  price: number;
}

export default function Page() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: userdata, isLoading, isError } = useGetOrdersQuery(user?.id);

  const { data = [] } = useGetBrandsQuery({});
  const downloadInvoice = (order: Order) => {
    if (!order.address) {
      alert("Order address is missing!");
      return;
    }

    generateInvoicePDF({
      logo: data[0]?.logo || "",
      brandName: data[0]?.name || "My Shop",
      name: user?.username || "Customer",
      email: user?.email || "",
      userPhone: order.address.phoneNumber || "",
      order,
      address: order.address,
      totalPrice: order.totalPrice,
      transactionId: order.transactionId || "N/A",
      paymentMethod: order.paymentMethod || "Unknown",
      paidAmount: order.totalPrice,
      date: order.createdAt,
      deliveryCharge: order.deliveryCharge || 0,
      variant: order.products.map((product) => product.variant || "N/A"),
      color: order.products.map((product) => product.color || "N/A"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        Error loading orders. Please try again later.
      </div>
    );
  }

  if (!userdata || userdata.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        No orders found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Order History
      </h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto w-full">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Download Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userdata.map((order: Order) => {
                  return (
                    <TableRow key={order._id} className="text-sm md:text-base">
                      <TableCell>{order._id}</TableCell>
                      <TableCell>
                        <Badge
                          className={`px-2 py-1 text-xs md:text-sm ${
                            order.status === "pending"
                              ? "bg-yellow-500"
                              : order.status === "shipped"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <ul className="list-disc pl-4 text-xs md:text-sm">
                          {order.products.map((prod) => (
                            <Link
                              key={prod._id}
                              href={`/product/${prod.productId._id}`}
                            >
                              <li key={prod._id}>
                                <span className="font-semibold">
                                  {prod.productId?.name.slice(0, 20) ??
                                    "Unknown Product"}
                                </span>
                                {"....."}- {prod.price} (x{prod.quantity})
                              </li>
                            </Link>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`px-2 py-1 text-xs md:text-sm ${
                            order.paymentStatus === "pending"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        >
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="px-2 py-1 text-xs md:text-sm bg-gray-500">
                          {order.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.createdAt), "PPP")}
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => downloadInvoice(order)}>
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
