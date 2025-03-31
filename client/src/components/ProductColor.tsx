"use client";
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProductColorProps {
  colorOptions: string[];
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

export default function ProductColor({
  colorOptions,
  selectedColor,
  setSelectedColor,
}: ProductColorProps) {
  return (
    <div className="mb-4">
      {colorOptions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Color</h3>
          <RadioGroup
            className="flex flex-wrap gap-4"
            value={selectedColor}
            onValueChange={setSelectedColor}
          >
            {colorOptions?.map((color, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={color} id={`color-${index}`} />
                <label
                  htmlFor={`color-${index}`}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <span
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color }}
                  ></span>
                  <span>{color}</span>
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
