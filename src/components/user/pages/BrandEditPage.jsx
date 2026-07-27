"use client";
import { useUserContext } from "@/context/UserContext";
import React, { useState } from "react";
import { BiLayout, BiShare } from "react-icons/bi";
import { FaPlus, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { FiEdit, FiX } from "react-icons/fi";
import { LuRefreshCw, LuFingerprint, LuFlag } from "react-icons/lu";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { HiOutlineSwatch } from "react-icons/hi2";
import { TbColumns2, TbArrowBigRightLines } from "react-icons/tb";
import { BsPeople, BsLightbulb } from "react-icons/bs";
import { RiVoiceprintFill } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Reusable pieces                                                     */
/* ------------------------------------------------------------------ */

const Card = ({ isdark, className = "", children }) => (
  <div
    className={`rounded-xl p-6 shadow-sm ${
      isdark ? "bg-[#1e293b]" : "bg-white"
    } ${className}`}
  >
    {children}
  </div>
);

const SectionHeader = ({ isdark, icon, title, onEdit, iconColor }) => (
  <div className="flex items-center gap-2 justify-between">
    <div className="flex items-center gap-2">
      <div
        className={`p-2 rounded-xl bg-[#c4b5fd1a] ${
          iconColor || "text-[#a78bfa]"
        }`}
      >
        {icon}
      </div>
      <h6
        className={`text-lg sm:text-xl font-medium ${
          isdark ? "text-white" : "text-[#475569]"
        }`}
      >
        {title}
      </h6>
    </div>
    {onEdit && (
      <button
        type="button"
        onClick={onEdit}
        className={`${
          isdark ? "text-white" : "text-[#475569]"
        } hover:text-[#7c3aed] transition-colors`}
        aria-label={`Edit ${title}`}
      >
        <FiEdit size={22} />
      </button>
    )}
  </div>
);

const Divider = ({ isdark }) => (
  <div
    className={`h-px w-full my-5 ${isdark ? "bg-[#334155]" : "bg-[#e2e8f0]"}`}
  />
);

/* Modal ------------------------------------------------------------- */
const EditModal = ({ isdark, open, title, onClose, onSubmit, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-xl rounded-xl p-6 shadow-xl max-h-[85vh] overflow-y-auto ${
          isdark ? "bg-[#1e293b]" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <h5
            className={`text-lg font-semibold ${
              isdark ? "text-white" : "text-[#334155]"
            }`}
          >
            {title}
          </h5>
          <button
            type="button"
            onClick={onClose}
            className={isdark ? "text-white" : "text-[#475569]"}
            aria-label="Close"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4">{children}</div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onSubmit}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ isdark, label, value, onChange, rows }) => (
  <div className="flex flex-col gap-1">
    <label className={`text-sm ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
      {label}
    </label>
    {rows ? (
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none resize-y focus:border-[#7c3aed] ${
          isdark
            ? "bg-[#111827] border-[#334155] text-white"
            : "bg-white border-[#d1d5db] text-[#334155]"
        }`}
      />
    ) : (
      <input
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#7c3aed] ${
          isdark
            ? "bg-[#111827] border-[#334155] text-white"
            : "bg-white border-[#d1d5db] text-[#334155]"
        }`}
      />
    )}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

const BrandEditPage = () => {
  const { isdark } = useUserContext();
  const [modal, setModal] = useState(null); // which section is being edited

  /* --- brand data (replace with real API state) --- */
  const [brand, setBrand] = useState({
    id: "b655e797-261d-4899-8386-8ec669a84142",
    name: "Samsung",
    tagline: "Design. Develop",
    description:
      "Samsung is a global leader in technology, opening new possibilities for people everywhere. Through relentless innovation and discovery, we are transforming the worlds of televisions, smartphones, wearable devices, tablets, digital appliances, and network systems.",
    colors: [
      { name: "Deep Teal", hex: "#1F4E4A" },
      { name: "Sand", hex: "#C9B79C" },
      { name: "Crimson", hex: "#9B2D4F" },
      { name: "Taupe", hex: "#B5A296" },
    ],
    logoLight: "",
    logoDark: "",
    identity: {
      mission:
        "The design, development, and art brand's mission is to inspire creativity and self-expression through unique and innovative designs. Our vision is to be a leader in the industry, constantly pushing boundaries and setting trends. Our core values include creativity, quality.",
      vision:
        "Mission: Our mission is to create unique and innovative designs that inspire and empower individuals to express their individuality and creativity. Vision: Our vision is to become a leading brand in the art industry, known for our exceptional designs and commitment to promoting self.",
      values:
        "Mission: Our mission is to create unique and innovative designs that inspire and empower individuals to express their individuality and creativity. Vision: We envision a world where art is accessible to all and serves as a means of self-expression and connection. Core Values.",
    },
    audience: [
      {
        label: "Segment 1",
        text: "The target audience for Samsung's Design, Development, Art brand is primarily tech-savvy individuals who are interested in cutting-edge technology and innovative design. This audience is typically between the ages of 18-45, with a higher concentration in the.",
      },
      {
        label: "Segment 2",
        text: "The target audience for Samsung's Design, Development, Art brand is primarily tech-savvy individuals who are interested in innovative and high-quality home electronics. This audience is typically between the ages of 18-45, with a higher concentration in urban.",
      },
      {
        label: "Segment 3",
        text: "Target Audience: The target audience for Samsung's Design, Development, Art brand is primarily tech-savvy individuals who are interested in innovative and high-quality home electronics. This includes both men and women, aged 18-45, who are.",
      },
    ],
    strategy: {
      promise:
        "Positioning: Design, Development, Art DDA is a creative agency that combines design, development, and art to bring unique and innovative solutions to our clients. We are the go-to partner for businesses looking to elevate their brand and stand.",
    },
    voice: {
      message:
        "The design, development, and art brand's voice is professional and sophisticated, yet approachable and creative. It strikes a balance between formality and playfulness, allowing for a sense of expertise and authority while still being relatable and engaging. The brand's voice is confident and authentic.",
      tones: [
        "The tone of Samsung's brand voice is modern, innovative, and authoritative. It conveys a sense of expertise and authority in the field of technology, while also being approachable and customer-focused. In different situations, the tone may shift slightly to better suit the audience and purpose, but it will always maintain a professional and customer-centric. In a crisis communication, the tone may become more serious and empathetic, while still providing reassurance and solutions.",
        "The tone of Samsung's brand voice is modern, innovative, and reliable. It conveys a sense of expertise and authority in the field of technology, while also being approachable and customer-focused. In all contexts, the tone should be professional and confident, showcasing the brand's commitment to providing high-quality products and services. However, in different situations, the tone may shift slightly to better suit the audience and purpose.",
        "The tone of Samsung's brand voice is innovative, modern, and sophisticated. It conveys a sense of excitement and curiosity about the latest technology and how it can enhance our daily lives. In all contexts, the tone should be confident and knowledgeable, showcasing Samsung's expertise in the field of electronics. However, in different situations, the tone may shift slightly to better suit the audience and purpose.",
      ],
    },
  });

  const bodyText = isdark ? "text-[#cbd5e1]" : "text-[#475569]";
  const mutedText = isdark ? "text-[#94a3b8]" : "text-[#64748b]";

  return (
    <div className={isdark ? "bg-[#0f172a] min-h-screen" : "min-h-screen"}>
      <div className="p-4 sm:p-6 pb-28 flex flex-col gap-4">
        {/* Breadcrumb --------------------------------------------------- */}
        <div className="flex justify-between gap-2 flex-wrap">
        <div
          className={`flex items-center gap-2 text-sm shrink-0 flex-wrap ${mutedText}`}
        >
          <span className="text-[#8b5cf6] cursor-pointer">User</span>
          <MdOutlineKeyboardArrowRight />
          <span className="text-[#8b5cf6] cursor-pointer">Brands</span>
          <MdOutlineKeyboardArrowRight />
          <span className="break-all">{brand.id}</span>
        </div>
   <Link  href={"/brands"}  
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#8b5cf6] hover:bg-[#7c3aed] transition-colors`}
        >
          Back
        </Link>
        </div>

        {/* Row 1: actions + brand name --------------------------------- */}
        <div className="flex flex-col lg:flex-row gap-4">
          <Card isdark={isdark} className="w-full lg:w-auto shrink-0">
            <button
              type="button"
              className="rounded-xl flex flex-col justify-center items-center bg-[#7c3aed] hover:bg-[#6d28d9] transition-colors px-4 py-3 w-full lg:w-80 h-28"
            >
              <div className="rounded-full h-10 w-10 flex justify-center text-[#7c3aed] items-center bg-white">
                <LuRefreshCw />
              </div>
              <h6 className="text-white font-medium mt-2">Create New Brand</h6>
            </button>

            <div className="flex items-center gap-4 mt-5">
              {[
                { icon: <FaPlus size={18} />, label: "Create Post" },
                { icon: <BiShare size={24} />, label: "Share Branding" },
              ].map((a) => (
                <button
                  key={a.label}
                  type="button"
                  className={`${
                    isdark ? "bg-[#111827]" : "bg-[#d1d5db80]"
                  } p-4 flex flex-col justify-center items-center rounded-xl w-full hover:opacity-80 transition-opacity`}
                >
                  <div className="rounded-full h-10 w-10 flex justify-center text-[#7c3aed] items-center bg-[#d1d5db]">
                    {a.icon}
                  </div>
                  <h6
                    className={`${
                      isdark ? "text-white" : "text-[#334155]"
                    } font-medium mt-2 text-sm`}
                  >
                    {a.label}
                  </h6>
                </button>
              ))}
            </div>
          </Card>

          <Card isdark={isdark} className="w-full flex flex-col">
            <SectionHeader
              isdark={isdark}
              icon={<BiLayout size={25} />}
              title="Brand Name"
              onEdit={() => setModal("name")}
            />
            <div className="flex-1 flex items-center justify-center py-10">
              <h1
                className={`text-4xl sm:text-5xl font-bold text-center break-words ${
                  isdark ? "text-white" : "text-[#1e293b]"
                }`}
              >
                {brand.name}
              </h1>
            </div>
          </Card>
        </div>

        {/* Tagline ------------------------------------------------------ */}
        <Card isdark={isdark}>
          <SectionHeader
            isdark={isdark}
            icon={<TbArrowBigRightLines size={25} />}
            title="Tagline"
            onEdit={() => setModal("tagline")}
          />
          <Divider isdark={isdark} />
          <div className="flex items-start justify-center gap-3 py-8">
            <FaQuoteLeft className={`${mutedText} mt-2 shrink-0`} size={20} />
            <h2
              className={`text-2xl sm:text-3xl font-semibold text-center ${
                isdark ? "text-white" : "text-[#1e293b]"
              }`}
            >
              {brand.tagline}
            </h2>
            <FaQuoteRight
              className={`${mutedText} mt-2 shrink-0 self-end`}
              size={20}
            />
          </div>
        </Card>

        {/* Brand Description -------------------------------------------- */}
        <Card isdark={isdark}>
          <SectionHeader
            isdark={isdark}
            icon={<TbColumns2 size={25} />}
            title="Brand Description"
            onEdit={() => setModal("description")}
          />
          <Divider isdark={isdark} />
          <p className={`text-sm sm:text-base leading-relaxed ${bodyText}`}>
            {brand.description}
          </p>
        </Card>

        {/* Colors -------------------------------------------------------- */}
        <Card isdark={isdark}>
          <SectionHeader
            isdark={isdark}
            icon={<HiOutlineSwatch size={25} />}
            title="Colors"
            onEdit={() => setModal("colors")}
          />
          <Divider isdark={isdark} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {brand.colors.map((c, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div
                  className="h-28 w-full rounded-xl border border-black/5"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="flex items-center justify-between px-1">
                  <span className={`text-sm font-medium ${bodyText}`}>
                    {c.name}
                  </span>
                  <span className={`text-xs uppercase ${mutedText}`}>
                    {c.hex}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Logo ---------------------------------------------------------- */}
        <Card isdark={isdark}>
          <SectionHeader
            isdark={isdark}
            icon={<LuFlag size={25} />}
            title="Logo"
            iconColor="text-[#f97316]"
            onEdit={() => setModal("logo")}
          />
          <Divider isdark={isdark} />
          <div className="grid grid-cols-1 sm:grid-cols-2 rounded-xl overflow-hidden">
            {/* light variant */}
            <div className="bg-[#eef6f7] h-64 flex items-center justify-center gap-3 p-6">
              {brand.logoLight ? (
                <Image
                  src={brand.logoLight}
                  width={100}
                  height={100}
                  alt={`${brand.name} logo on light background`}
                  className="max-h-24 object-contain"
                />
              ) : (
                <span className="text-2xl font-bold text-white/70">
                  {brand.name}
                </span>
              )}
            </div>
            {/* dark variant */}
            <div className="bg-[#111111] h-64 flex items-center justify-center gap-3 p-6">
              {brand.logoDark ? (
                <img
                  src={brand.logoDark}
                  alt={`${brand.name} logo on dark background`}
                  className="max-h-24 object-contain"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {brand.name}
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Brand Identity ------------------------------------------------ */}
        <Card isdark={isdark}>
          <SectionHeader
            isdark={isdark}
            icon={<LuFingerprint size={25} />}
            title="Brand Identity"
            onEdit={() => setModal("identity")}
          />
          <Divider isdark={isdark} />
          <div className="flex flex-col gap-6">
            {[
              { label: "Mission", value: brand.identity.mission },
              { label: "Vision", value: brand.identity.vision },
              { label: "Values", value: brand.identity.values },
            ].map((item) => (
              <div key={item.label}>
                <h4 className="text-lg font-semibold text-[#8b5cf6] mb-2">
                  {item.label}
                </h4>
                <p
                  className={`text-sm sm:text-base leading-relaxed ${bodyText}`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Audience + Strategy ------------------------------------------- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card isdark={isdark}>
            <SectionHeader
              isdark={isdark}
              icon={<BsPeople size={25} />}
              title="Audience"
              onEdit={() => setModal("audience")}
            />
            <Divider isdark={isdark} />
            <div className="flex flex-col gap-5">
              {brand.audience.map((seg) => (
                <div key={seg.label}>
                  <h4
                    className={`font-semibold mb-1 ${
                      isdark ? "text-white" : "text-[#1e293b]"
                    }`}
                  >
                    {seg.label}
                  </h4>
                  <p className={`text-sm leading-relaxed ${bodyText}`}>
                    {seg.text}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card isdark={isdark}>
            <SectionHeader
              isdark={isdark}
              icon={<BsLightbulb size={25} />}
              title="Brand Strategy"
              onEdit={() => setModal("strategy")}
            />
            <Divider isdark={isdark} />
            <h4
              className={`font-semibold mb-2 ${
                isdark ? "text-white" : "text-[#1e293b]"
              }`}
            >
              Brand Promise
            </h4>
            <p className={`text-sm leading-relaxed ${bodyText}`}>
              {brand.strategy.promise}
            </p>
          </Card>
        </div>

        {/* Brand Voice ---------------------------------------------------- */}
        <Card isdark={isdark}>
          <SectionHeader
            isdark={isdark}
            icon={<RiVoiceprintFill size={25} />}
            title="Brand Voice"
            onEdit={() => setModal("voice")}
          />
          <Divider isdark={isdark} />

          <h4
            className={`font-semibold mb-2 ${
              isdark ? "text-white" : "text-[#1e293b]"
            }`}
          >
            Message
          </h4>
          <p className={`text-sm leading-relaxed ${bodyText}`}>
            {brand.voice.message}
          </p>

          <h4
            className={`font-semibold mt-6 mb-3 ${
              isdark ? "text-white" : "text-[#1e293b]"
            }`}
          >
            Tone
          </h4>
          <ul className="flex flex-col gap-5">
            {brand.voice.tones.map((tone, i) => (
              <li key={i} className="flex gap-3">
                <span className="h-3 w-3 rounded-[3px] bg-[#7c3aed] shrink-0 mt-1.5" />
                <p
                  className={`text-sm leading-relaxed uppercase ${
                    isdark ? "text-[#cbd5e1]" : "text-[#334155]"
                  }`}
                >
                  {tone}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Sticky bottom action bar -------------------------------------- */}
      <div
        className={`sticky bottom-[-18] border-t px-4 sm:px-6 py-3 flex flex-wrap justify-end gap-3 backdrop-blur ${
          isdark
            ? "bg-[#0f172a]/90 border-[#334155]"
            : "bg-[#f8fafc]/90 border-[#e2e8f0]"
        }`}
      >
        <button
          type="button"
          className="flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-medium px-5 py-3 rounded-lg transition-colors"
        >
          <LuRefreshCw size={16} /> Create New Brand
        </button>
        <button
          type="button"
          className={`flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-lg transition-colors ${
            isdark
              ? "bg-[#1e293b] text-white hover:bg-[#334155]"
              : "bg-[#e2e8f0] text-[#334155] hover:bg-[#cbd5e1]"
          }`}
        >
          <FaPlus size={14} /> Create Post
        </button>
        <button
          type="button"
          className={`flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-lg transition-colors ${
            isdark
              ? "bg-[#1e293b] text-white hover:bg-[#334155]"
              : "bg-[#e2e8f0] text-[#334155] hover:bg-[#cbd5e1]"
          }`}
        >
          <BiShare size={16} /> Share
        </button>
      </div>

      {/* ---------------------------- Modals ---------------------------- */}
      <EditModal
        isdark={isdark}
        open={modal === "name"}
        title="Edit Brand Name"
        onClose={() => setModal(null)}
        onSubmit={() => setModal(null)}
      >
        <Field
          isdark={isdark}
          label="Name"
          value={brand.name}
          onChange={(e) => setBrand({ ...brand, name: e.target.value })}
        />
      </EditModal>

      <EditModal
        isdark={isdark}
        open={modal === "tagline"}
        title="Edit Tagline"
        onClose={() => setModal(null)}
        onSubmit={() => setModal(null)}
      >
        <Field
          isdark={isdark}
          label="Tagline"
          value={brand.tagline}
          onChange={(e) => setBrand({ ...brand, tagline: e.target.value })}
        />
      </EditModal>

      <EditModal
        isdark={isdark}
        open={modal === "description"}
        title="Edit Brand Description"
        onClose={() => setModal(null)}
        onSubmit={() => setModal(null)}
      >
        <Field
          isdark={isdark}
          label="Description"
          rows={6}
          value={brand.description}
          onChange={(e) => setBrand({ ...brand, description: e.target.value })}
        />
      </EditModal>

      <EditModal
        isdark={isdark}
        open={modal === "colors"}
        title="Edit Colors"
        onClose={() => setModal(null)}
        onSubmit={() => setModal(null)}
      >
        {brand.colors.map((c, i) => (
          <div key={i} className="flex items-end gap-3">
            <div className="flex-1">
              <Field
                isdark={isdark}
                label={`Color ${i + 1} name`}
                value={c.name}
                onChange={(e) => {
                  const next = [...brand.colors];
                  next[i] = { ...next[i], name: e.target.value };
                  setBrand({ ...brand, colors: next });
                }}
              />
            </div>
            <input
              type="color"
              value={c.hex}
              onChange={(e) => {
                const next = [...brand.colors];
                next[i] = { ...next[i], hex: e.target.value };
                setBrand({ ...brand, colors: next });
              }}
              className="h-10 w-14 rounded-lg cursor-pointer border-0 bg-transparent"
              aria-label={`Pick color ${i + 1}`}
            />
          </div>
        ))}
      </EditModal>

      <EditModal
        isdark={isdark}
        open={modal === "logo"}
        title="Edit Logo"
        onClose={() => setModal(null)}
        onSubmit={() => setModal(null)}
      >
        {[
          { key: "logoLight", label: "Logo for light backgrounds" },
          { key: "logoDark", label: "Logo for dark backgrounds" },
        ].map((l) => (
          <div key={l.key} className="flex flex-col gap-1">
            <label className={`text-sm ${mutedText}`}>{l.label}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file)
                  setBrand({ ...brand, [l.key]: URL.createObjectURL(file) });
              }}
              className={`text-sm ${
                isdark ? "text-[#94a3b8]" : "text-[#64748b]"
              }`}
            />
          </div>
        ))}
      </EditModal>

      <EditModal
        isdark={isdark}
        open={modal === "identity"}
        title="Edit Brand Identity"
        onClose={() => setModal(null)}
        onSubmit={() => setModal(null)}
      >
        {["mission", "vision", "values"].map((k) => (
          <Field
            key={k}
            isdark={isdark}
            label={k[0].toUpperCase() + k.slice(1)}
            rows={4}
            value={brand.identity[k]}
            onChange={(e) =>
              setBrand({
                ...brand,
                identity: { ...brand.identity, [k]: e.target.value },
              })
            }
          />
        ))}
      </EditModal>

      <EditModal
        isdark={isdark}
        open={modal === "audience"}
        title="Edit Audience"
        onClose={() => setModal(null)}
        onSubmit={() => setModal(null)}
      >
        {brand.audience.map((seg, i) => (
          <Field
            key={i}
            isdark={isdark}
            label={seg.label}
            rows={4}
            value={seg.text}
            onChange={(e) => {
              const next = [...brand.audience];
              next[i] = { ...next[i], text: e.target.value };
              setBrand({ ...brand, audience: next });
            }}
          />
        ))}
      </EditModal>

      <EditModal
        isdark={isdark}
        open={modal === "strategy"}
        title="Edit Brand Strategy"
        onClose={() => setModal(null)}
        onSubmit={() => setModal(null)}
      >
        <Field
          isdark={isdark}
          label="Brand Promise"
          rows={5}
          value={brand.strategy.promise}
          onChange={(e) =>
            setBrand({
              ...brand,
              strategy: { ...brand.strategy, promise: e.target.value },
            })
          }
        />
      </EditModal>

      <EditModal
        isdark={isdark}
        open={modal === "voice"}
        title="Edit Brand Voice"
        onClose={() => setModal(null)}
        onSubmit={() => setModal(null)}
      >
        <Field
          isdark={isdark}
          label="Message"
          rows={4}
          value={brand.voice.message}
          onChange={(e) =>
            setBrand({
              ...brand,
              voice: { ...brand.voice, message: e.target.value },
            })
          }
        />
        <div className="flex flex-col gap-2">
          <label className={`text-sm ${mutedText}`}>Tones</label>
          {brand.voice.tones.map((t, i) => (
            <input
              key={i}
              value={t}
              onChange={(e) => {
                const next = [...brand.voice.tones];
                next[i] = e.target.value;
                setBrand({ ...brand, voice: { ...brand.voice, tones: next } });
              }}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#7c3aed] ${
                isdark
                  ? "bg-[#111827] border-[#334155] text-white"
                  : "bg-white border-[#d1d5db] text-[#334155]"
              }`}
            />
          ))}
        </div>
      </EditModal>
    </div>
  );
};

export default BrandEditPage;