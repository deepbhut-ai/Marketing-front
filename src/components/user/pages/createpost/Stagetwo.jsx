"use client";
import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { ConfigProvider, DatePicker, Select, message, theme } from "antd";
const { RangePicker } = DatePicker;
import dayjs from "@/lib/dayjsSetup";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { apiFetch } from "@/lib/apiClient";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaTiktok, FaYoutube } from "react-icons/fa6";

const POST_TYPES = [
  { value: "content", label: "Content" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
];

// ---------------------------------------------------------------------------
// Post-type selection rules
// ---------------------------------------------------------------------------
//   content — can combine with image OR video (but not both at once)
//   image   — can combine with content, but NOT with video
//   video   — can combine with content, but NOT with image
//
// Valid combinations:
//   content only
//   image only
//   video only
//   content + image
//   content + video
//
// Invalid (blocked by togglePostType):
//   image + video
//   content + image + video
// ---------------------------------------------------------------------------
// "Conflicts" maps each type to the type it blocks (and vice-versa).
const CONFLICTS = {
  image: "video",
  video: "image",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PLATFORM_OPTIONS = [
  { value: "instagram", label: "Instagram", icon: FaInstagram, color: "#e1306c" },
  { value: "facebook", label: "Facebook", icon: FaFacebookF, color: "#1877f2" },
  { value: "twitter", label: "Twitter / X", icon: FaXTwitter, color: "#000000" },
  { value: "linkedin", label: "LinkedIn", icon: FaLinkedinIn, color: "#0a66c2" },
  { value: "tiktok", label: "TikTok", icon: FaTiktok, color: "#010101" },
  { value: "youtube", label: "YouTube", icon: FaYoutube, color: "#ff0000" },
];

// Separate lookup so icon components never end up inside the `options`
// array antd hands to its internal <div>/<Option> nodes — passing a
// component reference as an option field gets spread onto the DOM and
// React rejects it ("Invalid value for prop `icon` on <div> tag").
const PLATFORM_MAP = Object.fromEntries(PLATFORM_OPTIONS.map((p) => [p.value, p]));

const MAX_RANGE_DAYS = 21;

// Used only if the browser doesn't support Intl.supportedValuesOf (older
// Safari) — modern Chrome/Edge/Firefox/Safari 16+ all support it, in which
// case the full IANA list is used instead of this short fallback.
const FALLBACK_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

// Builds { value: "Asia/Kolkata", label: "Asia/Kolkata (GMT+5:30)" } for
// every supported IANA zone, so the Select shows the current UTC offset
// alongside the zone name.
const getTimezoneOptions = () => {
  const zones =
    typeof Intl.supportedValuesOf === "function"
      ? Intl.supportedValuesOf("timeZone")
      : FALLBACK_TIMEZONES;

  return zones.map((tz) => {
    let offset = "";
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        timeZoneName: "shortOffset",
      }).formatToParts(new Date());
      offset = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    } catch {
      // ignore zones the runtime can't format
    }
    return { value: tz, label: offset ? `${tz} (${offset})` : tz };
  });
};

// Day-name -> dayjs().day() index, used by the range/active-day check below.
const DAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

// Returns true if at least one calendar day inside [from, to] falls on one
// of the selected active weekdays. Bounded by MAX_RANGE_DAYS (21), so the
// loop is always cheap.
const rangeHasActiveDay = (range, days) => {
  if (!range?.[0] || !range?.[1] || !days?.length) return false;
  const wanted = new Set(days.map((d) => DAY_INDEX[d]));
  let cursor = range[0].startOf("day");
  const end = range[1].startOf("day");
  let guard = 0;
  while ((cursor.isBefore(end, "day") || cursor.isSame(end, "day")) && guard <= MAX_RANGE_DAYS + 1) {
    if (wanted.has(cursor.day())) return true;
    cursor = cursor.add(1, "day");
    guard += 1;
  }
  return false;
};

// The generate-captions endpoint can respond in a couple of different
// shapes depending on status code / middleware:
//   - a plain object:            { success, message, data: {...} }
//   - an array-like [body, status] pair: [{ success:false, message, errors }, 400]
// This normalizes both down to the actual body object so callers only
// ever have to check `result.success`.
const normalizeApiResponse = (data) => {
  if (Array.isArray(data)) return data[0] ?? null;
  return data ?? null;
};

const Stagetwo = ({
  onNext,
  onBack,
  scheduleRange,
  setScheduleRange,
  postTypes,
  setPostTypes,
  activeDays,
  setActiveDays,
  platforms,
  setPlatforms,
  timezone,
  setTimezone,
  title,
  website,
  description,
  setGeneratedItems,
}) => {
  const { isdark } = useUserContext();
  const [messageApi, contextHolder] = message.useMessage();

  const [stage] = useState(2);
  const [generating, setGenerating] = useState(false);

  // Detected on mount (client-only) so SSR doesn't guess the wrong zone —
  // defaults to the visitor's actual PC/browser timezone.
  const [timezoneOptions, setTimezoneOptions] = useState([]);

  useEffect(() => {
    // Auto-detect browser timezone on first mount
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setTimezoneOptions(getTimezoneOptions());
  }, []);

  const today = dayjs().startOf("day");
  const maxDate = today.add(MAX_RANGE_DAYS, "day").endOf("day");

  // ---- antd theme — same pattern as the rest of the app ------------------
  const antdTheme = {
    algorithm: isdark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    components: {
      Select: {
        selectorBg: isdark ? "#0f172a" : "#ffffff",
        colorText: isdark ? "#ffffff" : "#000000",
        colorBorder: isdark ? "#475569" : "#d9d9d9",
        colorPrimaryHover: isdark ? "#8b5cf6" : "#4096ff",
        colorPrimary: "#8b5cf6",
        controlOutline: "transparent",
        controlHeight: 44,
        optionSelectedBg: isdark ? "#334155" : "#e6f4ff",
        colorBgElevated: isdark ? "#1e293b" : "#ffffff",
      },
      DatePicker: {
        colorBgContainer: isdark ? "#0f172a" : "#ffffff",
        colorText: isdark ? "#ffffff" : "#000000",
        colorTextPlaceholder: isdark ? "#64748b" : "#94a3b8",
        colorBorder: isdark ? "#475569" : "#d9d9d9",
        colorPrimaryHover: isdark ? "#8b5cf6" : "#4096ff",
        colorPrimary: "#8b5cf6",
        controlOutline: "transparent",
        controlHeight: 44,
        colorBgElevated: isdark ? "#1e293b" : "#ffffff",
        cellActiveWithRangeBg: isdark ? "#334155" : "#e6f4ff",
      },
    },
  };

  // Only allow the next 21 days (today included) to be picked
  const disabledDate = (current) => {
    if (!current) return false;
    return current.isBefore(today, "day") || current.isAfter(maxDate, "day");
  };

  // Toggle a post type on/off, enforcing the conflict rules:
  //   image ↔ video are mutually exclusive (selecting one removes the other)
  //   content can combine with either image or video freely
  //   At least one post type must always stay selected.
  const togglePostType = (value) => {
    setPostTypes((prev) => {
      const isActive = prev.includes(value);

      if (isActive) {
        // Can't remove the last one
        if (prev.length === 1) return prev;
        return prev.filter((v) => v !== value);
      }

      // Turning ON a new type — remove its conflict partner if present
      const conflict = CONFLICTS[value];
      const next = conflict
        ? prev.filter((v) => v !== conflict)
        : prev;
      return [...next, value];
    });
  };

  const toggleDay = (day) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleNext = async () => {
    const missing = [];
    if (!scheduleRange) missing.push("Schedule From & To");
    if (platforms.length === 0) missing.push("Social Platform");
    if (activeDays.length === 0) missing.push("Post Day");
    if (missing.length > 0) {
      messageApi.warning(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    // Safety-net guards (also enforced in the RangePicker onChange):
    //   1. From can't be in the past
    //   2. To must be after From
    const [from, to] = scheduleRange;
    if (from && from.isBefore(dayjs(), "second")) {
      messageApi.error("From date & time can't be in the past.");
      return;
    }
    if (from && to && !to.isAfter(from, "second")) {
      messageApi.error("To date & time must be after the From date & time.");
      return;
    }

    // Client-side guard: catch a range/active-day mismatch before ever
    // calling the API (e.g. range is Thu–Fri but only "Mon" is active).
    if (!rangeHasActiveDay(scheduleRange, activeDays)) {
      messageApi.error(
        "No valid dates in the given range with the selected active days"
      );
      return;
    }

    // Send ISO-8601 format with "Z" suffix (e.g. "2026-08-10T04:04:00.000Z")
    // but preserve the calendar day the user actually picked.
    // Plain .toISOString() converts to real UTC, which shifts the date
    // backward for non-UTC timezones (e.g. 10 Aug 04:04 IST → 09 Aug 22:34 UTC).
    // Instead we treat the local wall-clock time as if it were UTC, so the
    // API receives the same date/time the user sees on screen. The user's
    // real timezone is sent separately in the `timezone` field so the
    // backend can convert if needed.
    const fromRaw = scheduleRange?.[0];
    const toRaw = scheduleRange?.[1];
    const from_date = fromRaw
      ? dayjs.utc(fromRaw.format("YYYY-MM-DD HH:mm:ss")).toISOString()
      : null;
    const to_date = toRaw
      ? dayjs.utc(toRaw.format("YYYY-MM-DD HH:mm:ss")).toISOString()
      : null;

    const payload = {
      description,
      platforms,
      from_date,
      to_date,
      active_days: activeDays,
      timezone,
      post_types: postTypes,
      website,
      title,
    };

    setGenerating(true);
    try {
      const data = await apiFetch("posts/generate-captions/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Normalize: response can come back as either a plain object
      // ({success, message, data}) or an array-like [body, status] pair
      // (e.g. [{success:false, message:"...", errors:{}}, 400]).
      const result = normalizeApiResponse(data);

      // Handle the API returning success: false in the body (whichever
      // shape it arrived in) — stay on this stage and surface the message.
      if (!result || result.success === false) {
        messageApi.error(
          result?.message || "Failed to generate captions"
        );
        return;
      }

      const items = result?.data?.items || result?.items || [];
      setGeneratedItems(items);
      messageApi.success(
        result?.data?.message || result?.message || "Captions generated successfully"
      );
      onNext?.();
    } catch (error) {
      console.error("Generate captions failed:", error);
      const errData = normalizeApiResponse(error?.data) || error?.data;
      const errMsg =
        (Array.isArray(errData) && errData[0]?.message) ||
        errData?.message ||
        errData?.detail ||
        error?.message ||
        "Failed to generate captions";
      messageApi.error(errMsg);
    } finally {
      setGenerating(false);
    }
  };

  const handleBack = () => {
    onBack?.();
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <div
        className={`shadow-sm rounded-xl p-5 sm:p-8 md:p-10 ${
          isdark ? "bg-[#1e293b]" : "bg-white"
        }`}
      >
        {contextHolder}
        {/* Stage badge */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <span className="bg-[#8b5cf6] text-white text-sm font-semibold px-5 py-2 rounded-full">
            Stage {stage}
          </span>
        </div>
        <div className="lg:flex justify-between gap-5">
          {/* 1. From / To date & time — next 21 days only */}
          <div className="mb-6 w-full">
            <label
              className={`block text-sm font-semibold mb-2 ${
                isdark ? "text-white" : "text-[#475569]"
              }`}
            >
              Schedule From &amp; To <span className="text-red-500">*</span>
            </label>
            <RangePicker
              value={scheduleRange}
              onChange={(value) => {
                // value is null when the user clears the picker
                if (!value) {
                  setScheduleRange(null);
                  return;
                }

                const [from, to] = value;

                // Guard 1: "From" can't be before the current moment.
                // We compare with second-level precision so a time picked
                // a few seconds ago doesn't falsely trigger.
                if (from && from.isBefore(dayjs(), "second")) {
                  messageApi.error("From date & time can't be in the past.");
                  return; // don't update state — picker keeps the old value
                }

                // Guard 2: "To" must be after "From" (date OR time difference).
                if (from && to && !to.isAfter(from, "second")) {
                  messageApi.error("To date & time must be after the From date & time.");
                  return;
                }

                setScheduleRange(value);
              }}
              showTime={{ format: "hh:mm A" }}
              format="DD MMM YYYY, hh:mm A"
              disabledDate={disabledDate}
              placeholder={["From date", "To date"]}
              style={{ width: "100%", height: 44 }}
            />
            <p className={`text-xs mt-1.5 ${isdark ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
              Both dates must fall within the next {MAX_RANGE_DAYS} days from today.
            </p>
          </div>

          {/* 2. Timezone — defaults to the user's PC/browser timezone */}
          <div className="mb-6 w-full">
            <label
              className={`block text-sm font-semibold mb-2 ${
                isdark ? "text-white" : "text-[#475569]"
              }`}
            >
              Timezone <span className="text-red-500">*</span>
            </label>
            <Select
              showSearch
              value={timezone}
              onChange={setTimezone}
              options={timezoneOptions}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: "100%" }}
            />
            <p className={`text-xs mt-1.5 ${isdark ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
              Detected automatically from your device — change it if you're scheduling for
              a different region.
            </p>
          </div>
        </div>
        <div className="lg:flex justify-between gap-5">
          {/* 3. Post type — both Content Post and Image Post can be selected
              together, but at least one must always remain active */}
          <div className="mb-6 w-full">
            <label
              className={`block text-sm font-semibold mb-2 ${
                isdark ? "text-white" : "text-[#475569]"
              }`}
            >
              Post Type <span className="text-red-500">*</span>
            </label>
            <div
              className={`inline-flex p-1 rounded-lg gap-1 ${
                isdark ? "bg-[#0f172a]" : "bg-gray-100"
              }`}
            >
              {POST_TYPES.map((opt) => {
                const active = postTypes.includes(opt.value);
                const isLastActive = active && postTypes.length === 1;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={active}
                    disabled={isLastActive}
                    onClick={() => togglePostType(opt.value)}
                    title={isLastActive ? "At least one post type must be selected" : undefined}
                    className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? `bg-[#8b5cf6] text-white shadow-sm ${isLastActive ? "cursor-not-allowed opacity-90" : ""}`
                        : isdark
                          ? "text-[#94a3b8] hover:text-white"
                          : "text-[#64748b] hover:text-[#1e293b]"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className={`text-xs mt-1.5 ${isdark ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
              Content can combine with Image or Video. Image and Video can&apos;t be selected together.
            </p>
          </div>

          {/* 4. Post days — any day, including weekends, is selectable */}
          <div className="mb-6 w-full">
            <label
              className={`block text-sm font-semibold mb-2 ${
                isdark ? "text-white" : "text-[#475569]"
              }`}
            >
              Post Days <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const active = activeDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`w-12 h-12 rounded-full text-sm font-medium border transition-colors ${
                      active
                        ? "bg-[#8b5cf6] border-[#8b5cf6] text-white"
                        : isdark
                          ? "border-gray-600 text-[#94a3b8] hover:border-[#8b5cf6]"
                          : "border-gray-200 text-[#64748b] hover:border-[#8b5cf6]"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            <p className={`text-xs mt-1.5 ${isdark ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
              Weekends are selectable too — pick any combination of days.
            </p>
          </div>
        </div>

        {/* 5. Social platforms — multi-select */}
        <div className="mb-2 w-full">
          <label
            className={`block text-sm font-semibold mb-2 ${
              isdark ? "text-white" : "text-[#475569]"
            }`}
          >
            Social Platforms <span className="text-red-500">*</span>
          </label>
          <Select
            mode="multiple"
            value={platforms}
            onChange={setPlatforms}
            placeholder="Select platforms"
            style={{ width: "100%" }}
            optionLabelProp="label"
            options={PLATFORM_OPTIONS.map((p) => ({
              value: p.value,
              label: p.label,
            }))}
            optionRender={(option) => {
              const platform = PLATFORM_MAP[option.value];
              const Icon = platform.icon;
              return (
                <span className="flex items-center gap-2">
                  <Icon size={14} style={{ color: platform.color }} />
                  {platform.label}
                </span>
              );
            }}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 sm:mt-10">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors btn-generate`}
          >
            <FiArrowLeft size={16} />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={generating}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors btn-generate disabled:opacity-50`}
          >
            {generating ? "Generating..." : "Next"}
            <FiArrowRight size={16} />
          </button>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Stagetwo;