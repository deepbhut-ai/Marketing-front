"use client";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FiPlus, FiSave, FiX } from "react-icons/fi";

// Replace with your API providers
const PROVIDERS = [
  { id: "openai", name: "OpenAi" },
  { id: "gemini", name: "Gemini" },
  { id: "claude", name: "Claude" },
];

const AiTrainingCreate = () => {
  const { isdark } = useUserContext();

  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [rows, setRows] = useState([{ id: Date.now(), question: "", answer: "" }]);

  const addRow = () => setRows((p) => [...p, { id: Date.now(), question: "", answer: "" }]);
  const removeRow = (id) => setRows((p) => (p.length === 1 ? p : p.filter((r) => r.id !== id)));
  const updateRow = (id, key, value) =>
    setRows((p) => p.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const handleCreate = () => {
    console.log({ title, provider, rows });
    // TODO: call your API
  };

  // ---- shared classes ----
  const cardCls = `rounded-lg p-6 shadow-sm ${
    isdark ? "bg-[#1e293b]" : "bg-white"
  }`;

  const labelCls = `block text-sm mb-2 ${isdark ? "text-[#cbd5e1]" : "text-[#374151]"}`;

  const fieldCls = `w-full px-4 py-2.5 text-sm rounded-md outline-none border transition-colors
    focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]
    ${
      isdark
        ? "bg-transparent border-[#334155] text-white placeholder:text-[#64748b]"
        : "bg-white border-[#e2e8f0] text-[#111827] placeholder:text-[#9ca3af]"
    }`;

  return (
    <div>
      {/* Breadcrumb + Back */}
      <div className="flex justify-between gap-2 items-center">
        <div className="flex items-center gap-2 text-sm shrink-0 text-[#64748b]">
          <span className="text-[#8b5cf6]">User</span> <MdOutlineKeyboardArrowRight />{" "}
          <span className="text-[#8b5cf6]">Commentai</span> <MdOutlineKeyboardArrowRight />{" "}
          <Link href="/ai-training" className="text-[#8b5cf6]">
            Ai-Training
          </Link>{" "}
          <MdOutlineKeyboardArrowRight />{" "}
          <span className={isdark ? "text-[#cbd5e1]" : "text-[#374151]"}>Create</span>
        </div>
        <Link
          href="/ai-training"
          className="bg-[#8b5cf6] px-4 py-2 rounded-md text-white text-sm hover:bg-[#7c4fe0] transition-colors"
        >
          Back
        </Link>
      </div>

      {/* Heading + Add Dataset */}
      <div className="flex justify-between gap-4 items-center flex-wrap mt-4">
        <div>
          <h5 className={`text-lg font-semibold ${isdark ? "text-white" : "text-[#111827]"}`}>
            Create Ai Training Dataset
          </h5>
          <p className={`text-sm mt-0.5 ${isdark ? "text-[#cbd5e1]" : "text-[#4b5563]"}`}>
            Create a new dataset for training the AI model.
          </p>
        </div>
        <button
          onClick={addRow}
          className="flex items-center gap-2 bg-[#8b5cf6] px-5 py-3 rounded-md text-white text-sm cursor-pointer
            hover:bg-[#7c4fe0] focus:outline-none focus:ring-4 focus:ring-[#8b5cf6]/40 transition-colors"
        >
          <FiPlus size={17} /> Add Dataset
        </button>
      </div>

      {/* Title + Provider */}
      <div className={`${cardCls} mt-5`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className={fieldCls}
            />
          </div>
          <div>
            <label className={labelCls}>Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className={fieldCls}
            >
              <option value="" className={isdark ? "bg-[#1e293b]" : "bg-white"}>
                Select Provider
              </option>
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id} className={isdark ? "bg-[#1e293b]" : "bg-white"}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Q&A table */}
      <div className={`${cardCls} mt-5 p-0 overflow-hidden`}>
        {/* header */}
        <div
          className={`grid grid-cols-[minmax(0,1.6fr)_minmax(0,2fr)_90px] gap-6 px-6 py-4 border-b text-sm font-medium ${
            isdark ? "border-[#334155] text-white" : "border-[#e5e7eb] text-[#111827]"
          }`}
        >
          <span>Command Or Question</span>
          <span>Answer</span>
          <span className="text-right">Action</span>
        </div>

        {/* rows */}
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,2fr)_90px] gap-6 px-6 py-5 items-center"
          >
            <input
              value={row.question}
              onChange={(e) => updateRow(row.id, "question", e.target.value)}
              className={fieldCls}
            />
            <textarea
              rows={3}
              value={row.answer}
              onChange={(e) => updateRow(row.id, "answer", e.target.value)}
              className={`${fieldCls} resize-y`}
            />
            <div className="flex justify-end">
              <button
                onClick={() => removeRow(row.id)}
                className="flex items-center justify-center px-4 py-2.5 rounded-md bg-[#f43f5e] text-white
                  cursor-pointer hover:bg-[#e11d48] transition-colors"
              >
                <FiX size={17} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create */}
      <div className="flex justify-end mt-5">
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#8b5cf6] px-5 py-3 rounded-md text-white text-sm
            cursor-pointer hover:bg-[#7c4fe0] transition-colors"
        >
          <FiSave size={16} /> Create
        </button>
      </div>
    </div>
  );
};

export default AiTrainingCreate;