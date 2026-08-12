"use client";
import React, { useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { ConfigProvider, DatePicker, theme } from "antd";
import dayjs from "@/lib/dayjsSetup";

const { RangePicker } = DatePicker;

/**
 * Shared date-range picker with presets (Today, Last 7 Days, Last Month).
 * Disables future dates. Returns start/end as ISO strings via onChange.
 *
 * Props:
 *   value    — [dayjs, dayjs] | null
 *   onChange — (range, startISO, endISO) => void
 *   style    — optional inline style override
 */
const DateRangePicker = ({ value, onChange, style }) => {
  const { isdark } = useUserContext();

  // Disable future dates — can't select dates after today
  const disabledDate = (current) => {
    if (!current) return false;
    return current.isAfter(dayjs().endOf("day"));
  };

  // Presets: Today, Yesterday, Last 7 Days, Last 30 Days, This Month, Last Month
  const presets = [
    {
      label: "Today",
      value: [dayjs().startOf("day"), dayjs().endOf("day")],
    },
    {
      label: "Yesterday",
      value: [dayjs().subtract(1, "day").startOf("day"), dayjs().subtract(1, "day").endOf("day")],
    },
    {
      label: "Last 7 Days",
      value: [dayjs().subtract(6, "day").startOf("day"), dayjs().endOf("day")],
    },
    {
      label: "Last 30 Days",
      value: [dayjs().subtract(29, "day").startOf("day"), dayjs().endOf("day")],
    },
    {
      label: "This Month",
      value: [dayjs().startOf("month"), dayjs().endOf("day")],
    },
    {
      label: "Last Month",
      value: [dayjs().subtract(1, "month").startOf("month"), dayjs().subtract(1, "month").endOf("month")],
    },
  ];

  const handleChange = (val) => {
    if (!val) {
      onChange?.(null, null, null);
      return;
    }
    const [start, end] = val;
    const startISO = start
      ? dayjs.utc(start.format("YYYY-MM-DD") + "T00:00:00Z").toISOString()
      : null;
    const endISO = end
      ? dayjs.utc(end.format("YYYY-MM-DD") + "T23:59:59Z").toISOString()
      : null;
    onChange?.(val, startISO, endISO);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isdark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          DatePicker: {
            colorBgContainer: isdark ? "#1e293b" : "#ffffff",
            colorText: isdark ? "#ffffff" : "#000000",
            colorBorder: isdark ? "#475569" : "#d9d9d9",
            colorPrimaryHover: isdark ? "#475569" : "#4096ff",
            colorPrimary: isdark ? "#475569" : "#1677ff",
            colorBgElevated: isdark ? "#1e293b" : "#ffffff",
          },
        },
      }}
    >
      <RangePicker
        value={value}
        onChange={handleChange}
        presets={presets}
        disabledDate={disabledDate}
        format="DD MMM YYYY"
        placeholder={["Start date", "End date"]}
        style={{ width: "100%", height: 34, ...style }}
        allowClear
      />
    </ConfigProvider>
  );
};

export default DateRangePicker;