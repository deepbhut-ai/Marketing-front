"use client";
import React, { useState, useRef, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import { FaAngleDown, FaRegCalendarAlt } from "react-icons/fa";
import { RxCardStack } from "react-icons/rx";
import { MdOutlineFilterAlt } from "react-icons/md";
import { ConfigProvider, Select, theme } from "antd";
import { CgSearch } from "react-icons/cg";
import CardSeactions from "../sections/CardSeactions";
import CalenderContent from "../sections/CalenderContent";

const ContentPage = () => {
  const { isdark } = useUserContext();
  const [section, setSection] = useState(false);
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
      <div className="flex justify-between items-center gap-2">
        <div
          className={`flex gap-4 p-1 shadow-sm rounded-sm ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
        >
          <button
            onClick={() => setSection(false)}
            className={`flex gap-2 items-center rounded-sm px-4 py-2 ${isdark ? "text-white" : ""} ${section ? "" : "text-white bg-[#8b5cf6] font-medium"}`}
          >
            <FaRegCalendarAlt /> Calender
          </button>
          <button
            onClick={() => setSection(true)}
            className={`flex gap-2 items-center rounded-sm px-4 py-2 ${isdark ? "text-white" : ""} ${section ? "text-white bg-[#8b5cf6] font-medium" : ""}`}
          >
            <RxCardStack /> Cards
          </button>
        </div>
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setopenFilter(!openFilter)}
            className={`flex gap-2 items-center shadow-sm rounded-sm px-4 py-2 ${isdark ? "text-white bg-[#1e293b]" : " bg-white"} `}
          >
            <MdOutlineFilterAlt className="text-[#94a3b8]" /> Search{" "}
            <FaAngleDown className="text-[#94a3b8]" />
          </button>
          {openFilter && (
            <div
              className={`absolute z-10 top-12 px-4 py-3 shadow-sm border rounded-sm left-[-92] ${isdark ? "bg-[#1e293b] border-[#d2d7e04d]  " : "bg-white border-[#e2e8f0]"}`}
            >
              <div className="">
                <div>
                  <label htmlFor="" className={`${isdark ? "text-white " : ""}`}>
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
                       getPopupContainer={() => filterRef.current} 
                      classNames={{
                        popup: {
                          root: isdark
                            ? "darkSelectDropdown"
                            : "lightSelectDropdown",
                        },
                      }}
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
      <div>
        {section ?
        <CardSeactions /> 
        :
        
        <CalenderContent/>
    }

      </div>
    </div>
  );
};

export default ContentPage;