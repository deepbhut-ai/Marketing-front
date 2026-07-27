"use client";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import React, { useState } from "react";
import { ConfigProvider, Select, theme } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BsCreditCard2Front } from "react-icons/bs";

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------
const GREEN = "#4ade80";
const BAR_GREEN = "#7bc496";
const RED = "#f87171";
const PURPLE = "#8b5cf6";

const RANGES = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

// Replace with your API data — one series per range
const COST_DATA = {
  day: [
    { label: "0", value: 0 },
    { label: "1", value: 0 },
    { label: "2", value: 0 },
    { label: "3", value: 0 },
    { label: "4", value: 0 },
    { label: "5", value: 0 },
  ],
  week: [
    { label: "Mon", value: 0 },
    { label: "Tue", value: 0 },
    { label: "Wed", value: 0 },
    { label: "Thu", value: 0 },
    { label: "Fri", value: 0 },
    { label: "Sat", value: 0 },
    { label: "Sun", value: 0 },
  ],
  month: [
    { label: "Jan", value: 0 },
    { label: "Feb", value: 0 },
    { label: "Mar", value: 0 },
    { label: "Apr", value: 0 },
    { label: "May", value: 0 },
    { label: "Jun", value: 0 },
    { label: "Jul", value: 308 },
  ],
  year: [
    { label: "2024", value: 26000 },
    { label: "2025", value: 18000 },
    { label: "2026", value: 348 },
  ],
};

const BILL = {
  periodLabel: "01 Jul - 31 Jul",
  used: 308,
  limit: 128754,
};

const USAGE = { available: 100, used: 0 };

// ---------------------------------------------------------------------------
const CreditsPage = () => {
  const { isdark } = useUserContext();
  const [range, setRange] = useState("year");

  const data = COST_DATA[range] ?? [];
  const costs = data.reduce((sum, d) => sum + d.value, 0);

  const donutData = [
    { name: "Available", value: Math.max(BILL.limit - BILL.used, 0), color: GREEN },
    { name: "Used", value: BILL.used, color: RED },
  ];

  const usageTotal = USAGE.available + USAGE.used || 1;
  const availablePct = (USAGE.available / usageTotal) * 100;

  // ---- tokens ----
  const cardCls = `rounded-lg p-5 sm:p-6 ${isdark ? "bg-[#1e293b]" : "bg-white shadow-sm"}`;
  const heading = isdark ? "text-white" : "text-[#111827]";
  const muted = isdark ? "text-[#94a3b8]" : "text-[#64748b]";
  const gridColor = isdark ? "#475569" : "#e5e7eb";
  const tickColor = isdark ? "#94a3b8" : "#94a3b8";

  const antdTheme = {
    algorithm: isdark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: PURPLE,
      colorBorder: isdark ? "#334155" : "#e2e8f0",
      colorText: isdark ? "#ffffff" : "#111827",
      colorBgElevated: isdark ? "#1e293b" : "#ffffff",
      borderRadius: 6,
      controlHeight: 44,
      fontSize: 14,
    },
    components: {
      Select: {
        selectorBg: isdark ? "transparent" : "#ffffff",
        optionSelectedBg: isdark ? "#334155" : "#ede9fe",
        optionSelectedColor: isdark ? "#ffffff" : "#6d28d9",
        optionActiveBg: isdark ? "#2d3c4c" : "#f1f5f9",
        hoverBorderColor: PURPLE,
        activeBorderColor: PURPLE,
        activeOutlineColor: "rgba(139, 92, 246, 0.2)",
      },
    },
  };

  const tooltipStyle = {
    backgroundColor: isdark ? "#0f172a" : "#ffffff",
    border: `1px solid ${isdark ? "#334155" : "#e2e8f0"}`,
    borderRadius: 6,
    fontSize: 12,
    color: isdark ? "#e2e8f0" : "#111827",
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <div>
        {/* ---------- breadcrumb + actions ---------- */}
        <div className="flex justify-between gap-3 items-center flex-wrap">
          <div className={`flex items-center gap-2 text-sm ${muted}`}>
            <span className="text-[#8b5cf6]">User</span>
            <MdOutlineKeyboardArrowRight />
            <span className={isdark ? "text-[#cbd5e1]" : "text-[#374151]"}>Credits</span>
          </div>

          <div className="flex gap-3">
            <Link
              href="/credits-logs"
              className="bg-[#8b5cf6] px-4 py-2.5 rounded-md text-white text-sm hover:bg-[#7c4fe0] transition-colors"
            >
              Credit Logs
            </Link>
            <Link
              href="/credit-history"
              className="bg-[#8b5cf6] px-4 py-2.5 rounded-md text-white text-sm hover:bg-[#7c4fe0] transition-colors"
            >
              Credit History
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4">
          {/* ---------- costs chart ---------- */}
          <div className={`${cardCls} lg:col-span-2`}>
            <div className="flex justify-between gap-3 items-center flex-wrap">
              <h5 className={`flex items-center gap-2.5 text-lg font-medium ${heading}`}>
                <BsCreditCard2Front size={20} className={muted} />
                Costs: {costs}
              </h5>

              <Select
                value={range}
                onChange={setRange}
                options={RANGES}
                className="w-full sm:w-[200px]"
              />
            </div>

            <div className="mt-8 h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid stroke={gridColor} vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={{ stroke: gridColor }}
                    tick={{ fill: tickColor, fontSize: 12 }}
                    dy={8}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: isdark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}
                  />
                  <Bar dataKey="value" name="Cost" fill={BAR_GREEN} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ---------- monthly bill ---------- */}
          <div className={cardCls}>
            <h5 className={`text-lg font-semibold ${heading}`}>
              Monthly Bill <span className={`text-base font-normal ${muted}`}>{BILL.periodLabel}</span>
            </h5>

            {/* donut + stats */}
            <div className="flex items-center justify-center gap-4 flex-wrap mt-6">
              <div className="h-[220px] w-[220px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      innerRadius="56%"
                      outerRadius="98%"
                      startAngle={90}
                      endAngle={-270}
                      stroke={isdark ? "#1e293b" : "#ffffff"}
                      strokeWidth={2}
                    >
                      {donutData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="shrink-0">
                <p className={`text-3xl font-bold ${heading}`}>{BILL.used}</p>
                <p className={`text-base mt-1 ${muted}`}>
                  / {BILL.limit}
                  <br />
                  limit
                </p>
                <button className="mt-4 px-4 py-2.5 rounded-md bg-[#8b5cf6] text-white text-sm leading-tight cursor-pointer hover:bg-[#7c4fe0] transition-colors">
                  Increase
                  <br />
                  limit
                </button>
              </div>
            </div>

            {/* credit usage */}
            <h6 className={`text-base font-semibold mt-8 ${heading}`}>Credit Usage</h6>

            <div className="flex justify-between gap-2 items-center mt-3">
              <span className={`flex items-center gap-2 text-sm ${heading}`}>
                <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: GREEN }} />
                Available
              </span>
              <span className={`flex items-center gap-2 text-sm ${heading}`}>
                <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: RED }} />
                Used
              </span>
            </div>

            <div
              className={`h-3 w-full rounded-sm overflow-hidden mt-2 ${isdark ? "bg-[#334155]" : "bg-[#f1f5f9]"}`}
              style={{ backgroundColor: RED }}
            >
              <div className="h-full transition-all" style={{ width: `${availablePct}%`, backgroundColor: GREEN }} />
            </div>

            <div className={`flex justify-between gap-2 text-sm mt-2 ${heading}`}>
              <span>{USAGE.available}</span>
              <span>{USAGE.used}</span>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CreditsPage;