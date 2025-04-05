"use client";
import { useGetSlidersQuery } from "@/api/sliderApi";
import { Card } from "@/components/ui/card";
import { Slider } from "@/lib/types";
import { motion } from "framer-motion";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";

export default function ImageSlider() {
  const { data: sliders = [], isLoading, isError } = useGetSlidersQuery({});
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (sliders.length ? (prev + 1) % sliders.length : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [sliders]);

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }
  if (isError) {
    return <div className="text-center p-4">Error: Something Went Wrong</div>;
  }

  return (
    <div className="relative w-full max-w-full mx-auto overflow-hidden h-[50vh] flex items-center justify-center">
      <div className="relative w-full h-full">
        {sliders.map((slide: Slider, index: number) => (
          <motion.div
            key={slide._id}
            className={`absolute w-full h-full flex items-center justify-center transition-opacity duration-500 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === current ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full h-full relative">
              <Image
                layout="fill"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 50vw"
                src={slide.image}
                alt={slide.title}
                loading="lazy"
                className="rounded-lg"
              />

            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
