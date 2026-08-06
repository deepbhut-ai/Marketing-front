"use client";
import React, { useState } from "react";
import { message } from "antd";
import { useUserContext } from "@/context/UserContext";
import { apiFetch } from "@/lib/apiClient";
import { HiSparkles } from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";

// The enhance-description endpoint can respond in a couple of different
// shapes depending on status code / middleware:
//   - a plain object:                     { success, message, data: {...} }
//   - an array-like [body, status] pair:  [{ success:false, message, errors }, 400]
// This normalizes both down to the actual body object so callers only
// ever have to check `result.success`.
const normalizeApiResponse = (data) => {
  if (Array.isArray(data)) return data[0] ?? null;
  return data ?? null;
};

const StageOne = ({ onNext, title, setTitle, website, setWebsite, description, setDescription }) => {
  const { isdark } = useUserContext();
  const [messageApi, contextHolder] = message.useMessage();

  const [stage] = useState(1);
  const [enhancing, setEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!description.trim()) return;
    setEnhancing(true);

    try {
      const data = await apiFetch("posts/enhance-description/", {
        method: "POST",
        body: JSON.stringify({
          title,
          website,
          description,
        }),
      });

      // Normalize: response can come back as either a plain object
      // ({success, message, data}) or an array-like [body, status] pair
      // (e.g. [{success:false, message:"Zettalgor API request failed",
      // errors:{details:"..."}}, 400]).
      const result = normalizeApiResponse(data);

      // Handle the API returning success: false in the body (whichever
      // shape it arrived in) — don't touch the description, just show
      // the error and stop.
      if (!result || result.success === false) {
        messageApi.error(result?.message || "Failed to enhance description");
        return;
      }

      const enhanced =
        result?.data?.enhanced_description ||
        result?.data?.description ||
        result?.enhanced_description ||
        result?.description ||
        "";
      setDescription(enhanced);
      messageApi.success(result?.data?.message || result?.message || "Description enhanced successfully");
    } catch (error) {
      console.error("Enhance failed:", error);
      const errData = normalizeApiResponse(error?.data) || error?.data;
      const errMsg =
        (Array.isArray(errData) && errData[0]?.message) ||
        errData?.message ||
        errData?.detail ||
        error?.message ||
        "Failed to enhance description";
      messageApi.error(errMsg);
    } finally {
      setEnhancing(false);
    }
  };

  const handleNext = () => {
    const missing = [];
    if (!title.trim()) missing.push("Template Title");
    if (!description.trim()) missing.push("Additional description");
    if (missing.length > 0) {
      messageApi.warning(`Please fill in: ${missing.join(", ")}`);
      return;
    }
    onNext?.();
  };

  return (
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

      {/* Template Title + Website to promote */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label
            className={`block text-sm font-semibold mb-2 ${
              isdark ? "text-white" : "text-[#475569]"
            }`}
          >
            Template Title <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            className={`w-full h-12 rounded-lg px-4 border outline-none transition-colors ${
              isdark
                ? "bg-[#0f172a] border-gray-600 text-white placeholder:text-[#64748b] focus:border-[#8b5cf6]"
                : "bg-white border-[#475569] text-[#475569] placeholder:text-[#94a3b8] focus:border-[#8b5cf6]"
            }`}
          />
        </div>

        <div>
          <label
            className={`block text-sm font-semibold mb-2 ${
              isdark ? "text-white" : "text-[#475569]"
            }`}
          >
            Website to promote
          </label>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com/"
            type="url"
            className={`w-full h-12 rounded-lg px-4 border outline-none transition-colors ${
              isdark
                ? "bg-[#0f172a] border-gray-600 text-white placeholder:text-[#64748b] focus:border-[#8b5cf6]"
                : "bg-white border-[#475569] text-[#475569] placeholder:text-[#94a3b8] focus:border-[#8b5cf6]"
            }`}
          />
        </div>
      </div>

      {/* Additional description */}
      <div>
        <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
          <label
            className={`text-sm font-semibold ${
              isdark ? "text-white" : "text-[#475569]"
            }`}
          >
            Additional description to promote <span className="text-red-500">*</span>
          </label>
          <button
            onClick={handleEnhance}
            disabled={enhancing || !description.trim()}
            className="flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c6ff0] to-[#a78bfa] hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <HiSparkles size={16} />
            {enhancing ? "Enhancing..." : "Enhanced with AI"}
          </button>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Describe what you'd like to promote..."
          className={`w-full rounded-lg px-4 py-3 border outline-none resize-y transition-colors ${
            isdark
              ? "bg-[#0f172a] border-gray-600 text-white placeholder:text-[#64748b] focus:border-[#8b5cf6]"
              : "bg-white border-[#475569] text-[#475569] placeholder:text-[#94a3b8] focus:border-[#8b5cf6]"
          }`}
        />
      </div>

      {/* Next */}
      <div className="flex justify-end mt-8 sm:mt-10">
        <button
          onClick={handleNext}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors btn-generate`}
        >
          Next
          <FiArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default StageOne;