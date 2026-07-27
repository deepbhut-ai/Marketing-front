"use client";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FiArchive } from "react-icons/fi";
import { RiMoneyDollarCircleLine, RiBillLine } from "react-icons/ri";

// ---------------------------------------------------------------------------
// Data — replace with your API response
// ---------------------------------------------------------------------------
const SUMMARY = {
  totalPurchase: 2,
  totalCosts: "2000.00",
  totalCredits: 2000,
};

const LOGS = [
  { id: "0000002", credits: 1000, price: "1000.00", status: "Complete", gateway: "stripe", date: "11 May 2025" },
  { id: "0000001", credits: 1000, price: "1000.00", status: "Complete", gateway: "mollie", date: "22 Apr 2025" },
];

const COLS = [
  { key: "id", label: "Transaction No" },
  { key: "credits", label: "Credits" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
  { key: "gateway", label: "Gateway" },
  { key: "date", label: "Date" },
];

// ---------------------------------------------------------------------------
const StatCard = ({ isdark, icon: Icon, tint, label, value }) => (
  <div className={`rounded-lg p-5 flex items-center gap-4 ${isdark ? "bg-[#1e293b]" : "bg-white shadow-sm"}`}>
    <span
      className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${tint}${isdark ? "33" : "1a"}`, color: tint }}
    >
      <Icon size={26} />
    </span>
    <div className="min-w-0">
      <p className={`text-base ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>{label}</p>
      <p className={`text-2xl font-semibold mt-0.5 truncate ${isdark ? "text-white" : "text-[#111827]"}`}>{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className="inline-block px-2.5 py-1 rounded-md text-xs bg-[#8b5cf6] text-white">{status}</span>
);

// ---------------------------------------------------------------------------
const CreditsLogsPage = () => {
  const { isdark } = useUserContext();

  const heading = isdark ? "text-white" : "text-[#111827]";
  const muted = isdark ? "text-[#94a3b8]" : "text-[#64748b]";
  const body = isdark ? "text-[#cbd5e1]" : "text-[#374151]";
  const borderCls = isdark ? "border-[#334155]" : "border-[#e5e7eb]";
  const cardBg = isdark ? "bg-[#1e293b]" : "bg-white shadow-sm";

  const cell = (row, key) => {
    if (key === "status") return <StatusBadge status={row.status} />;
    if (key === "price") return `$ ${row.price}`;
    return row[key];
  };

  return (
    <div>
      {/* ---------- breadcrumb + back ---------- */}
      <div className="flex justify-between gap-3 items-center flex-wrap">
        <div className={`flex items-center gap-2 text-sm ${muted}`}>
          <span className="text-[#8b5cf6]">User</span>
          <MdOutlineKeyboardArrowRight />
          <span className={isdark ? "text-[#cbd5e1]" : "text-[#374151]"}>Credit-Logs</span>
        </div>

        <Link
          href="/credits"
          className="bg-[#8b5cf6] px-4 py-2.5 rounded-md text-white text-sm hover:bg-[#7c4fe0] transition-colors"
        >
          Back to Credits
        </Link>
      </div>

      {/* ---------- stat cards ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 mt-4">
        <StatCard isdark={isdark} icon={FiArchive} tint="#8b5cf6" label="Total Purchase" value={SUMMARY.totalPurchase} />
        <StatCard isdark={isdark} icon={RiMoneyDollarCircleLine} tint="#10b981" label="Total Costs" value={`$ ${SUMMARY.totalCosts}`} />
        <StatCard isdark={isdark} icon={RiBillLine} tint="#f59e0b" label="Total Credits" value={SUMMARY.totalCredits} />
      </div>

      {/* ---------- transactions ---------- */}
      <div className={`rounded-lg mt-6 ${cardBg}`}>
        {/* desktop table */}
        <div className="hidden md:block overflow-x-auto p-2">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className={`border-b ${borderCls}`}>
                {COLS.map((c) => (
                  <th key={c.key} className={`text-left font-medium px-6 py-5 ${heading}`}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOGS.map((row) => (
                <tr key={row.id} className={`border-b last:border-b-0 ${borderCls}`}>
                  {COLS.map((c) => (
                    <td key={c.key} className={`px-6 py-4 whitespace-nowrap ${body}`}>
                      {cell(row, c.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile cards */}
        <div className="md:hidden">
          {LOGS.map((row) => (
            <div key={row.id} className={`px-4 py-4 border-b last:border-b-0 ${borderCls}`}>
              <div className="flex justify-between gap-2 items-center">
                <span className={`font-medium ${heading}`}>{row.id}</span>
                <StatusBadge status={row.status} />
              </div>
              <div className={`grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2 ${muted}`}>
                <span>Credits: {row.credits}</span>
                <span>Price: $ {row.price}</span>
                <span>Gateway: {row.gateway}</span>
                <span>Date: {row.date}</span>
              </div>
            </div>
          ))}
        </div>

        {LOGS.length === 0 && <p className={`py-14 text-center text-sm ${muted}`}>No credit logs yet.</p>}
      </div>
    </div>
  );
};

export default CreditsLogsPage;