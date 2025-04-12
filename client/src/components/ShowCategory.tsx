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
      <div className="w-full lg:w-1/4 bg-white p-4 rounded-xl shadow-sm">
        <Skeleton className="h-6 w-24 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 bg-white p-4 rounded-lg shadow-sm">
        Error: Something Went Wrong
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/4 bg-white p-4 rounded-xl shadow-md h-auto lg:h-[60vh]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categories</h2>

      <ScrollArea className="h-[45vh] lg:h-auto pr-2">
        <ul className="space-y-2">
          {categories?.slice(0, 6).map((category: Category) => (
            <li
              key={category._id}
              className="relative group bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 flex items-center justify-between transition duration-200"
              onMouseEnter={() => setHoveredCategory(category._id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                href={`/category/${category._id}`}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              >
                <Package className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{category.name}</span>
              </Link>
              <FaArrowRightLong className="text-gray-400 group-hover:text-blue-500" />

              {/* Subcategories */}
              {hoveredCategory === category._id &&
                category.subcategory &&
                category.subcategory.length > 0 && (
                  <ul className="absolute top-0 left-full ml-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2 space-y-1">
                    {category.subcategory.map((sub) => (
                      <li
                        key={sub._id}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition"
                      >
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <Link
                          href={`/subcategory/${sub._id}`}
                          className="text-gray-700 hover:text-blue-500"
                        >
                          {sub.name}
                        </Link>
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
