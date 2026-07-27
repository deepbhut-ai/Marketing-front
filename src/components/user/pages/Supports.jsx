"use client";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ConfigProvider, Select, theme } from "antd";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FiHeadphones, FiRotateCw, FiXSquare, FiFilter, FiChevronDown, FiSave } from "react-icons/fi";
import { BsFolder2Open } from "react-icons/bs";

const PURPLE = "#8b5cf6";

// ---------------------------------------------------------------------------
// Data — replace with your API response
// ---------------------------------------------------------------------------
const SUMMARY = { total: 5, pending: 5, open: 0, closed: 0 };

const SEARCH_FIELDS = [
  { value: "email", label: "User Email" },
  { value: "ticket", label: "Ticket No" },
  { value: "subject", label: "Subject" },
];

const TICKETS = [
  { id: "0000010", subject: "lkjlkjlkjlkjlk", conversations: 1, status: "pending", date: "31 Mar, 2025" },
  { id: "0000008", subject: "Testing this here 123", conversations: 1, status: "pending", date: "31 Mar, 2025" },
  { id: "0000004", subject: "Testing out", conversations: 1, status: "pending", date: "31 Mar, 2025" },
  { id: "0000003", subject: "Create Ticket", conversations: 1, status: "pending", date: "31 Mar, 2025" },
  { id: "0000002", subject: "soucis avec le problème", conversations: 1, status: "pending", date: "31 Mar, 2025" },
];

const STATUS_STYLES = {
  pending: "bg-[#f59e0b] text-white",
  open: "bg-[#10b981] text-white",
  closed: "bg-[#64748b] text-white",
};

// ---------------------------------------------------------------------------
const StatCard = ({ isdark, icon: Icon, label, value }) => (
  <div className={`rounded-lg p-5 flex items-center gap-4 ${isdark ? "bg-[#1e293b]" : "bg-white shadow-sm"}`}>
    <span
      className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${PURPLE}${isdark ? "33" : "1a"}`, color: PURPLE }}
    >
      <Icon size={22} />
    </span>
    <div className="min-w-0">
      <p className={`text-base ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>{label}</p>
      <p className={`text-2xl font-semibold mt-0.5 ${isdark ? "text-white" : "text-[#111827]"}`}>{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`inline-block px-2.5 py-1 rounded-md text-xs ${STATUS_STYLES[status] ?? "bg-[#64748b] text-white"}`}>
    {status}
  </span>
);

// ---------------------------------------------------------------------------
// Create Ticket modal
// ---------------------------------------------------------------------------
const CreateTicketModal = ({ isdark, onClose, onSubmit }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // close on Esc
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const labelCls = `block text-sm mb-2 ${isdark ? "text-[#cbd5e1]" : "text-[#374151]"}`;
  const fieldCls = `w-full px-4 py-2.5 text-sm rounded-md outline-none border transition-colors
    focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]
    ${
      isdark
        ? "bg-transparent border-[#334155] text-white placeholder:text-[#64748b]"
        : "bg-white border-[#e2e8f0] text-[#111827] placeholder:text-[#9ca3af]"
    }`;

  const canSubmit = subject.trim() && message.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className={`relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-lg p-8 shadow-2xl ${
          isdark ? "bg-[#1e293b]" : "bg-white"
        }`}
      >
        <h5 className={`text-2xl font-bold mb-6 ${isdark ? "text-white" : "text-[#111827]"}`}>Create Ticket</h5>

        <div className="mb-5">
          <label className={labelCls}>Subject*</label>
          <input
            autoFocus
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className={fieldCls}
          />
        </div>

        <div className="mb-6">
          <label className={labelCls}>Message*</label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write message...."
            className={`${fieldCls} resize-y`}
          />
        </div>

        <button
          onClick={() => canSubmit && onSubmit({ subject, message })}
          disabled={!canSubmit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#8b5cf6] text-white text-sm cursor-pointer
            hover:bg-[#7c4fe0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave size={16} /> Submit
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
const Supports = () => {
  const { isdark } = useUserContext();

  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [field, setField] = useState("email");

  const heading = isdark ? "text-white" : "text-[#111827]";
  const muted = isdark ? "text-[#94a3b8]" : "text-[#64748b]";
  const body = isdark ? "text-[#cbd5e1]" : "text-[#374151]";
  const borderCls = isdark ? "border-[#334155]" : "border-[#e5e7eb]";
  const cardBg = isdark ? "bg-[#1e293b]" : "bg-white shadow-sm";

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

  const applyFilter = () => {
    console.log({ search, field });
    // TODO: call your API
    setFilterOpen(false);
  };

  const createTicket = (payload) => {
    console.log(payload);
    // TODO: POST the ticket, then refresh the list
    setCreateOpen(false);
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <div>
        {/* ---------- breadcrumb + add new ---------- */}
        <div className="flex justify-between gap-3 items-center flex-wrap">
          <div className={`flex items-center gap-2 text-sm ${muted}`}>
            <span className="text-[#8b5cf6]">User</span>
            <MdOutlineKeyboardArrowRight />
            <span className={isdark ? "text-[#cbd5e1]" : "text-[#374151]"}>Supports</span>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="bg-[#8b5cf6] px-4 py-2.5 rounded-md text-white text-sm cursor-pointer hover:bg-[#7c4fe0] transition-colors"
          >
            Add New
          </button>
        </div>

        {/* ---------- stat cards ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-4">
          <StatCard isdark={isdark} icon={FiHeadphones} label="Total Supports" value={SUMMARY.total} />
          <StatCard isdark={isdark} icon={FiRotateCw} label="Pending Supports" value={SUMMARY.pending} />
          <StatCard isdark={isdark} icon={BsFolder2Open} label="Open Supports" value={SUMMARY.open} />
          <StatCard isdark={isdark} icon={FiXSquare} label="Closed Supports" value={SUMMARY.closed} />
        </div>

        {/* ---------- filter ---------- */}
        <div className="flex justify-end mt-8 relative">
          <button
            onClick={() => setFilterOpen((p) => !p)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-md border text-sm cursor-pointer transition-colors
              ${borderCls} ${body} ${cardBg} hover:border-[#8b5cf6]`}
          >
            <FiFilter size={16} />
            Filter
            <FiChevronDown size={16} className={`transition-transform ${filterOpen ? "rotate-180" : ""}`} />
          </button>

          {filterOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setFilterOpen(false)} />
              <div
                className={`absolute right-0 top-full mt-2 z-40 w-full max-w-[396px] rounded-lg p-6 shadow-2xl ${
                  isdark ? "bg-[#1e293b]" : "bg-white"
                }`}
              >
                <p className={`text-base font-semibold mb-3 ${heading}`}>Status</p>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search......"
                  className={`w-full px-4 py-2.5 text-sm rounded-md outline-none border mb-4 transition-colors
                    focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]
                    ${
                      isdark
                        ? "bg-transparent border-[#334155] text-white placeholder:text-[#64748b]"
                        : "bg-white border-[#e2e8f0] text-[#111827] placeholder:text-[#9ca3af]"
                    }`}
                />

                <Select value={field} onChange={setField} options={SEARCH_FIELDS} className="w-full mb-4" />

                <button
                  onClick={applyFilter}
                  className="w-full py-2.5 rounded-md bg-[#8b5cf6] text-white text-sm cursor-pointer hover:bg-[#7c4fe0] transition-colors"
                >
                  Filter
                </button>
              </div>
            </>
          )}
        </div>

        {/* ---------- tickets ---------- */}
        <div className={`rounded-lg mt-3 ${cardBg}`}>
          {/* desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className={`border-b ${borderCls}`}>
                  <th className={`text-left font-medium px-8 py-5 ${heading}`}>Ticket No</th>
                  <th className={`text-left font-medium px-8 py-5 ${heading}`}>Subject</th>
                  <th className={`text-left font-medium px-8 py-5 ${heading}`}>Conversations</th>
                  <th className={`text-left font-medium px-8 py-5 ${heading}`}>Status</th>
                  <th className={`text-left font-medium px-8 py-5 ${heading}`}>Date</th>
                  <th className={`text-right font-medium px-8 py-5 ${heading}`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {TICKETS.map((t) => (
                  <tr key={t.id} className={`border-b last:border-b-0 ${borderCls}`}>
                    <td className={`px-8 py-4 whitespace-nowrap ${body}`}>{t.id}</td>
                    <td className={`px-8 py-4 ${body}`}>{t.subject}</td>
                    <td className={`px-8 py-4 ${body}`}>{t.conversations}</td>
                    <td className="px-8 py-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className={`px-8 py-4 whitespace-nowrap ${body}`}>{t.date}</td>
                    <td className="px-8 py-4 text-right">
                      <Link
                        href={`/supports/${t.id}`}
                        className="inline-block px-5 py-2 rounded-md bg-[#8b5cf6] text-white text-sm hover:bg-[#7c4fe0] transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile cards */}
          <div className="md:hidden">
            {TICKETS.map((t) => (
              <div key={t.id} className={`px-4 py-4 border-b last:border-b-0 ${borderCls}`}>
                <div className="flex justify-between gap-2 items-center">
                  <span className={`font-medium ${heading}`}>{t.id}</span>
                  <StatusBadge status={t.status} />
                </div>
                <p className={`text-sm mt-1 ${body}`}>{t.subject}</p>
                <div className="flex justify-between gap-2 items-center mt-3">
                  <span className={`text-xs ${muted}`}>
                    {t.conversations} conversation{t.conversations === 1 ? "" : "s"} · {t.date}
                  </span>
                  <Link
                    href={`/supports/${t.id}`}
                    className="px-4 py-1.5 rounded-md bg-[#8b5cf6] text-white text-xs hover:bg-[#7c4fe0] transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {TICKETS.length === 0 && (
            <p className={`py-14 text-center text-sm ${muted}`}>No support tickets yet. Click "Add New" to create one.</p>
          )}
        </div>

        {/* ---------- create ticket modal ---------- */}
        {createOpen && (
          <CreateTicketModal isdark={isdark} onClose={() => setCreateOpen(false)} onSubmit={createTicket} />
        )}
      </div>
    </ConfigProvider>
  );
};

export default Supports;