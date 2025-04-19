"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetProductsQuery } from "@/api/productApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/lib/types";
import { Search } from "lucide-react";
import Image from "next/legacy/image";
import Link from "next/link";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Default values
  const [limit, setLimit] = useState<number>(
    Number(searchParams.get("limit")) || 10
  );
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );
  const [search, setSearch] = useState<string>("");

  // Function to update URL when filters change
  const updateUrl = (newPage?: number, newLimit?: number) => {
    const params = new URLSearchParams();

    params.set("limit", String(newLimit ?? limit));
    params.set("page", String(newPage ?? page));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Sync local state with URL changes (when back/forward button is used)
  useEffect(() => {
    setLimit(Number(searchParams.get("limit")) || 10);
    setPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  const { data, isLoading, isError } = useGetProductsQuery({
    limit,
    page,
    search, 
  });

  const { products, totalProducts } = data || {};
  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="container m-auto px-4 py-8">
      <h2 className="text-4xl font-bold mb-4">Products</h2>

      {/* Search & Filters */}
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="border px-4 py-2 rounded-lg w-full sm:w-64"
          />
          <Search className="absolute right-3 top-3 text-gray-500" size={18} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
          <Select
            onValueChange={(value) => {
              setLimit(Number(value));
              updateUrl(undefined, Number(value));
            }}
            value={String(limit)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => {
              setPage(1);
              setSearch("");
              setLimit(10);
              updateUrl(1, 10);
            }}
            className="w-full sm:w-auto"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Product List */}
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-500">Error loading products</p>}
      {products?.length === 0 && <p>No products found</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products?.map((product: Product) => (
          <Card
            key={product._id}
            className="overflow-hidden h-full group relative"
          >
            <CardHeader className="p-0 relative">
              <Image
                loading="lazy"
                width={100}
                height={192}
                src={product.image?.[0] || "https://via.placeholder.com/200"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="flex px-4 flex-col h-full justify-between">
              <div>
                <Link href={`/product/${product._id}`} className="block">
                  <CardTitle className="text-lg font-semibold truncate hover:underline">
                    {product.name}
                  </CardTitle>
                </Link>
                <p className="text-red-500 font-bold">
                  ${product.discountedPrice.toFixed(2)}{" "}
                  <span className="line-through text-gray-400">
                    ${product.price.toFixed(2)}
                  </span>
                </p>
                <p className="text-sm">⭐ {product.rating} / 5</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={() => {
            const newPage = Math.max(page - 1, 1);
            setPage(newPage);
            updateUrl(newPage);
          }}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => {
            const newPage = Math.min(page + 1, totalPages);
            setPage(newPage);
            updateUrl(newPage);
          }}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
