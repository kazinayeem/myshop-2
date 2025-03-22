"use client";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-bold text-red-500">
        Product Loading{" "}
      </div>
    );
  }
  return (
    <div>
      <ProductDetails params={{ id }} />
    </div>
  );
}
