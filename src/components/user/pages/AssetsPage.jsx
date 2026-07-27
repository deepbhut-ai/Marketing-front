"use client"
import { useUserContext } from '@/context/UserContext'
import { ConfigProvider, Select,theme } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { CgSearch } from 'react-icons/cg'
import { FaAngleDown} from 'react-icons/fa'
import { LuBrainCog } from 'react-icons/lu'
import { MdOutlineFileUpload, MdOutlineFilterAlt } from 'react-icons/md'
import { TbBorderAll } from 'react-icons/tb'
import Allassets from '../sections/Allassets'
import Uploads from '../sections/Uploads'
import Aiassets from '../sections/Aiassets'

const AssetsPage = () => {
      const { isdark } = useUserContext();
      const [section, setSection] = useState('all');
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
  <div className="flex flex-wrap justify-between items-center gap-2">
        <div
          className={`flex flex-wrap gap-4 p-1 shadow-sm rounded-sm ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
        >
          <button
            onClick={() => setSection("all")}
            className={`flex gap-2 items-center rounded-sm px-4 py-2 ${isdark ? "text-white" : ""} ${section =="all" ? "text-white bg-[#8b5cf6] font-medium" : ""}`}
          >
            <TbBorderAll /> All
          </button>
          <button
            onClick={() => setSection("upload")}
            className={`flex gap-2 items-center rounded-sm px-4 py-2 ${isdark ? "text-white" : ""} ${section =='upload' ? "text-white bg-[#8b5cf6] font-medium" : ""}`}
          >
            <MdOutlineFileUpload /> Uploads
          </button>
          <button
            onClick={() => setSection("ai")}
            className={`flex gap-2 items-center rounded-sm px-4 py-2 ${isdark ? "text-white" : ""} ${section =='ai' ? "text-white bg-[#8b5cf6] font-medium" : ""}`}
          >
            <LuBrainCog  /> Ai Generated
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
     {section =="all" &&
     
     <Allassets/> 
     }
     {
        section =="upload" &&

      <Uploads/>  
     }
     { 
        section =="ai"&&

       <Aiassets/>
     }

 </div>

    </div>
  )
}

export default AssetsPage