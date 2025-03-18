import ProductDetails from "@/components/ProductDetails";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>
    <ProductDetails params={{ id }} />
  </div>;
}
