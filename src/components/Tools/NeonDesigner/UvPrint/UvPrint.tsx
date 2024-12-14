"use client";
import { useState } from "react";
import { colors } from "@/data/colors";

interface uvPrintProps {
  selectedColor: (color: string) => void;
}

export default function UvPrint({ selectedColor }: uvPrintProps) {
  const [activeColor, setActiveColor] = useState<string>("");

  const handleColor = (color: string) => {
    setActiveColor(color);
    selectedColor(color);
  };

  return (
    <div className="py-4 grid grid-cols-10 gap-4">
      {colors.map((color, index) => (
        <button
          type="button"
          key={index}
          onClick={() => {
            handleColor(color.value);
          }}>
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-10 h-10 rounded-full border-2 border-white outline outline-2 outline-gray-100 cursor-pointer ${color.value === activeColor ? "outline-pink-600" : ""}`}
              style={{
                backgroundColor: `rgb(${color.value})`,
              }}></div>
            <p className="text-[10px] mt-2 leading-normal h-[30px] 3xl:h-auto">
              {color.label}
            </p>
          </div>
        </button>
      ))}
      <button
        type="button"
        onClick={() => {
          handleColor("0,0,0");
        }}>
        <div className="flex flex-col items-center text-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-white outline outline-2 outline-gray-100 cursor-pointer relative overflow-hidden"
            style={{
              backgroundColor: "#FFFFFF",
            }}>
            <style jsx>{`
              div::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                  to bottom right,
                  transparent calc(50% - 1px),
                  #d3d3d3,
                  transparent calc(50% + 1px)
                );
              }
            `}</style>
          </div>
          <p className="text-[10px] mt-2 leading-normal h-[30px] 3xl:h-auto">
            Uitzetten
          </p>
        </div>
      </button>
    </div>
  );
}
