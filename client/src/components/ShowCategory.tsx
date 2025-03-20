"use client";

import { useGetCategoriesQuery } from "@/api/categoryApi";
import { Category } from "@/lib/types";
import Link from "next/link";
import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

export default function ShowCategory() {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery({});
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: Something Went Wrong </div>;
  return (
    <div className="w-full lg:w-1/4 bg-gray-100 p-4 rounded-lg h-auto lg:h-[50vh]">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <ul>
        {categories?.slice(0, 4).map((category: Category) => (
          <li
            key={category._id}
            className="mb-2 cursor-pointer hover:text-blue-500 flex items-center justify-between p-2 rounded-lg transition duration-200 ease-in-out"
          >
            <Link
              href={`/category/${category._id}`}
              className="flex items-center"
            >
              <span>{category.name}</span>
            </Link>
            <span className="ml-2">
              <FaArrowRightLong />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
