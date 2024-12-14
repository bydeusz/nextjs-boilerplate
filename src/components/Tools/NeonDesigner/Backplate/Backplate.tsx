"use client";
import { useState } from "react";
import { backplates } from "@/data/backplates";
import { colors } from "@/data/colors";

interface BackplateProps {
  color: string;
  onBackplateChange: (backplate: string, backplateColor: string) => void;
}

export default function Backplate({
  color,
  onBackplateChange,
}: BackplateProps) {
  const [activeColor, setActiveColor] = useState<string>(color);
  const [selectedBackplate, setSelectedBackplate] =
    useState<string>("ingegoten");

  const handleBackplateClick = (value: string) => {
    setSelectedBackplate(value);
    onBackplateChange(value, activeColor);
  };

  const handleColorClick = (backplateColor: string) => {
    setActiveColor(backplateColor);
    onBackplateChange(selectedBackplate, backplateColor);
  };

  return (
    <div className="h-72 overflow-y-scroll">
      <div>
        <div className="pt-4 mb-2 text-sm font-semibold">Soort</div>
        <div className="py-4 grid grid-cols-10 gap-4">
          {backplates.map((backplate, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <button
                type="button"
                className={`w-10 h-10 rounded-full border-2 bg-gray-100 border-white outline outline-2 outline-gray-100 cursor-pointer relative overflow-hidden hover:outline-pink-600 ${
                  selectedBackplate === backplate.value
                    ? "outline-pink-600"
                    : ""
                }`}
                onClick={() => {
                  handleBackplateClick(backplate.value);
                }}></button>
              <p className="text-[10px] mt-2 leading-normal h-[30px] 3xl:h-auto">
                {backplate.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      {selectedBackplate === "vierkant" && (
        <div>
          <div className="pt-4 mb-2 text-sm font-semibold">Kleur</div>
          <div className="py-4 grid grid-cols-10 gap-4">
            {colors.map((color, index) => (
              <button
                type="button"
                key={index}
                onClick={() => {
                  handleColorClick(color.value);
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
                handleColorClick("0,0,0");
              }}>
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-10 h-10 rounded-full border-2 border-white outline outline-2 outline-gray-100 cursor-pointer relative overflow-hidden"
                  style={{
                    backgroundColor: "#FFFFFF",
                  }}></div>
                <p className="text-[10px] mt-2 leading-normal h-[30px] 3xl:h-auto">
                  Custom
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
