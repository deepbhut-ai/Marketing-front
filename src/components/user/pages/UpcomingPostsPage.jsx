"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import {
  MdOutlineFilterAlt,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { BiCalendarEvent } from "react-icons/bi";
import { HiOutlineRefresh } from "react-icons/hi";
import { CgSearch } from "react-icons/cg";
import { ConfigProvider, Select, theme } from "antd";
import { FaAngleDown } from "react-icons/fa";
import AnalylicsTable from "../sections/AnalylicsTable";
import DateRangePicker from "../sections/DateRangePicker";
import { apiFetch } from "@/lib/apiClient";

const PLATFORM_OPTIONS = [
  { value: "", label: "All" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "scheduled", label: "Scheduled" },
];

const UpcomingPostsPage = () => {
  const { isdark } = useUserContext();
  const [openFilter, setopenFilter] = useState(false);
  const filterRef = useRef(null);

  // ── API state ──────────────────────────────────────────────────────
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  const [summary, setSummary] = useState(null);

  // ── Filter state ───────────────────────────────────────────────────
  const [platformFilter, setPlatformFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchPosts = useCallback(
    async (pageNum = 1, platform = platformFilter, status = statusFilter, start = startDate, end = endDate) => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(pageNum),
          page_size: String(pageSize),
        });
        if (platform) query.set("platform", platform);
        if (status) query.set("status", status);
        if (start) query.set("start_date", start);
        if (end) query.set("end_date", end);

        const data = await apiFetch(`posts/scheduled/?${query.toString()}`);
        const items = data?.data || [];
        const pagination = data?.pagination || {};

        // If a keyword is set, filter client-side on the caption
        const filtered = keyword
          ? items.filter((p) =>
              (p.caption || "").toLowerCase().includes(keyword.toLowerCase())
            )
          : items;

        setPosts(filtered);
        setTotal(pagination.total || filtered.length);
        setTotalPages(pagination.total_pages || 1);
        setPage(pagination.page || pageNum);
        setSummary(data?.summary || null);
      } catch (error) {
        console.error("Fetch scheduled posts failed:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    },
    [platformFilter, statusFilter, pageSize, keyword, startDate, endDate]
  );

  // Fetch on mount and when page changes
  useEffect(() => {
    fetchPosts(page);
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
    fetchPosts(1, platformFilter, statusFilter, startDate, endDate);
    setopenFilter(false);
  };

  const handleClear = () => {
    setPlatformFilter("");
    setStatusFilter("");
    setKeyword("");
    setDateRange(null);
    setStartDate(null);
    setEndDate(null);
    setPage(1);
    fetchPosts(1, "", "", null, null);
    setopenFilter(false);
  };

  const handleRefresh = () => {
    fetchPosts(page, platformFilter, statusFilter, startDate, endDate);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 text-sm ${isdark ? "text-[#64748b]" : "text-[#64748b]"}`}
      >
        <span className="text-[#8b5cf6]">User</span>{" "}
        <MdOutlineKeyboardArrowRight /> <span>Upcoming Posts</span>
      </div>

      {/* Stat cards */}
      <div className={`flex gap-5 flex-wrap mt-3`}>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 w-full`}>
          <div className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}>
            <div className="p-3 flex justify-center items-center bg-[#8b5cf61a] text-[#8b5cf6] rounded-xl">
              <BiCalendarEvent size={24} />
            </div>
            <div>
              <p className={`text-[#64748b]`}>Scheduled Posts</p>
              <h6 className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}>
                {summary?.scheduled_count ?? total}
              </h6>
            </div>
          </div>
          <div className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}>
            <div className="p-3 flex justify-center items-center bg-[#f59e0b1a] text-[#f59e0b] rounded-xl">
              <BiCalendarEvent size={24} />
            </div>
            <div>
              <p className={`text-[#64748b]`}>Pending</p>
              <h6 className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}>
                {summary?.pending_count ?? 0}
              </h6>
            </div>
          </div>
          <div className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}>
            <div className="p-3 flex justify-center items-center bg-[#10b9811a] text-[#10b981] rounded-xl">
              <BiCalendarEvent size={24} />
            </div>
            <div>
              <p className={`text-[#64748b]`}>Total Pages</p>
              <h6 className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}>
                {totalPages}
              </h6>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh + Search filter + Date Range */}
      <div className="flex gap-2 justify-between items-center mt-5 flex-wrap">
        <button
          onClick={handleRefresh}
          className={`px-2 py-1 text-white bg-[#8b5cf6] rounded-sm flex gap-2 items-center cursor-pointer disabled:opacity-50`}
          disabled={loading}
        >
          <HiOutlineRefresh className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
        <div className="flex gap-2 items-center">
          <div className="w-[280px]">
            <DateRangePicker
              value={dateRange}
              onChange={(range, startISO, endISO) => {
                setDateRange(range);
                setStartDate(startISO);
                setEndDate(endISO);
                setPage(1);
                fetchPosts(1, platformFilter, statusFilter, startISO, endISO);
              }}
            />
          </div>
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
              className={`absolute top-12 px-4 py-3 shadow-sm border rounded-sm left-[-134px] w-[260px] z-10 ${isdark ? "bg-[#1e293b] border-[#d2d7e04d]" : "bg-white border-[#e2e8f0]"}`}
            >
              <div className="space-y-3">
                <div>
                  <ConfigProvider
                    theme={{
                      algorithm: isdark ? theme.darkAlgorithm : theme.defaultAlgorithm,
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
                    <label className={`block mb-1 text-sm ${isdark ? "text-white" : ""}`}>
                      Platform
                    </label>
                    <Select
                      className="selectSet w-full"
                      value={platformFilter}
                      onChange={setPlatformFilter}
                      classNames={{
                        popup: { root: isdark ? "darkSelectDropdown" : "lightSelectDropdown" },
                      }}
                      getPopupContainer={() => filterRef.current}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                      placeholder="Select platform"
                      options={PLATFORM_OPTIONS}
                    />
                    <label className={`block mb-1 mt-3 text-sm ${isdark ? "text-white" : ""}`}>
                      Status
                    </label>
                    <Select
                      className="selectSet w-full"
                      value={statusFilter}
                      onChange={setStatusFilter}
                      classNames={{
                        popup: { root: isdark ? "darkSelectDropdown" : "lightSelectDropdown" },
                      }}
                      getPopupContainer={() => filterRef.current}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                      placeholder="Select status"
                      options={STATUS_OPTIONS}
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
      </div>

      {/* Table with API data */}
      <AnalylicsTable
        posts={posts}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UpcomingPostsPage;