"use client";
import React, { useEffect, useRef, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import {
  MdOutlineFilterAlt,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { BiBarChartAlt2, BiCommentDetail, BiLike } from "react-icons/bi";
import { HiOutlineRefresh } from "react-icons/hi";
import { CgSearch } from "react-icons/cg";
import { ConfigProvider, Select, theme } from "antd";
import { FaAngleDown } from "react-icons/fa";
import AnalylicsTable from "../sections/AnalylicsTable";

const AnalyticsPage = () => {
  const { isdark } = useUserContext();
  const [openFilter, setopenFilter] = useState(false);
  const filterRef = useRef(null);
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
      <div
        className={`flex items-center gap-2 text-sm  ${isdark ? "text-[#64748b]" : "text-[#64748b]"}`}
      >
        <span className="text-[#8b5cf6]">User</span>{" "}
        <MdOutlineKeyboardArrowRight /> <span>Analytics</span>
      </div>
      <div className={`flex gap-5 flex-wrap mt-3`}>
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 w-full  `}
        >
          <div
            className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <div className="p-3 flex justify-center items-center bg-[#8b5cf61a] text-[#8b5cf6] rounded-xl">
              {" "}
              <BiBarChartAlt2 size={24} />
            </div>
            <div>
              <p className={`text-[#64748b]`}>Total Posts</p>
              <h6
                className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
              >
                6
              </h6>
            </div>
          </div>
          <div
            className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <div className="p-3 flex justify-center items-center bg-[#10b9811a] text-[#10b981] rounded-xl">
              {" "}
              <BiLike size={24} />
            </div>
            <div>
              <p className={`text-[#64748b]`}>Total Reactions</p>
              <h6
                className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
              >
                4
              </h6>
            </div>
          </div>
          <div
            className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <div className="p-3 flex justify-center items-center bg-[#f59e0b1a] text-[#f59e0b] rounded-xl">
              {" "}
              <BiCommentDetail size={24} />
            </div>
            <div>
              <p className={`text-[#64748b]`}>Total Comments</p>
              <h6
                className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
              >
                0
              </h6>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-between items-center mt-5">
        <button
          className={`px-2 py-1 text-white bg-[#8b5cf6] rounded-sm flex gap-2 items-center cursor-pointer`}
        >
          <HiOutlineRefresh /> Refresh Analytics{" "}
        </button>
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
              className={`absolute top-12 px-4 py-3 shadow-sm border rounded-sm left-[-92] ${isdark ? "bg-[#1e293b] border-[#d2d7e04d]  " : "bg-white border-[#e2e8f0]"}`}
            >
              <div className="">
                <div>
                  <label htmlFor="" className={`${isdark ? "text-white" : ""}`}>
                    Search Keyword
                  </label>
                  <input
                     className={`input ${isdark ?"":"!border-[#d9d9d9]"}`}
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

      <AnalylicsTable/>
    </div>
  );
};

export default AnalyticsPage;
