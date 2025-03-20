"use client";

import {
  useGetAddressQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
} from "@/api/addressApi";
import { useAppSelector } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner"; // For notifications
type Address = {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
};

export default function AddressPage() {
  const user = useAppSelector((state) => state.auth.user);

  const { data: addresses, isLoading } = useGetAddressQuery(user?.id);
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const deleteAddressHandler = async (id: string) => {
    try {
      await deleteAddress(id).unwrap();
      toast.success("Address deleted successfully!");
    } catch {
      toast.error("Failed to delete address.");
    }
  };
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await addAddress({ userId: user?.id, ...formData }).unwrap();
      toast.success("Address added successfully!");
      setOpen(false);
    } catch {
      toast.error("Failed to add address.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Manage Addresses</h2>

      {/* Display Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses && addresses.length > 0 ? (
          addresses.map((addr: Address) => (
            <Card key={addr._id} className="border p-4">
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
              {/* delete button */}
              <div className="flex justify-end mt-4">
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteAddressHandler(addr._id);
                  }}
                >
                  Delete Address
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p>No addresses found.</p>
        )}
      </div>

      {/* Add Address Button */}
      <div className="mt-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Address Line 1</Label>
                <Input
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Address Line 2</Label>
                <Input
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>City</Label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Zip Code</Label>
                <Input
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isAdding}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isAdding ? "Adding..." : "Add Address"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
