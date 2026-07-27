"use client";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FiArchive } from "react-icons/fi";
import { RiMoneyDollarCircleLine, RiBillLine } from "react-icons/ri";

// ---------------------------------------------------------------------------
// Data — replace with your API response
// ---------------------------------------------------------------------------
const SUMMARY = {
  total: 234,
  totalCredits: 8231.5,
  remainingCredits: 0,
};

const HISTORY = [
  { id: 1, description: "This record is generated for brand_posts slogan", credits: "0.50", date: "23 Jun 2026" },
  { id: 2, description: "This record is generated for brand_posts slogan", credits: "0.50", date: "04 May 2026" },
  { id: 3, description: "This record is generated for brand_posts slogan", credits: "0.50", date: "26 Apr 2026" },
  { id: 4, description: "This record is generated for brand_posts slogan", credits: "0.50", date: "08 Apr 2026" },
  { id: 5, description: "This record is generated for brand_posts slogan", credits: "0.50", date: "17 Mar 2026" },
  { id: 6, description: "This record is generated for brand_posts post", credits: "100.00", date: "13 Mar 2026" },
  { id: 7, description: "This record is generated for template video", credits: "0", date: "13 Mar 2026" },
  { id: 8, description: "This record is generated for brand_posts slogan", credits: "0.50", date: "13 Mar 2026" },
  { id: 9, description: "This record is generated for brand_posts slogan", credits: "0.50", date: "13 Feb 2026" },
  { id: 10, description: "This record is generated for template video", credits: "100", date: "10 Feb 2026" },
];

const TOTAL_PAGES = 24;

// ---------------------------------------------------------------------------
// Pagination: window of 10 pages, ellipsis, then the last two
// ---------------------------------------------------------------------------
const getPages = (current, total, win = 10) => {
  if (total <= win + 3) return Array.from({ length: total }, (_, i) => i + 1);

  let start = Math.max(1, current - Math.floor(win / 2) + 1);
  if (start + win - 1 > total) start = total - win + 1;
  start = Math.max(1, start);
  const end = Math.min(start + win - 1, total);

  const pages = [];
  if (start > 1) {
    pages.push(1, 2);
    if (start > 3) pages.push("start-gap");
  }
  for (let i = start; i <= end; i++) if (!pages.includes(i)) pages.push(i);
  if (end < total) {
    if (end < total - 2) pages.push("end-gap");
    for (let i = Math.max(end + 1, total - 1); i <= total; i++) pages.push(i);
  }
  return pages;
};

const StatCard = ({ isdark, icon: Icon, tint, label, value }) => (
  <div className={`rounded-lg p-5 flex items-center gap-4 ${isdark ? "bg-[#1e293b]" : "bg-white shadow-sm"}`}>
    <span
      className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${tint}${isdark ? "33" : "1a"}`, color: tint }}
    >
      <Icon size={24} />
    </span>
    <div className="min-w-0">
      <p className={`text-sm ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>{label}</p>
      <p className={`text-2xl font-semibold mt-0.5 truncate ${isdark ? "text-white" : "text-[#111827]"}`}>{value}</p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
const CreditsHistoryPage = () => {
  const { isdark } = useUserContext();
  const [page, setPage] = useState(1);

  const heading = isdark ? "text-white" : "text-[#111827]";
  const muted = isdark ? "text-[#94a3b8]" : "text-[#64748b]";
  const body = isdark ? "text-[#cbd5e1]" : "text-[#374151]";
  const borderCls = isdark ? "border-[#334155]" : "border-[#e5e7eb]";
  const cardBg = isdark ? "bg-[#1e293b]" : "bg-white shadow-sm";

  const pageBtn = (active) =>
    `min-w-[38px] px-3 py-2 rounded-md text-sm border transition-colors ${
      active
        ? "bg-[#8b5cf6] border-[#8b5cf6] text-white"
        : isdark
        ? `${borderCls} ${body} hover:border-[#8b5cf6] hover:text-[#8b5cf6] cursor-pointer`
        : `${borderCls} ${body} hover:border-[#8b5cf6] hover:text-[#8b5cf6] cursor-pointer`
    }`;

  const pages = getPages(page, TOTAL_PAGES);

  return (
    <div>
      {/* ---------- breadcrumb + back ---------- */}
      <div className="flex justify-between gap-3 items-center flex-wrap">
        <div className={`flex items-center gap-2 text-sm ${muted}`}>
          <span className="text-[#8b5cf6]">User</span>
          <MdOutlineKeyboardArrowRight />
          <span className={isdark ? "text-[#cbd5e1]" : "text-[#374151]"}>Credit-History</span>
        </div>

        <Link
          href="/credits"
          className="bg-[#8b5cf6] px-4 py-2.5 rounded-md text-white text-sm hover:bg-[#7c4fe0] transition-colors"
        >
          Back to Credits
        </Link>
      </div>

      {/* ---------- stat cards ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-4">
        <StatCard isdark={isdark} icon={FiArchive} tint="#8b5cf6" label="Total" value={SUMMARY.total} />
        <StatCard isdark={isdark} icon={RiMoneyDollarCircleLine} tint="#10b981" label="Total Credits" value={SUMMARY.totalCredits} />
        <StatCard isdark={isdark} icon={RiBillLine} tint="#f59e0b" label="Total Credits" value={SUMMARY.remainingCredits} />
      </div>

      {/* ---------- history table ---------- */}
      <div className={`rounded-lg mt-6 p-2 ${cardBg}`}>
        {/* desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${borderCls}`}>
                <th className={`text-left font-medium px-6 py-5 ${heading}`}>Description</th>
                <th className={`text-left font-medium px-6 py-5 w-[200px] ${heading}`}>Credits</th>
                <th className={`text-left font-medium px-6 py-5 w-[240px] ${heading}`}>Date</th>
              </tr>
            </thead>
            <tbody>
              {HISTORY.map((row) => (
                <tr key={row.id} className={`border-b last:border-b-0 ${borderCls}`}>
                  <td className={`px-6 py-4 ${body}`}>{row.description}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${body}`}>{row.credits}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${body}`}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile cards */}
        <div className="md:hidden">
          {HISTORY.map((row) => (
            <div key={row.id} className={`px-3 py-4 border-b last:border-b-0 ${borderCls}`}>
              <p className={`text-sm ${body}`}>{row.description}</p>
              <div className={`flex justify-between gap-2 text-xs mt-2 ${muted}`}>
                <span>Credits: {row.credits}</span>
                <span>{row.date}</span>
              </div>
            </div>
          ))}
        </div>

        {HISTORY.length === 0 && <p className={`py-14 text-center text-sm ${muted}`}>No credit history yet.</p>}

        {/* ---------- pagination ---------- */}
        {TOTAL_PAGES > 1 && (
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 px-4 py-5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`${pageBtn(false)} disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-inherit`}
            >
              « Previous
            </button>

            {pages.map((p) =>
              typeof p === "number" ? (
                <button key={p} onClick={() => setPage(p)} className={pageBtn(p === page)}>
                  {p}
                </button>
              ) : (
                <span key={p} className={`min-w-[38px] px-3 py-2 text-sm text-center ${muted}`}>
                  ...
                </span>
              )
            )}

            <button
              onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              disabled={page === TOTAL_PAGES}
              className={`${pageBtn(false)} disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-inherit`}
            >
              Next »
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditsHistoryPage;