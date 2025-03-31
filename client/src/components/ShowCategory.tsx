"use client";

import { useGetCategoriesQuery } from "@/api/categoryApi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";

import { MapPin, Package } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  subcategory?: SubCategory[];
}

interface SubCategory {
  _id: string;
  name: string;
}
export default function ShowCategory() {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery({});
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="w-full lg:w-1/4 bg-gray-100 p-2 rounded-lg h-auto lg:h-[50vh]">
        <Skeleton className="h-6 w-24 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if (isError)
    return <div className="text-red-500">Error: Something Went Wrong</div>;

  return (
    <div className="relative w-full lg:w-1/4 bg-gray-100 p-2 rounded-lg h-auto lg:h-[50vh] overflow-visible">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <ScrollArea className="h-[45vh] lg:h-auto">
        <ul>
          {categories?.slice(0, 10).map((category: Category) => (
            <li
              key={category._id}
              className="relative mb-2 cursor-pointer hover:text-blue-500 flex items-center justify-between p-2 rounded-lg transition duration-200 ease-in-out"
              onMouseEnter={() => setHoveredCategory(String(category._id))}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                href={`/category/${category._id}`}
                className="flex items-center space-x-2"
              >
                <Package className="w-5 h-5" />
                <span>{category.name}</span>
              </Link>
              <span className="ml-2">
                <FaArrowRightLong />
              </span>
              {hoveredCategory === String(category._id) &&
                (category.subcategory ?? []).length > 0 && (
                  <ul className="absolute left-full top-0 bg-white shadow-md rounded-lg p-2 w-40 z-50">
                    {category.subcategory?.map((sub) => (
                      <li
                        key={sub._id}
                        className="p-2 hover:bg-gray-200 rounded flex items-center space-x-2"
                      >
                        <MapPin className="w-4 h-4" />
                        <Link href={`/subcategory/${sub._id}`}>{sub.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
