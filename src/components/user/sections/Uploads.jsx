"use client";
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import { FaRegFile } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const Uploads = () => {
  const { isdark } = useUserContext();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null); // the actual File object
  const [preview, setPreview] = useState(null); // object URL for image preview

  const handleBoxClick = () => {
    fileInputRef.current.click(); // opens the OS file picker
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);

    // only build an image preview if it's actually an image
    if (selected.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation(); // don't trigger handleBoxClick
    setFile(null);
    setPreview(null);
    fileInputRef.current.value = ""; // reset so selecting the same file again still fires onChange
  };

  return (
    <div>
      <div
        onClick={handleBoxClick}
        className={`h-48 w-[14rem] relative flex flex-col items-center mt-5 justify-center rounded-2xl border border-dashed border-[#ddd6fe] cursor-pointer overflow-hidden ${
          isdark ? "bg-[#6d28d91a]" : "bg-[#a78bfa1a]"
        }`}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="preview"
              fill
              className="object-cover rounded-2xl"
            />
            <button
              onClick={handleRemove}
              className="absolute top-1.5 right-1.5 h-6 w-6 flex items-center justify-center rounded-full bg-black/60 text-white z-10"
            >
              <IoMdClose size={14} />
            </button>
          </>
        ) : file ? (
          <>
            <button
              onClick={handleRemove}
              className="absolute top-1.5 right-1.5 h-6 w-6 flex items-center justify-center rounded-full bg-black/40 text-white"
            >
              <IoMdClose size={14} />
            </button>
            <div className="rounded-full font-light h-10 w-10 text-[#8b5cf6] bg-[#a78bfa1a] flex justify-center items-center">
              <FaRegFile size={18} />
            </div>
            <span
              className={`font-medium text-sm mt-2 px-3 text-center truncate max-w-full ${
                isdark ? "text-white" : ""
              }`}
            >
              {file.name}
            </span>
          </>
        ) : (
          <>
            <div className="rounded-full font-light h-10 w-10 text-[#8b5cf6] bg-[#a78bfa1a] flex justify-center items-center">
              <GoPlus size={24} />
            </div>
            <span
              className={`font-medium text-xl ${isdark ? "text-white" : ""}`}
            >
              Create Post
            </span>
          </>
        )}
      </div>

      {/* hidden actual input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default Uploads;