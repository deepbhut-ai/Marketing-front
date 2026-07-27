"use client";
import { useUserContext } from "@/context/UserContext";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import {
  HiOutlineDocumentText,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentDuplicate,
  HiOutlineFilter,
  HiChevronDown,
} from "react-icons/hi";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { ConfigProvider, Select,theme } from "antd";

const DUMMY_ROWS = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  generatedFor: "Brand Posts",
  title: "Fathers day",
  charge: i === 5 ? 100 : 1,
  totalWords: i === 5 ? 100 : 5,
  content:
    i === 5
      ? "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt doloribus animi eligendi de..."
      : "Driving Innovation, Powering Success",
}));

const TOTAL_PAGES = 92;

const StatCard = ({ icon: Icon, label, value, isdark }) => (
  <div
    className={`flex items-center gap-4 rounded-xl border p-5 flex-1 min-w-[220px] ${
      isdark ? "bg-[#1e293b] border-[#1e293b]" : "bg-white border-[#e5e7eb]"
    }`}
  >
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-full ${
        isdark ? "bg-[#1e293b]" : "bg-[#ede9fe]"
      }`}
    >
      <Icon className="text-[#8b5cf6] text-xl" />
    </div>
    <div>
      <p className={`text-sm ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
        {label}
      </p>
      <p
        className={`text-2xl font-semibold ${
          isdark ? "text-white" : "text-[#0f172a]"
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

const AiGeneratedHistory = () => {
  const { isdark } = useUserContext();
  const [currentPage, setCurrentPage] = useState(1);
   const [openFilter, setopenFilter] = useState(false);
    const filterRef = useRef(null);
  const columns = [
    "Generated For",
    "Title/Name",
    "Charge",
    "Total Words",
    "Content",
    "Date",
  ];

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 10;

    if (TOTAL_PAGES <= maxVisible + 2) {
      for (let i = 1; i <= TOTAL_PAGES; i++) pages.push(i);
      return pages;
    }

    for (let i = 1; i <= maxVisible; i++) pages.push(i);
    pages.push("...");
    pages.push(TOTAL_PAGES - 1);
    pages.push(TOTAL_PAGES);
    return pages;
  };
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
    <div className={isdark ? "text-white" : "text-[#0f172a]"}>
      {/* Breadcrumb */}
      <div
        className={`flex items-center gap-2 text-sm ${
          isdark ? "text-[#64748b]" : "text-[#64748b]"
        }`}
      >
        <span className="text-[#8b5cf6]">User</span>{" "}
        <MdOutlineKeyboardArrowRight /> <span>Ai-Generated-History</span>
      </div>

      {/* Stat Cards */}
      <div className="mt-6 flex flex-wrap gap-5">
        <StatCard
          icon={HiOutlineDocumentText}
          label="Total"
          value={915}
          isdark={isdark}
        />
        <StatCard
          icon={HiOutlineCurrencyDollar}
          label="Total Charges"
          value={44348}
          isdark={isdark}
        />
        <StatCard
          icon={HiOutlineDocumentDuplicate}
          label="Total Results"
          value={915}
          isdark={isdark}
        />
      </div>

      {/* Filter Button */}
      <div className="mt-8 flex justify-end relative">
        <button
          onClick={() => setopenFilter(!openFilter)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            isdark
              ? "bg-[#1e293b] border-[#1e293b] text-white hover:bg-[#1e293b]"
              : "bg-white border-[#e5e7eb] text-[#0f172a] hover:bg-[#f9fafb]"
          }`}
        >
          <HiOutlineFilter />
          Filter
          <HiChevronDown
           
          />
        </button>
       {openFilter && (
            <div ref={filterRef}
              className={`absolute top-12 px-4 py-3 shadow-sm border rounded-sm w-56  ${isdark ? "bg-[#1e293b] border-[#d2d7e04d]  " : "bg-white border-[#e2e8f0]"}`}
            >
              <div className="">
              
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
                      Status
                    </label>
                    <Select
                      className="selectSet "
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
                    Filter 
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Table */}
      <div
        className={`mt-4 overflow-x-auto rounded-xl border ${
          isdark ? "border-[#1e293b] bg-[#1e293b]" : "border-[#e5e7eb] bg-white"
        }`}
      >
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr
              className={`border-b ${
                isdark ? "border-[#1e293b]" : "border-[#e5e7eb]"
              }`}
            >
              {columns.map((col) => (
                <th
                  key={col}
                  className={`px-6 py-4 font-semibold border-b whitespace-nowrap ${
                    isdark ? "text-white border-[#d2d7e04d]" : "text-[#0f172a] border-[#e2e8f0]"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DUMMY_ROWS.map((row) => (
              <tr
                key={row.id}
                className={`border-b last:border-b-0 ${
                  isdark ? "border-[#1e293b]" : "border-[#f1f5f9]"
                }`}
              >
                <td
                  className={`px-6 py-4 whitespace-nowrap border-b ${
                    isdark ? "text-[#cbd5e1] border-[#d2d7e04d]" : "text-[#334155] border-[#e2e8f0]"
                  }`}
                >
                  {row.generatedFor}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap border-b  ${isdark ?"border-[#d2d7e04d]":"border-[#e2e8f0]"}`}>
                  <a
                    href="#"
                    className="underline text-[#8b5cf6] hover:text-[#7c3aed]"
                  >
                    {row.title}
                  </a>
                </td>

                <td
                  className={`px-6 py-4 whitespace-nowrap border-b ${
                    isdark ? "text-[#cbd5e1] border-[#d2d7e04d]" : "text-[#334155] border-[#e2e8f0]"
                  }`}
                >
                  {row.charge}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap border-b ${
                    isdark ? "text-[#cbd5e1] border-[#d2d7e04d]" : "text-[#334155] border-[#e2e8f0]"
                  }`}
                >
                  {row.totalWords}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap max-w-xs truncate border-b ${
                    isdark ? "text-[#cbd5e1] border-[#d2d7e04d]" : "text-[#334155] border-[#e2e8f0]"
                  }`}
                >
                  {row.content}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap max-w-xs truncate border-b ${
                    isdark ? "text-[#cbd5e1] border-[#d2d7e04d]" : "text-[#334155] border-[#e2e8f0]"
                  }`}
                >
                  15/08/1947
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed ${
            isdark
              ? "bg-[#1e293b] border-[#1e293b] text-white hover:bg-[#1e293b]"
              : "bg-white border-[#e5e7eb] text-[#0f172a] hover:bg-[#f9fafb]"
          }`}
        >
          <HiChevronLeft /> Previous
        </button>

        {getPageNumbers().map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className={isdark ? "text-[#64748b] px-1" : "text-[#64748b] px-1"}
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`min-w-[38px] rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                currentPage === p
                  ? "bg-[#8b5cf6] border-[#8b5cf6] text-white"
                  : isdark
                    ? "bg-[#1e293b] border-[#1e293b] text-white hover:bg-[#1e293b]"
                    : "bg-white border-[#e5e7eb] text-[#0f172a] hover:bg-[#f9fafb]"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
          disabled={currentPage === TOTAL_PAGES}
          className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed ${
            isdark
              ? "bg-[#1e293b] border-[#1e293b] text-white hover:bg-[#1e293b]"
              : "bg-white border-[#e5e7eb] text-[#0f172a] hover:bg-[#f9fafb]"
          }`}
        >
          Next <HiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default AiGeneratedHistory;
