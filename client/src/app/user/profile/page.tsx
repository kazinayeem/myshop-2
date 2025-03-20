"use client";
import { useGetUserByIdQuery } from "@/api/userApi";
import { useAppSelector } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Order = {
  _id: string;
  status: string;
  totalPrice: number;
  products: Product[];
};

type Product = {
  _id: string;
  productId: {
    name: string;
  };
  quantity: number;
};

type Address = {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
};

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useGetUserByIdQuery(user?.id);

  // Show a loading message while the data is loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Show an error message if there is an issue fetching data
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading profile data. Please try again later.
      </div>
    );
  }

  // Ensure data is available before trying to destructure it
  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        No user data found.
      </div>
    );
  }

  const {
    username,
    email,
    mobileNumber,
    isAdmin,
    createdAt,
    updatedAt,
    address,
    orderhistory,
  } = data;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Profile</h2>

      {/* User Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <strong>id:</strong> {user?.id}
            </div>
            <div>
              <strong>Username:</strong> {username}
            </div>
            <div>
              <strong>Email:</strong> {email}
            </div>
            <div>
              <strong>Mobile:</strong> {mobileNumber}
            </div>
            <div>
              <strong>Role:</strong>
              <Badge
                className={`ml-2 ${isAdmin ? "bg-red-500" : "bg-blue-500"}`}
              >
                {isAdmin ? "Admin" : "User"}
              </Badge>
            </div>
            <div>
              <strong>Created At:</strong> {format(new Date(createdAt), "PPP")}
            </div>
            <div>
              <strong>Updated At:</strong> {format(new Date(updatedAt), "PPP")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent>
          {address.length > 0 ? (
            <div className="space-y-4">
              {address.map((addr: Address) => (
                <div key={addr._id} className="border rounded-lg p-4">
                  <p>
                    <strong>Street:</strong> {addr.addressLine1},{" "}
                    {addr.addressLine2}
                  </p>
                  <p>
                    <strong>City:</strong> {addr.city}, {addr.state}
                  </p>
                  <p>
                    <strong>Zip Code:</strong> {addr.zipCode}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No address available</p>
          )}
        </CardContent>
      </Card>

      {/* Order History Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {orderhistory.length > 0 ? (
            <ScrollArea className="max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Products</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderhistory.map((order: Order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            order.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${order.totalPrice}</TableCell>
                      <TableCell>
                        <ul className="list-disc pl-4">
                          {order.products.map((prod: Product) => (
                            <li key={prod._id}>
                              {prod.productId.name} (x{prod.quantity})
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <p>No orders placed</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
