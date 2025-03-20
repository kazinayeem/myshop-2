"use client";

import { useGetCategoriesQuery } from "@/api/categoryApi";
import { Button } from "@/components/ui/button";
import { Category } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Categories() {
  const router = useRouter();

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { data: categories, isLoading, isError } = useGetCategoriesQuery({});

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: Something Went Wrong </div>;
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
          {categories.map((category: Category) => (
            <div
              onClick={() => router.push(`/category/${category._id}`)}
              key={category._id}
              className="flex flex-col items-center justify-center border rounded-lg p-4 w-40 h-40 md:w-40 shadow-sm hover:shadow-md transition-all cursor-pointer"
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
