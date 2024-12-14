"use client";
import { useRef, useImperativeHandle, forwardRef } from "react";
import domtoimage from "dom-to-image";

interface ScreenshotProps {
  children: React.ReactNode;
  id: string;
  name: string;
}

const Screenshot = forwardRef(
  ({ children, id, name }: ScreenshotProps, ref) => {
    const divRef = useRef<HTMLDivElement | null>(null);

    const takeScreenshot = async () => {
      if (divRef.current) {
        try {
          const blob = await domtoimage.toBlob(divRef.current);
          const file = new File(
            [blob],
            `Graphic Custom LED Neon Sign - ${name}.jpg`,
            {
              type: "image/jpeg",
            },
          );

          const formData = new FormData();
          formData.append("file", file);
          formData.append("id", id);

          const response = await fetch("/api/monday/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response from API:", errorData);
            throw new Error("Failed to upload image");
          }

          const data = await response.json();
          console.log("Image uploaded successfully:", data);
        } catch (error) {
          console.error("Error taking screenshot:", error);
        }
      } else {
        console.error("divRef is not attached to any element");
      }
    };

    useImperativeHandle(ref, () => ({
      takeScreenshot,
    }));

    return (
      <div ref={divRef} className="h-full">
        {children}
      </div>
    );
  },
);

// Add display name for debugging
Screenshot.displayName = "Screenshot";

export default Screenshot;
