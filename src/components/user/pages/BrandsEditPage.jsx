"use client";
import { useUserContext } from "@/context/UserContext";
import { apiFetch } from "@/lib/apiClient";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BiLayout, BiGlobe } from "react-icons/bi";
import { FaPlus, FaTags } from "react-icons/fa";
import { LuFlag } from "react-icons/lu";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { HiOutlineSwatch, HiSparkles } from "react-icons/hi2";
import { TbColumns2 } from "react-icons/tb";
import { BsPeople } from "react-icons/bs";
import { message, Spin } from "antd";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  API response normalizer (same logic as create-post StageOne)       */
/* ------------------------------------------------------------------ */
const normalizeApiResponse = (data) => {
  if (Array.isArray(data)) return data[0] ?? null;
  return data ?? null;
};

/* ------------------------------------------------------------------ */
/*  Reusable pieces (mirrors BrandsCreatePage)                          */
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

const SectionHeader = ({ isdark, icon, title, iconColor }) => (
  <div className="flex items-center gap-2">
    <div
      className={`p-2 rounded-xl bg-[#c4b5fd1a] ${iconColor || "text-[#a78bfa]"}`}
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
);

const Divider = ({ isdark }) => (
  <div className={`h-px w-full my-5 ${isdark ? "bg-[#334155]" : "bg-[#e2e8f0]"}`} />
);

const Field = ({ isdark, label, value, onChange, rows, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className={`text-sm ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
      {label}
    </label>
    {rows ? (
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
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
        placeholder={placeholder}
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

const BrandsEditPage = ({ brandId }) => {
  const { isdark } = useUserContext();
  const router = useRouter();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    brand_name: "",
    industry: "",
    website_url: "",
    target_audience: "",
    brand_summary: "",
    brand_keywords: "",
    primary_colors: ["#8b5cf6", "#a78bfa"],
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const mutedText = isdark ? "text-[#94a3b8]" : "text-[#64748b]";

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  /* ── Fetch brand detail on mount ───────────────────────────────── */
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const data = await apiFetch(`api/brand/${brandId}/`);
        const brand = data?.data ?? data ?? null;
        if (!active || !brand) return;

        setForm({
          brand_name: brand.brand_name ?? "",
          industry: brand.industry ?? "",
          website_url: brand.website_url ?? "",
          target_audience: brand.target_audience ?? "",
          brand_summary: brand.brand_summary ?? "",
          brand_keywords: Array.isArray(brand.brand_keywords)
            ? brand.brand_keywords.join(", ")
            : brand.brand_keywords ?? "",
          primary_colors:
            brand.primary_colors?.length > 0
              ? brand.primary_colors
              : ["#8b5cf6", "#a78bfa"],
        });
        if (brand.logo_url) setLogoPreview(brand.logo_url);
      } catch (err) {
        console.error("Fetch brand detail failed:", err);
        messageApi.error(err?.message || "Failed to load brand details.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId]);

  /* ── Enhance brand summary with AI ─────────────────────────────── */
  const handleEnhanceSummary = async () => {
    if (!form.brand_summary.trim()) return;
    setEnhancing(true);

    try {
      const data = await apiFetch("posts/enhance-description/", {
        method: "POST",
        body: JSON.stringify({
          title: form.brand_name,
          website: form.website_url,
          description: form.brand_summary,
        }),
      });

      const result = normalizeApiResponse(data);

      if (!result || result.success === false) {
        messageApi.error(result?.message || "Failed to enhance brand summary");
        return;
      }

      const enhanced =
        result?.data?.enhanced_description ||
        result?.data?.description ||
        result?.enhanced_description ||
        result?.description ||
        "";
      update("brand_summary", enhanced);
      messageApi.success(
        result?.data?.message || result?.message || "Brand summary enhanced successfully"
      );
    } catch (error) {
      console.error("Enhance failed:", error);
      const errData = normalizeApiResponse(error?.data) || error?.data;
      const errMsg =
        (Array.isArray(errData) && errData[0]?.message) ||
        errData?.message ||
        errData?.detail ||
        error?.message ||
        "Failed to enhance brand summary";
      messageApi.error(errMsg);
    } finally {
      setEnhancing(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  /* ── Submit (PUT) ───────────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!form.brand_name.trim()) {
      messageApi.warning("Please enter a brand name.");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (logoFile) formData.append("logo", logoFile);
      formData.append("brand_name", form.brand_name);
      formData.append("industry", form.industry);
      formData.append("website_url", form.website_url);
      formData.append("target_audience", form.target_audience);
      formData.append("brand_summary", form.brand_summary);
      formData.append("brand_keywords", form.brand_keywords);
      formData.append("primary_colors", form.primary_colors.join(","));

      await apiFetch(`api/brand/${brandId}/update-with-logo/`, {
        method: "PUT",
        body: formData,
      });

      messageApi.success("Brand updated successfully!");
      setTimeout(() => {
        router.push("/brands");
      }, 1000);
    } catch (err) {
      console.error("Update brand error:", err);
      messageApi.error(err?.message || "Failed to update brand.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Loading state ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isdark ? "bg-[#0f172a]" : ""
        }`}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={isdark ? "bg-[#0f172a] min-h-screen" : "min-h-screen"}>
      {contextHolder}
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
            <span>Edit</span>
          </div>
          <Link
            href={"/brands"}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#8b5cf6] hover:bg-[#7c3aed] transition-colors`}
          >
            Back
          </Link>
        </div>

        {/* Brand Name --------------------------------------------------- */}
        <Card isdark={isdark} className="w-full flex flex-col">
          <SectionHeader
            isdark={isdark}
            icon={<BiLayout size={25} />}
            title="Brand Name"
          />
          <Divider isdark={isdark} />
          <div className="flex-1 flex items-center justify-center py-6">
            <input
              value={form.brand_name}
              onChange={(e) => update("brand_name", e.target.value)}
              placeholder="Enter brand name"
              className={`w-full text-center text-3xl sm:text-4xl font-bold outline-none bg-transparent border-b-2 pb-2 ${
                isdark
                  ? "text-white border-[#334155] placeholder:text-[#475569]"
                  : "text-[#1e293b] border-[#e2e8f0] placeholder:text-[#cbd5e1]"
              } focus:border-[#7c3aed]`}
            />
          </div>
        </Card>

        {/* Industry + Website URL --------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card isdark={isdark}>
            <SectionHeader
              isdark={isdark}
              icon={<FaTags size={22} />}
              title="Industry"
            />
            <Divider isdark={isdark} />
            <Field
              isdark={isdark}
              label="Industry"
              value={form.industry}
              onChange={(e) => update("industry", e.target.value)}
              placeholder="e.g. Food & Beverage"
            />
          </Card>

          <Card isdark={isdark}>
            <SectionHeader
              isdark={isdark}
              icon={<BiGlobe size={22} />}
              title="Website URL"
            />
            <Divider isdark={isdark} />
            <Field
              isdark={isdark}
              label="Website"
              value={form.website_url}
              onChange={(e) => update("website_url", e.target.value)}
              placeholder="https://www.example.com"
            />
          </Card>
        </div>

        {/* Logo ---------------------------------------------------------- */}
        <Card isdark={isdark}>
          <SectionHeader
            isdark={isdark}
            icon={<LuFlag size={25} />}
            title="Logo"
            iconColor="text-[#f97316]"
          />
          <Divider isdark={isdark} />
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`h-28 w-28 rounded-xl border flex items-center justify-center overflow-hidden ${
                  isdark ? "border-[#334155] bg-[#0f172a]" : "border-[#e2e8f0] bg-gray-50"
                }`}
              >
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoPreview}
                    alt="logo preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className={`text-xs ${mutedText}`}>No logo</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 text-sm text-[#7c3aed] hover:text-[#6d28d9] transition-colors"
              >
                <FaPlus size={12} /> Upload logo
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>
            <p className={`text-sm ${mutedText}`}>
              Upload a PNG/JPG/SVG logo file. This will be sent as the
              <code className="mx-1 px-1 py-0.5 rounded bg-[#c4b5fd1a] text-[#a78bfa]">logo</code>
              field in the request.
            </p>
          </div>
        </Card>

        {/* Brand Summary ----------------------------------------------- */}
        <Card isdark={isdark}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <SectionHeader
              isdark={isdark}
              icon={<TbColumns2 size={25} />}
              title="Brand Summary"
            />
            <button
              onClick={handleEnhanceSummary}
              disabled={enhancing || !form.brand_summary.trim()}
              className="flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c6ff0] to-[#a78bfa] hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <HiSparkles size={16} />
              {enhancing ? "Enhancing..." : "Enhanced with AI"}
            </button>
          </div>
          <Divider isdark={isdark} />
          <div className="flex flex-col gap-1">
            <textarea
              rows={6}
              value={form.brand_summary}
              onChange={(e) => update("brand_summary", e.target.value)}
              placeholder="e.g. Chipotle Mexican Grill is a restaurant..."
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none resize-y focus:border-[#7c3aed] ${
                isdark
                  ? "bg-[#111827] border-[#334155] text-white"
                  : "bg-white border-[#d1d5db] text-[#334155]"
              }`}
            />
          </div>
        </Card>

        {/* Primary Colors --------------------------------------------- */}
        <Card isdark={isdark}>
          <SectionHeader
            isdark={isdark}
            icon={<HiOutlineSwatch size={25} />}
            title="Primary Colors"
          />
          <Divider isdark={isdark} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {form.primary_colors.map((hex, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div
                  className="h-20 w-full rounded-xl border border-black/5"
                  style={{ backgroundColor: hex }}
                />
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="color"
                    value={hex}
                    onChange={(e) => {
                      const next = [...form.primary_colors];
                      next[i] = e.target.value;
                      update("primary_colors", next);
                    }}
                    className="h-8 w-12 rounded-lg cursor-pointer border-0 bg-transparent"
                    aria-label={`Pick color ${i + 1}`}
                  />
                  <span className={`text-xs uppercase ${mutedText}`}>{hex}</span>
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "primary_colors",
                        form.primary_colors.filter((_, idx) => idx !== i)
                      )
                    }
                    className={`${mutedText} hover:text-red-500 transition-colors`}
                    aria-label={`Remove color ${i + 1}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              update("primary_colors", [...form.primary_colors, "#8b5cf6"])
            }
            className="mt-4 flex items-center gap-2 text-sm text-[#7c3aed] hover:text-[#6d28d9] transition-colors"
          >
            <FaPlus size={12} /> Add color
          </button>
          <p className={`mt-2 text-xs ${mutedText}`}>
            Sent as <code className="px-1 py-0.5 rounded bg-[#c4b5fd1a] text-[#a78bfa]">primary_colors</code> (comma-separated hex values, e.g. <code className="text-[#a78bfa]">#E8380E,#FFFFFF,#000000</code>)
          </p>
        </Card>

        {/* Brand Keywords ---------------------------------------------- */}
        <Card isdark={isdark}>
          <SectionHeader
            isdark={isdark}
            icon={<FaTags size={22} />}
            title="Brand Keywords"
          />
          <Divider isdark={isdark} />
          <Field
            isdark={isdark}
            label="Keywords"
            value={form.brand_keywords}
            onChange={(e) => update("brand_keywords", e.target.value)}
            placeholder="e.g. Mexican food,tacos,burritos"
          />
          <p className={`mt-2 text-xs ${mutedText}`}>Comma-separated values.</p>
        </Card>

        {/* Target Audience --------------------------------------------- */}
        <Card isdark={isdark}>
          <SectionHeader
            isdark={isdark}
            icon={<BsPeople size={25} />}
            title="Target Audience"
          />
          <Divider isdark={isdark} />
          <Field
            isdark={isdark}
            label="Target Audience"
            value={form.target_audience}
            onChange={(e) => update("target_audience", e.target.value)}
            placeholder="e.g. food enthusiasts, families"
          />
          <p className={`mt-2 text-xs ${mutedText}`}>Comma-separated audience segments.</p>
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
          disabled={submitting}
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-60 text-white text-sm font-medium px-5 py-3 rounded-lg transition-colors"
        >
          {submitting ? "Updating..." : "Update Brand"}
        </button>
      </div>
    </div>
  );
};

export default BrandsEditPage;