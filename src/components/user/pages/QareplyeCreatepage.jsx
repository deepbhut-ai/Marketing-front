"use client";
import { useUserContext } from "@/context/UserContext";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FiPlus, FiX, FiSave } from "react-icons/fi";
import Link from "next/link";

const QareplyeCreatepage = () => {
      const { isdark } = useUserContext();
        const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), question: "", answer: "" },
    ]);
  };

  
  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };


          const inputBase = `w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors resize-none focus:border-[#8b5cf6] ${
    isdark
      ? "bg-transparent border-[#334155] text-white placeholder:text-[#64748b]"
      : "bg-white border-[#e2e8f0] text-[#0f172a] placeholder:text-[#94a3b8]"
  }`;


  return (
    <div>
      <div className="flex justify-between items-center">
        <div
          className={`flex items-center gap-2 text-sm flex-wrap ${
            isdark ? "text-[#64748b]" : "text-[#64748b]"
          }`}
        >
          <span className="text-[#8b5cf6]">User</span>
          <MdOutlineKeyboardArrowRight />
          <span className="text-[#8b5cf6]">Commentai</span>
          <MdOutlineKeyboardArrowRight />
          <span className="text-[#8b5cf6]">Qa-Replies</span>
          <MdOutlineKeyboardArrowRight />
       
          <span className={isdark ? "text-[#cbd5e1]" : "text-[#334155]"}>
           Create
          </span>
        </div>
        <Link href={"/qa-replies"}
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#8b5cf6] hover:bg-[#7c3aed] transition-colors`}
        >
          Back
        </Link>
      </div>
     {/* Title card */}
      <div
        className={`mt-4 rounded-xl border p-6 ${
          isdark
            ? "border-[#1e293b] bg-[#1e293b]"
            : "border-[#e5e7eb] bg-white"
        }`}
      >
        <label
          className={`block text-sm mb-2 ${
            isdark ? "text-[#cbd5e1]" : "text-[#334155]"
          }`}
        >
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputBase}
        />
      </div>
    {/* Q&A card */}
      <div
        className={`mt-4 rounded-xl border overflow-hidden ${
          isdark
            ? "border-[#1e293b] bg-[#1e293b]"
            : "border-[#e5e7eb] bg-white"
        }`}
      >
        <div
          className={`flex justify-between items-center px-6 py-4 border-b ${
            isdark ? "border-[#334155]" : "border-[#e2e8f0]"
          }`}
        >
          <div className="flex gap-40 flex-1">
            <span
              className={`font-semibold text-sm ${
                isdark ? "text-white" : "text-[#0f172a]"
              }`}
            >
              Question
            </span>
            <span
              className={`font-semibold text-sm ${
                isdark ? "text-white" : "text-[#0f172a]"
              }`}
            >
              Answer
            </span>
          </div>
          <button
            onClick={addItem}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#8b5cf6] text-white hover:bg-[#7c3aed] transition-colors shrink-0"
            aria-label="Add question"
          >
            <FiPlus size={18} />
          </button>
        </div>

        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`flex gap-4 items-start px-6 py-4 ${
              idx !== items.length - 1
                ? `border-b ${
                    isdark ? "border-[#334155]" : "border-[#e2e8f0]"
                  }`
                : ""
            }`}
          >
            <textarea
              rows={2}
              value={item.question}
              placeholder="Enter question or command or keyword to search"
              onChange={(e) =>
                updateItem(item.id, "question", e.target.value)
              }
              className={`${inputBase} flex-1`}
            />
            <textarea
              rows={2}
              value={item.answer}
              placeholder="Enter answer or response of the query"
              onChange={(e) => updateItem(item.id, "answer", e.target.value)}
              className={`${inputBase} flex-1`}
            />
            <button
              onClick={() => removeItem(item.id)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#ef4444] text-white hover:bg-[#dc2626] transition-colors shrink-0 mt-1"
              aria-label="Remove question"
            >
              <FiX size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Update button */}
      <div className="flex justify-end mt-4">
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#8b5cf6] hover:bg-[#7c3aed] transition-colors">
          <FiSave size={16} />
          Create
        </button>
      </div>
    </div>
  )
}

export default QareplyeCreatepage