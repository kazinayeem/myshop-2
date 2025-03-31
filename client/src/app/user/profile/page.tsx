"use client";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/api/userApi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/lib/hooks";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError, isSuccess } = useGetUserByIdQuery(user?.id);
  const [updateUser] = useUpdateUserMutation();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateUser({ id: user?.id, ...formData });
    setEditMode(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
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
    role,
    createdAt,
    updatedAt,
    profilePic,
  } = data;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Profile</h2>
      {isSuccess && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Avatar>
              <AvatarImage src={profilePic} />
              <AvatarFallback>{username}</AvatarFallback>
            </Avatar>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <strong>ID:</strong> {user?.id}
              </div>
              <div>
                <strong>Username:</strong>{" "}
                {editMode ? (
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                ) : (
                  username
                )}
              </div>
              <div>
                <strong>Email:</strong>{" "}
                {editMode ? (
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  email
                )}
              </div>
              <div>
                <strong>Mobile:</strong>{" "}
                {editMode ? (
                  <Input
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                  />
                ) : (
                  mobileNumber
                )}
              </div>
              <div>
                <strong>Role:</strong>
                <Badge className={`ml-2 bg-blue-500`}>{role}</Badge>
              </div>
              <div>
                <strong>Created At:</strong>{" "}
                {format(new Date(createdAt), "PPP")}
              </div>
              <div>
                <strong>Updated At:</strong>{" "}
                {format(new Date(updatedAt), "PPP")}
              </div>
            </div>
          </CardContent>
          <div className="flex justify-end p-4 space-x-2">
            {editMode ? (
              <>
                <Button onClick={handleSave} variant="default">
                  Save
                </Button>
                <Button onClick={() => setEditMode(false)} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setEditMode(true);
                  setFormData({ username, email, mobileNumber });
                }}
                variant="destructive"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
