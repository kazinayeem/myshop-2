"use client";
import { useGetUserByIdQuery } from "@/api/userApi";
import { useAppSelector } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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

  const { username, email, mobileNumber, isAdmin, createdAt, updatedAt } = data;

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
    </div>
  );
}
