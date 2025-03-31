"use client";
import Image from "next/image";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  data: {
    image: string[];
  };
}

export default function ImageCarousel({ data }: Props) {
  return (
    <div className="relative w-full lg:w-3/4 mx-auto">
      <Carousel className="relative w-full h-[300px] lg:h-[500px] overflow-hidden rounded-lg">
        <CarouselPrevious className="absolute top-1/2 left-2 z-10 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-200 transition duration-200 ease-in-out">
          <ChevronLeft className="w-5 h-5" />
        </CarouselPrevious>
        <CarouselNext className="absolute top-1/2 right-2 z-10 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-200 transition duration-200 ease-in-out">
          <ChevronRight className="w-5 h-5" />
        </CarouselNext>
        <CarouselContent>
          {data?.image?.map((image, index) => (
            <CarouselItem
              key={index}
              className="relative w-full h-full flex justify-center"
            >
              <Image
                src={image}
                alt={`Product Image ${index + 1}`}
                width={800}
                height={500}
                className="rounded-lg object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
