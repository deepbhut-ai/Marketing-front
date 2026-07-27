"use client";
import { useUserContext } from "@/context/UserContext";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

// ---------------------------------------------------------------------------
// Data — replace with your API response
// ---------------------------------------------------------------------------
const CYCLES = [
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
  { key: "lifetime", label: "Lifetime" },
];

const COMMON_FEATURES = [
  "Show the analytics of brand contents",
  "Stock library access (Unsplash, Pixels)",
  "Storage limitation in 2 GB",
  "Allow post scheduling",
  "Access Image Editor",
];

const PLANS = [
  {
    id: "enterprise",
    name: "Enterprise",
    prices: { monthly: 20, yearly: 230, lifetime: 500 },
    features: ["Credit: 8000", "Max 20 Brands", "Max 20 Social Account", "Max 100 Posts", ...COMMON_FEATURES],
  },
  {
    id: "starter",
    name: "Starter",
    prices: { monthly: 10, yearly: 110, lifetime: 400 },
    features: ["Credit: 5000", "Max 10 Brands", "Max 10 Social Account", "Max 25 Posts", ...COMMON_FEATURES],
  },
  {
    id: "advance",
    name: "Advance",
    prices: { monthly: 30, yearly: 350, lifetime: 700 },
    features: ["Credit: 20000", "Unlimited Brands", "Unlimited Social Account", "Unlimited Posts", ...COMMON_FEATURES],
  },
];

const CURRENT = {
  planId: "starter",
  planName: "Starter",
  cycleLabel: "Monthly Plan",
  amount: "10.00",
  expiresOn: "Aug 06, 2026",
  description:
    "Unlimited access to our legal document library and online rental application tool, billed monthly.",
};

const HISTORY = [
  { invoice: "0000040", plan: "Starter", amount: "10.00", tax: "0.00", status: "approved", expire: "06 Aug, 2026", created: "07 Jul, 2026" },
  { invoice: "0000039", plan: "Enterprise", amount: "20.00", tax: "0.00", status: "approved", expire: "06 Aug, 2026", created: "07 Jul, 2026" },
  { invoice: "0000037", plan: "Enterprise", amount: "20.00", tax: "0.00", status: "approved", expire: "07 Jun, 2026", created: "08 May, 2026" },
  { invoice: "0000036", plan: "Enterprise", amount: "20.00", tax: "0.00", status: "approved", expire: "25 Apr, 2026", created: "26 Mar, 2026" },
  { invoice: "0000033", plan: "Enterprise", amount: "20.00", tax: "0.00", status: "approved", expire: "22 Mar, 2026", created: "20 Feb, 2026" },
  { invoice: "0000031", plan: "Enterprise", amount: "20.00", tax: "0.00", status: "approved", expire: "14 Feb, 2026", created: "16 Jan, 2026" },
  { invoice: "0000027", plan: "Advance", amount: "30.00", tax: "0.00", status: "approved", expire: "13 Jan, 2026", created: "14 Dec, 2025" },
  { invoice: "0000022", plan: "Advance", amount: "30.00", tax: "0.00", status: "approved", expire: "26 Nov, 2025", created: "28 Oct, 2025" },
  { invoice: "0000019", plan: "Advance", amount: "30.00", tax: "0.00", status: "approved", expire: "02 Nov, 2025", created: "04 Oct, 2025" },
  { invoice: "0000018", plan: "Advance", amount: "30.00", tax: "0.00", status: "approved", expire: "01 Oct, 2025", created: "01 Sep, 2025" },
  { invoice: "0000010", plan: "Starter", amount: "110.00", tax: "0.00", status: "approved", expire: "05 Jun, 2026", created: "05 Jun, 2025" },
];

const COLS = [
  { key: "invoice", label: "Invoice No" },
  { key: "plan", label: "Plan" },
  { key: "amount", label: "Amount", money: true },
  { key: "tax", label: "Tax", money: true },
  { key: "status", label: "Status" },
  { key: "expire", label: "Expire Date" },
  { key: "created", label: "Created Date" },
];

// ---------------------------------------------------------------------------
const Subscription = () => {
  const { isdark } = useUserContext();
  const [cycle, setCycle] = useState("monthly");

  const cycleLabel = CYCLES.find((c) => c.key === cycle)?.label;

  const muted = isdark ? "text-[#94a3b8]" : "text-[#64748b]";
  const heading = isdark ? "text-white" : "text-[#111827]";
  const cardBg = isdark ? "bg-[#1e293b]" : "bg-white";
  const borderCls = isdark ? "border-[#334155]" : "border-[#e2e8f0]";

  return (
    <div>
      {/* ---------- breadcrumb + cycle toggle ---------- */}
      <div className="flex justify-between gap-4 items-center flex-wrap">
        <div className={`flex items-center gap-2 text-sm ${muted}`}>
          <span className="text-[#8b5cf6]">User</span>
          <MdOutlineKeyboardArrowRight />
          <span className={isdark ? "text-[#cbd5e1]" : "text-[#374151]"}>Subscription</span>
        </div>

        <div className={`flex rounded-full p-1 w-full sm:w-auto ${cardBg} ${isdark ? "" : "shadow-sm"}`}>
          {CYCLES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCycle(c.key)}
              className={`flex-1 sm:flex-none sm:w-[145px] py-2 text-sm rounded-full cursor-pointer transition-colors ${
                cycle === c.key
                  ? "bg-[#8b5cf6] text-white"
                  : `${muted} ${isdark ? "hover:bg-white/5" : "hover:bg-black/5"}`
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- current plan hero (no card background) ---------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8">
        <div className="md:max-w-[380px]">
          <h5 className={`text-base font-semibold ${heading}`}>Current Plan ({CURRENT.planName})</h5>
          <p className={`text-sm mt-2 leading-relaxed ${muted}`}>{CURRENT.description}</p>
        </div>

        <p className={`text-3xl font-semibold ${heading}`}>$ {CURRENT.amount}</p>

        <div className="md:text-right">
          <p className={`text-sm font-semibold ${heading}`}>{CURRENT.cycleLabel}</p>
          <p className={`text-sm mt-1 ${muted}`}>Your subscription will</p>
          <p className={`text-sm ${muted}`}>expire {CURRENT.expiresOn}</p>
        </div>
      </div>

      {/* ---------- plan cards ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 mt-8">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === CURRENT.planId;
          return (
            <div
              key={plan.id}
              className={`rounded-lg border p-6 flex flex-col transition-colors ${
                isCurrent ? `${cardBg} border-[#8b5cf6]` : `bg-transparent ${borderCls}`
              }`}
            >
              <h6 className={`text-center text-base font-medium ${heading}`}>{plan.name}</h6>

              <p className={`text-center mt-4 ${heading}`}>
                <span className="text-3xl font-semibold">$ {plan.prices[cycle]}</span>{" "}
                <span className={`text-sm ${muted}`}>{cycleLabel}</span>
              </p>

              <ul className={`mt-6 flex flex-col gap-2.5 text-sm ${muted}`}>
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <button
                className={`mt-6 mx-auto px-10 py-2 rounded-md text-sm cursor-pointer transition-opacity hover:opacity-85 ${
                  isdark ? "bg-[#4c1d95] text-[#ddd6fe]" : "bg-[#ede9fe] text-[#6d28d9]"
                }`}
              >
                Choose Plan
              </button>
            </div>
          );
        })}
      </div>

      {/* ---------- subscription history ---------- */}
      <h5 className={`text-base font-semibold mt-10 ${heading}`}>Subscription History</h5>

      <div className={`rounded-lg mt-3 ${cardBg} ${isdark ? "" : "shadow-sm"}`}>
        {/* desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm min-w-[880px]">
            <thead>
              <tr className={`border-b ${borderCls}`}>
                {COLS.map((c) => (
                  <th key={c.key} className={`text-left font-medium px-6 py-4 ${heading}`}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HISTORY.map((row) => (
                <tr key={row.invoice} className={`border-b last:border-b-0 ${borderCls}`}>
                  {COLS.map((c) => (
                    <td key={c.key} className={`px-6 py-3 whitespace-nowrap ${isdark ? "text-[#cbd5e1]" : "text-[#374151]"}`}>
                      {c.money ? `$ ${row[c.key]}` : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile cards */}
        <div className="md:hidden">
          {HISTORY.map((row) => (
            <div key={row.invoice} className={`px-4 py-4 border-b last:border-b-0 ${borderCls}`}>
              <div className="flex justify-between gap-2 items-center">
                <span className={`font-medium ${heading}`}>{row.invoice}</span>
                <span className={`text-sm ${muted}`}>{row.plan}</span>
              </div>
              <div className={`grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2 ${muted}`}>
                <span>Amount: $ {row.amount}</span>
                <span>Tax: $ {row.tax}</span>
                <span>Status: {row.status}</span>
                <span>Expires: {row.expire}</span>
                <span className="col-span-2">Created: {row.created}</span>
              </div>
            </div>
          ))}
        </div>

        {HISTORY.length === 0 && (
          <p className={`py-14 text-center text-sm ${muted}`}>No subscription history yet.</p>
        )}
      </div>
    </div>
  );
};

export default Subscription;