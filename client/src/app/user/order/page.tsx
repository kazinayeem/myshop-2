"use client";
import { useGetOrdersQuery } from "@/api/orderApi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppSelector } from "@/lib/hooks";
import { format } from "date-fns";
interface Order {
  _id: string;
  status: string;
  totalPrice: number;
  products: Product[];
  paymentStatus: string;
  createdAt: string;
}
interface Product {
  _id: string;
  productId: {
    name: string;
  };
  quantity: number;
  price: number;
}
export default function Page() {
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useGetOrdersQuery(user?.id);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading orders. Please try again later.
      </div>
    );
  }

  // Ensure data is available
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        No orders found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Order History</h2>

      {/* Orders Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((order: Order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          order.status === "pending"
                            ? "bg-yellow-500"
                            : order.status === "shipped"
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${order.totalPrice}</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4">
                        {order.products.map((prod) => (
                          <li key={prod._id}>
                            <span className="font-semibold">
                              {prod.productId?.name ?? "Unknown Product"}
                            </span>{" "}
                            - ${prod.price} (x{prod.quantity})
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          order.paymentStatus === "pending"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), "PPP")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
