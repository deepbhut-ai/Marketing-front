"use client";
import { useUserContext } from "@/context/UserContext";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowRight, MdOutlineFlag } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import Link from "next/link";

const initialMessages = [
  {
    id: 1,
    sender: "bot",
    text: "Welcome to the brand setup! To optimize content for your brand, we need some?",
  },
  {
    id: 2,
    sender: "bot",
    text: "Firstly, what's the exact name of your brand?",
  },
];

const BrandsCreatePage = () => {
  const { isdark } = useUserContext();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const wordCount = input.trim() === "" ? 0 : input.trim().split(/\s+/).length;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // placeholder for a bot reply — swap with a real API call
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "Great! Now, can you provide a detailed description of your brand? Think about the main product or service you offer, who your primary customers are, and what sets you apart from others.",
        },
      ]);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-90px)]">
      {/* breadcrumb */}
      <div className="flex justify-between items-center">
        <div
          className={`flex items-center gap-2 text-sm shrink-0 ${isdark ? "text-[#64748b]" : "text-[#64748b]"}`}
        >
          <span className="text-[#8b5cf6]">User</span>{" "}
          <MdOutlineKeyboardArrowRight />{" "}
          <span className="text-[#8b5cf6]">Brands</span>{" "}
          <MdOutlineKeyboardArrowRight /> <span>Create</span>
        </div>
        <Link
          className={`text-white bg-[#8b5cf6] px-4 py-1 rounded-lg`}
          href={"/brands"}
        >
          {" "}
          Back
        </Link>
      </div>

      {/* chat card */}
      <div
        className={`mt-3 w-full rounded-2xl shadow-sm border flex flex-col flex-1 min-h-0 ${
          isdark ? "bg-[#1e293b] border-[#334155]" : "bg-white border-gray-200"
        }`}
      >
        {/* header */}
        <div
          className={`flex items-center gap-3 px-4 sm:px-6 py-4 border-b shrink-0 ${isdark ? "border-[#334155]" : "border-gray-200"}`}
        >
          <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg bg-[#10b9811a] text-[#10b981]">
            <MdOutlineFlag size={20} />
          </div>
          <h2
            className={`text-lg sm:text-xl font-bold ${isdark ? "text-white" : "text-[#1e293b]"}`}
          >
            Create New Brand
          </h2>
        </div>

        {/* messages */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex flex-col gap-4 px-4 sm:px-6 py-5 flex-1 min-h-0 overflow-y-auto"
        >
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[75%] ${
                  isUser ? "self-end flex-row-reverse" : "self-start"
                }`}
              >
                <div
                  className={`h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-full flex items-center justify-center text-xs font-medium ${
                    isdark
                      ? "bg-[#334155] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isUser ? "US" : "AI"}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? "bg-[#8b5cf6] text-white rounded-tr-none"
                      : isdark
                        ? "bg-[#0f172a] text-gray-200 rounded-tl-none"
                        : "bg-gray-100 text-gray-700 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* input */}
        <div className="px-4 sm:px-6 pb-4 shrink-0">
          <div
            className={`flex items-center gap-2 rounded-full border px-3 sm:px-4 py-2 ${
              isdark
                ? "border-[#334155] bg-[#0f172a]"
                : "border-gray-300 bg-white"
            }`}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write Something"
              className={`flex-1 bg-transparent outline-none text-sm py-1.5 ${
                isdark
                  ? "text-white placeholder:text-gray-500"
                  : "text-gray-800 placeholder:text-gray-400"
              }`}
            />
            <button
              type="button"
              className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full bg-[#8b5cf6] text-white hover:bg-[#7c3aed] transition-colors"
              aria-label="Voice input"
            >
              <FaMicrophone size={14} />
            </button>
            <button
              type="button"
              onClick={handleSend}
              className={`h-9 w-9 shrink-0 flex items-center justify-center rounded-full transition-colors ${
                isdark
                  ? "bg-[#334155] text-white hover:bg-[#475569]"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              aria-label="Send message"
            >
              <IoSend size={14} />
            </button>
          </div>
          <p
            className={`mt-2 text-xs ${isdark ? "text-gray-400" : "text-gray-500"}`}
          >
            Words: {wordCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandsCreatePage;
