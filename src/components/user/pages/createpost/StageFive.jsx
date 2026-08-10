"use client";
import React, { useMemo, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { ConfigProvider, Modal, message, theme } from "antd";
import dayjs from "@/lib/dayjsSetup";
import { apiFetch } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowRight,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiCheckCircle,
  FiVideo,
} from "react-icons/fi";

const MAX_RANGE_DAYS = 21;

const imageUrlForSeed = (seed) => `https://picsum.photos/seed/${seed}/600/450`;
const fallbackVideo = "https://www.w3schools.com/html/mov_bbb.mp4";

// ---------------------------------------------------------------------------
// Build the review items from the real API response items (from Stage-2's
// generate-captions endpoint). Each item has:
//   { day, scheduled_at, content, hashtags, day_group_id, post_ids, image_url, video_url }
// Falls back to placeholder cards if no API data is available yet.
// ---------------------------------------------------------------------------
const buildItems = (generatedItems = [], scheduledDates = [], hasContent = true, hasImage = true, hasVideo = false) => {
  const today = dayjs().startOf("day").hour(10).minute(0);

  if (generatedItems && generatedItems.length > 0) {
    return generatedItems.map((item, i) => {
      const scheduledAt =
        item.scheduled_at ? dayjs(item.scheduled_at) : (scheduledDates[i] || today.add(i, "day"));
      const content = item.content
        ? item.hashtags
          ? `${item.content}\n\n${item.hashtags}`
          : item.content
        : "";
      return {
        id: i + 1,
        day: item.day ?? i,
        content: hasContent ? content : null,
        image: hasImage ? (item.image_url || imageUrlForSeed(`marketingira-${i}`)) : null,
        video: hasVideo ? (item.video_url || null) : null,
        scheduledAt,
        // Preserve day_group_id from the generate-captions API response
        // so it can be sent in the final-submit payload.
        day_group_id: item.day_group_id,
        post_ids: item.post_ids,
      };
    });
  }

  // Fallback placeholder cards
  return Array.from({ length: MAX_RANGE_DAYS }, (_, i) => ({
    id: i + 1,
    day: i,
    content: hasContent ? "" : null,
    image: hasImage ? imageUrlForSeed(`marketingira-${i}`) : null,
    video: hasVideo ? fallbackVideo : null,
    scheduledAt: scheduledDates[i] || today.add(i, "day"),
    day_group_id: null,
    post_ids: null,
  }));
};

const StageFive = ({
  onBack,
  onReset,
  dayCount = MAX_RANGE_DAYS,
  scheduledDates = [],
  postTypes = ["content", "image"],
  generatedItems = [],
}) => {
  const { isdark } = useUserContext();
  const router = useRouter();
  const [messageApi, messageContextHolder] = message.useMessage();

  const hasContent = postTypes.includes("content");
  const hasImage = postTypes.includes("image");
  const hasVideo = postTypes.includes("video");

  const [stage] = useState(5);
  const [items] = useState(() =>
    buildItems(generatedItems, scheduledDates, hasContent, hasImage, hasVideo)
  );
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
      onOk: async () => {
        setSubmitting(true);
        try {
          // Build the payload — only the day_group_id for each item
          const payload = {
            items: items.map((it) => ({
              day_group_id: it.day_group_id,
            })),
          };

          await apiFetch("posts/final-submit/", {
            method: "POST",
            body: JSON.stringify(payload),
          });

          messageApi.success("All posts submitted successfully!");

          // Reset to Stage 1 after a short delay so the user sees the toast
          setTimeout(() => {
            onReset?.();
          }, 1200);
        } catch (error) {
          console.error("Final submit failed:", error);
          const errRaw = error?.data;
          const errResult = Array.isArray(errRaw) ? errRaw[0] ?? {} : errRaw ?? {};
          const errMsg =
            errResult?.message || error?.message || "Failed to submit posts";
          messageApi.error(errMsg);
        } finally {
          setSubmitting(false);
        }
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

              {/* Show video if available */}
              {item.video ? (
                <div className={`aspect-video overflow-hidden ${isdark ? "bg-[#1e293b]" : "bg-gray-100"}`}>
                  <video
                    src={item.video}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : hasVideo ? (
                /* Video selected but no URL yet — show placeholder */
                <div className={`aspect-video flex flex-col items-center justify-center gap-2 ${isdark ? "bg-[#1e293b]" : "bg-gray-100"}`}>
                  <FiVideo size={28} className={isdark ? "text-[#334155]" : "text-gray-300"} />
                  <p className={`text-xs ${isdark ? "text-[#475569]" : "text-gray-400"}`}>
                    Video not generated yet
                  </p>
                </div>
              ) : null}

              {/* Show image if available */}
              {item.image && !item.video && (
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