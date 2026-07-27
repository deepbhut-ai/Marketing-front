"use client";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FiLogIn, FiEdit, FiActivity, FiTrash2, FiRefreshCw } from "react-icons/fi";

// Replace with your API data
const INITIAL_ROWS = [
  {
    id: 1,
    title: "Socialai_Openai_Dataset_Model",
    fileName: "socialai_openai_dataset_model",
    status: "Succeeded",
  },
];

const STATUS_STYLES = {
  Succeeded: "bg-[#10b981] text-white",
  Running: "bg-[#3b82f6] text-white",
  Pending: "bg-[#f59e0b] text-white",
  Failed: "bg-[#f43f5e] text-white",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
      STATUS_STYLES[status] ?? "bg-[#64748b] text-white"
    }`}
  >
    {status}
  </span>
);

// ---------------------------------------------------------------------------
// Action menu
// ---------------------------------------------------------------------------
const ActionMenu = ({ isdark, onAction }) => {
  const [open, setOpen] = useState(false);

  const items = [
    { key: "check", label: "Check Status", icon: FiLogIn },
    { key: "edit", label: "Edit", icon: FiEdit },
    { key: "test", label: "Test Prompt", icon: FiActivity },
    { key: "deleteDb", label: "Delete From DB", icon: FiTrash2 },
    { key: "deleteModel", label: "Delete With Model", icon: FiTrash2 },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`p-1.5 rounded-md cursor-pointer transition-colors ${
          isdark ? "text-[#cbd5e1] hover:bg-white/10" : "text-[#475569] hover:bg-black/5"
        }`}
      >
        <BsThreeDots size={18} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            className={`absolute right-0 top-9 z-40 w-56 rounded-lg shadow-2xl overflow-hidden border ${
              isdark ? "bg-[#1e293b] border-[#334155]" : "bg-white border-[#e5e7eb]"
            }`}
          >
            {items.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  setOpen(false);
                  onAction(key);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors ${
                  isdark
                    ? "text-[#e2e8f0] hover:bg-[#2d3c4c]"
                    : "text-[#374151] hover:bg-[#f1f5f9]"
                }`}
              >
                <Icon size={16} className="shrink-0 text-[#94a3b8]" />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const AiTrainingLogs = () => {
  const { isdark } = useUserContext();
  const [rows] = useState(INITIAL_ROWS);
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    // TODO: call your sync API
    setTimeout(() => setSyncing(false), 1200);
  };

  const handleAction = (key, row) => {
    console.log(key, row);
    // TODO: wire to your API
  };

  const gridCls =
    "grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,0.8fr)_90px] gap-4 items-center";

  return (
    <div>
      {/* Breadcrumb + actions */}
      <div className="flex justify-between gap-3 items-center flex-wrap">
        <div className="flex items-center gap-2 text-sm shrink-0 text-[#64748b]">
          <span className="text-[#8b5cf6]">User</span> <MdOutlineKeyboardArrowRight />{" "}
          <span className="text-[#8b5cf6]">Commentai</span> <MdOutlineKeyboardArrowRight />{" "}
          <Link href="/ai-training" className="text-[#8b5cf6]">
            Ai-Training
          </Link>{" "}
          <MdOutlineKeyboardArrowRight />{" "}
          <span className={isdark ? "text-[#cbd5e1]" : "text-[#374151]"}>Openai</span>
        </div>

        <div className="flex gap-2">
          <Link
            href="/ai-training-create"
            className="bg-[#8b5cf6] px-4 py-2 rounded-md text-white text-sm hover:bg-[#7c4fe0] transition-colors"
          >
            Add New
          </Link>
          <Link
            href="/ai-training"
            className="bg-[#8b5cf6] px-4 py-2 rounded-md text-white text-sm hover:bg-[#7c4fe0] transition-colors"
          >
            Back
          </Link>
        </div>
      </div>

      {/* Sync */}
      <div className="flex justify-end mt-3">
        <button
          onClick={handleSync}
          disabled={syncing}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm cursor-pointer transition-colors disabled:opacity-70 ${
            isdark
              ? "bg-[#7f1d2e] text-[#fda4af] hover:bg-[#8f2338]"
              : "bg-[#fee2e2] text-[#e11d48] hover:bg-[#fecdd3]"
          }`}
        >
          <FiRefreshCw size={15} className={syncing ? "animate-spin" : ""} />
          Sync Fine-tuned Models
        </button>
      </div>

      {/* Table */}
      <div
        className={`mt-3 rounded-lg shadow-sm overflow-visible ${
          isdark ? "bg-[#1e293b]" : "bg-white"
        }`}
      >
        {/* header — desktop only */}
        <div
          className={`${gridCls} hidden md:grid px-6 py-4 border-b text-sm font-medium ${
            isdark ? "border-[#334155] text-white" : "border-[#e5e7eb] text-[#111827]"
          }`}
        >
          <span>Title</span>
          <span>File Name In Provider</span>
          <span>Status</span>
          <span className="text-right">Action</span>
        </div>

        {/* desktop rows */}
        {rows.map((row) => (
          <div
            key={row.id}
            className={`${gridCls} hidden md:grid px-6 py-4 text-sm ${
              isdark ? "text-[#cbd5e1]" : "text-[#374151]"
            }`}
          >
            <span className="truncate">{row.title}</span>
            <span className="truncate">{row.fileName}</span>
            <span>
              <StatusBadge status={row.status} />
            </span>
            <div className="flex justify-end">
              <ActionMenu isdark={isdark} onAction={(k) => handleAction(k, row)} />
            </div>
          </div>
        ))}

        {/* mobile cards */}
        {rows.map((row) => (
          <div
            key={`m-${row.id}`}
            className={`md:hidden px-4 py-4 border-b last:border-b-0 ${
              isdark ? "border-[#334155]" : "border-[#e5e7eb]"
            }`}
          >
            <div className="flex justify-between gap-2 items-start">
              <div className="min-w-0">
                <p className={`text-sm font-medium break-words ${isdark ? "text-white" : "text-[#111827]"}`}>
                  {row.title}
                </p>
                <p className={`text-xs mt-1 break-words ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
                  {row.fileName}
                </p>
                <div className="mt-2">
                  <StatusBadge status={row.status} />
                </div>
              </div>
              <ActionMenu isdark={isdark} onAction={(k) => handleAction(k, row)} />
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className={`py-14 text-center text-sm ${isdark ? "text-[#64748b]" : "text-[#9ca3af]"}`}>
            No fine-tuned models yet. Click Add New to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTrainingLogs;