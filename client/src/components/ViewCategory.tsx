"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/legacy/image";
import { useEffect, useRef, useState } from "react";

interface Category {
  _id: number;
  name: string;
  image: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/categories`
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="p-6 container mx-auto">
      <h2 className="text-4xl font-bold mb-4">Browse By Category</h2>
      <div className="relative">
        {/* Scroll Left Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hidden md:flex"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Categories List */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth"
        >
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex flex-col items-center justify-center border rounded-lg p-4 w-40 h-40 md:w-40 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <Image
                  width={80}
                  height={80}
                  loading="lazy"
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-sm font-medium mt-2">{category.name}</span>
            </div>
          ))}
        </div>

        {/* Scroll Right Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hidden md:flex"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
