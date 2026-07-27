"use client";
import { useUserContext } from "@/context/UserContext";
import { ConfigProvider, Select, theme } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CgSearch } from "react-icons/cg";
import { FaAngleDown, FaRegFile, FaRegTrashAlt } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import {
  MdOutlineFilterAlt,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

const BrandsPage = () => {
  const { isdark } = useUserContext();
  const [openFilter, setopenFilter] = useState(false);
  const filterRef = useRef(null);
  const [openeActionModel, setOpenActionModel] = useState(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setopenFilter(false);
      }
    }
    if (openFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openFilter]);
  return (
    <div>
      <div className="flex justify-between gap-2 flex-wrap items-center">
      <div
        className={`flex items-center gap-2 text-sm  ${isdark ? "text-[#64748b]" : "text-[#64748b]"}`}
      >
        <span className="text-[#8b5cf6]">User</span>{" "}
        <MdOutlineKeyboardArrowRight /> <span>Brands</span>
      </div>
      <div className="flex justify-end">
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setopenFilter(!openFilter)}
            className={`flex gap-2 items-center shadow-sm rounded-sm px-4 py-1 ${isdark ? "text-white bg-[#1e293b]" : " bg-white"} `}
          >
            <MdOutlineFilterAlt className="text-[#94a3b8]" /> Search{" "}
            <FaAngleDown className="text-[#94a3b8]" />
          </button>
          {openFilter && (
            <div
              className={`absolute top-12 z-10 px-4 py-3 shadow-sm border rounded-sm left-[-92] ${isdark ? "bg-[#1e293b] border-[#d2d7e04d]  " : "bg-white border-[#e2e8f0]"}`}
            >
              <div className="">
                <div>
                  <label htmlFor="" className={`${isdark ? "text-white" : ""}`}>
                    Search Keyword
                  </label>
                  <input
                    className={`input ${isdark ? "" : "!border-[#d9d9d9]"}`}
                    type="text"
                    placeholder="Enter search keyword"
                  />
                </div>
                <div>
                  <ConfigProvider
                    theme={{
                      algorithm: isdark
                        ? theme.darkAlgorithm
                        : theme.defaultAlgorithm,
                      components: {
                        Select: {
                          selectorBg: isdark ? "#1e293b" : "#ffffff",
                          colorText: isdark ? "#ffffff" : "#000000",
                          colorBorder: isdark ? "#475569" : "#d9d9d9",
                          colorPrimaryHover: isdark ? "#475569" : "#4096ff",
                          colorPrimary: isdark ? "#475569" : "#1677ff",
                          controlOutline: "transparent",
                          optionSelectedBg: isdark ? "#334155" : "#e6f4ff",
                          colorBgElevated: isdark ? "#1e293b" : "#ffffff",
                        },
                      },
                    }}
                  >
                    <label className={`${isdark ? "text-white" : ""}`}>
                      Search Type
                    </label>
                    <Select
                      className="selectSet"
                      classNames={{
                        popup: {
                          root: isdark
                            ? "darkSelectDropdown"
                            : "lightSelectDropdown",
                        },
                      }}
                      getPopupContainer={() => filterRef.current}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      placeholder="Title"
                      options={[
                        { value: "1", label: "Jack" },
                        { value: "2", label: "Lucy" },
                        { value: "3", label: "Tom" },
                      ]}
                    />
                  </ConfigProvider>
                  <button className="flex items-center gap-2 py-2 bg-[#8b5cf6] rounded-sm text-center w-full justify-center cursor-pointer text-white ">
                    Search <CgSearch />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      </div>
      <div
        className={`grid grid-cols-1 justify-items-center  md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-5 mt-5`}
      >
        <Link  href={'/brands/create'} 
          className={`h-72  w-[15rem] relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#ddd6fe] ${isdark ? "bg-[#6d28d91a]" : "bg-[#a78bfa1a]"}  `}
        >
          <div className="rounded-full font-light h-10 w-10 text-[#8b5cf6] bg-[#a78bfa1a] flex justify-center items-center">
            <GoPlus size={24} />
          </div>
          <span className={`font-medium text-xl ${isdark ? "text-white" : ""}`}>
            Create Brand
          </span>
        </Link>

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
                      className={`  ${isdark ? "" : ""}`}
                    >
                      <Link href={"/brands/454"} className="flex cursor-pointer gap-2 items-center text-sm pb-1 mb-1">
                      
                      <RiEdit2Fill /> Edit
                      </Link>
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
  );
};

export default BrandsPage;
