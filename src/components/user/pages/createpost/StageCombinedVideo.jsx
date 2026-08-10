"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { ConfigProvider, Modal, TimePicker, message, theme } from "antd";
import dayjs from "@/lib/dayjsSetup";
import { apiFetch } from "@/lib/apiClient";
import {
  FiArrowLeft,
  FiArrowRight,
  FiRefreshCw,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiCheck,
  FiVideo,
  FiType,
  FiLayers,
} from "react-icons/fi";
import { FaRegCircleCheck } from "react-icons/fa6";

const MAX_RANGE_DAYS = 21;

const fallbackVideo = "https://www.w3schools.com/html/mov_bbb.mp4";

// ---------------------------------------------------------------------------
// Build the working list of day cards from the API response items array.
// Each item: { day, scheduled_at, content, hashtags, day_group_id, post_ids, video_url }
// Falls back to placeholder cards when no API data is available yet.
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
        // Use video_url from the API response. When it's empty (the
        // API returns "" while the video is still generating), keep
        // null so the UI shows a placeholder instead of a random video.
        video: item.video_url || null,
        contentPrompt: "",
        videoPrompt: "",
        bothPrompt: "",
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
    video: fallbackVideo,
    contentPrompt: "",
    videoPrompt: "",
    bothPrompt: "",
    scheduledAt: scheduledDates[i] || today.add(i, "day"),
  }));
};

const StageCombinedVideo = ({
  onNext,
  onBack,
  stageNum = 3,
  dayCount = MAX_RANGE_DAYS,
  scheduledDates = [],
  generatedItems = [],
  title,
  website,
  description,
  postTypes = [],
  setGeneratedItems,
  timezone = "UTC",
}) => {
  const { isdark } = useUserContext();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [stage] = useState(stageNum);
  const [items, setItems] = useState(() =>
    buildInitialItems(generatedItems, scheduledDates)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [regenerating, setRegenerating] = useState(null); // null | "content" | "video" | "both"
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

  // Update the scheduled time for the current day via the API.
  const handleScheduleUpdate = async (newTime) => {
    if (!current || !newTime) return;
    const newScheduledAt = current.scheduledAt
      .hour(newTime.hour())
      .minute(newTime.minute());
    updateCurrent({ scheduledAt: newScheduledAt });
    if (current.day_group_id) {
      try {
        await apiFetch("posts/day-group/update-schedule/", {
          method: "POST",
          body: JSON.stringify({
            day_group_id: current.day_group_id,
            scheduled_time: newScheduledAt.format("YYYY-MM-DDTHH:mm:ss"),
            timezone,
          }),
        });
        messageApi.success("Schedule updated successfully");
      } catch (error) {
        const errResult = Array.isArray(error?.data) ? error.data[0] ?? {} : error?.data ?? {};
        messageApi.error(errResult?.message || error?.message || "Failed to update schedule");
      }
    }
  };

  // Sync the current items back to CreatePost so StageFive sees updated
  // content + video in the review/preview.
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
        video_url: it.video || "",
      }))
    );
  }, [items, setGeneratedItems]);

  // ── Regenerate handlers ───────────────────────────────────────────────
  // All three call the same posts/regenerate-day-group/ endpoint, but
  // pass different `regenerate` values: "content", "video", or "both".
  const handleRegenerate = async (mode) => {
    if (!current) return;
    setRegenerating(mode);

    const promptField =
      mode === "content" ? "contentPrompt" : mode === "video" ? "videoPrompt" : "bothPrompt";
    const userPrompt = current[promptField]?.trim() || "";

    const payload = {
      day_group_id: current.day_group_id,
      description: userPrompt || description,
      prompt: userPrompt,
      day: current.day,
      scheduled_at: current.scheduledAt?.toISOString() || null,
      website,
      title,
      brand_summary: "",
      model: "",
      post_types: postTypes,
      regenerate: mode, // "content" | "video" | "both"
    };

    try {
      const data = await apiFetch("posts/regenerate-day-group/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = Array.isArray(data) ? data[0] ?? {} : data ?? {};
      const d = result?.data || {};
      const item = (d.items && d.items[0]) || {};
      const post = (d.posts && d.posts[0]) || {};

      if (mode === "content" || mode === "both") {
        const regenerated =
          item.content || d.content || result?.content || current.content;
        const hashtags = item.hashtags || d.hashtags || result?.hashtags || "";
        const newContent = hashtags ? `${regenerated}\n\n${hashtags}` : regenerated;
        updateCurrent({ content: newContent });
      }

      if (mode === "video" || mode === "both") {
        const newVideo =
          item.video_url ||
          post.video_url ||
          d.video_url ||
          result?.video_url ||
          current.video ||
          null;

        if (newVideo && newVideo !== current.video) {
          // The API returns the URL immediately, but the actual video
          // file may still be generating on the server. Preload it
          // before updating state so the spinner stays visible until
          // the video is truly ready to play.
          try {
            await new Promise((resolve) => {
              const vid = document.createElement("video");
              vid.onloadeddata = resolve;
              vid.onerror = resolve; // resolve even on error
              vid.src = newVideo;
              setTimeout(resolve, 60000); // videos may take longer — 60s safety
            });
          } catch {
            // ignore preload errors — update with the URL anyway
          }
          updateCurrent({ video: newVideo });
        }
      }

      const successMsg =
        mode === "content"
          ? "Content regenerated successfully"
          : mode === "video"
            ? "Video regenerated successfully"
            : "Content & video regenerated successfully";
      messageApi.success(result?.message || d?.message || successMsg);
    } catch (error) {
      console.error(`Regenerate (${mode}) failed:`, error);
      const errRaw = error?.data;
      const errResult = Array.isArray(errRaw) ? errRaw[0] ?? {} : errRaw ?? {};
      const errMsg =
        errResult?.message || error?.message || "Failed to regenerate";
      messageApi.error(errMsg);
    } finally {
      setRegenerating(null);
    }
  };

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

  const regenBtnCls = (isPrimary = false) =>
    `flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors disabled:opacity-50 ${
      isPrimary
        ? "text-white bg-[#8b5cf6] hover:bg-[#7c3aed]"
        : isdark
          ? "border border-gray-600 text-white hover:bg-[#0f172a]"
          : "border border-gray-200 text-[#475569] hover:bg-gray-50"
    }`;

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
          Review each day&apos;s post (video + content), then Approve to lock it in and move to
          the next day — once approved a day can&apos;t be revisited.
        </p>

        {/* Progress dots */}
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
          <div className="flex flex-col items-center justify-center text-center py-16 mb-8">
            <FaRegCircleCheck size={40} className="text-emerald-500 mb-4" />
            <h3 className={`text-lg font-semibold ${isdark ? "text-white" : "text-[#1e293b]"}`}>
              All {total} days approved
            </h3>
            <p className={`text-sm mt-1 mb-6 ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
              You&apos;re ready to move on to the next stage.
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

            {/* ── Social-post style preview: video on top, content below ── */}
            <div
              className={`rounded-xl overflow-hidden border ${
                isdark ? "bg-[#0f172a] border-gray-600" : "bg-white border-gray-200"
              }`}
            >
              {/* Header */}
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

              {/* Video — on top */}
              <div
                className={`aspect-video relative flex items-center justify-center overflow-hidden ${
                  isdark ? "bg-[#1e293b]" : "bg-gray-100"
                }`}
              >
                {current.video ? (
                  <video
                    src={current.video}
                    controls
                    className={`w-full h-full object-cover transition-opacity ${
                      regenerating === "video" || regenerating === "both"
                        ? "opacity-40"
                        : "opacity-100"
                    }`}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FiVideo size={32} className={isdark ? "text-[#334155]" : "text-gray-300"} />
                    <p className={`text-xs ${isdark ? "text-[#475569]" : "text-gray-400"}`}>
                      {regenerating === "video" || regenerating === "both"
                        ? "Generating video…"
                        : "No video yet — click Regenerate to generate"}
                    </p>
                  </div>
                )}
                {(regenerating === "video" || regenerating === "both") && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiRefreshCw size={22} className="text-white animate-spin drop-shadow" />
                  </div>
                )}
              </div>

              {/* Content — below video */}
              <div
                className={`relative px-4 py-3 text-sm whitespace-pre-wrap ${
                  isdark ? "text-gray-200" : "text-[#374151]"
                }`}
              >
                {current.content}
                {(regenerating === "content" || regenerating === "both") && (
                  <span className="inline-flex items-center gap-1 ml-2 text-xs text-[#8b5cf6]">
                    <FiRefreshCw size={11} className="animate-spin" /> regenerating…
                  </span>
                )}
              </div>

              {/* Footer actions */}
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

            {/* ── Regenerate options ── */}
            <div className="mt-5 space-y-4">
              <div>
                <label className={`block text-xs font-medium mb-2 ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
                  Regenerate
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRegenerate("content")}
                    disabled={!!regenerating}
                    className={regenBtnCls()}
                  >
                    <FiType size={14} className={regenerating === "content" ? "animate-spin" : ""} />
                    {regenerating === "content" ? "…" : "Content only"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRegenerate("video")}
                    disabled={!!regenerating}
                    className={regenBtnCls()}
                  >
                    <FiVideo size={14} className={regenerating === "video" ? "animate-spin" : ""} />
                    {regenerating === "video" ? "…" : "Video only"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRegenerate("both")}
                    disabled={!!regenerating}
                    className={regenBtnCls(true)}
                  >
                    <FiLayers size={14} className={regenerating === "both" ? "animate-spin" : ""} />
                    {regenerating === "both" ? "…" : "Both"}
                  </button>
                </div>
              </div>

              {/* Prompt input */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
                  Describe what you want (optional)
                </label>
                <input
                  type="text"
                  value={current.bothPrompt}
                  onChange={(e) => updateCurrent({ bothPrompt: e.target.value })}
                  placeholder="e.g. cinematic product demo with a friendly voiceover"
                  className={`w-full text-sm rounded-lg px-3 h-10 border outline-none transition-colors ${
                    isdark
                      ? "bg-[#0f172a] border-gray-600 text-white placeholder:text-[#64748b] focus:border-[#8b5cf6]"
                      : "bg-white border-gray-200 text-[#475569] placeholder:text-[#94a3b8] focus:border-[#8b5cf6]"
                  }`}
                />
                <p className={`text-xs mt-1 ${isdark ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
                  This prompt is used for whichever regenerate button you click above.
                </p>
              </div>

              {/* Schedule time */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
                  Scheduled for
                </label>
                <div className="flex items-center gap-2">
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
                      handleScheduleUpdate(value);
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

              {/* Approve & Back */}
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
                  onClick={handleApprove}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
                >
                  <FiCheck size={16} />
                  Approve &amp; Next Day
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default StageCombinedVideo;