"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { ConfigProvider, Modal, TimePicker, message, theme } from "antd";
import dayjs from "dayjs";
import { apiFetch } from "@/lib/apiClient";
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

const imageUrlForSeed = (seed) => `https://picsum.photos/seed/${seed}/600/450`;

// ---------------------------------------------------------------------------
// Build the working list of day cards from the real API response items
// (from Stage-2's generate-captions endpoint). Each item has:
//   { day, scheduled_at, content, hashtags, day_group_id, post_ids, image_url }
// Falls back to placeholder cards if no API data is available yet.
// ---------------------------------------------------------------------------
const buildInitialItems = (generatedItems = [], scheduledDates = []) => {
  const today = dayjs().startOf("day").hour(10).minute(0);

  if (generatedItems && generatedItems.length > 0) {
    return generatedItems.map((item, i) => {
      const scheduledAt =
        item.scheduled_at ? dayjs(item.scheduled_at) : (scheduledDates[i] || today.add(i, "day"));
      return {
        id: i + 1,
        day: item.day ?? i,
        image: item.image_url || imageUrlForSeed(`marketingira-${i}`),
        prompt: "",
        scheduledAt,
        day_group_id: item.day_group_id,
        post_ids: item.post_ids,
      };
    });
  }

  // Fallback placeholder cards
  return Array.from({ length: MAX_RANGE_DAYS }, (_, i) => ({
    id: i + 1,
    day: i,
    image: imageUrlForSeed(`marketingira-${i}`),
    prompt: "",
    scheduledAt: scheduledDates[i] || today.add(i, "day"),
  }));
};

// Swap this whole function for your real image-generation API call, sending
// `prompt` as the instruction when it's non-empty.
const pickImage = (prompt, id) => {
  const base = prompt && prompt.trim() ? prompt.trim() : `random-${Math.random()}`;
  return imageUrlForSeed(`${id}-${base}`);
};

const StageFour = ({
  onNext,
  onBack,
  onBackToContent,
  hasContent = true,
  dayCount = MAX_RANGE_DAYS,
  scheduledDates = [],
  generatedItems = [],
  title,
  website,
  description,
  postTypes = [],
  setGeneratedItems,
}) => {
  const { isdark } = useUserContext();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [stage] = useState(4);
  const [items, setItems] = useState(() =>
    buildInitialItems(generatedItems, scheduledDates)
  );
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

  // Sync updated items back to CreatePost so StageFive sees the
  // regenerated image in the review/preview.
  useEffect(() => {
    if (!setGeneratedItems) return;
    setGeneratedItems(
      items.map((it) => ({
        day: it.day,
        scheduled_at: it.scheduledAt?.toISOString() || null,
        content: it.content?.split("\n\n")[0] || it.content || "",
        hashtags: it.content?.split("\n\n")[1] || "",
        day_group_id: it.day_group_id,
        post_ids: it.post_ids,
        image_url: it.image || "",
      }))
    );
  }, [items, setGeneratedItems]);

  // Regenerate the image for the current day only via the same
  // posts/regenerate-day-group/ endpoint used in Stage Three.
  const handleUpdate = async () => {
    if (!current) return;
    setRegenerating(true);

    const payload = {
      day_group_id: current.day_group_id,
      description: current.prompt?.trim() ? current.prompt : description,
      prompt: current.prompt || "",
      day: current.day,
      scheduled_at: current.scheduledAt?.toISOString() || null,
      website,
      title,
      brand_summary: "",
      model: "",
      post_types: postTypes,
    };

    try {
      const data = await apiFetch("posts/regenerate-day-group/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = Array.isArray(data) ? data[0] ?? {} : data ?? {};
      const d = result?.data || {};
      // Image can be in data.items[0], data.posts[0], or at the top level
      const item = (d.items && d.items[0]) || {};
      const post = (d.posts && d.posts[0]) || {};
      const newImage =
        item.image_url ||
        post.image_url ||
        d.image_url ||
        result?.image_url ||
        current.image;
      updateCurrent({ image: newImage });
      messageApi.success(
        result?.message || d?.message || "Image regenerated successfully"
      );
    } catch (error) {
      console.error("Regenerate image failed:", error);
      const errRaw = error?.data;
      const errResult = Array.isArray(errRaw) ? errRaw[0] ?? {} : errRaw ?? {};
      const errMsg =
        errResult?.message || error?.message || "Failed to regenerate image";
      messageApi.error(errMsg);
    } finally {
      setRegenerating(false);
    }
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
    // If content stage exists, go back to it; otherwise go to schedule (stage 2)
    if (hasContent) {
      onBackToContent?.();
    } else {
      onBack?.();
    }
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
        className={`shadow-sm rounded-xl p-5 sm:p-4 md:p-8 ${
          isdark ? "bg-[#1e293b]" : "bg-white"
        }`}
      >
        {/* Stage badge */}
        <div className="flex justify-center mb-3">
          <span className="bg-[#8b5cf6] text-white text-sm font-semibold px-5 py-2 rounded-full">
            Stage {stage}
          </span>
        </div>
        <p className={`text-center text-sm mb-2 ${isdark ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
          Review each day's image, then Approve to lock it in and move to the next day —
          once approved a day can't be revisited.
        </p>

        {/* Progress dots — approved (checked), current (ring), locked (dim) */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 mb-2">
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
          <div className="max-w-md mx-auto">
            <p
              className={`text-center text-xs font-semibold uppercase tracking-wide mb-3 ${
                isdark ? "text-[#8b5cf6]" : "text-[#7c3aed]"
              }`}
            >
              Day {currentIndex + 1} of {total} — {current.scheduledAt.format("DD MMM YYYY")}
            </p>

            {/* Social-post style preview — image focused */}
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
                  M
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${isdark ? "text-white" : "text-[#1e293b]"}`}>
                    Marketing.IRA
                  </p>
                  <p className={`text-xs ${isdark ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
                    Scheduled · {current.scheduledAt.format("hh:mm A")}
                  </p>
                </div>
              </div>

              <div
                className={`aspect-[4/3] relative flex items-center justify-center overflow-hidden ${
                  isdark ? "bg-[#1e293b]" : "bg-gray-100"
                }`}
              >
                {current.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={current.image}
                    alt={`Day ${currentIndex + 1} suggestion`}
                    className={`w-full h-full object-cover transition-opacity ${
                      regenerating ? "opacity-40" : "opacity-100"
                    }`}
                  />
                ) : (
                  <FiImage size={32} className={isdark ? "text-[#334155]" : "text-gray-300"} />
                )}
                {regenerating && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiRefreshCw size={22} className="text-white animate-spin drop-shadow" />
                  </div>
                )}
              </div>

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
                  Describe the image you want (optional)
                </label>
                <input
                  type="text"
                  value={current.prompt}
                  onChange={(e) => updateCurrent({ prompt: e.target.value })}
                  placeholder="e.g. bright product shot on a purple gradient background"
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
                  Approve&nbsp;&amp;&nbsp;Next&nbsp;Day
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default StageFour;