"use client";
import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import { BiBookmarkAltMinus } from "react-icons/bi";

const AiTools = () => {
  const { isdark } = useUserContext();
  return (
    <div>
      <div
        className={`flex items-center gap-2 text-sm  ${isdark ? "text-[#64748b]" : "text-[#64748b]"}`}
      >
        <span className="text-[#8b5cf6]">User</span>{" "}
        <MdOutlineKeyboardArrowRight /> <span>Ai-Tools</span>
      </div>
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3 `}>
        <div
          className={`px-4 py-3 shadow-sm rounded-sm  ${isdark ? "bg-[#1e293b] " : "bg-white"} `}
        >
          <h6 className={`text-[#64748b] ${isdark ? "" : ""}`}>AI Tools</h6>
          <h6
            className={`text-2xl font-medium ${isdark ? "text-white" : "text-[#475569]"}`}
          >
            17
          </h6>
        </div>
        <div
          className={`px-4 py-3 shadow-sm rounded-sm  ${isdark ? "bg-[#1e293b] " : "bg-white"} `}
        >
          <h6 className={`text-[#64748b]`}>Bookmarked</h6>
          <h6
            className={`text-2xl font-medium ${isdark ? "text-white" : "text-[#475569]"}`}
          >
            4
          </h6>
        </div>
        <div
          className={`px-4 py-3 shadow-sm rounded-sm  ${isdark ? "bg-[#1e293b] " : "bg-white"} `}
        >
          <h6 className={`text-[#64748b]`}>Credits</h6>
          <h6
            className={`text-2xl font-medium ${isdark ? "text-white" : "text-[#475569]"}`}
          >
            128754.5
          </h6>
        </div>
      </div>

      <div className={` grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8 `}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => {
          return (
            <div
              key={item}
              className={`px-4 py-3 shadow-sm rounded-sm  ${isdark ? "bg-[#1e293b] " : "bg-white"}`}
            >
              <div className="flex flex-wrap justify-between items-center border-b border-[#7c3aed] pt-2 pb-4">
                <div>
                  <Image
                    src={"/images/facebook.svg"}
                    alt="Img"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h6 className={`font-medium ${isdark ? "text-white" : ""}`}>
                    Eum praesentium volu
                  </h6>
                  <p className={`text-[#6b7280]`}>Text</p>
                </div>
                <div className="rounded-full w-10 h-10 border border-[#7c3aed] flex justify-center items-center ">
                  <BiBookmarkAltMinus size={25} className="text-[#7c3aed]" />
                </div>
              </div>
              <div className={`py-4  ${isdark ? "text-white" : ""}`}>
                <p>it will Compose a compelling blog post</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AiTools;
