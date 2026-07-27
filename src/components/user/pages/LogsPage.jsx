"use client";
import { useUserContext } from "@/context/UserContext";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { HiOutlineExternalLink, HiOutlinePhotograph } from "react-icons/hi";

const PLATFORM_STYLES = {
  Instagram: "bg-[#10b981] text-white",
  "Facebook Page": "bg-[#8b5cf6] text-white",
  Facebook: "bg-[#3b82f6] text-white",
  Twitter: "bg-[#0ea5e9] text-white",
  LinkedIn: "bg-[#0a66c2] text-white",
};

const DUMMY_LOGS = [
  {
    id: 1,
    name: "Mohammad Maruf",
    platform: "Instagram",
    post: "Two stmmmm",
    replyText: "SocialAI is an AI-powered SaaS platform ...",
    fullReplyText:
      "SocialAI is an AI-powered SaaS platform, Deliver unparalleled customer service, Continuously innovate and improve for instagram",
    mood: "Auto",
    charge: 0,
    status: 200,
    time: "17 Aug, 2025 11:50 am",
  },
  {
    id: 2,
    name: "Mohammad Maruf",
    platform: "Instagram",
    post: "Two stmmmm",
    replyText: "SocialAI is an AI-powered SaaS platform ...",
    fullReplyText:
      "SocialAI is an AI-powered SaaS platform, Deliver unparalleled customer service, Continuously innovate and improve for instagram",
    mood: "Auto",
    charge: 0,
    status: 200,
    time: "17 Aug, 2025 11:49 am",
  },
  {
    id: 3,
    name: "Drcodes Shop",
    platform: "Facebook Page",
    post: "Post cutting-edge te...",
    replyText: "SocialAI is an AI-powered SaaS platform ...",
    fullReplyText:
      "SocialAI is an AI-powered SaaS platform, Deliver unparalleled customer service, Continuously innovate and improve for facebook",
    mood: "Auto",
    charge: 1,
    status: 200,
    time: "16 Aug, 2025 04:17 pm",
  },
];

const StatusBadge = ({ status }) => {
  const isSuccess = status >= 200 && status < 300;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        isSuccess ? "bg-[#10b981] text-white" : "bg-[#ef4444] text-white"
      }`}
    >
      {status}
    </span>
  );
};

const MoodBadge = ({ mood }) => (
  <span className="inline-flex items-center rounded-full bg-[#10b981] px-2.5 py-1 text-xs font-semibold text-white">
    {mood}
  </span>
);

const PlatformBadge = ({ platform }) => (
  <span
    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${
      PLATFORM_STYLES[platform] || "bg-[#64748b] text-white"
    }`}
  >
    {platform}
  </span>
);

const LogsPage = () => {
  const { isdark } = useUserContext();
  const [hoveredRow, setHoveredRow] = useState(null);

  const columns = [
    "Platform",
    "Post",
    "Reply Text",
    "Reply Mood",
    "Charge",
    "Status",
    "Time",
  ];

  return (
    <div className={isdark ? "text-white" : "text-[#0f172a]"}>
      {/* Breadcrumb */}
      <div
        className={`flex items-center gap-2 text-sm shrink-0 ${
          isdark ? "text-[#64748b]" : "text-[#64748b]"
        }`}
      >
        <span className="text-[#8b5cf6]">User</span>{" "}
        <MdOutlineKeyboardArrowRight />{" "}
        <span className="text-[#8b5cf6]">Commentai</span>{" "}
        <MdOutlineKeyboardArrowRight /> <span>Logs</span>
      </div>

      {/* Table */}
      <div
        className={`logs-scroll mt-6 overflow-x-auto rounded-xl border ${
          isdark
            ? "border-[#1e293b] bg-[#1e293b]"
            : "border-[#e5e7eb] bg-white"
        }`}
      >
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead>
            <tr
              className={`border-b ${
                isdark ? "border-[#1e293b]" : "border-[#e5e7eb]"
              }`}
            >
              {columns.map((col) => (
                <th
                  key={col}
                  className={`px-6 py-4 font-semibold whitespace-nowrap ${
                    isdark ? "text-white" : "text-[#0f172a]"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DUMMY_LOGS.map((log) => (
              <tr
                key={log.id}
                className={`border-b last:border-b-0 ${
                  isdark ? "border-[#d2d7e04d]" : "border-[#e2e8f0]"
                }`}
              >
                {/* Platform */}
                <td className="px-6 py-4 align-top">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        isdark ? "bg-[#1e293b]" : "bg-[#f1f5f9]"
                      }`}
                    >
                      <HiOutlinePhotograph
                        className={isdark ? "text-[#64748b]" : "text-[#94a3b8]"}
                      />
                    </div>
                    <div>
                      <p
                        className={`font-medium whitespace-nowrap ${
                          isdark ? "text-white" : "text-[#0f172a]"
                        }`}
                      >
                        {log.name}
                      </p>
                      <div className="mt-1">
                        <PlatformBadge platform={log.platform} />
                      </div>
                    </div>
                  </div>
                </td>

                {/* Post */}
                <td
                  className={`px-6 py-4 align-top whitespace-nowrap ${
                    isdark ? "text-[#cbd5e1]" : "text-[#334155]"
                  }`}
                >
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 hover:text-[#8b5cf6]"
                  >
                    {log.post}
                    <HiOutlineExternalLink className="shrink-0" />
                  </a>
                </td>

                {/* Reply Text */}
                <td
                  className="px-6 py-4 align-top max-w-xs relative"
                  onMouseEnter={() => setHoveredRow(log.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <p
                    className={`truncate cursor-default ${
                      isdark ? "text-[#cbd5e1]" : "text-[#334155]"
                    }`}
                  >
                    {log.replyText}
                  </p>

                  {hoveredRow === log.id && (
                    <div
                      className={`absolute z-10 mt-2 w-80 rounded-lg border p-3 text-xs shadow-lg ${
                        isdark
                          ? "bg-[#1e293b] border-[#334155] text-[#e2e8f0]"
                          : "bg-white border-[#e5e7eb] text-[#334155]"
                      }`}
                    >
                      {log.fullReplyText}
                    </div>
                  )}
                </td>

                {/* Reply Mood */}
                <td className="px-6 py-4 align-top whitespace-nowrap">
                  <MoodBadge mood={log.mood} />
                </td>

                {/* Charge */}
                <td
                  className={`px-6 py-4 align-top whitespace-nowrap ${
                    isdark ? "text-[#cbd5e1]" : "text-[#334155]"
                  }`}
                >
                  {log.charge}
                </td>

                {/* Status */}
                <td className="px-6 py-4 align-top whitespace-nowrap">
                  <StatusBadge status={log.status} />
                </td>

                {/* Time */}
                <td
                  className={`px-6 py-4 align-top whitespace-nowrap ${
                    isdark ? "text-[#cbd5e1]" : "text-[#334155]"
                  }`}
                >
                  {log.time.split(" ").slice(0, 3).join(" ")}
                  <br />
                  {log.time.split(" ").slice(3).join(" ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        /* Webkit browsers (Chrome, Edge, Safari) */
        .logs-scroll::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .logs-scroll::-webkit-scrollbar-track {
          background: ${isdark ? "#0f1729" : "#f1f5f9"};
          border-radius: 8px;
        }
        .logs-scroll::-webkit-scrollbar-thumb {
          background: ${isdark ? "#334155" : "#cbd5e1"};
          border-radius: 8px;
        }
        .logs-scroll::-webkit-scrollbar-thumb:hover {
          background: ${isdark ? "#475569" : "#94a3b8"};
        }

        /* Firefox */
        .logs-scroll {
          scrollbar-width: thin;
          scrollbar-color: ${isdark ? "#334155 #0f1729" : "#cbd5e1 #f1f5f9"};
        }
      `}</style>
    </div>
  );
};

export default LogsPage;