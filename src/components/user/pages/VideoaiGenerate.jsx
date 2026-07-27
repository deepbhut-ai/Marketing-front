"use client";
import { useUserContext } from "@/context/UserContext";
import React, { useRef, useState } from "react";
import { ConfigProvider, Select, theme } from "antd";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FiUploadCloud, FiPlus, FiX, FiTrash2 } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { BiMoviePlay } from "react-icons/bi";

const DURATIONS = [
  { value: "5", label: "5 Seconds" },
  { value: "10", label: "10 Seconds" },
  { value: "15", label: "15 Seconds" },
];

const EXAMPLE_PRESETS = [
  { id: "e1", title: "Product Showcase", prompt: "A slow cinematic pan around [product] on a marble surface." },
  { id: "e2", title: "Talking Head", prompt: "A person speaking to camera saying [text], soft studio lighting." },
];

const AiVideoGenerate = () => {
  const { isdark } = useUserContext();
  const fileRef = useRef(null);

  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(undefined);
  const [tab, setTab] = useState("custom");
  const [customPresets, setCustomPresets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [videos] = useState([]);

  const availableCredits = 128754.5;
  const requiredCredits = 0;

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (f) setImage({ file: f, url: URL.createObjectURL(f) });
  };

  const presets = tab === "custom" ? customPresets : EXAMPLE_PRESETS;

  // ---- shared classes ----
  const cardCls = `rounded-lg p-5 shadow-sm ${isdark ? "bg-[#1e293b]" : "bg-white"}`;
  const labelCls = `block text-sm mb-2 ${isdark ? "text-[#cbd5e1]" : "text-[#374151]"}`;
  const fieldCls = `w-full px-3 py-2.5 text-sm rounded-md outline-none border transition-colors
    focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]
    ${
      isdark
        ? "bg-transparent border-[#334155] text-white placeholder:text-[#64748b]"
        : "bg-white border-[#e2e8f0] text-[#111827] placeholder:text-[#9ca3af]"
    }`;

  // ---- antd theme, driven by isdark ----
  const antdTheme = {
    algorithm: isdark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: "#8b5cf6",
      colorBorder: isdark ? "#334155" : "#e2e8f0",
      colorText: isdark ? "#ffffff" : "#111827",
      colorTextPlaceholder: isdark ? "#64748b" : "#9ca3af",
      colorBgElevated: isdark ? "#1e293b" : "#ffffff",
      borderRadius: 6,
      controlHeight: 42,
      fontSize: 14,
    },
    components: {
      Select: {
        selectorBg: isdark ? "transparent" : "#ffffff",
        optionSelectedBg: isdark ? "#334155" : "#ede9fe",
        optionSelectedColor: isdark ? "#ffffff" : "#6d28d9",
        optionActiveBg: isdark ? "#2d3c4c" : "#f1f5f9",
        hoverBorderColor: "#8b5cf6",
        activeBorderColor: "#8b5cf6",
        activeOutlineColor: "rgba(139, 92, 246, 0.2)",
      },
    },
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#64748b]">
          <span className="text-[#8b5cf6]">User</span> <MdOutlineKeyboardArrowRight />
          <span className="text-[#8b5cf6]">Videoai</span> <MdOutlineKeyboardArrowRight />
          <span className="text-[#8b5cf6]">Generate</span> <MdOutlineKeyboardArrowRight />
          <span className={isdark ? "text-[#cbd5e1]" : "text-[#374151]"}>Create</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-4">
          {/* ---------------- Left: form ---------------- */}
          <div className={`${cardCls} lg:col-span-2`}>
            <label className={labelCls}>Source Image</label>

            {/* dropzone */}
            <div
              onClick={() => fileRef.current?.click()}
              className={`relative h-[118px] rounded-md border border-dashed flex flex-col items-center justify-center
                gap-2 cursor-pointer overflow-hidden transition-colors
                ${
                  isdark
                    ? "border-[#334155] hover:border-[#8b5cf6] text-[#94a3b8]"
                    : "border-[#cbd5e1] hover:border-[#8b5cf6] text-[#64748b]"
                }`}
            >
              {image ? (
                <>
                  <img src={image.url} alt="source" className="absolute inset-0 w-full h-full object-contain" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                    }}
                    className="absolute top-1.5 right-1.5 p-1.5 rounded-md bg-[#f43f5e] text-white cursor-pointer"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </>
              ) : (
                <>
                  <FiUploadCloud size={22} />
                  <span className="text-sm">Click to upload an image</span>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
            </div>

            {/* prompt */}
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your text here... Use [text] to highlight content"
              className={`${fieldCls} mt-4 resize-y`}
            />

            {/* duration */}
            <div className="mt-4">
              <label className={labelCls}>Duration</label>
              <Select
                value={duration}
                onChange={setDuration}
                placeholder="Select Duration"
                options={DURATIONS}
                allowClear
                className="w-full"
              />
            </div>

            {/* tabs + create new */}
            <div className="flex items-center justify-between gap-2 mt-4">
              <div className="flex items-center gap-1">
                {[
                  { key: "custom", label: "Custom" },
                  { key: "example", label: "Example" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
                      tab === t.key
                        ? "bg-[#8b5cf6] text-white"
                        : isdark
                        ? "text-[#94a3b8] hover:bg-white/5"
                        : "text-[#64748b] hover:bg-black/5"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === "custom" && (
                <button
                  onClick={() => setModalOpen(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border cursor-pointer transition-colors
                    ${
                      isdark
                        ? "border-[#334155] text-[#cbd5e1] hover:border-[#8b5cf6] hover:text-[#8b5cf6]"
                        : "border-[#e2e8f0] text-[#475569] hover:border-[#8b5cf6] hover:text-[#8b5cf6]"
                    }`}
                >
                  <FiPlus size={14} /> Create New
                </button>
              )}
            </div>

            {/* presets */}
            <div className="mt-3 max-h-40 overflow-y-auto flex flex-col gap-2">
              {presets.length === 0 ? (
                <p className={`text-sm text-center py-6 ${isdark ? "text-[#64748b]" : "text-[#9ca3af]"}`}>
                  No {tab} presets found
                </p>
              ) : (
                presets.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setPrompt(p.prompt)}
                    className={`group rounded-md px-3 py-2 text-sm border cursor-pointer transition-colors ${
                      isdark
                        ? "border-[#334155] hover:border-[#8b5cf6] text-[#cbd5e1]"
                        : "border-[#e2e8f0] hover:border-[#8b5cf6] text-[#374151]"
                    }`}
                  >
                    <div className="flex justify-between gap-2 items-center">
                      <span className="font-medium truncate">{p.title}</span>
                      {tab === "custom" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomPresets((prev) => prev.filter((x) => x.id !== p.id));
                          }}
                          className="opacity-0 group-hover:opacity-100 text-[#f43f5e] cursor-pointer shrink-0"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      )}
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${isdark ? "text-[#64748b]" : "text-[#9ca3af]"}`}>
                      {p.prompt}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* credits */}
            <div className={`flex justify-between gap-2 text-xs mt-4 ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
              <span>Available Credits: {availableCredits}</span>
              <span>Required Credits: {requiredCredits}</span>
            </div>

            {/* generate */}
            <button
              className="w-full flex items-center justify-center gap-2 mt-3 py-2.5 rounded-md bg-[#8b5cf6]
                text-white text-sm cursor-pointer hover:bg-[#7c4fe0] transition-colors"
            >
              <HiOutlineSparkles size={16} /> Generate
            </button>
          </div>

          {/* ---------------- Right: results ---------------- */}
          <div className={`${cardCls} lg:col-span-3 min-h-[460px]`}>
            {videos.length === 0 ? (
              <div className="h-full min-h-[420px] flex flex-col items-center justify-center gap-3">
                <BiMoviePlay size={40} className={isdark ? "text-[#334155]" : "text-[#cbd5e1]"} />
                <p className={`text-sm ${isdark ? "text-[#64748b]" : "text-[#9ca3af]"}`}>No data found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map((v) => (
                  <video key={v.id} src={v.url} controls className="w-full rounded-md" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ---------------- Create New Preset modal ---------------- */}
        {modalOpen && (
          <CreatePresetModal
            isdark={isdark}
            fieldCls={fieldCls}
            labelCls={labelCls}
            onClose={() => setModalOpen(false)}
            onCreate={(preset) => {
              setCustomPresets((p) => [...p, { id: Date.now().toString(), ...preset }]);
              setModalOpen(false);
            }}
          />
        )}
      </div>
    </ConfigProvider>
  );
};

// ---------------------------------------------------------------------------
const CreatePresetModal = ({ isdark, fieldCls, labelCls, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className={`relative w-full max-w-[384px] rounded-lg p-5 shadow-2xl ${
          isdark ? "bg-[#1e293b] text-white" : "bg-white text-[#111827]"
        }`}
      >
        <div className="flex justify-between gap-2 items-center mb-4">
          <h5 className="flex items-center gap-2 text-base font-semibold">
            <HiOutlineSparkles size={17} className="text-[#8b5cf6]" /> Create New Preset
          </h5>
          <button
            onClick={onClose}
            className={`p-1 rounded cursor-pointer ${
              isdark ? "text-[#94a3b8] hover:bg-white/10" : "text-[#64748b] hover:bg-black/5"
            }`}
          >
            <FiX size={17} />
          </button>
        </div>

        <div className="mb-3">
          <label className={labelCls}>Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={fieldCls} />
        </div>

        <div className="mb-5">
          <label className={labelCls}>Prompt *</label>
          <textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} className={`${fieldCls} resize-y`} />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-md text-sm cursor-pointer border border-[#f43f5e] text-[#f43f5e]
              hover:bg-[#f43f5e]/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => title.trim() && prompt.trim() && onCreate({ title, prompt })}
            className="flex-1 py-2.5 rounded-md text-sm cursor-pointer bg-[#8b5cf6] text-white
              hover:bg-[#7c4fe0] transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiVideoGenerate;