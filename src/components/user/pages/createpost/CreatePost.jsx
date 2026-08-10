"use client";
import React, { useMemo, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { FiCheck } from "react-icons/fi";
import dayjs from "@/lib/dayjsSetup";
import StageOne from "./StageOne";
import Stagetwo from "./Stagetwo";
import StageThree from "./StageThree";
import StageFour from "./StageFour";
import StageFive from "./StageFive";
import StageCombined from "./StageCombined";
import StageVideo from "./StageVideo";
import StageCombinedVideo from "./StageCombinedVideo";

const MAX_RANGE_DAYS = 21;
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CreatePost = () => {
  const { isdark } = useUserContext();
  const [stageIndex, setStageIndex] = useState(0);

  // ── Lifted Stage-1 state ──────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  // ── Generated captions from Stage-2 API (consumed by Stage-3) ─────────
  const [generatedItems, setGeneratedItems] = useState([]);

  // ── Lifted Stage-2 state ──────────────────────────────────────────────
  const [scheduleRange, setScheduleRange] = useState(null);
  const [postTypes, setPostTypes] = useState(["content"]);
  const [activeDays, setActiveDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [platforms, setPlatforms] = useState([]);
  const [timezone, setTimezone] = useState("UTC");

  // ── Compute scheduled dates from range + activeDays ──────────────────
  const scheduledDates = useMemo(() => {
    if (!scheduleRange || scheduleRange.length < 2) return [];
    const start = scheduleRange[0].startOf("day");
    const end = scheduleRange[1].startOf("day");
    // Preserve the actual times the user picked in the RangePicker
    const fromTime = { hour: scheduleRange[0].hour(), minute: scheduleRange[0].minute() };
    const toTime = { hour: scheduleRange[1].hour(), minute: scheduleRange[1].minute() };
    const dates = [];
    let cur = start;
    while (cur.isBefore(end) || cur.isSame(end, "day")) {
      const dayName = DAY_NAMES[cur.day()];
      if (activeDays.includes(dayName)) {
        dates.push(cur); // date only — time assigned below
      }
      cur = cur.add(1, "day");
    }
    const sliced = dates.slice(0, MAX_RANGE_DAYS);
    // First day gets the From time, last day gets the To time,
    // days in between get an evenly-spaced time between them.
    if (sliced.length === 1) {
      sliced[0] = sliced[0].hour(fromTime.hour).minute(fromTime.minute);
    } else if (sliced.length > 1) {
      sliced[0] = sliced[0].hour(fromTime.hour).minute(fromTime.minute);
      sliced[sliced.length - 1] = sliced[sliced.length - 1].hour(toTime.hour).minute(toTime.minute);
      // Interpolate times for middle days
      for (let i = 1; i < sliced.length - 1; i++) {
        const ratio = i / (sliced.length - 1);
        const totalFromMin = fromTime.hour * 60 + fromTime.minute;
        const totalToMin = toTime.hour * 60 + toTime.minute;
        const interpMin = Math.round(totalFromMin + ratio * (totalToMin - totalFromMin));
        sliced[i] = sliced[i].hour(Math.floor(interpMin / 60)).minute(interpMin % 60);
      }
    }
    return sliced;
  }, [scheduleRange, activeDays]);

  const dayCount = scheduledDates.length;

  // ── Dynamic stage list ────────────────────────────────────────────────
  // Post-type selection rules (enforced in Stagetwo's togglePostType):
  //   content — can combine with image OR video
  //   image   — can combine with content, NOT with video
  //   video   — can combine with content, NOT with image
  //
  // Valid combinations and their stages:
  //   content only        → Content
  //   image only          → Images
  //   video only          → Video
  //   content + image     → Content & Image (combined)
  //   content + video     → Content & Video (combined video)
  const hasContent = postTypes.includes("content");
  const hasImage = postTypes.includes("image");
  const hasVideo = postTypes.includes("video");
  const hasContentImage = hasContent && hasImage;
  const hasContentVideo = hasContent && hasVideo;

  const stages = useMemo(() => {
    const list = [
      { id: "details", label: "Details", num: 1 },
      { id: "schedule", label: "Schedule", num: 2 },
    ];
    if (hasContentVideo) {
      list.push({ id: "combined_video", label: "Content & Video", num: 3 });
    } else if (hasContentImage) {
      list.push({ id: "combined", label: "Content & Image", num: 3 });
    } else if (hasVideo) {
      list.push({ id: "video", label: "Video", num: 3 });
    } else {
      if (hasContent) list.push({ id: "content", label: "Content", num: 3 });
      if (hasImage) list.push({ id: "image", label: "Images", num: 4 });
    }
    const lastNum = list[list.length - 1]?.num || 2;
    list.push({ id: "review", label: "Review", num: lastNum + 1 });
    return list;
  }, [hasContent, hasImage, hasVideo, hasContentImage, hasContentVideo]);

  const currentStageId = stages[stageIndex]?.id;

  // ── Navigation ────────────────────────────────────────────────────────
  const goNext = () => setStageIndex((i) => Math.min(i + 1, stages.length - 1));
  const goBack = () => setStageIndex((i) => Math.max(i - 1, 0));
  const goTo = (idx) => {
    if (idx <= stageIndex) setStageIndex(idx);
  };

  // Reset the entire wizard back to Stage 1 with a clean slate —
  // called after the final-submit API succeeds.
  const handleReset = () => {
    setStageIndex(0);
    setTitle("");
    setWebsite("");
    setDescription("");
    setGeneratedItems([]);
    setScheduleRange(null);
    setPostTypes(["content"]);
    setActiveDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
    setPlatforms([]);
    setTimezone("UTC");
  };

  // When postTypes change, clamp stageIndex so we don't land on a removed stage
  const clampStageIndex = () => {
    setStageIndex((i) => Math.min(i, stages.length - 1));
  };

  return (
    <div>
      {/* Stepper */}
   

      {/* Stage body */}
      <div>
        {currentStageId === "details" && (
          <StageOne
            onNext={goNext}
            title={title}
            setTitle={setTitle}
            website={website}
            setWebsite={setWebsite}
            description={description}
            setDescription={setDescription}
          />
        )}

        {currentStageId === "schedule" && (
          <Stagetwo
            onNext={goNext}
            onBack={goBack}
            scheduleRange={scheduleRange}
            setScheduleRange={setScheduleRange}
            postTypes={postTypes}
            setPostTypes={(v) => { setPostTypes(v); clampStageIndex(); }}
            activeDays={activeDays}
            setActiveDays={setActiveDays}
            platforms={platforms}
            setPlatforms={setPlatforms}
            timezone={timezone}
            setTimezone={setTimezone}
            title={title}
            website={website}
            description={description}
            setGeneratedItems={setGeneratedItems}
          />
        )}

        {currentStageId === "content" && (
          <StageThree
            onNext={goNext}
            onBack={goBack}
            dayCount={dayCount || 1}
            scheduledDates={scheduledDates}
            generatedItems={generatedItems}
            title={title}
            website={website}
            description={description}
            postTypes={postTypes}
            setGeneratedItems={setGeneratedItems}
            timezone={timezone}
          />
        )}

        {currentStageId === "combined" && (
          <StageCombined
            onNext={goNext}
            onBack={goBack}
            stageNum={3}
            dayCount={dayCount || 1}
            scheduledDates={scheduledDates}
            generatedItems={generatedItems}
            title={title}
            website={website}
            description={description}
            postTypes={postTypes}
            setGeneratedItems={setGeneratedItems}
            timezone={timezone}
          />
        )}

        {currentStageId === "combined_video" && (
          <StageCombinedVideo
            onNext={goNext}
            onBack={goBack}
            stageNum={3}
            dayCount={dayCount || 1}
            scheduledDates={scheduledDates}
            generatedItems={generatedItems}
            title={title}
            website={website}
            description={description}
            postTypes={postTypes}
            setGeneratedItems={setGeneratedItems}
            timezone={timezone}
          />
        )}

        {currentStageId === "image" && (
          <StageFour
            onNext={goNext}
            onBack={goBack}
            onBackToContent={() => {
              const contentIdx = stages.findIndex((s) => s.id === "content");
              if (contentIdx >= 0) setStageIndex(contentIdx);
            }}
            hasContent={hasContent}
            dayCount={dayCount || 1}
            scheduledDates={scheduledDates}
            generatedItems={generatedItems}
            title={title}
            website={website}
            description={description}
            postTypes={postTypes}
            setGeneratedItems={setGeneratedItems}
            timezone={timezone}
          />
        )}

        {currentStageId === "video" && (
          <StageVideo
            onNext={goNext}
            onBack={goBack}
            stageNum={3}
            dayCount={dayCount || 1}
            scheduledDates={scheduledDates}
            generatedItems={generatedItems}
            title={title}
            website={website}
            description={description}
            postTypes={postTypes}
            setGeneratedItems={setGeneratedItems}
            timezone={timezone}
          />
        )}

        {currentStageId === "review" && (
          <StageFive
            onBack={goBack}
            onReset={handleReset}
            dayCount={dayCount || 1}
            scheduledDates={scheduledDates}
            postTypes={postTypes}
            generatedItems={generatedItems}
          />
        )}
      </div>
    </div>
  );
};

export default CreatePost;