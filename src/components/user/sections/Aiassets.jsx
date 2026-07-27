"use client";
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegFile, FaRegTrashAlt } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";

const Aiassets = () => {
      const { isdark } = useUserContext();
      const [openeActionModel, setOpenActionModel] = useState(null);
  return (
     <div>
         <div
           className={`grid grid-cols-1 justify-items-center  md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-5 mt-5`}
         >
           {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
             const isOpen = openeActionModel === item;
             return (
               <div
                 key={item}
                 className={`h-72  w-[15rem] relative rounded-xl shadow-sm border  ${isdark ? "bg-[#0f172a7e] border border-gray-600" : "bg-white border-gray-300"} `}
               >
                 <div>
                   <Image
                     src={"/images/demo.jpeg"}
                     className={`w-full rounded-t-xl h-60`}
                     alt=""
                     width={100}
                     height={100}
                   />
                 </div>
                 <div
                   className={`flex justify-end items-center px-2 gap-1 py-3 ${isdark ? "text-white" : ""}`}
                 >
                   <FaRegFile /> 1.00 MB
                 </div>
                 <div
                   onClick={() => setOpenActionModel(isOpen ? null : item)}
                   className={`h-8 w-8 cursor-pointer  absolute top-1 right-1 flex justify-center items-center  rounded-full ${isdark ? "bg-[#1e293b] text-white" : "bg-white"}`}
                 >
                   <BsThreeDotsVertical />
                 </div>
                 {isOpen && (
                   <div
                     className={` absolute rounded-xl px-3 py-2 top-10 right-1 ${isdark ? "bg-[#1e293b] text-white" : "bg-white text-[#374151]"}`}
                   >
                     <ul>
                       <li
                         className={`flex cursor-pointer gap-2 items-center text-sm pb-1 mb-1  ${isdark ? "" : ""}`}
                       >
                         <RiEdit2Fill /> Edit
                       </li>
                       <li className="flex gap-2 items-center text-sm cursor-pointer">
                         <FaRegTrashAlt /> Delete
                       </li>
                     </ul>
                   </div>
                 )}
               </div>
             );
           })}
         </div>
       </div>
  )
}

export default Aiassets