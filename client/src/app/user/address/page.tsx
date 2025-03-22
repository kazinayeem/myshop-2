"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetAddressQuery,
} from "@/api/addressApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // For notifications

type Address = {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber?: string;
  country?: string;
  division?: string; // Added division property
  district?: string; // Added district property
  upazilla?: string; // Added upazilla property
  union?: string; // Added union property
  userId: string;
};

export default function AddressPage() {
  const [divisions, setDivisions] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedDivision, setSelectedDivision] = useState("");
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [upazillas, setUpazillas] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedUpazilla, setSelectedUpazilla] = useState("");
  const [unions, setUnions] = useState<{ id: string; name: string }[]>([]);
  const [selectedUnion, setSelectedUnion] = useState("");

  // Fetch division data
  useEffect(() => {
    const fetchDivisions = async () => {
      const response = await fetch("https://bdapi.vercel.app/api/v.1/division");
      const data = await response.json();
      setDivisions(data.data);
    };
    fetchDivisions();
  }, []);

  // Fetch districts based on selected division
  useEffect(() => {
    if (!selectedDivision) return;
    const fetchDistricts = async () => {
      const response = await fetch(
        `https://bdapi.vercel.app/api/v.1/district/${selectedDivision}`
      );
      const data = await response.json();
      setDistricts(data.data);
    };
    fetchDistricts();
  }, [selectedDivision]);

  // Fetch upazillas based on selected district
  useEffect(() => {
    if (!selectedDistrict) return;
    const fetchUpazillas = async () => {
      const response = await fetch(
        `https://bdapi.vercel.app/api/v.1/upazilla/${selectedDistrict}`
      );
      const data = await response.json();
      setUpazillas(data.data);
    };
    fetchUpazillas();
  }, [selectedDistrict]);

  // Fetch unions based on selected upazilla
  useEffect(() => {
    if (!selectedUpazilla) return;
    const fetchUnions = async () => {
      const response = await fetch(
        `https://bdapi.vercel.app/api/v.1/union/${selectedUpazilla}`
      );
      const data = await response.json();
      setUnions(data.data);
    };
    fetchUnions();
  }, [selectedUpazilla]);

  const user = useAppSelector((state) => state.auth.user);
  const { data: addresses, isLoading, refetch } = useGetAddressQuery(user?.id);
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const deleteAddressHandler = async (id: string) => {
    try {
      await deleteAddress(id).unwrap();
      refetch();
    } catch {
      toast.error("Failed to delete address.");
    }
  };

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    divisons: selectedDivision,
    districts: selectedDistrict,
    upazillas: selectedUpazilla,
    unions: selectedUnion,
    zipCode: "",
    country: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // Validate the form data here if needed
      if (
        !formData.addressLine1 ||
        !formData.zipCode ||
        formData.addressLine2 === ""
      ) {
        alert("Please fill in all required fields.");
        return;
      }
      // Prepare the data to be sent with only the name fields
      const addressData = {
        userId: user?.id,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        zipCode: formData.zipCode,
        country: formData.country || "Bangladesh",
        phoneNumber: formData.phoneNumber,
        division:
          divisions.find((division) => division.id === selectedDivision)
            ?.name || "",
        district:
          districts.find((district) => district.id === selectedDistrict)
            ?.name || "",
        upazilla:
          upazillas.find((upazilla) => upazilla.id === selectedUpazilla)
            ?.name || "",
        union: unions.find((union) => union.id === selectedUnion)?.name || "",
      };
      await addAddress(addressData).unwrap();
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
                  <strong>Country:</strong> {addr.country || "Bangladesh"}
                </p>
                <p>
                  <strong>Street:</strong> {addr.addressLine1},{" "}
                  {addr.addressLine2}
                </p>
                <p>
                  <strong>Zip Code:</strong> {addr.zipCode}
                </p>
                {addr.phoneNumber && (
                  <p>
                    <strong>Phone:</strong> {addr.phoneNumber}
                  </p>
                )}
                <p>
                  <strong>Division:</strong> {addr.division}
                </p>
                <p>
                  <strong>District:</strong> {addr.district}
                </p>
                <p>
                  <strong>Upazilla:</strong> {addr.upazilla}
                </p>
                <p>
                  <strong>Union:</strong> {addr.union}
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
                <Label>Phone Number</Label>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
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

              <div>
                <Label>Zip Code</Label>
                <Input
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Select Division, District, Upazilla, and Union */}
              <div>
                <Label>Division</Label>
                <Select
                  onValueChange={(value) => {
                    setSelectedDivision(value);
                    setSelectedDistrict("");
                    setSelectedUpazilla("");
                    setSelectedUnion("");
                  }}
                  value={selectedDivision}
                  defaultValue="select"
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">Select Division</SelectItem>
                    {divisions.map((division) => (
                      <SelectItem key={division.id} value={division.id}>
                        {division.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>District</Label>
                <Select
                  onValueChange={(value) => {
                    setSelectedDistrict(value);
                    setSelectedUpazilla("");
                    setSelectedUnion("");
                  }}
                  defaultValue="select"
                  value={selectedDistrict}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">Select District</SelectItem>
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={district.id}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Upazilla</Label>
                <Select
                  onValueChange={(value) => {
                    setSelectedUpazilla(value);
                    setSelectedUnion("");
                  }}
                  defaultValue="select"
                  value={selectedUpazilla}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">Select Upazilla</SelectItem>
                    {upazillas.map((upazilla) => (
                      <SelectItem key={upazilla.id} value={upazilla.id}>
                        {upazilla.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Union</Label>
                <Select
                  onValueChange={(value) => {
                    setSelectedUnion(value);
                  }}
                  defaultValue="select"
                  value={selectedUnion}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">Select Union</SelectItem>
                    {unions.map((union) => (
                      <SelectItem key={union.id} value={union.id}>
                        {union.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
