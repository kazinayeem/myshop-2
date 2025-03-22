"use client";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";

export default  function Page() {
   const {id} = useParams<{ id: string }>();
  // const { id } = await params;
  return <div>
    <ProductDetails params={{ id }} />
  </div>;
}
