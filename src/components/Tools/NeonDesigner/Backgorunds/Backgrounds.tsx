"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Loading } from "@/components/lables/Loading/Loading";

interface BackgroundsProps {
  background: string;
  selectedBackground: (background: string) => void;
}

export default function Backgrounds({
  background,
  selectedBackground,
}: BackgroundsProps) {
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [active, setActive] = useState<string>(background);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/tool/backgrounds")
      .then((res) => res.json())
      .then((data) => {
        setBackgrounds(data.backgroundImageUrls);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching backgrounds:", error);
        setLoading(false);
      });
  }, []);

  const handleBackground = (background: string) => {
    setActive(background);
    selectedBackground(background);
  };

  return (
    <>
      {loading ? (
        <div className="h-full relative py-4 ">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loading className="h-6 w-6 text-pink-600" />
          </div>
        </div>
      ) : (
        <div className="py-4 grid gap-4 grid-cols-8">
          {backgrounds.map((background, index) => (
            <button
              className={`overflow-hidden rounded-md border-2 border-white outline outline-2 outline-gray-100 cursor-pointer ${active === background ? "outline-pink-600" : ""}`}
              type="button"
              key={index}
              onClick={() => handleBackground(background)}>
              <Image
                src={background}
                alt="background"
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
