"use client";
import { useUserContext } from "@/context/UserContext";
import React, { useState } from "react";
import {
  BiBox,
  BiCart,
  BiCartDownload,
  BiMemoryCard,
  BiReceipt,
} from "react-icons/bi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiUser, FiInbox } from "react-icons/fi";
import { LuCircleDollarSign } from "react-icons/lu";
import {
  MdOutlineKeyboardArrowRight,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { RiGroupLine } from "react-icons/ri";

const FILTER_OPTIONS = ["Day", "Week", "Month", "Year"];

const SALES_DATA = {
  Day: [
    { label: "Mon", value: 1 },
    { label: "Tue", value: 2 },
    { label: "Wed", value: 1 },
    { label: "Thu", value: 3 },
    { label: "Fri", value: 2 },
    { label: "Sat", value: 4 },
    { label: "Sun", value: 3 },
  ],
  Week: [
    { label: "Week 1", value: 8 },
    { label: "Week 2", value: 14 },
    { label: "Week 3", value: 10 },
    { label: "Week 4", value: 18 },
  ],
  Month: [
    { label: "Jan", value: 80 },
    { label: "Feb", value: 50 },
    { label: "Mar", value: 50 },
    { label: "May", value: 40 },
    { label: "Jul", value: 25 },
  ],
  Year: [
    { label: "2022", value: 120 },
    { label: "2023", value: 190 },
    { label: "2024", value: 160 },
    { label: "2025", value: 240 },
  ],
};

const PLAN_TABS = ["Today", "Month", "All"];

const PLAN_DATA = {
  Today: [
    { name: "Starter", price: "10.00", cycle: "Monthly", orders: 2 },
    { name: "Enterprise", price: "20.00", cycle: "Monthly", orders: 1 },
  ],
  Month: [
    { name: "Starter", price: "10.00", cycle: "Monthly", orders: 13 },
    { name: "Enterprise", price: "20.00", cycle: "Monthly", orders: 12 },
    { name: "Advance", price: "30.00", cycle: "Monthly", orders: 10 },
    { name: "Starter", price: "110.00", cycle: "Yearly", orders: 3 },
  ],
  All: [
    { name: "Starter", price: "10.00", cycle: "Monthly", orders: 48 },
    { name: "Enterprise", price: "20.00", cycle: "Monthly", orders: 39 },
    { name: "Advance", price: "30.00", cycle: "Monthly", orders: 27 },
    { name: "Starter", price: "110.00", cycle: "Yearly", orders: 9 },
  ],
};

const POPULAR_PLANS = [
  { plan: "Starter", users: 14, sales: 13, amount: "130.00" },
  { plan: "Enterprise", users: 6, sales: 12, amount: "240.00" },
  { plan: "Advance", users: 6, sales: 10, amount: "300.00" },
  { plan: "Starter", users: 1, sales: 3, amount: "330.00" },
  { plan: "Enterprise", users: 1, sales: 1, amount: "500.00" },
  { plan: "Advance", users: 2, sales: 1, amount: "702.00" },
];

const RECENT_POSTS = [
  { brand: "Arrow development", user: "Callum Jackson", title: "None" },
  { brand: "df dsfsd f", user: "ali", title: "None" },
  { brand: "df dsfsd f", user: "ali", title: "None" },
  { brand: "df dsfsd f", user: "ali", title: "None" },
  { brand: "Car Wash", user: "Mia", title: "None" },
  { brand: "test brand", user: "Mia", title: "None" },
];

const RECENT_CREDITS = [
  { invoice: "0000001", user: "test user", credits: 1000, price: "1000.00", status: "Complete" },
  { invoice: "0000002", user: "test user", credits: 1000, price: "1000.00", status: "Complete" },
  { invoice: "0000003", user: "md maruf", credits: 1000, price: "1000.00", status: "Complete" },
  { invoice: "0000004", user: "Mia", credits: 500, price: "500.00", status: "Complete" },
];

const SalesOverviewChart = ({ isdark }) => {
  const [filter, setFilter] = useState("Day");
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h6 className={`font-medium ${isdark ? "text-white" : "text-[#1e293b]"}`}>
          Overview Of Sales
        </h6>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className={`flex items-center justify-between gap-8 border rounded-lg px-4 py-2 text-sm min-w-[130px]
            ${open ? "border-[#8b5cf6]" : isdark ? "border-[#334155]" : "border-[#e2e8f0]"}
            ${isdark ? "text-white bg-[#1e293b]" : "text-[#334155] bg-white"}`}
          >
            {filter}
            <MdKeyboardArrowDown
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div
              className={`absolute right-0 mt-1 w-full rounded-lg shadow-lg overflow-hidden z-10 border
              ${isdark ? "bg-[#1e293b] border-[#334155]" : "bg-white border-[#e2e8f0]"}`}
            >
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setFilter(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm
                  ${
                    opt === filter
                      ? "bg-[#8b5cf6] text-white"
                      : isdark
                        ? "text-slate-200 hover:bg-[#334155]"
                        : "text-[#334155] hover:bg-[#f1f5f9]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ width: "100%", height: 300 }} className="mt-4">
        <ResponsiveContainer>
          <AreaChart data={SALES_DATA[filter]} margin={{ left: -20, right: 10, top: 10 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isdark ? "#334155" : "#e2e8f0"}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: isdark ? "#94a3b8" : "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: isdark ? "#94a3b8" : "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isdark ? "#0f172a" : "#fff",
                border: `1px solid ${isdark ? "#334155" : "#e2e8f0"}`,
                borderRadius: 8,
                fontSize: 12,
                color: isdark ? "#e2e8f0" : "#334155",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Sales"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#salesGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const MostOrderedPlan = ({ isdark }) => {
  const [tab, setTab] = useState("Month");

  return (
    <div
      className={`shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h6 className={`font-medium ${isdark ? "text-white" : "text-[#1e293b]"}`}>
          Most Ordered Plan
        </h6>
        <div className="flex items-center gap-3 text-sm">
          {PLAN_TABS.map((t, i) => (
            <React.Fragment key={t}>
              <button
                onClick={() => setTab(t)}
                className={
                  tab === t
                    ? "text-[#8b5cf6] font-medium"
                    : isdark
                      ? "text-slate-400"
                      : "text-[#64748b]"
                }
              >
                {t}
              </button>
              {i < PLAN_TABS.length - 1 && (
                <span className={isdark ? "text-slate-600" : "text-[#cbd5e1]"}>|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {PLAN_DATA[tab].map((plan, i) => (
          <div
            key={i}
            className={`rounded-lg p-4 ${isdark ? "bg-[#0f172a]" : "bg-[#f8fafc]"}`}
          >
            <p className={`font-medium ${isdark ? "text-white" : "text-[#1e293b]"}`}>
              {plan.name}
            </p>
            <p className={`text-sm mt-1 ${isdark ? "text-slate-400" : "text-[#64748b]"}`}>
              Price: $ {plan.price}, {plan.cycle}, Total Order: {plan.orders}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const PopularPlans = ({ isdark }) => {
  const headCell = `text-left text-sm font-medium pb-3 whitespace-nowrap pr-8 ${
    isdark ? "text-white" : "text-[#1e293b]"
  }`;
  const bodyCell = `py-3 pr-8 whitespace-nowrap text-sm ${
    isdark ? "text-slate-300" : "text-[#334155]"
  }`;

  return (
    <div
      className={`shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
    >
      <h6 className={`font-medium mb-4 ${isdark ? "text-white" : "text-[#1e293b]"}`}>
        Popular Plans
      </h6>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse">
          <thead>
            <tr
              className={`border-b ${isdark ? "border-[#334155]" : "border-[#f1f5f9]"}`}
            >
              <th className={headCell}>Plan</th>
              <th className={headCell}>Active Users</th>
              <th className={headCell}>Sales</th>
              <th className={headCell}>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {POPULAR_PLANS.map((row, i) => (
              <tr
                key={i}
                className={`border-b last:border-b-0 ${
                  isdark ? "border-[#334155]" : "border-[#f1f5f9]"
                }`}
              >
                <td className={bodyCell}>{row.plan}</td>
                <td className={bodyCell}>{row.users}</td>
                <td className={bodyCell}>{row.sales}</td>
                <td className={bodyCell}>$ {row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RecentOrders = ({ isdark }) => (
  <div
    className={`shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
  >
    <h6 className={`font-medium ${isdark ? "text-white" : "text-[#1e293b]"}`}>
      Recent Orders
    </h6>
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <div
        className={`p-4 rounded-full ${isdark ? "bg-[#0f172a]" : "bg-[#f8fafc]"}`}
      >
        <FiInbox
          size={28}
          className={isdark ? "text-slate-500" : "text-[#94a3b8]"}
        />
      </div>
      <p className={`text-sm ${isdark ? "text-slate-400" : "text-[#64748b]"}`}>
        No data found
      </p>
    </div>
  </div>
);

const RecentPosts = ({ isdark }) => {
  const headCell = `text-left text-sm font-medium pb-3 whitespace-nowrap pr-8 ${
    isdark ? "text-white" : "text-[#1e293b]"
  }`;
  const bodyCell = `py-3 pr-8 whitespace-nowrap text-sm ${
    isdark ? "text-slate-300" : "text-[#334155]"
  }`;

  return (
    <div
      className={`shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
    >
      <h6 className={`font-medium mb-4 ${isdark ? "text-white" : "text-[#1e293b]"}`}>
        Recent Posts
      </h6>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse">
          <thead>
            <tr
              className={`border-b ${isdark ? "border-[#334155]" : "border-[#f1f5f9]"}`}
            >
              <th className={headCell}>Brand</th>
              <th className={headCell}>User Name</th>
              <th className={headCell}>Title</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_POSTS.map((row, i) => (
              <tr
                key={i}
                className={`border-b last:border-b-0 ${
                  isdark ? "border-[#334155]" : "border-[#f1f5f9]"
                }`}
              >
                <td className={bodyCell}>{row.brand}</td>
                <td className={bodyCell}>{row.user}</td>
                <td className={bodyCell}>{row.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RecentCredits = ({ isdark }) => {
  const headCell = `text-left text-sm font-medium pb-3 whitespace-nowrap pr-8 ${
    isdark ? "text-white" : "text-[#1e293b]"
  }`;
  const bodyCell = `py-3 pr-8 whitespace-nowrap text-sm ${
    isdark ? "text-slate-300" : "text-[#334155]"
  }`;

  return (
    <div
      className={`shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
    >
      <h6 className={`font-medium mb-4 ${isdark ? "text-white" : "text-[#1e293b]"}`}>
        Recent Credits
      </h6>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr
              className={`border-b ${isdark ? "border-[#334155]" : "border-[#f1f5f9]"}`}
            >
              <th className={headCell}>Invoice</th>
              <th className={headCell}>User Name</th>
              <th className={headCell}>Credits</th>
              <th className={headCell}>Price</th>
              <th className={headCell}>Status</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_CREDITS.map((row, i) => (
              <tr
                key={i}
                className={`border-b last:border-b-0 ${
                  isdark ? "border-[#334155]" : "border-[#f1f5f9]"
                }`}
              >
                <td className={`${bodyCell} text-[#8b5cf6]`}>{row.invoice}</td>
                <td className={bodyCell}>{row.user}</td>
                <td className={bodyCell}>{row.credits}</td>
                <td className={bodyCell}>$ {row.price}</td>
                <td className={bodyCell}>
                  <span className="bg-[#10b981] text-white text-xs font-medium px-3 py-1 rounded-full">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminDashbord = () => {
  const { isdark } = useUserContext();
  return (
    <div>
      <div
        className={`flex items-center gap-2 text-sm  ${isdark ? "text-[#64748b]" : "text-[#64748b]"}`}
      >
        <span className="text-[#8b5cf6]">Admin</span>{" "}
        <MdOutlineKeyboardArrowRight /> <span>Dashboard</span>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 w-full mt-4 `}
      >
        <div
          className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
        >
          <div className="p-3 flex justify-center items-center bg-[#8b5cf61a] text-[#8b5cf6] rounded-xl">
            {" "}
            <BiCart size={24} />
          </div>
          <div>
            <p className={`text-[#64748b]`}>Total Orders</p>
            <h6
              className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
            >
              6
            </h6>
          </div>
        </div>
        <div
          className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
        >
          <div className="p-3 flex justify-center items-center bg-[#10b9811a] text-[#10b981] rounded-xl">
            {" "}
            <LuCircleDollarSign size={24} />
          </div>
          <div>
            <p className={`text-[#64748b]`}>Total Sales</p>
            <h6
              className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
            >
             $ 2,220.0
            </h6>
          </div>
        </div>
        <div
          className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
        >
          <div className="p-3 flex justify-center items-center bg-[#f59e0b1a] text-[#f59e0b] rounded-xl">
            {" "}
            <BiBox size={24} />
          </div>
          <div>
            <p className={`text-[#64748b]`}>Total Brands</p>
            <h6
              className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
            >
              16
            </h6>
          </div>
        </div>
        <div
          className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
        >
          <div className="p-3 flex justify-center items-center bg-[#6366f11a] text-[#6366f1] rounded-xl">
            {" "}
            <BiReceipt size={24} />
          </div>
          <div>
            <p className={`text-[#64748b]`}>Total Post</p>
            <h6
              className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
            >
              37
            </h6>
          </div>
        </div>
        <div
          className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
        >
          <div className="p-3 flex justify-center items-center bg-[#0ea5e91a] text-[#0ea5e9] rounded-xl">
            {" "}
            <BiMemoryCard size={24} />
          </div>
          <div>
            <p className={`text-[#64748b]`}>Storege Used</p>
            <h6
              className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
            >
              1
            </h6>
          </div>
        </div>
        <div
          className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
        >
          <div className="p-3 flex justify-center items-center bg-[#84cc161a] text-[#84cc16] rounded-xl">
            {" "}
            <RiGroupLine size={24} />
          </div>
          <div>
            <p className={`text-[#64748b]`}>Social Accounts </p>
            <h6
              className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
            >
              0
            </h6>
          </div>
        </div>
        <div
          className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
        >
          <div className="p-3 flex justify-center items-center bg-[#8b5cf61a] text-[#8b5cf6] rounded-xl">
            {" "}
            <FiUser size={24} />
          </div>
          <div>
            <p className={`text-[#64748b]`}>Total Customers</p>
            <h6
              className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
            >
              0
            </h6>
          </div>
        </div>
        <div
          className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
        >
          <div className="p-3 flex justify-center items-center bg-[#10b9811a] text-[#10b981] rounded-xl">
            {" "}
            <BiCartDownload size={24} />
          </div>
          <div>
            <p className={`text-[#64748b]`}>Recent Orders</p>
            <h6
              className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
            >
              0
            </h6>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
        <div className="xl:col-span-2">
          <SalesOverviewChart isdark={isdark} />
        </div>
        <MostOrderedPlan isdark={isdark} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
        <div className="xl:col-span-2">
          <PopularPlans isdark={isdark} />
        </div>
        <RecentOrders isdark={isdark} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <RecentPosts isdark={isdark} />
        <RecentCredits isdark={isdark} />
      </div>
    </div>
  );
};

export default AdminDashbord;