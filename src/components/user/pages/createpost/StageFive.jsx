"use client";
import React, { useMemo, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { ConfigProvider, Modal, message, theme } from "antd";
import dayjs from "dayjs";
import {
  FiArrowLeft,
  FiArrowRight,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiCheckCircle,
} from "react-icons/fi";

const MAX_RANGE_DAYS = 21;

// ---------------------------------------------------------------------------
// Dummy combined preview data — replace with the real, approved output of
// Stage 3 (content) and Stage 4 (image) once they're wired together (e.g.
// via shared state/context/URL params across the wizard). Each entry here
// represents one day's final post exactly as it will be published.
// ---------------------------------------------------------------------------
const DUMMY_CONTENT = [
  "Unlock 50+ new leads this week with AI-driven outreach that actually converts.",
  "Behind the scenes: how our platform fine-tunes a custom model in under 60 seconds.",
  "Stop guessing. Start deploying. See how domain-specific AI beats generic models.",
  "3 mistakes business owners make when adopting AI — and how to avoid them.",
  "From idea to deployed AI model in one afternoon. Here's how our early users did it.",
  "No ML degree required. Just your business data and 60 seconds.",
  "Case study: how a mid-size SaaS company cut support tickets by 40% with custom AI.",
];

const imageUrlForSeed = (seed) => `https://picsum.photos/seed/${seed}/600/450`;

const buildItems = (count = MAX_RANGE_DAYS, scheduledDates = [], hasContent = true, hasImage = true) => {
  const today = dayjs().startOf("day").hour(10).minute(0);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    day: i,
    content: hasContent ? DUMMY_CONTENT[i % DUMMY_CONTENT.length] : null,
    image: hasImage ? imageUrlForSeed(`marketingira-${i}`) : null,
    scheduledAt: scheduledDates[i] || today.add(i, "day"),
  }));
};

const StageFive = ({ onBack, dayCount = MAX_RANGE_DAYS, scheduledDates = [], postTypes = ["content", "image"] }) => {
  const { isdark } = useUserContext();
  const [messageApi, messageContextHolder] = message.useMessage();

  const hasContent = postTypes.includes("content");
  const hasImage = postTypes.includes("image");

  const [stage] = useState(5);
  const [items] = useState(() => buildItems(dayCount, scheduledDates, hasContent, hasImage));
  const [submitting, setSubmitting] = useState(false);
  const [modal, modalContextHolder] = Modal.useModal();

  const antdTheme = useMemo(
    () => ({ algorithm: isdark ? theme.darkAlgorithm : theme.defaultAlgorithm }),
    [isdark]
  );

  const handleBack = () => {
    onBack?.();
  };

  const handleSubmit = () => {
    modal.confirm({
      title: `Submit all ${items.length} posts?`,
      content:
        "This schedules every post for its date and time. You can still manage individual posts later from your dashboard.",
      okText: "Submit",
      cancelText: "Cancel",
      onOk: () => {
        setSubmitting(true);
        // TODO: replace with your real "create schedule" API call
        setTimeout(() => {
          console.log({ stage, items });
          setSubmitting(false);
          messageApi.success("All posts submitted successfully!");
        }, 800);
      },
    });
  };

  return (
    <ConfigProvider theme={antdTheme}>
      {modalContextHolder}
      {messageContextHolder}
      <div
        className={`shadow-sm rounded-xl p-5 sm:p-6 md:p-8 ${
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
          Final review — this is exactly how each post will look on the platform. Submit
          when you're happy with all {items.length} days.
        </p>

        {/* Back — Submit */}
        <div className="flex items-center justify-between mb-8 gap-3">
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
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors disabled:opacity-60"
          >
            <FiCheckCircle size={16} />
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>

        {/* Responsive preview grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`rounded-xl overflow-hidden border ${
                isdark ? "bg-[#0f172a] border-gray-600" : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`flex items-center justify-between gap-2 p-3 border-b ${
                  isdark ? "border-gray-600" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    M
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isdark ? "text-white" : "text-[#1e293b]"
                      }`}
                    >
                      Marketing.IRA
                    </p>
                    <p className={`text-[11px] ${isdark ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
                      {item.scheduledAt.format("DD MMM, hh:mm A")}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full shrink-0 ${
                    isdark ? "bg-[#1e293b] text-[#8b5cf6]" : "bg-[#f5f3ff] text-[#7c3aed]"
                  }`}
                >
                  Day {idx + 1}
                </span>
              </div>

              {/* Show image if available */}
              {item.image && (
                <div className={`aspect-[4/3] overflow-hidden ${isdark ? "bg-[#1e293b]" : "bg-gray-100"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={`Day ${idx + 1} post`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Show content text if available */}
              {item.content && (
                <p
                  className={`px-3 py-3 text-xs leading-relaxed ${
                    isdark ? "text-gray-200" : "text-[#374151]"
                  }`}
                >
                  {item.content}
                </p>
              )}

              <div
                className={`flex items-center gap-4 px-3 py-2.5 border-t text-xs ${
                  isdark ? "border-gray-600 text-[#94a3b8]" : "border-gray-100 text-[#64748b]"
                }`}
              >
                <span className="flex items-center gap-1">
                  <FiHeart size={13} /> Like
                </span>
                <span className="flex items-center gap-1">
                  <FiMessageCircle size={13} /> Comment
                </span>
                <span className="flex items-center gap-1">
                  <FiShare2 size={13} /> Share
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation — Back left, Submit right */}
  
      </div>
    </ConfigProvider>
  );
};

export default StageFive;