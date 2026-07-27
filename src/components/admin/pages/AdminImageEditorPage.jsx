"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import * as fabric from "fabric";
import {
  FaArrowLeft,
  FaBold,
  FaUnderline,
  FaItalic,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaChevronRight,
  FaChevronDown,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaRegSave,
  FaPaperPlane,
} from "react-icons/fa";
import { IoSettingsOutline, IoText, IoImageOutline } from "react-icons/io5";
import { BiSolidShapes } from "react-icons/bi";
import { useUserContext } from "@/context/UserContext";

/* ---------------------------------------------------------------
   Sample data — extend these freely. Each shape entry needs a
   `type` fabric knows how to build; add new categories the same way.
---------------------------------------------------------------- */
const FONT_FAMILIES = ["Buller", "Arial", "Georgia", "Helvetica", "Poppins", "Roboto", "Times New Roman"];

const TEXT_PRESETS = [
  { label: "Text", size: 18 },
  { label: "Text", size: 40 },
  { label: "Text 1", size: 28 },
  { label: "Text 2", size: 22 },
  { label: "Text 3", size: 18 },
  { label: "Text 4", size: 16 },
];

/* ---------------------------------------------------------------
   Small helpers for building composite (multi-part) shapes
---------------------------------------------------------------- */
const grp = (objects, opts = {}) => new fabric.Group(objects, opts);
const rect = (w, h, opts = {}) => new fabric.Rect({ width: w, height: h, ...opts });
const circ = (r, opts = {}) => new fabric.Circle({ radius: r, ...opts });
const tri = (w, h, opts = {}) => new fabric.Triangle({ width: w, height: h, ...opts });
const line = (pts, opts = {}) => new fabric.Line(pts, opts);
const path = (d, opts = {}) => new fabric.Path(d, opts);

const STAR_PATH =
  "M50 3 L61 37 L97 37 L68 58 L79 92 L50 71 L21 92 L32 58 L3 37 L39 37 Z";
const HEART_PATH =
  "M50,88 C20,65 0,45 0,25 C0,10 12,0 25,0 C35,0 45,7 50,18 C55,7 65,0 75,0 C88,0 100,10 100,25 C100,45 80,65 50,88 Z";

const SHAPE_CATEGORIES = {
  "Basic Shapes": [
    { name: "Rectangle", preview: "▭", build: () => rect(100, 70, { fill: "#8b5cf6" }) },
    { name: "Circle", preview: "●", build: () => circ(50, { fill: "#22c55e" }) },
    { name: "Triangle", preview: "▲", build: () => tri(90, 80, { fill: "#f59e0b" }) },
    { name: "Ellipse", preview: "⬬", build: () => new fabric.Ellipse({ rx: 60, ry: 35, fill: "#ef4444" }) },
    { name: "Line", preview: "—", build: () => line([0, 0, 100, 0], { stroke: "#64748b", strokeWidth: 4 }) },
    {
      name: "Pentagon",
      preview: "⬠",
      build: () => new fabric.Polygon([{ x: 50, y: 0 }, { x: 100, y: 38 }, { x: 82, y: 100 }, { x: 18, y: 100 }, { x: 0, y: 38 }], { fill: "#0ea5e9" }),
    },
    {
      name: "Hexagon",
      preview: "⬡",
      build: () => new fabric.Polygon([{ x: 25, y: 0 }, { x: 75, y: 0 }, { x: 100, y: 43 }, { x: 75, y: 86 }, { x: 25, y: 86 }, { x: 0, y: 43 }], { fill: "#ec4899" }),
    },
    { name: "Star", preview: "★", build: () => path(STAR_PATH, { fill: "#facc15" }) },
  ],

  "Abstract Shapes": [
    { name: "Blob", preview: "🟣", build: () => path("M43.5,-58.5C55.5,-49.6,63.4,-34.9,66.7,-19.3C70,-3.7,68.7,12.8,61.6,26.1C54.6,39.4,41.9,49.5,27.7,56.3C13.6,63.1,-2,66.6,-17.6,64.3C-33.2,62,-48.8,53.9,-58.4,41C-68,28.1,-71.6,10.4,-68.9,-5.9C-66.2,-22.2,-57.2,-37.1,-44.6,-46.2C-32,-55.3,-16,-58.6,0.4,-59.2C16.8,-59.8,33.6,-57.7,43.5,-58.5Z", { fill: "#8b5cf6" }) },
    { name: "Wave", preview: "〰", build: () => path("M0,20 Q25,0 50,20 T100,20 L100,60 L0,60 Z", { fill: "#06b6d4" }) },
    { name: "Splash", preview: "💧", build: () => path("M50,0 C70,20 90,45 90,65 A40,40 0 1,1 10,65 C10,45 30,20 50,0 Z", { fill: "#3b82f6" }) },
    { name: "Squiggle", preview: "🌀", build: () => path("M10,50 Q30,10 50,50 T90,50", { fill: "", stroke: "#f97316", strokeWidth: 8 }) },
  ],

  Arrow: [
    { name: "Right", preview: "→", build: () => path("M0,25 L60,25 L60,10 L100,40 L60,70 L60,55 L0,55 Z", { fill: "#6366f1" }) },
    { name: "Left", preview: "←", build: () => path("M0,25 L60,25 L60,10 L100,40 L60,70 L60,55 L0,55 Z", { fill: "#6366f1", flipX: true }) },
    { name: "Up", preview: "↑", build: () => path("M0,25 L60,25 L60,10 L100,40 L60,70 L60,55 L0,55 Z", { fill: "#6366f1", angle: -90 }) },
    { name: "Down", preview: "↓", build: () => path("M0,25 L60,25 L60,10 L100,40 L60,70 L60,55 L0,55 Z", { fill: "#6366f1", angle: 90 }) },
    { name: "Double Right", preview: "»", build: () => grp([tri(35, 45, { angle: 90, fill: "#6366f1", left: 0 }), tri(35, 45, { angle: 90, fill: "#6366f1", left: 30 })]) },
    { name: "Refresh", preview: "↻", build: () => new fabric.Circle({ radius: 30, fill: "", stroke: "#6366f1", strokeWidth: 8, startAngle: 40, endAngle: 320 }) },
    { name: "Swap", preview: "⇄", build: () => grp([line([0, 0, 60, 0], { stroke: "#6366f1", strokeWidth: 6 }), tri(16, 16, { angle: 90, fill: "#6366f1", left: 55, top: -8 }), line([0, 20, 60, 20], { stroke: "#6366f1", strokeWidth: 6 }), tri(16, 16, { angle: -90, fill: "#6366f1", left: -15, top: 12 })]) },
    { name: "Expand", preview: "⤢", build: () => grp([tri(14, 14, { angle: -45, fill: "#6366f1" }), tri(14, 14, { angle: 135, fill: "#6366f1", left: 40, top: 40 })]) },
  ],

  Badges: [
    { name: "Circle Badge", preview: "🔵", build: () => grp([circ(45, { fill: "#3b82f6" }), tri(20, 18, { fill: "#3b82f6", top: 55, angle: 180 })]) },
    { name: "Star Badge", preview: "⭐", build: () => path(STAR_PATH, { fill: "#f59e0b", scaleX: 1.1, scaleY: 1.1 }) },
    { name: "Ribbon", preview: "🎗️", build: () => grp([circ(35, { fill: "#ef4444" }), rect(14, 40, { fill: "#ef4444", left: -20, top: 40 }), rect(14, 40, { fill: "#ef4444", left: 6, top: 40 })]) },
    { name: "Shield", preview: "🛡️", build: () => path("M50,0 L95,15 L95,50 C95,80 75,100 50,110 C25,100 5,80 5,50 L5,15 Z", { fill: "#0ea5e9" }) },
    { name: "Tag", preview: "🏷️", build: () => grp([path("M0,20 L40,0 L100,60 L60,100 L0,40 Z", { fill: "#22c55e" }), circ(6, { fill: "#ffffff", left: 8, top: 8 })]) },
    { name: "Medal", preview: "🥇", build: () => grp([rect(10, 35, { fill: "#ef4444", left: 5, top: -30 }), rect(10, 35, { fill: "#3b82f6", left: 20, top: -30 }), circ(30, { fill: "#f59e0b", top: 10 })]) },
  ],

  Banners: [
    { name: "Ribbon Banner", preview: "🎀", build: () => path("M0,10 L100,10 L88,25 L100,40 L0,40 L12,25 Z", { fill: "#ef4444" }) },
    { name: "Folded Banner", preview: "🚩", build: () => grp([rect(100, 40, { fill: "#8b5cf6" }), tri(20, 20, { fill: "#5b21b6", angle: 180, left: -5, top: 40 }), tri(20, 20, { fill: "#5b21b6", angle: 180, left: 85, top: 40 })]) },
    { name: "Bookmark", preview: "🔖", build: () => path("M0,0 L60,0 L60,90 L30,70 L0,90 Z", { fill: "#06b6d4" }) },
    { name: "Scroll", preview: "📜", build: () => grp([rect(100, 40, { fill: "#f59e0b", rx: 6, ry: 6 }), circ(8, { fill: "#d97706", left: -8, top: 12 }), circ(8, { fill: "#d97706", left: 92, top: 12 })]) },
  ],

  Button: [
    { name: "Rounded", preview: "▢", build: () => rect(140, 50, { fill: "#8b5cf6", rx: 10, ry: 10 }) },
    { name: "Pill", preview: "⬭", build: () => rect(140, 50, { fill: "#22c55e", rx: 25, ry: 25 }) },
    { name: "Outline", preview: "▭", build: () => rect(140, 50, { fill: "", stroke: "#3b82f6", strokeWidth: 3, rx: 10, ry: 10 }) },
    { name: "Square", preview: "■", build: () => rect(120, 50, { fill: "#0f172a" }) },
  ],

  Dividers: [
    { name: "Solid", preview: "―", build: () => line([0, 0, 200, 0], { stroke: "#64748b", strokeWidth: 3 }) },
    { name: "Dashed", preview: "┄", build: () => line([0, 0, 200, 0], { stroke: "#64748b", strokeWidth: 3, strokeDashArray: [12, 8] }) },
    { name: "Dotted", preview: "┈", build: () => line([0, 0, 200, 0], { stroke: "#64748b", strokeWidth: 4, strokeDashArray: [2, 8], strokeLineCap: "round" }) },
    { name: "Wavy", preview: "〜", build: () => path("M0,10 Q25,0 50,10 T100,10 T150,10 T200,10", { fill: "", stroke: "#64748b", strokeWidth: 3 }) },
  ],

  Ecommerce: [
    { name: "Bag", preview: "🛍️", build: () => grp([new fabric.Polygon([{ x: 10, y: 20 }, { x: 90, y: 20 }, { x: 80, y: 100 }, { x: 20, y: 100 }], { fill: "#8b5cf6" }), new fabric.Circle({ radius: 15, startAngle: 200, endAngle: 340, fill: "", stroke: "#8b5cf6", strokeWidth: 5, left: 25, top: -8 })]) },
    { name: "Cart", preview: "🛒", build: () => grp([rect(70, 45, { fill: "", stroke: "#3b82f6", strokeWidth: 5, left: 15, top: 0 }), circ(8, { fill: "#3b82f6", left: 15, top: 50 }), circ(8, { fill: "#3b82f6", left: 65, top: 50 })]) },
    { name: "Percent Badge", preview: "%", build: () => grp([circ(35, { fill: "#ef4444" }), new fabric.Textbox("%", { fontSize: 32, fill: "#fff", left: -12, top: -18, width: 40 })]) },
    { name: "Price Tag", preview: "💲", build: () => path("M0,20 L40,0 L100,60 L60,100 L0,40 Z", { fill: "#22c55e" }) },
  ],

  Emoji: [
    { name: "Smile", char: "😀" },
    { name: "Heart Eyes", char: "😍" },
    { name: "Fire", char: "🔥" },
    { name: "Party", char: "🎉" },
    { name: "Thumbs Up", char: "👍" },
    { name: "Star Struck", char: "🤩" },
    { name: "Clap", char: "👏" },
    { name: "Rocket", char: "🚀" },
  ].map((e) => ({
    ...e,
    preview: e.char,
    build: () => new fabric.Textbox(e.char, { fontSize: 60, width: 80 }),
  })),

  Holiday: [
    { name: "Tree", preview: "🎄", build: () => grp([tri(60, 35, { fill: "#16a34a", top: 0 }), tri(75, 40, { fill: "#16a34a", top: 28 }), tri(90, 45, { fill: "#16a34a", top: 60 }), rect(14, 20, { fill: "#78350f", top: 100, left: -7 })]) },
    { name: "Gift", preview: "🎁", build: () => grp([rect(90, 70, { fill: "#ef4444" }), rect(14, 70, { fill: "#facc15" }), rect(90, 14, { fill: "#facc15", top: 28 })]) },
    { name: "Snowflake", preview: "❄️", build: () => grp([line([0, -40, 0, 40], { stroke: "#38bdf8", strokeWidth: 4 }), line([0, -40, 0, 40], { stroke: "#38bdf8", strokeWidth: 4, angle: 60 }), line([0, -40, 0, 40], { stroke: "#38bdf8", strokeWidth: 4, angle: 120 })]) },
    { name: "Ornament", preview: "🔴", build: () => grp([circ(30, { fill: "#dc2626" }), rect(8, 12, { fill: "#94a3b8", top: -42, left: -4 })]) },
  ],

  Object: [
    { name: "Lightbulb", preview: "💡", build: () => grp([circ(28, { fill: "#facc15" }), rect(14, 16, { fill: "#94a3b8", top: 24, left: -7 })]) },
    { name: "Pin", preview: "📍", build: () => grp([circ(28, { fill: "#ef4444" }), tri(20, 24, { fill: "#ef4444", angle: 180, top: 22 })]) },
    { name: "Heart", preview: "❤️", build: () => path(HEART_PATH, { fill: "#ef4444" }) },
    { name: "Clock", preview: "🕐", build: () => grp([circ(35, { fill: "", stroke: "#0f172a", strokeWidth: 5 }), line([0, 0, 0, -22], { stroke: "#0f172a", strokeWidth: 4 }), line([0, 0, 15, 0], { stroke: "#0f172a", strokeWidth: 4 })]) },
    { name: "Speech Bubble", preview: "💬", build: () => grp([rect(90, 55, { fill: "#3b82f6", rx: 10, ry: 10 }), tri(16, 16, { fill: "#3b82f6", angle: 180, top: 40, left: -25 })]) },
  ],

  Pattern: [
    { name: "Dots Grid", preview: "⠿", build: () => grp(Array.from({ length: 9 }).map((_, i) => circ(6, { fill: "#8b5cf6", left: (i % 3) * 22, top: Math.floor(i / 3) * 22 }))) },
    { name: "Stripes", preview: "▤", build: () => grp(Array.from({ length: 4 }).map((_, i) => rect(14, 80, { fill: i % 2 ? "#8b5cf6" : "#c4b5fd", left: i * 16 }))) },
    { name: "Checker", preview: "▦", build: () => grp(Array.from({ length: 9 }).map((_, i) => rect(24, 24, { fill: (Math.floor(i / 3) + i) % 2 ? "#0f172a" : "#e2e8f0", left: (i % 3) * 24, top: Math.floor(i / 3) * 24 }))) },
    { name: "Cross Hatch", preview: "▧", build: () => grp([line([0, 0, 80, 80], { stroke: "#64748b", strokeWidth: 2 }), line([0, 80, 80, 0], { stroke: "#64748b", strokeWidth: 2 })]) },
  ],

  Seasonal: [
    { name: "Sun", preview: "☀️", build: () => grp([circ(26, { fill: "#f59e0b" }), ...[0, 45, 90, 135].map((a) => line([-40, 0, 40, 0], { stroke: "#f59e0b", strokeWidth: 4, angle: a }))]) },
    { name: "Leaf", preview: "🍃", build: () => path("M0,60 C0,20 40,0 70,0 C70,35 45,60 0,60 Z", { fill: "#65a30d" }) },
    { name: "Umbrella", preview: "☂️", build: () => grp([path("M0,40 A40,40 0 0,1 80,40 Z", { fill: "#3b82f6" }), line([40, 40, 40, 95], { stroke: "#334155", strokeWidth: 4 })]) },
    { name: "Snowflake", preview: "❄️", build: () => grp([line([0, -40, 0, 40], { stroke: "#38bdf8", strokeWidth: 4 }), line([0, -40, 0, 40], { stroke: "#38bdf8", strokeWidth: 4, angle: 60 }), line([0, -40, 0, 40], { stroke: "#38bdf8", strokeWidth: 4, angle: 120 })]) },
  ],

  Social: [
    { name: "Like", preview: "❤️", build: () => path(HEART_PATH, { fill: "#ef4444", scaleX: 0.7, scaleY: 0.7 }) },
    { name: "Comment", preview: "💬", build: () => grp([rect(90, 55, { fill: "#3b82f6", rx: 12, ry: 12 }), tri(16, 16, { fill: "#3b82f6", angle: 180, top: 40, left: -25 })]) },
    { name: "Share", preview: "🔗", build: () => grp([new fabric.Circle({ radius: 14, fill: "", stroke: "#10b981", strokeWidth: 5, left: -30 }), new fabric.Circle({ radius: 14, fill: "", stroke: "#10b981", strokeWidth: 5, left: 30 }), line([-16, 0, 16, 0], { stroke: "#10b981", strokeWidth: 5 })]) },
    { name: "Follow", preview: "➕", build: () => grp([circ(30, { fill: "#8b5cf6" }), line([-14, 0, 14, 0], { stroke: "#fff", strokeWidth: 5 }), line([0, -14, 0, 14], { stroke: "#fff", strokeWidth: 5 })]) },
    { name: "Star Rating", preview: "★", build: () => path(STAR_PATH, { fill: "#facc15" }) },
  ],
};

/* ---------------------------------------------------------------
   Small building blocks
---------------------------------------------------------------- */
const ToolbarButton = ({ active, onClick, children, isdark }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-10 w-10 flex items-center justify-center rounded-lg transition-colors ${
      active
        ? "bg-[#8b5cf6] text-white"
        : isdark
        ? "text-gray-300 hover:bg-[#334155]"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

const PanelShell = ({ title, isdark, children }) => (
  <div
    className={`w-72 shrink-0 rounded-2xl shadow-sm border p-5 overflow-y-auto no-scrollbar ${
      isdark ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-gray-200 text-[#1e293b]"
    }`}
    style={{ maxHeight: "calc(100dvh - 220px)" }}
  >
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    {children}
  </div>
);

/* ---------------------------------------------------------------
   Color extraction — walks a shape (or a Group's children) and
   returns one editable entry per colored part (fill and/or stroke).
   Composite shapes (Groups) get one row per sub-object; simple
   shapes get one or two rows (fill / stroke) for themselves.
---------------------------------------------------------------- */
const normalizeColor = (c) => (typeof c === "string" && c.startsWith("#") ? c : "#000000");

const extractColorEntries = (obj) => {
  if (!obj) return [];
  const entries = [];

  const pushFromTarget = (target, idPrefix, index) => {
    if (target.fill && target.fill !== "" && target.fill !== "transparent") {
      entries.push({ id: `${idPrefix}-fill`, index, prop: "fill", color: normalizeColor(target.fill) });
    }
    if (target.stroke && target.stroke !== "" && target.stroke !== "transparent") {
      entries.push({ id: `${idPrefix}-stroke`, index, prop: "stroke", color: normalizeColor(target.stroke) });
    }
  };

  if (obj.type === "group" && typeof obj.getObjects === "function") {
    obj.getObjects().forEach((child, idx) => pushFromTarget(child, `part-${idx}`, idx));
  } else {
    pushFromTarget(obj, "self", null);
  }
  return entries;
};

const ShapeColorsPanel = ({ isdark, object, onApply }) => {
  const [colors, setColors] = useState(() => extractColorEntries(object));

  // re-sync local edits whenever a *different* object gets selected
  useEffect(() => {
    setColors(extractColorEntries(object));
  }, [object]);

  const updateLocal = (id, newColor) => {
    setColors((prev) => prev.map((c) => (c.id === id ? { ...c, color: newColor } : c)));
  };

  if (colors.length === 0) {
    return (
      <PanelShell title="Change Colors" isdark={isdark}>
        <p className={`text-sm ${isdark ? "text-gray-400" : "text-gray-500"}`}>
          This object has no editable fill or stroke colors.
        </p>
      </PanelShell>
    );
  }

  return (
    <PanelShell title="Change Colors" isdark={isdark}>
      <div className="flex flex-col gap-3">
        {colors.map((c) => (
          <div key={c.id} className="flex items-center gap-3">
            <input
              type="color"
              value={c.color}
              onChange={(e) => updateLocal(c.id, e.target.value)}
              className="h-9 w-9 rounded-full border-none cursor-pointer shrink-0"
            />
            <span className="text-sm">{c.color.toUpperCase()}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onApply(colors)}
        className="w-full mt-5 py-2.5 rounded-lg bg-[#8b5cf6] text-white text-sm font-medium hover:bg-[#7c3aed] transition-colors"
      >
        Update Changes
      </button>
    </PanelShell>
  );
};

/* ---------------------------------------------------------------
   Shapes panel — accordion of categories
---------------------------------------------------------------- */
const ShapesPanel = ({ isdark, onAddShape }) => {
  const [openCategory, setOpenCategory] = useState("Basic Shapes");

  return (
    <PanelShell title="Shapes" isdark={isdark}>
      <div className="flex flex-col gap-2">
        {Object.entries(SHAPE_CATEGORIES).map(([category, shapes]) => {
          const isOpen = openCategory === category;
          return (
            <div key={category}>
              <button
                type="button"
                onClick={() => setOpenCategory(isOpen ? null : category)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isdark ? "bg-[#0f172a] hover:bg-[#151f32]" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {category}
                {isOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
              </button>
              {isOpen && (
                <div className="grid grid-cols-3 gap-2 mt-2 mb-1">
                  {shapes.map((shape) => (
                    <button
                      key={shape.name}
                      type="button"
                      title={shape.name}
                      onClick={() => onAddShape(shape.build)}
                      className={`h-16 rounded-lg flex items-center justify-center border text-2xl ${
                        isdark ? "border-[#334155] hover:border-[#8b5cf6]" : "border-gray-200 hover:border-[#8b5cf6]"
                      }`}
                    >
                      {shape.preview}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PanelShell>
  );
};

/* ---------------------------------------------------------------
   Image panel
---------------------------------------------------------------- */
const ImagePanel = ({ isdark, onUpload }) => {
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => onUpload(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <PanelShell title="Image" isdark={isdark}>
      <label className={`block text-sm mb-2 ${isdark ? "text-gray-300" : "text-gray-600"}`}>Upload Image</label>
      <div className="flex items-center gap-2">
        <label
          className={`px-3 py-2 rounded-md text-sm cursor-pointer border ${
            isdark ? "border-[#334155] bg-[#0f172a]" : "border-gray-300 bg-white"
          }`}
        >
          Choose File
          <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
        </label>
        <span className={`text-xs truncate ${isdark ? "text-gray-400" : "text-gray-500"}`}>
          {fileName || "No file chosen"}
        </span>
      </div>
    </PanelShell>
  );
};

/* ---------------------------------------------------------------
   Settings panel — canvas background
---------------------------------------------------------------- */
const SettingsPanel = ({ isdark, bgColor, onBgColorChange, onRemoveBackground }) => (
  <PanelShell title="Settings" isdark={isdark}>
    <button
      type="button"
      onClick={onRemoveBackground}
      className="w-full mb-4 py-2.5 rounded-lg bg-emerald-100 text-emerald-700 font-medium text-sm hover:bg-emerald-200 transition-colors"
    >
      Remove Background
    </button>
    <div className="flex items-center gap-3">
      <span className="text-sm">BG Color</span>
      <input
        type="color"
        value={bgColor === "transparent" ? "#000000" : bgColor}
        onChange={(e) => onBgColorChange(e.target.value)}
        className="h-8 w-8 rounded-full border-none cursor-pointer"
      />
      <button
        type="button"
        onClick={() => onBgColorChange("transparent")}
        className={`text-xs underline ${isdark ? "text-gray-300" : "text-gray-500"}`}
      >
        transparent
      </button>
    </div>
  </PanelShell>
);

/* ---------------------------------------------------------------
   Text panel — presets list + active-object controls
---------------------------------------------------------------- */
const TextPanel = ({ isdark, onAddText, activeText, onUpdateText }) => (
  <PanelShell title="Text" isdark={isdark}>
    {!activeText ? (
      <div className="flex flex-col gap-4">
        {TEXT_PRESETS.map((preset, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onAddText(preset)}
            className="text-left hover:opacity-70 transition-opacity"
            style={{ fontSize: Math.min(preset.size, 32) }}
          >
            {preset.label}
          </button>
        ))}
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm block mb-1">Font Family</label>
          <select
            value={activeText.fontFamily}
            onChange={(e) => onUpdateText({ fontFamily: e.target.value })}
            className={`w-full rounded-md border px-2 py-2 text-sm ${
              isdark ? "bg-[#0f172a] border-[#334155] text-white" : "bg-white border-gray-300"
            }`}
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <div>
            <label className="text-sm block mb-1">Size</label>
            <input
              type="number"
              value={activeText.fontSize}
              onChange={(e) => onUpdateText({ fontSize: Number(e.target.value) })}
              className={`w-20 rounded-md border px-2 py-2 text-sm ${
                isdark ? "bg-[#0f172a] border-[#334155] text-white" : "bg-white border-gray-300"
              }`}
            />
          </div>
          <button
            type="button"
            onClick={() => onUpdateText({ fontWeight: activeText.fontWeight === "bold" ? "normal" : "bold" })}
            className={`h-10 w-10 rounded-md flex items-center justify-center ${
              activeText.fontWeight === "bold" ? "bg-[#8b5cf6] text-white" : isdark ? "bg-[#334155] text-white" : "bg-gray-200"
            }`}
          >
            <FaBold size={14} />
          </button>
          <button
            type="button"
            onClick={() => onUpdateText({ underline: !activeText.underline })}
            className={`h-10 w-10 rounded-md flex items-center justify-center ${
              activeText.underline ? "bg-[#8b5cf6] text-white" : isdark ? "bg-[#334155] text-white" : "bg-gray-200"
            }`}
          >
            <FaUnderline size={14} />
          </button>
          <button
            type="button"
            onClick={() => onUpdateText({ fontStyle: activeText.fontStyle === "italic" ? "normal" : "italic" })}
            className={`h-10 w-10 rounded-md flex items-center justify-center ${
              activeText.fontStyle === "italic" ? "bg-[#8b5cf6] text-white" : isdark ? "bg-[#334155] text-white" : "bg-gray-200"
            }`}
          >
            <FaItalic size={14} />
          </button>
        </div>

        <div>
          <label className="text-sm block mb-1">Text Alignment</label>
          <div className="flex gap-2">
            {[
              { val: "left", Icon: FaAlignLeft },
              { val: "center", Icon: FaAlignCenter },
              { val: "right", Icon: FaAlignRight },
            ].map(({ val, Icon }) => (
              <button
                key={val}
                type="button"
                onClick={() => onUpdateText({ textAlign: val })}
                className={`h-10 w-10 rounded-md flex items-center justify-center ${
                  activeText.textAlign === val ? "bg-[#8b5cf6] text-white" : isdark ? "bg-[#334155] text-white" : "bg-gray-200"
                }`}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Text Color</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={activeText.fill}
              onChange={(e) => onUpdateText({ fill: e.target.value })}
              className="h-7 w-7 rounded-full border-none cursor-pointer"
            />
            <span className="text-xs">{activeText.fill}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Text BG Color</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={activeText.backgroundColor || "#000000"}
              onChange={(e) => onUpdateText({ backgroundColor: e.target.value })}
              className="h-7 w-7 rounded-full border-none cursor-pointer"
            />
            <span className="text-xs">{activeText.backgroundColor || "none"}</span>
          </div>
        </div>
      </div>
    )}
  </PanelShell>
);

/* ---------------------------------------------------------------
   Active-object floating toolbar (opacity / order / delete)
---------------------------------------------------------------- */
const ObjectToolbar = ({ isdark, opacity, onOpacityChange, onBringForward, onSendBackward, onDelete }) => (
  <div
    className={`flex items-center gap-3 rounded-2xl shadow-sm border px-4 py-2 mb-3 w-fit ${
      isdark ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-gray-200"
    }`}
  >
    <span className="text-sm">Opacity</span>
    <input
      type="range"
      min={0}
      max={100}
      value={opacity}
      onChange={(e) => onOpacityChange(Number(e.target.value))}
      className="w-32 accent-[#8b5cf6]"
    />
    <input
      type="number"
      min={0}
      max={100}
      value={opacity}
      onChange={(e) => onOpacityChange(Number(e.target.value))}
      className={`w-14 rounded-md border px-1 py-1 text-sm text-center ${
        isdark ? "bg-[#0f172a] border-[#334155] text-white" : "bg-white border-gray-300"
      }`}
    />
    <button type="button" onClick={onBringForward} title="Bring forward" className="p-2 hover:opacity-70">
      <FaArrowUp size={14} />
    </button>
    <button type="button" onClick={onSendBackward} title="Send backward" className="p-2 hover:opacity-70">
      <FaArrowDown size={14} />
    </button>
    <button type="button" onClick={onDelete} title="Delete" className="p-2 text-red-500 hover:opacity-70">
      <FaTrash size={14} />
    </button>
  </div>
);

/* ---------------------------------------------------------------
   Main editor
---------------------------------------------------------------- */
const CanvasEditor = () => {
//   const isdark = false; wire up to your useUserContext() if this lives inside your app
const { isdark } = useUserContext();
  const canvasElRef = useRef(null);
  const fabricRef = useRef(null);
  const activeObjectRef = useRef(null); // always holds the REAL fabric instance

  const [tool, setTool] = useState("text"); // settings | text | image | shapes
  const [activeVersion, setActiveVersion] = useState(0); // bump to force a re-render
  const [bgColor, setBgColor] = useState("#0f172a");

  const activeObject = activeObjectRef.current; // read fresh on every render

  // -- init canvas once
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: 600,
      height: 600,
      backgroundColor: bgColor,
      preserveObjectStacking: true,
    });
    fabricRef.current = canvas;

    const syncActive = () => {
      const obj = canvas.getActiveObject() || null;
      activeObjectRef.current = obj;
      setActiveVersion((v) => v + 1);
      if (obj) {
        if (obj.type === "textbox") setTool("text");
        else if (obj.type === "image") setTool("image");
        else setTool("shapes");
      }
    };

    canvas.on("selection:created", syncActive);
    canvas.on("selection:updated", syncActive);
    canvas.on("selection:cleared", () => {
      activeObjectRef.current = null;
      setActiveVersion((v) => v + 1);
    });
    canvas.on("object:modified", () => {
      // re-sync values (e.g. after resize/rotate) without forcing a tab switch
      activeObjectRef.current = canvas.getActiveObject() || null;
      setActiveVersion((v) => v + 1);
    });

    return () => canvas.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -- background color / transparency
  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.backgroundColor = bgColor === "transparent" ? "" : bgColor;
    fabricRef.current.renderAll();
  }, [bgColor]);

  const addObject = useCallback((obj) => {
    const canvas = fabricRef.current;
    obj.set({ left: 120, top: 120 });
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
    activeObjectRef.current = obj;
    setActiveVersion((v) => v + 1);
  }, []);

  const handleAddText = (preset) => {
    const text = new fabric.Textbox(preset.label, {
      fontSize: preset.size,
      fontFamily: "Buller",
      fill: "#ffffff",
      textAlign: "left",
    });
    addObject(text);
  };

  const handleUpdateText = (props) => {
    const obj = activeObjectRef.current;
    if (!obj) return;
    obj.set(props);
    fabricRef.current.renderAll();
    setActiveVersion((v) => v + 1); // re-render panel with the new values, object itself is untouched
  };

  const handleUploadImage = (dataUrl) => {
    fabric.FabricImage.fromURL(dataUrl).then((img) => {
      img.scaleToWidth(200);
      addObject(img);
    });
  };

  const handleAddShape = (buildFn) => {
    addObject(buildFn());
  };

  const handleRemoveBackground = () => {
    // True background removal needs an ML model / API (e.g. @imgly/background-removal
    // or a server route calling remove.bg). This is a placeholder hook point.
    alert("Wire this up to a background-removal service (e.g. @imgly/background-removal) for the selected image.");
  };

  const handleOpacityChange = (val) => {
    const obj = activeObjectRef.current;
    if (!obj) return;
    obj.set("opacity", val / 100);
    fabricRef.current.renderAll();
    setActiveVersion((v) => v + 1);
  };

  const handleBringForward = () => {
    const obj = activeObjectRef.current;
    if (!obj) return;
    fabricRef.current.bringObjectForward(obj);
    fabricRef.current.renderAll();
  };

  const handleSendBackward = () => {
    const obj = activeObjectRef.current;
    if (!obj) return;
    fabricRef.current.sendObjectBackwards(obj);
    fabricRef.current.renderAll();
  };

  const handleDelete = () => {
    const obj = activeObjectRef.current;
    if (!obj) return;
    fabricRef.current.remove(obj);
    fabricRef.current.discardActiveObject();
    fabricRef.current.renderAll();
    activeObjectRef.current = null;
    setActiveVersion((v) => v + 1);
  };

  const handleApplyShapeColors = (colorEntries) => {
    const obj = activeObjectRef.current;
    if (!obj) return;

    if (obj.type === "group" && typeof obj.getObjects === "function") {
      const children = obj.getObjects();
      colorEntries.forEach(({ index, prop, color }) => {
        if (children[index]) children[index].set(prop, color);
      });
    } else {
      colorEntries.forEach(({ prop, color }) => obj.set(prop, color));
    }

    fabricRef.current.renderAll();
    setActiveVersion((v) => v + 1);
  };

  const opacityPct = activeObject ? Math.round((activeObject.opacity ?? 1) * 100) : 100;

  return (
    <div className={` min-h-screen ${isdark ? "bg-[#0f172a]" : "bg-gray-50"}`}>
      {/* top bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <button
          type="button"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium ${
            isdark ? "bg-slate-600" : "bg-slate-600"
          }`}
        >
          <FaArrowLeft size={12} /> Back
        </button>

        <div className={`flex items-center gap-1 rounded-xl shadow-sm border p-1.5 ${isdark ? "bg-[#1e293b] border-[#334155]" : "bg-white border-gray-200"}`}>
          <ToolbarButton active={tool === "settings"} onClick={() => setTool("settings")} isdark={isdark}>
            <IoSettingsOutline size={18} />
          </ToolbarButton>
          <ToolbarButton active={tool === "text"} onClick={() => setTool("text")} isdark={isdark}>
            <IoText size={18} />
          </ToolbarButton>
          <ToolbarButton active={tool === "image"} onClick={() => setTool("image")} isdark={isdark}>
            <IoImageOutline size={18} />
          </ToolbarButton>
          <ToolbarButton active={tool === "shapes"} onClick={() => setTool("shapes")} isdark={isdark}>
            <BiSolidShapes size={18} />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${
              isdark ? "border-[#334155] text-white" : "border-gray-300 text-gray-700"
            }`}
          >
            <FaRegSave size={13} /> Save as copy
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#ede9fe] text-[#8b5cf6]"
          >
            <FaPaperPlane size={13} /> Save
          </button>
        </div>
      </div>

      {/* body */}
      <div className="flex gap-5 flex-wrap lg:flex-nowrap items-start">
        {tool === "settings" && (
          <SettingsPanel
            isdark={isdark}
            bgColor={bgColor}
            onBgColorChange={setBgColor}
            onRemoveBackground={handleRemoveBackground}
          />
        )}
        {tool === "text" && (
          <TextPanel isdark={isdark} onAddText={handleAddText} activeText={activeObject?.type === "textbox" ? activeObject : null} onUpdateText={handleUpdateText} />
        )}
        {tool === "image" && <ImagePanel isdark={isdark} onUpload={handleUploadImage} />}
        {tool === "shapes" &&
          (activeObject && !["textbox", "image"].includes(activeObject.type) ? (
            <ShapeColorsPanel isdark={isdark} object={activeObject} onApply={handleApplyShapeColors} />
          ) : (
            <ShapesPanel isdark={isdark} onAddShape={handleAddShape} />
          ))}

        {/* canvas */}
        <div className="flex-1 min-w-0">
          {activeObject && (
            <ObjectToolbar
              isdark={isdark}
              opacity={opacityPct}
              onOpacityChange={handleOpacityChange}
              onBringForward={handleBringForward}
              onSendBackward={handleSendBackward}
              onDelete={handleDelete}
            />
          )}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-800 w-fit">
            <canvas ref={canvasElRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;