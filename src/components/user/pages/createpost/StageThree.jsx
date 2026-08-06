"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { ConfigProvider, DatePicker, Modal, TimePicker, message, theme } from "antd";
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

// ---------------------------------------------------------------------------
// Build the working list of day cards from the API response items array
// (from Stage-2's generate-captions endpoint). Each item has:
//   { day, scheduled_at, content, hashtags, day_group_id, post_ids }
// When no API data is available yet we fall back to placeholder cards
// so the stage still renders during development.
// ---------------------------------------------------------------------------
const buildInitialItems = (generatedItems, scheduledDates = []) => {
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
        content,
        image: null,
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
    content: "",
    image: null,
    prompt: "",
    scheduledAt: scheduledDates[i] || today.add(i, "day"),
  }));
};

const StageThree = ({
  onNext,
  onBack,
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

  const [stage] = useState(3);
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

  // Sync the current items back to CreatePost so StageFive sees updated
  // content in the review/preview. Called via useEffect to avoid
  // updating a parent component during render.
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

  // Regenerate the caption for the current day only.
  // Uses the per-card prompt input if provided, otherwise falls back
  // to the original `description` from Stage 1.
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

      // Normalize: response can be a plain object or [body, status] array
      const result = Array.isArray(data) ? data[0] ?? {} : data ?? {};
      const d = result?.data || {};
      // Regenerated content comes back in data.items[0]
      const item = (d.items && d.items[0]) || {};
      const regenerated =
        item.content || d.content || result?.content || current.content;
      const hashtags = item.hashtags || d.hashtags || result?.hashtags || "";
      const newContent = hashtags ? `${regenerated}\n\n${hashtags}` : regenerated;
      updateCurrent({ content: newContent });
      messageApi.success(
        result?.message || d?.message || "Caption regenerated successfully"
      );
    } catch (error) {
      console.error("Regenerate caption failed:", error);
      const errRaw = error?.data;
      const errResult = Array.isArray(errRaw) ? errRaw[0] ?? {} : errRaw ?? {};
      const errMsg =
        errResult?.message || error?.message || "Failed to regenerate caption";
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
                  Approve&nbsp;&amp;&nbsp;Next&nbsp;Day
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