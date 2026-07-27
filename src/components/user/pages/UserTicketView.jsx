"use client";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FiSend } from "react-icons/fi";

// ---------------------------------------------------------------------------
// Data — replace with your API response
// ---------------------------------------------------------------------------
const TICKET = {
  no: "10",
  userName: "test user",
  subject: "lkjlkjlkjlkjlk",
  online: true,
  canReply: false, // false → shows the red "You can't not send reply" notice
};

const MESSAGES = [
  { id: 1, own: true, author: "test user", text: "kjljljljoijoijoijoioijoij", date: "27 Nov, 2025" },
];

// ---------------------------------------------------------------------------
const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const Avatar = ({ name, size = 44, online = false, isdark }) => (
  <span className="relative shrink-0" style={{ width: size, height: size }}>
    <span
      className={`w-full h-full rounded-full flex items-center justify-center font-medium ${
        isdark ? "bg-[#e2e8f0] text-[#1e293b]" : "bg-[#e5e7eb] text-[#374151]"
      }`}
      style={{ fontSize: size * 0.34 }}
    >
      {initialsOf(name)}
    </span>
    {online && (
      <span
        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#22c55e] border-2 ${
          isdark ? "border-[#1e293b]" : "border-white"
        }`}
      />
    )}
  </span>
);

// ---------------------------------------------------------------------------
const UserTicketView = () => {
  const { isdark } = useUserContext();
  const [messages, setMessages] = useState(MESSAGES);
  const [reply, setReply] = useState("");
  const bottomRef = useRef(null);

  const heading = isdark ? "text-white" : "text-[#111827]";
  const muted = isdark ? "text-[#94a3b8]" : "text-[#64748b]";
  const borderCls = isdark ? "border-[#334155]" : "border-[#e5e7eb]";
  const cardBg = isdark ? "bg-[#1e293b]" : "bg-white shadow-sm";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendReply = () => {
    if (!reply.trim()) return;
    setMessages((m) => [
      ...m,
      {
        id: Date.now(),
        own: true,
        author: TICKET.userName,
        text: reply.trim(),
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      },
    ]);
    setReply("");
    // TODO: POST the reply to your API
  };

  return (
    <div>
      {/* ---------- breadcrumb ---------- */}
      <div className={`flex items-center gap-2 text-sm ${muted}`}>
        <span className="text-[#8b5cf6]">User</span>
        <MdOutlineKeyboardArrowRight />
        <Link href="/supports" className="text-[#8b5cf6]">
          Supports
        </Link>
        <MdOutlineKeyboardArrowRight />
        <span className={isdark ? "text-[#cbd5e1]" : "text-[#374151]"}>{TICKET.no}</span>
      </div>

      {/* ---------- ticket card ---------- */}
      <div className={`rounded-lg mt-4 ${cardBg}`}>
        {/* header */}
        <div className={`flex items-center gap-4 px-5 py-5 border-b ${borderCls}`}>
          <Avatar name={TICKET.userName} size={56} online={TICKET.online} isdark={isdark} />
          <div className="min-w-0">
            <p className={`font-semibold ${heading}`}>{TICKET.userName}</p>
            <p className={`text-base truncate ${muted}`}>Subject : {TICKET.subject}</p>
          </div>
        </div>

        {/* conversation */}
        <div className="px-5 py-6 min-h-[240px] max-h-[520px] overflow-y-auto flex flex-col gap-5">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.own ? "flex-row-reverse" : "flex-row"}`}>
              <Avatar name={m.author} size={44} isdark={isdark} />

              <div className={`flex flex-col max-w-[75%] ${m.own ? "items-end" : "items-start"}`}>
                <div
                  className={`px-4 py-2.5 rounded-md text-sm break-words ${
                    m.own
                      ? "bg-[#8b5cf6] text-white"
                      : isdark
                      ? "bg-[#334155] text-[#e2e8f0]"
                      : "bg-[#f1f5f9] text-[#374151]"
                  }`}
                >
                  {m.text}
                </div>
                <span className={`text-xs mt-1.5 ${muted}`}>{m.date}</span>
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <p className={`text-sm text-center py-10 ${muted}`}>No messages in this ticket yet.</p>
          )}

          <div ref={bottomRef} />
        </div>

        {/* reply / blocked notice */}
        {TICKET.canReply ? (
          <div className={`flex gap-3 items-end px-5 py-5 border-t ${borderCls}`}>
            <textarea
              rows={1}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendReply();
                }
              }}
              placeholder="Write a reply...."
              className={`flex-1 px-4 py-2.5 text-sm rounded-md outline-none border resize-y transition-colors
                focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]
                ${
                  isdark
                    ? "bg-transparent border-[#334155] text-white placeholder:text-[#64748b]"
                    : "bg-white border-[#e2e8f0] text-[#111827] placeholder:text-[#9ca3af]"
                }`}
            />
            <button
              onClick={sendReply}
              disabled={!reply.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#8b5cf6] text-white text-sm cursor-pointer
                hover:bg-[#7c4fe0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <FiSend size={15} /> Send
            </button>
          </div>
        ) : (
          <p className="text-center font-semibold text-[#ef4444] px-5 pb-8">You can't not send reply</p>
        )}
      </div>
    </div>
  );
};

export default UserTicketView;