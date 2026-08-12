"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import {
  MdOutlineFilterAlt,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { HiOutlineRefresh } from "react-icons/hi";
import { CgSearch } from "react-icons/cg";
import { ConfigProvider, Select, Tooltip, theme } from "antd";
import { FaAngleDown } from "react-icons/fa";
import { BiBarChartAlt2, BiCoinStack, BiCreditCard } from "react-icons/bi";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { apiFetch } from "@/lib/apiClient";
import dayjs from "@/lib/dayjsSetup";
import DateRangePicker from "../sections/DateRangePicker";
import TableLoader from "@/components/common/TableLoader";

const ACTION_OPTIONS = [
  { value: "", label: "All" },
  { value: "caption_generation", label: "Caption Generation" },
  { value: "image_generation", label: "Image Generation" },
  { value: "video_generation", label: "Video Generation" },
];

const ACTION_LABELS = {
  caption_generation: "Caption",
  image_generation: "Image",
  video_generation: "Video",
};

const STATUS_STYLES = {
  pending: "bg-[#f59e0b] text-white",
  posted: "bg-[#10b981] text-white",
  failed: "bg-[#f43f5e] text-white",
  complete: "bg-[#10b981] text-white",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
      STATUS_STYLES[status] ?? "bg-[#64748b] text-white"
    }`}
  >
    {status || "unknown"}
  </span>
);

const CreditLogsTable = ({ items = [], loading = false, page = 1, totalPages = 1, onPageChange }) => {
  const { isdark } = useUserContext();

  const columns = ["#", "Generated For", "Action", "Credits", "Reference", "Note", "Date"];

  if (loading) {
    return <TableLoader columns={7} rows={5} />;
  }

  return (
    <div className={`w-full overflow-x-auto rounded-sm mt-5 ${isdark ? "bg-[#1e293b]" : "bg-white"} p-2`}>
      <table className="w-full min-w-[960px] border-separate border-spacing-0">
        <thead>
          <tr>
            {columns.map((head) => (
              <th
                key={head}
                className={`px-2 py-4 text-left text-sm font-semibold border-b ${
                  isdark ? "text-white border-[#d2d7e04d]" : "border-[#e2e8f0]"
                }`}
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-10 text-center text-sm text-[#94a3b8]">
                No records found.
              </td>
            </tr>
          ) : (
            items.map((row) => {
              const dt = row.created_at ? dayjs(row.created_at) : null;
              const dateStr = dt ? dt.format("DD MMM, YYYY hh:mm A") : "—";
              const actionLabel = ACTION_LABELS[row.action_key] || row.action_key || "—";

              return (
                <tr key={row.id}>
                  <td
                    className={`px-2 py-2 whitespace-nowrap text-sm border-b ${
                      isdark ? "text-[#94a3b8] border-[#d2d7e04d]" : "text-[#475569] border-[#e2e8f0]"
                    }`}
                  >
                    {row.id}
                  </td>
                  <td
                    className={`px-2 py-2 whitespace-nowrap text-sm border-b ${
                      isdark ? "text-[#94a3b8] border-[#d2d7e04d]" : "text-[#475569] border-[#e2e8f0]"
                    }`}
                  >
                    {row.reference_type || "—"}
                  </td>
                  <td className={`px-2 py-2 whitespace-nowrap border-b ${isdark ? "border-[#d2d7e04d]" : "border-[#e2e8f0]"}`}>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        row.action_key === "image_generation"
                          ? "bg-[#8b5cf61a] text-[#8b5cf6]"
                          : row.action_key === "video_generation"
                            ? "bg-[#f59e0b1a] text-[#f59e0b]"
                            : "bg-[#10b9811a] text-[#10b981]"
                      }`}
                    >
                      {actionLabel}
                    </span>
                  </td>
                  <td
                    className={`px-2 py-2 whitespace-nowrap text-sm border-b ${
                      isdark ? "text-[#94a3b8] border-[#d2d7e04d]" : "text-[#475569] border-[#e2e8f0]"
                    }`}
                  >
                    {row.credits_used || 0}
                  </td>
                  <td
                    className={`px-2 py-2 whitespace-nowrap text-sm border-b ${
                      isdark ? "text-[#94a3b8] border-[#d2d7e04d]" : "text-[#475569] border-[#e2e8f0]"
                    }`}
                  >
                    #{row.reference_id || "—"}
                  </td>
                  <td
                    className={`px-2 py-2 max-w-[200px] truncate text-sm border-b ${
                      isdark ? "text-[#94a3b8] border-[#d2d7e04d]" : "text-[#475569] border-[#e2e8f0]"
                    }`}
                  >
                    <Tooltip title={row.note || "—"} styles={{ root: { maxWidth: 300 } }}>
                      <span className="cursor-help">{row.note || "—"}</span>
                    </Tooltip>
                  </td>
                  <td
                    className={`px-2 py-2 whitespace-nowrap text-sm border-b ${
                      isdark ? "text-[#94a3b8] border-[#d2d7e04d]" : "text-[#475569] border-[#e2e8f0]"
                    }`}
                  >
                    {dateStr}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <button
            onClick={() => onPageChange?.(page - 1)}
            disabled={page <= 1}
            className={`flex items-center justify-center w-8 h-8 rounded-md border text-sm transition-colors disabled:opacity-40 ${
              isdark
                ? "border-gray-600 text-white hover:bg-[#0f172a]"
                : "border-gray-200 text-[#475569] hover:bg-gray-50"
            }`}
          >
            <HiChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange?.(p)}
              className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                page === p
                  ? "bg-[#8b5cf6] text-white border border-[#8b5cf6]"
                  : isdark
                    ? "border border-gray-600 text-white hover:bg-[#0f172a]"
                    : "border border-gray-200 text-[#475569] hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= totalPages}
            className={`flex items-center justify-center w-8 h-8 rounded-md border text-sm transition-colors disabled:opacity-40 ${
              isdark
                ? "border-gray-600 text-white hover:bg-[#0f172a]"
                : "border-gray-200 text-[#475569] hover:bg-gray-50"
            }`}
          >
            <HiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const AiGeneratedHistory = () => {
  const { isdark } = useUserContext();
  const [openFilter, setopenFilter] = useState(false);
  const filterRef = useRef(null);

  // ── API state ──────────────────────────────────────────────────────
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [pageSize] = useState(10);

  // ── Filter state ───────────────────────────────────────────────────
  const [actionFilter, setActionFilter] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchLogs = useCallback(
    async (pageNum = 1, action = actionFilter, start = startDate, end = endDate) => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          action_key: action || "",
          page: String(pageNum),
          page_size: String(pageSize),
        });
        if (start) query.set("start_date", start);
        if (end) query.set("end_date", end);

        const data = await apiFetch(`api/credits/logs?${query.toString()}`);
        const d = data?.data || {};
        const rows = d.items || [];

        setItems(rows);
        setTotal(d.total || rows.length);
        setTotalPages(Math.ceil((d.total || rows.length) / pageSize));
        setPage(d.page || pageNum);
        setTotalCredits(rows.reduce((sum, r) => sum + (r.credits_used || 0), 0));
      } catch (error) {
        console.error("Fetch credit logs failed:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [actionFilter, pageSize, startDate, endDate]
  );

  useEffect(() => {
    fetchLogs(page);
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
    fetchLogs(1, actionFilter, startDate, endDate);
    setopenFilter(false);
  };

  const handleClear = () => {
    setActionFilter("");
    setDateRange(null);
    setStartDate(null);
    setEndDate(null);
    setPage(1);
    fetchLogs(1, "", null, null);
    setopenFilter(false);
  };

  const handleRefresh = () => {
    fetchLogs(page, actionFilter, startDate, endDate);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div
        className={`flex items-center gap-2 text-sm ${isdark ? "text-[#64748b]" : "text-[#64748b]"}`}
      >
        <span className="text-[#8b5cf6]">User</span>{" "}
        <MdOutlineKeyboardArrowRight /> <span>Ai-Generated-History</span>
      </div>

      {/* Stat cards */}
      <div className={`flex gap-5 flex-wrap mt-3`}>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 w-full`}>
          <div className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}>
            <div className="p-3 flex justify-center items-center bg-[#8b5cf61a] text-[#8b5cf6] rounded-xl">
              <BiBarChartAlt2 size={24} />
            </div>
            <div>
              <p className={`text-[#64748b]`}>Total</p>
              <h6 className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}>
                {total}
              </h6>
            </div>
          </div>
          <div className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}>
            <div className="p-3 flex justify-center items-center bg-[#10b9811a] text-[#10b981] rounded-xl">
              <BiCoinStack size={24} />
            </div>
            <div>
              <p className={`text-[#64748b]`}>Total Credits Used</p>
              <h6 className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}>
                {totalCredits}
              </h6>
            </div>
          </div>
          <div className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}>
            <div className="p-3 flex justify-center items-center bg-[#f59e0b1a] text-[#f59e0b] rounded-xl">
              <BiCreditCard size={24} />
            </div>
            <div>
              <p className={`text-[#64748b]`}>Page Size</p>
              <h6 className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}>
                {pageSize}
              </h6>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh + Filter + Date Range */}
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
                fetchLogs(1, actionFilter, startISO, endISO);
              }}
            />
          </div>
          <div className="relative" ref={filterRef}>
          <button
            onClick={() => setopenFilter(!openFilter)}
            className={`flex gap-2 items-center shadow-sm rounded-sm px-4 py-1 ${isdark ? "text-white bg-[#1e293b]" : " bg-white"} `}
          >
            <MdOutlineFilterAlt className="text-[#94a3b8]" /> Filter{" "}
            <FaAngleDown className="text-[#94a3b8]" />
          </button>
          {openFilter && (
            <div
              className={`absolute top-12 px-4 py-3 shadow-sm border rounded-sm right-0 w-[260px] z-10 ${isdark ? "bg-[#1e293b] border-[#d2d7e04d]" : "bg-white border-[#e2e8f0]"}`}
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
                      Action Type
                    </label>
                    <Select
                      className="selectSet w-full"
                      value={actionFilter}
                      onChange={setActionFilter}
                      classNames={{
                        popup: { root: isdark ? "darkSelectDropdown" : "lightSelectDropdown" },
                      }}
                      getPopupContainer={() => filterRef.current}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                      placeholder="Select action"
                      options={ACTION_OPTIONS}
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

      {/* Table */}
      <CreditLogsTable
        items={items}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AiGeneratedHistory;