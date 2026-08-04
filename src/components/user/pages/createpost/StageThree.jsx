"use client";
import React, { useMemo, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { ConfigProvider, DatePicker, Modal, TimePicker, message, theme } from "antd";
import dayjs from "dayjs";
import {
  FiArrowLeft,
  FiArrowRight,
  FiRefreshCw,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiCheck,
  FiImage,
} from "react-icons/fi";
import { FaRegCircleCheck } from "react-icons/fa6";

const MAX_RANGE_DAYS = 21;

// ---------------------------------------------------------------------------
// Dummy AI-suggested content — replace with your real API response.
// In production this array (and each item's `content`) comes from the
// backend once Stage 2's From/To range + platforms are submitted; the
// number of cards should equal the number of days between From and To,
// capped at MAX_RANGE_DAYS (21) just like the Stage 2 date range.
// ---------------------------------------------------------------------------
const DUMMY_SUGGESTIONS = [
  "Unlock 50+ new leads this week with AI-driven outreach that actually converts.",
  "Behind the scenes: how our platform fine-tunes a custom model in under 60 seconds.",
  "Stop guessing. Start deploying. See how domain-specific AI beats generic models.",
  "3 mistakes business owners make when adopting AI — and how to avoid them.",
  "From idea to deployed AI model in one afternoon. Here's how our early users did it.",
  "No ML degree required. Just your business data and 60 seconds.",
  "Case study: how a mid-size SaaS company cut support tickets by 40% with custom AI.",
  "Your competitors are already fine-tuning AI for their niche. Are you?",
  "Why 'good enough' generic AI is costing you customers — and what to do instead.",
  "A sneak peek at this week's product update: faster fine-tuning, smarter defaults.",
  "The real ROI of custom AI models for non-technical teams, explained simply.",
  "Meet the founders: why we built a platform for business owners, not engineers.",
  "5-minute demo: watch us go from raw data to a working AI model live.",
  "What 'enterprise-ready AI' actually means — and how to spot the real thing.",
  "Customer spotlight: how Zettalgor helped scale outreach across 3 new markets.",
  "The hidden cost of waiting to adopt AI in your industry.",
  "How to brief your team on AI adoption without the technical jargon.",
  "New integration alert: connect your CRM and go live with AI in minutes.",
  "Why speed to deployment matters more than model size for most businesses.",
  "A founder's honest take on choosing build vs. buy for AI infrastructure.",
  "Ready to scale? Here's what the next 90 days could look like with custom AI.",
];

const buildInitialItems = (count = MAX_RANGE_DAYS, scheduledDates = []) => {
  const today = dayjs().startOf("day").hour(10).minute(0);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    day: i,
    content: DUMMY_SUGGESTIONS[i % DUMMY_SUGGESTIONS.length],
    // No image in this dummy data — wire this up to your real API response
    // (or Stage 2's "Image Post" selection) once available. The preview
    // below only renders the image block when this is truthy.
    image: null,
    prompt: "",
    scheduledAt: scheduledDates[i] || today.add(i, "day"),
  }));
};

// Simple deterministic-ish picker so the same description tends to produce
// the same "generated" line — swap this whole function for your real API
// call, sending `prompt` as the instruction when it's non-empty.
const pickSuggestion = (prompt) => {
  if (!prompt || !prompt.trim()) {
    return DUMMY_SUGGESTIONS[Math.floor(Math.random() * DUMMY_SUGGESTIONS.length)];
  }
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) hash = (hash * 31 + prompt.charCodeAt(i)) >>> 0;
  return DUMMY_SUGGESTIONS[hash % DUMMY_SUGGESTIONS.length];
};

const StageThree = ({ onNext, onBack, dayCount = MAX_RANGE_DAYS, scheduledDates = [] }) => {
  const { isdark } = useUserContext();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [stage] = useState(3);
  const [items, setItems] = useState(() => buildInitialItems(dayCount, scheduledDates));
  // currentIndex only ever moves forward — approving a day is final, so
  // there's no "previous" control anywhere in this component.
  const [currentIndex, setCurrentIndex] = useState(0);
  const [regenerating, setRegenerating] = useState(false);
  // Modal.useModal (not the static Modal.confirm) so the confirm dialog
  // correctly inherits the ConfigProvider theme below instead of portaling
  // outside it in light mode regardless of `isdark`.
  const [modal, modalContextHolder] = Modal.useModal();

  const total = items.length;
  const isComplete = currentIndex >= total;
  const current = !isComplete ? items[currentIndex] : null;

  const antdTheme = useMemo(
    () => ({
      algorithm: isdark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      components: {
        DatePicker: {
          colorBgContainer: isdark ? "#0f172a" : "#ffffff",
          colorText: isdark ? "#ffffff" : "#000000",
          colorTextPlaceholder: isdark ? "#64748b" : "#94a3b8",
          colorBorder: isdark ? "#475569" : "#d9d9d9",
          colorPrimaryHover: isdark ? "#8b5cf6" : "#4096ff",
          colorPrimary: "#8b5cf6",
          controlOutline: "transparent",
          controlHeight: 40,
          colorBgElevated: isdark ? "#1e293b" : "#ffffff",
        },
        TimePicker: {
          colorBgContainer: isdark ? "#0f172a" : "#ffffff",
          colorText: isdark ? "#ffffff" : "#000000",
          colorTextPlaceholder: isdark ? "#64748b" : "#94a3b8",
          colorBorder: isdark ? "#475569" : "#d9d9d9",
          colorPrimaryHover: isdark ? "#8b5cf6" : "#4096ff",
          colorPrimary: "#8b5cf6",
          controlOutline: "transparent",
          controlHeight: 40,
          colorBgElevated: isdark ? "#1e293b" : "#ffffff",
        },
      },
    }),
    [isdark]
  );

  const updateCurrent = (patch) => {
    setItems((prev) =>
      prev.map((it, idx) => (idx === currentIndex ? { ...it, ...patch } : it))
    );
  };

  // Update: regenerate this day's content using its description, stay put
  const handleUpdate = () => {
    if (!current) return;
    setRegenerating(true);
    // TODO: replace with your real "regenerate suggestion" API call —
    // send current.prompt as the instruction.
    setTimeout(() => {
      updateCurrent({ content: pickSuggestion(current.prompt) });
      setRegenerating(false);
    }, 600);
  };

  // Approve: lock this day in and move forward — cannot come back.
  // Confirm first, since the action is irreversible.
  const handleApprove = () => {
    if (!current) return;
    modal.confirm({
      title: `Approve Day ${currentIndex + 1}?`,
      content:
        "Review each day's post, then Approve to lock it in and move to the next day — once approved a day can't be revisited.",
      okText: "Approve",
      cancelText: "Cancel",
      onOk: () => setCurrentIndex((idx) => idx + 1),
    });
  };

  const handleBack = () => {
    onBack?.();
  };

  const handleNext = () => {
    if (!isComplete) {
      messageApi.warning(`Please approve all ${total} days before proceeding.`);
      return;
    }
    onNext?.();
  };

  return (
    <ConfigProvider theme={antdTheme}>
      {modalContextHolder}
      {messageContextHolder}
      <div
        className={`shadow-sm rounded-xl p-5 sm:p-8 md:p-10 ${
          isdark ? "bg-[#1e293b]" : "bg-white"
        }`}
      >
        {/* Stage badge */}
        <div className="flex justify-center mb-3">
          <span className="bg-[#8b5cf6] text-white text-sm font-semibold px-5 py-2 rounded-full">
            Stage {stage}
          </span>
        </div>
        <p className={`text-center text-sm mb-6 ${isdark ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
          Review each day's post, then Approve to lock it in and move to the next day —
          once approved a day can't be revisited.
        </p>

        {/* Progress dots — approved (checked), current (ring), locked (dim) */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 mb-8">
          {items.map((it, idx) => {
            const approved = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <span
                key={it.id}
                title={`Day ${idx + 1}${approved ? " — approved" : ""}`}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors ${
                  approved
                    ? "bg-emerald-500 text-white"
                    : isCurrent
                      ? "bg-[#8b5cf6] text-white ring-2 ring-offset-2 ring-[#8b5cf6] " +
                        (isdark ? "ring-offset-[#1e293b]" : "ring-offset-white")
                      : isdark
                        ? "bg-[#0f172a] text-[#475569]"
                        : "bg-gray-100 text-gray-400"
                }`}
              >
                {approved ? <FiCheck size={12} /> : idx + 1}
              </span>
            );
          })}
        </div>

        {isComplete ? (
          /* All days approved */
          <div className="flex flex-col items-center justify-center text-center py-16 mb-8">
            <FaRegCircleCheck size={40} className="text-emerald-500 mb-4" />
            <h3 className={`text-lg font-semibold ${isdark ? "text-white" : "text-[#1e293b]"}`}>
              All {total} days approved
            </h3>
            <p className={`text-sm mt-1 mb-6 ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
              You're ready to move on to the next stage.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold border transition-colors ${
                  isdark
                    ? "border-gray-600 text-white hover:bg-[#0f172a]"
                    : "border-gray-200 text-[#475569] hover:bg-gray-50"
                }`}
              >
                <FiArrowLeft size={16} />
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#8b5cf6] hover:bg-[#7c3aed] transition-colors"
              >
                Next
                <FiArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto mb-8">
            <p
              className={`text-center text-xs font-semibold uppercase tracking-wide mb-3 ${
                isdark ? "text-[#8b5cf6]" : "text-[#7c3aed]"
              }`}
            >
              Day {currentIndex + 1} of {total} — {current.scheduledAt.format("DD MMM YYYY")}
            </p>

            {/* Social-post style preview */}
            <div
              className={`rounded-xl overflow-hidden border ${
                isdark ? "bg-[#0f172a] border-gray-600" : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`flex items-center gap-3 p-3 border-b ${
                  isdark ? "border-gray-600" : "border-gray-100"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  Z
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${isdark ? "text-white" : "text-[#1e293b]"}`}>
                    Zettalgor
                  </p>
                  <p className={`text-xs ${isdark ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
                    Scheduled · {current.scheduledAt.format("hh:mm A")}
                  </p>
                </div>
              </div>

              <p className={`px-4 py-3 text-sm whitespace-pre-wrap ${isdark ? "text-gray-200" : "text-[#374151]"}`}>
                {current.content}
              </p>

              {current.image && (
                <div
                  className={`aspect-[4/3] flex items-center justify-center ${
                    isdark ? "bg-[#1e293b]" : "bg-gray-100"
                  }`}
                >
                  {/* Replace with an actual <img src={current.image} /> once real images exist */}
                  <FiImage size={32} className={isdark ? "text-[#334155]" : "text-gray-300"} />
                </div>
              )}

              <div
                className={`flex items-center gap-5 px-4 py-3 border-t text-sm ${
                  isdark ? "border-gray-600 text-[#94a3b8]" : "border-gray-100 text-[#64748b]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <FiHeart size={16} /> Like
                </span>
                <span className="flex items-center gap-1.5">
                  <FiMessageCircle size={16} /> Comment
                </span>
                <span className="flex items-center gap-1.5">
                  <FiShare2 size={16} /> Share
                </span>
              </div>
            </div>

            {/* Editing controls for the current day only */}
            <div className="mt-4 space-y-3">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
                  Describe what you want (optional)
                </label>
                <input
                  type="text"
                  value={current.prompt}
                  onChange={(e) => updateCurrent({ prompt: e.target.value })}
                  placeholder="e.g. focus on customer testimonials"
                  className={`w-full text-sm rounded-lg px-3 h-10 border outline-none transition-colors ${
                    isdark
                      ? "bg-[#0f172a] border-gray-600 text-white placeholder:text-[#64748b] focus:border-[#8b5cf6]"
                      : "bg-white border-gray-200 text-[#475569] placeholder:text-[#94a3b8] focus:border-[#8b5cf6]"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
                  Scheduled for
                </label>
                <div className="flex items-center gap-2">
                  {/* Date is fixed to this day — only the time is editable */}
                  <div
                    className={`flex-1 h-10 rounded-lg px-3 flex items-center text-sm border ${
                      isdark
                        ? "bg-[#1e293b] border-gray-600 text-[#94a3b8]"
                        : "bg-gray-100 border-gray-200 text-[#64748b]"
                    }`}
                  >
                    {current.scheduledAt.format("DD MMM YYYY")}
                  </div>
                  <TimePicker
                    value={current.scheduledAt}
                    onChange={(value) => {
                      if (!value) return;
                      updateCurrent({
                        scheduledAt: current.scheduledAt
                          .hour(value.hour())
                          .minute(value.minute()),
                      });
                    }}
                    format="hh:mm A"
                    allowClear={false}
                    className="flex-1"
                    style={{ height: 40 }}
                  />
                </div>
                <p className={`text-xs mt-1 ${isdark ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
                  Only the time can be changed — the date is fixed to Day {currentIndex + 1}.
                </p>
              </div>

              {/* Update / Approve */}
              <div className="flex items-center gap-3 pt-1">
                {currentIndex === 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                      isdark
                        ? "border-gray-600 text-white hover:bg-[#0f172a]"
                        : "border-gray-200 text-[#475569] hover:bg-gray-50"
                    }`}
                  >
                    <FiArrowLeft size={14} />
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={regenerating}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                    isdark
                      ? "border-gray-600 text-white hover:bg-[#0f172a]"
                      : "border-gray-200 text-[#475569] hover:bg-gray-50"
                  }`}
                >
                  <FiRefreshCw size={14} className={regenerating ? "animate-spin" : ""} />
                  {regenerating ? "Regenerating..." : "Regenerate"}
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
                >
                  <FiCheck size={16} />
                  Approve{" "}&amp;{" "}Next{" "}Day
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
   
      </div>
    </ConfigProvider>
  );
};

export default StageThree;