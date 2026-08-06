"use client";
import React, { useMemo, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { FiCheck } from "react-icons/fi";
import dayjs from "dayjs";
import StageOne from "./StageOne";
import Stagetwo from "./Stagetwo";
import StageThree from "./StageThree";
import StageFour from "./StageFour";
import StageFive from "./StageFive";

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

  // ── Dynamic stage list (skip Content/Images based on postTypes) ──────
  const hasContent = postTypes.includes("content");
  const hasImage = postTypes.includes("image");

  const stages = useMemo(() => {
    const list = [
      { id: "details", label: "Details", num: 1 },
      { id: "schedule", label: "Schedule", num: 2 },
    ];
    if (hasContent) list.push({ id: "content", label: "Content", num: 3 });
    if (hasImage) list.push({ id: "image", label: "Images", num: 4 });
    list.push({ id: "review", label: "Review", num: 5 });
    return list;
  }, [hasContent, hasImage]);

  const currentStageId = stages[stageIndex]?.id;

  // ── Navigation ────────────────────────────────────────────────────────
  const goNext = () => setStageIndex((i) => Math.min(i + 1, stages.length - 1));
  const goBack = () => setStageIndex((i) => Math.max(i - 1, 0));
  const goTo = (idx) => {
    if (idx <= stageIndex) setStageIndex(idx);
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
          />
        )}

        {currentStageId === "image" && (
          <StageFour
            onNext={goNext}
            onBack={goBack}
            onBackToContent={() => {
              // Jump back to the content stage (index of "content" in stages array)
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
          />
        )}

        {currentStageId === "review" && (
          <StageFive
            onBack={goBack}
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