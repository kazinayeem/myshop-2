"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
interface Category {
  _id: string;
  name: string;
  image: string;
}

export default function ShowCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/categories`)
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);
  return (
    <div className="w-full lg:w-1/4 bg-gray-100 p-4 rounded-lg h-auto lg:h-[50vh]">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <ul>
        {categories?.slice(0, 4).map((category) => (
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
