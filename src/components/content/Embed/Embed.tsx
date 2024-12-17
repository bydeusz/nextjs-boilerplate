"use client";
import { useEffect, useRef, useState } from "react";

export interface EmbedProps {
  url: string;
  text: string;
  className?: string;
}

export const Embed = ({ url, text, className = "rounded-md" }: EmbedProps) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      {
        rootMargin: "0px",
        threshold: 0.1,
      },
    );
    if (iframeRef.current) {
      observer.observe(iframeRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`w-full aspect-video ${className}`} ref={iframeRef}>
      {isIntersecting && (
        <iframe
          className={`w-full aspect-video ${className}`}
          src={url}
          title={text}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};
