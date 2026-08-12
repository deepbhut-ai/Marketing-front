"use client";
import React, { useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";

/**
 * Small image thumbnail that shows a spinner until the image finishes loading.
 * Shared across AnalylicsTable and BrandsTable.
 */
const ImageWithLoader = ({ src, alt, className, rounded }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative ${className ?? ""} ${rounded ?? ""}`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <HiOutlineRefresh className="animate-spin text-[#8b5cf6]" size={14} />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-200 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default ImageWithLoader;