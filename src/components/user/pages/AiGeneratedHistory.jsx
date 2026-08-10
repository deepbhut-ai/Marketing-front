"use client";
import { useUserContext } from "@/context/UserContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import {
  HiOutlineDocumentText,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentDuplicate,
  HiOutlineFilter,
} from "react-icons/hi";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { ConfigProvider, Select, Tooltip, theme } from "antd";
import { apiFetch } from "@/lib/apiClient";
import dayjs from "@/lib/dayjsSetup";

const ACTION_OPTIONS = [
  { value: "", label: "All" },
  { value: "caption_generation", label: "Caption Generation" },
  { value: "image_generation", label: "Image Generation" },
  { value: "video_generation", label: "Video Generation" },
];

// Friendly labels for the action_key column
const ACTION_LABELS = {
  caption_generation: "Caption",
  image_generation: "Image",
  video_generation: "Video",
};

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
      <p className={`text-sm ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>{label}</p>
      <p className={`text-2xl font-semibold ${isdark ? "text-white" : "text-[#0f172a]"}`}>
        {value}
      </p>
    </div>
  </div>
);

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
  const [pageSize] = useState(20);

  // ── Filter state ───────────────────────────────────────────────────
  const [actionFilter, setActionFilter] = useState("");

  const fetchLogs = useCallback(
    async (pageNum = 1, action = actionFilter) => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          action_key: action || "",
          page: String(pageNum),
          page_size: String(pageSize),
        }).toString();

        const data = await apiFetch(`api/credits/logs?${query}`);
        const d = data?.data || {};
        const rows = d.items || [];

        setItems(rows);
        setTotal(d.total || rows.length);
        setTotalPages(Math.ceil((d.total || rows.length) / pageSize));
        setPage(d.page || pageNum);

        // Sum up all credits used across loaded items
        setTotalCredits(rows.reduce((sum, r) => sum + (r.credits_used || 0), 0));
      } catch (error) {
        console.error("Fetch credit logs failed:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [actionFilter, pageSize]
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

  const handleFilter = () => {
    setPage(1);
    fetchLogs(1, actionFilter);
    setopenFilter(false);
  };

  const handleClear = () => {
    setActionFilter("");
    setPage(1);
    fetchLogs(1, "");
    setopenFilter(false);
  };

  const columns = ["#", "Generated For", "Action", "Credits", "Reference", "Note", "Date"];

  // Pagination page numbers: 1 ... current ... last
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (page > 3) pages.push("...");
    if (page > 2) pages.push(page - 1);
    if (page !== 1 && page !== totalPages) pages.push(page);
    if (page < totalPages - 1) pages.push(page + 1);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className={isdark ? "text-white" : "text-[#0f172a]"}>
      {/* Breadcrumb */}
      <div className={`flex items-center gap-2 text-sm ${isdark ? "text-[#64748b]" : "text-[#64748b]"}`}>
        <span className="text-[#8b5cf6]">User</span> <MdOutlineKeyboardArrowRight />{" "}
        <span>Ai-Generated-History</span>
      </div>

      {/* Stat Cards */}
      <div className="mt-6 flex flex-wrap gap-5">
        <StatCard icon={HiOutlineDocumentText} label="Total" value={total} isdark={isdark} />
        <StatCard
          icon={HiOutlineCurrencyDollar}
          label="Total Credits Used"
          value={totalCredits}
          isdark={isdark}
        />
        <StatCard
          icon={HiOutlineDocumentDuplicate}
          label="Page Size"
          value={pageSize}
          isdark={isdark}
        />
      </div>

      {/* Filter Button */}
      <div className="mt-8 flex justify-end relative">
        <button
          onClick={() => setopenFilter(!openFilter)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            isdark
              ? "bg-[#1e293b] border-[#1e293b] text-white"
              : "bg-white border-[#e5e7eb] text-[#0f172a] hover:bg-[#f9fafb]"
          }`}
        >
          <HiOutlineFilter />
          Filter
        </button>
        {openFilter && (
          <div
            ref={filterRef}
            className={`absolute top-12 px-4 py-3 shadow-sm border rounded-sm w-56 z-10 ${
              isdark ? "bg-[#1e293b] border-[#d2d7e04d]" : "bg-white border-[#e2e8f0]"
            }`}
          >
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
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleFilter}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#8b5cf6] rounded-sm text-white cursor-pointer"
                >
                  Filter
                </button>
                <button
                  onClick={handleClear}
                  className={`px-4 py-2 rounded-sm border text-sm cursor-pointer transition-colors ${
                    isdark
                      ? "border-gray-600 text-white hover:bg-[#0f172a]"
                      : "border-gray-200 text-[#475569] hover:bg-gray-50"
                  }`}
                >
                  Clear
                </button>
              </div>
            </ConfigProvider>
          </div>
        )}
      </div>

      {/* Table */}
      <div
        className={`mt-4 overflow-x-auto rounded-xl border ${
          isdark ? "border-[#1e293b] bg-[#1e293b]" : "border-[#e5e7eb] bg-white"
        }`}
      >
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className={`border-b ${isdark ? "border-[#1e293b]" : "border-[#e5e7eb]"}`}>
              {columns.map((col) => (
                <th
                  key={col}
                  className={`px-4 py-4 font-semibold whitespace-nowrap border-b ${
                    isdark
                      ? "text-white border-[#d2d7e04d]"
                      : "text-[#0f172a] border-[#e2e8f0]"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-[#94a3b8]">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
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
                      className={`px-4 py-4 whitespace-nowrap border-b ${
                        isdark ? "text-[#cbd5e1] border-[#d2d7e04d]" : "text-[#334155] border-[#e2e8f0]"
                      }`}
                    >
                      {row.id}
                    </td>
                    <td
                      className={`px-4 py-4 whitespace-nowrap border-b ${
                        isdark ? "text-[#cbd5e1] border-[#d2d7e04d]" : "text-[#334155] border-[#e2e8f0]"
                      }`}
                    >
                      {row.reference_type || "—"}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap border-b ${
                      isdark ? "border-[#d2d7e04d]" : "border-[#e2e8f0]"
                    }`}>
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
                      className={`px-4 py-4 whitespace-nowrap border-b ${
                        isdark ? "text-[#cbd5e1] border-[#d2d7e04d]" : "text-[#334155] border-[#e2e8f0]"
                      }`}
                    >
                      {row.credits_used || 0}
                    </td>
                    <td
                      className={`px-4 py-4 whitespace-nowrap border-b ${
                        isdark ? "text-[#cbd5e1] border-[#d2d7e04d]" : "text-[#334155] border-[#e2e8f0]"
                      }`}
                    >
                      #{row.reference_id || "—"}
                    </td>
                    <td
                      className={`px-4 py-4 max-w-[260px] truncate border-b ${
                        isdark ? "text-[#cbd5e1] border-[#d2d7e04d]" : "text-[#334155] border-[#e2e8f0]"
                      }`}
                    >
                      <Tooltip title={row.note || "—"} styles={{ root: { maxWidth: 300 } }}>
                        <span className="cursor-help">{row.note || "—"}</span>
                      </Tooltip>
                    </td>
                    <td
                      className={`px-4 py-4 whitespace-nowrap border-b ${
                        isdark ? "text-[#cbd5e1] border-[#d2d7e04d]" : "text-[#334155] border-[#e2e8f0]"
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
      </div>

      {/* Pagination — Previous | 1 ... current ... last | Next */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {/* Previous */}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className={`flex items-center justify-center w-8 h-8 rounded-md border text-sm transition-colors disabled:opacity-40 ${
              isdark
                ? "border-gray-600 text-white hover:bg-[#0f172a]"
                : "border-gray-200 text-[#475569] hover:bg-gray-50"
            }`}
          >
            <HiChevronLeft />
          </button>

          {/* First page */}
          <button
            onClick={() => setPage(1)}
            className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
              page === 1
                ? "bg-[#8b5cf6] text-white border border-[#8b5cf6]"
                : isdark
                  ? "border border-gray-600 text-white hover:bg-[#0f172a]"
                  : "border border-gray-200 text-[#475569] hover:bg-gray-50"
            }`}
          >
            1
          </button>

          {/* Ellipsis if current is far from page 1 */}
          {page > 3 && (
            <span className={`text-sm ${isdark ? "text-[#64748b]" : "text-gray-400"}`}>…</span>
          )}

          {/* Page 2 — show when current is 2 or 3, but only if totalPages > 2 */}
          {page >= 2 && page <= 3 && totalPages > 2 && (
            <button
              onClick={() => setPage(2)}
              className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                page === 2
                  ? "bg-[#8b5cf6] text-white border border-[#8b5cf6]"
                  : isdark
                    ? "border border-gray-600 text-white hover:bg-[#0f172a]"
                    : "border border-gray-200 text-[#475569] hover:bg-gray-50"
              }`}
            >
              2
            </button>
          )}

          {/* Current page (if > 2 and not last) */}
          {page > 2 && page < totalPages && (
            <button
              onClick={() => setPage(page)}
              className="flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium bg-[#8b5cf6] text-white border border-[#8b5cf6]"
            >
              {page}
            </button>
          )}

          {/* Page before last — show when current is near the end,
              but skip if it's the same as the current page */}
          {page >= totalPages - 1 && page < totalPages && totalPages > 2 && totalPages - 1 !== page && (
            <button
              onClick={() => setPage(totalPages - 1)}
              className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                page === totalPages - 1
                  ? "bg-[#8b5cf6] text-white border border-[#8b5cf6]"
                  : isdark
                    ? "border border-gray-600 text-white hover:bg-[#0f172a]"
                    : "border border-gray-200 text-[#475569] hover:bg-gray-50"
              }`}
            >
              {totalPages - 1}
            </button>
          )}

          {/* Ellipsis if current is far from last */}
          {page < totalPages - 2 && (
            <span className={`text-sm ${isdark ? "text-[#64748b]" : "text-gray-400"}`}>…</span>
          )}

          {/* Last page */}
          {totalPages > 1 && (
            <button
              onClick={() => setPage(totalPages)}
              className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                page === totalPages
                  ? "bg-[#8b5cf6] text-white border border-[#8b5cf6]"
                  : isdark
                    ? "border border-gray-600 text-white hover:bg-[#0f172a]"
                    : "border border-gray-200 text-[#475569] hover:bg-gray-50"
              }`}
            >
              {totalPages}
            </button>
          )}

          {/* Next */}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className={`flex items-center justify-center w-8 h-8 rounded-md border text-sm transition-colors disabled:opacity-40 ${
              isdark
                ? "border-gray-600 text-white hover:bg-[#0f172a]"
                : "border-gray-200 text-[#475569] hover:bg-gray-50"
            }`}
          >
            <HiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default AiGeneratedHistory;