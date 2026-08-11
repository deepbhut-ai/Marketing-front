"use client";
import { useUserContext } from "@/context/UserContext";
import { ConfigProvider, Modal, Select, message, theme } from "antd";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CgSearch } from "react-icons/cg";
import { FaAngleDown } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { HiOutlineRefresh } from "react-icons/hi";
import {
  MdOutlineFilterAlt,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { apiFetch } from "@/lib/apiClient";
import BrandsTable from "../sections/BrandsTable";

const BrandsPage = () => {
  const { isdark } = useUserContext();
  const [openFilter, setopenFilter] = useState(false);
  const filterRef = useRef(null);

  // ── API state ──────────────────────────────────────────────────────
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);

  // ── Filter state ───────────────────────────────────────────────────
  const [keyword, setKeyword] = useState("");
  const [industry, setIndustry] = useState("");

  const fetchBrands = useCallback(
    async (pageNum = 1, search = keyword, ind = industry) => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(pageNum),
          page_size: String(pageSize),
        });
        if (search) query.set("search", search);
        if (ind) query.set("industry", ind);

        const data = await apiFetch(`api/brand/?${query.toString()}`);
        const items = data?.data?.items || [];
        const pagination = data?.data?.pagination || {};

        setBrands(items);
        setTotal(pagination.total || items.length);
        setTotalPages(pagination.total_pages || 1);
        setPage(pagination.page || pageNum);
      } catch (error) {
        console.error("Fetch brands failed:", error);
        message.error(error?.message || "Failed to fetch brands.");
        setBrands([]);
      } finally {
        setLoading(false);
      }
    },
    [keyword, industry, pageSize]
  );

  // Fetch on mount and when page changes
  useEffect(() => {
    fetchBrands(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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

  const handleSearch = () => {
    setPage(1);
    fetchBrands(1, keyword, industry);
    setopenFilter(false);
  };

  const handleClear = () => {
    setKeyword("");
    setIndustry("");
    setPage(1);
    fetchBrands(1, "", "");
    setopenFilter(false);
  };

  const handleRefresh = () => {
    fetchBrands(page, keyword, industry);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = (brand) => {
    Modal.confirm({
      title: "Delete Brand",
      content: `Are you sure you want to delete "${brand.brand_name}"? This action cannot be undone.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await apiFetch(`api/brand/${brand.id}`, { method: "DELETE" });
          message.success("Brand deleted successfully!");
          fetchBrands(page, keyword, industry);
        } catch (err) {
          console.error("Delete brand failed:", err);
          message.error(err?.message || "Failed to delete brand.");
        }
      },
    });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div
        className={`flex items-center gap-2 text-sm ${
          isdark ? "text-[#64748b]" : "text-[#64748b]"
        }`}
      >
        <span className="text-[#8b5cf6]">User</span>{" "}
        <MdOutlineKeyboardArrowRight /> <span>Brands</span>
      </div>

      {/* Refresh + Search filter */}
      <div className="flex gap-2 justify-between items-center mt-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex gap-2 items-center cursor-pointer shadow-sm transition-all duration-200 disabled:opacity-50 ${
              isdark
                ? "bg-[#1e293b] text-white hover:bg-[#334155] hover:shadow-md"
                : "bg-white text-[#475569] hover:bg-gray-50 hover:shadow-md"
            }`}
            disabled={loading}
          >
            <HiOutlineRefresh className={loading ? "animate-spin" : ""} />
            {loading ? "Loading..." : "Refresh"}
          </button>
          <Link
            href={"/brands/create"}
            className="group px-4 py-2 text-white bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] rounded-lg flex gap-2 items-center cursor-pointer shadow-sm hover:shadow-md hover:from-[#7c3aed] hover:to-[#6d28d9] transition-all duration-200"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
              <GoPlus size={16} />
            </span>
            <span className="text-sm font-semibold text-[#f5f3ff]">Create Brand</span>
          </Link>
        </div>

        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setopenFilter(!openFilter)}
            className={`flex gap-2 items-center shadow-sm rounded-sm px-4 py-1 ${
              isdark ? "text-white bg-[#1e293b]" : " bg-white"
            } `}
          >
            <MdOutlineFilterAlt className="text-[#94a3b8]" /> Search{" "}
            <FaAngleDown className="text-[#94a3b8]" />
          </button>
          {openFilter && (
            <div
              className={`absolute top-12 px-4 py-3 shadow-sm border rounded-sm left-[-134px] w-[260px] z-10 ${
                isdark
                  ? "bg-[#1e293b] border-[#d2d7e04d]"
                  : "bg-white border-[#e2e8f0]"
              }`}
            >
              <div className="space-y-3">
                <div>
                  <label
                    className={`block mb-1 text-sm ${
                      isdark ? "text-white" : ""
                    }`}
                  >
                    Search Keyword
                  </label>
                  <input
                    className={`input w-full ${
                      isdark ? "" : "!border-[#d9d9d9]"
                    }`}
                    type="text"
                    placeholder="Enter search keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
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
                    <label
                      className={`block mb-1 text-sm ${
                        isdark ? "text-white" : ""
                      }`}
                    >
                      Industry
                    </label>
                    <Select
                      className="selectSet w-full"
                      value={industry || undefined}
                      onChange={setIndustry}
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
                      placeholder="Select industry"
                      options={[
                        { value: "Food & Beverage", label: "Food & Beverage" },
                        { value: "ai ", label: "AI" },
                        { value: "Technology", label: "Technology" },
                        { value: "Fashion", label: "Fashion" },
                        { value: "Health", label: "Health" },
                        { value: "Finance", label: "Finance" },
                      ]}
                    />
                  </ConfigProvider>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={handleSearch}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#8b5cf6] rounded-sm cursor-pointer text-white"
                    >
                      Search <CgSearch />
                    </button>
                    <button
                      onClick={handleClear}
                      className={`flex items-center justify-center gap-2 py-2 px-4 rounded-sm border cursor-pointer transition-colors ${
                        isdark
                          ? "border-gray-600 text-white hover:bg-[#0f172a]"
                          : "border-gray-200 text-[#475569] hover:bg-gray-50"
                      }`}
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table with API data */}
      <BrandsTable
        brands={brands}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default BrandsPage;
