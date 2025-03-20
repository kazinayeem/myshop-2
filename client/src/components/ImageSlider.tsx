"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/legacy/image";

interface Slider {
  _id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

export default function ImageSlider() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/sliders`)
      .then((response) => response.json())
      .then((data) => setSliders(data))
      .catch((error) => console.error("Error fetching sliders:", error));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (sliders.length ? (prev + 1) % sliders.length : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [sliders]);

  if (sliders.length === 0) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="relative w-full max-w-full mx-auto overflow-hidden h-[50vh] flex items-center justify-center">
      <div className="relative w-full h-full">
        {sliders.map((slide, index) => (
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

              <CardContent className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-4">
                <h2 className="text-2xl font-bold">{slide.title}</h2>
                <p className="text-sm mb-4">{slide.description}</p>
                <Button asChild>
                  <a href={slide.buttonLink}>{slide.buttonText}</a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
