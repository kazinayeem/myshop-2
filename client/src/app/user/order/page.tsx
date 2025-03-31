"use client";
import { useGetBrandsQuery } from "@/api/BrandApi";
import { useGetOrdersQuery } from "@/api/orderApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col space-y-3">
        <h2 className="text-3xl font-bold mb-6">Profile</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-screen">
              <p className="text-red-500">Error fetching user data.</p>
            </div>
          </CardContent>
        </Card>
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
    <div className="container mx-auto max-w-screen-xl px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Order History
      </h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Download Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userdata.map((order: Order) => {
                  return (
                    <TableRow key={order._id} className="text-sm md:text-base">
                      <TableCell className="font-semibold hover:text-blue-500 hover:underline">
                        <Link href={`/user/order/${order._id}`}>
                          {order._id.slice(0, 10)}...
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`px-2 py-1 text-xs md:text-sm ${
                            {
                              pending: "bg-yellow-500",
                              shipped: "bg-blue-500",
                              delivered: "bg-green-500",
                              cancelled: "bg-red-500",
                              returned: "bg-orange-500",
                              refunded: "bg-purple-500",
                              failed: "bg-gray-500",
                              completed: "bg-teal-500",
                              processing: "bg-indigo-500",
                            }[order.status] || "bg-gray-400"
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
                                  {prod.productId?.name.slice(0, 15) ??
                                    "Unknown Product"}
                                </span>
                                {".."}- {prod.price} (x{prod.quantity})
                              </li>
                            </Link>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`px-2 py-1 text-xs md:text-sm ${
                            {
                              paid: "bg-green-500",
                              pending: "bg-yellow-500",
                              failed: "bg-red-500",
                            }[order.paymentStatus] || "bg-gray-400"
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
