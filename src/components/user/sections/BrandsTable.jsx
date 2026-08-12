"use client";
import React, { useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ConfigProvider, Modal, Tooltip, theme } from "antd";
import { HiOutlineRefresh } from "react-icons/hi";
import { FaRegImage } from "react-icons/fa6";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { BiGlobe } from "react-icons/bi";
import dayjs from "@/lib/dayjsSetup";
import Link from "next/link";

/** Small image thumbnail that shows a spinner until the image finishes loading. */
const ImageWithLoader = ({ src, alt, className, rounded }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative ${className ?? ""} ${rounded ?? ""}`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <HiOutlineRefresh className="animate-spin text-[#8b5cf6]" size={14} />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-200 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

/** Row of color swatches */
const ColorSwatches = ({ colors = [] }) => {
  if (!colors.length)
    return <span className="text-sm text-[#94a3b8]">—</span>;
  return (
    <div className="flex items-center gap-1.5">
      {colors.slice(0, 5).map((c, i) => (
        <span
          key={i}
          className="h-5 w-5 rounded-full border border-black/10 shrink-0"
          style={{ backgroundColor: c }}
          title={c}
        />
      ))}
      {colors.length > 5 && (
        <span className="text-xs text-[#94a3b8]">+{colors.length - 5}</span>
      )}
    </div>
  );
};

/** Joined list as badges — shows up to `max` items, rest in a Tooltip */
const TagList = ({ items = [], max = 1, icon: Icon }) => {
  if (!items.length)
    return <span className="text-sm text-[#94a3b8]">—</span>;
  const visible = items.slice(0, max);
  const overflow = items.slice(max);
  return (
    <div className="flex flex-wrap items-center gap-1">
      {Icon && <Icon size={12} className="text-[#8b5cf6] shrink-0" />}
      {visible.map((t, i) => (
        <span
          key={i}
          className="inline-block px-2 py-0.5 rounded-md text-xs bg-[#8b5cf61a] text-[#8b5cf6]"
        >
          {t}
        </span>
      ))}
      {overflow.length > 0 && (
        <Tooltip
          title={
            <div className="flex flex-wrap gap-1 max-w-[200px]">
              {overflow.map((t, i) => (
                <span
                  key={i}
                  className="inline-block px-2 py-0.5 rounded-md text-xs bg-[#8b5cf61a] text-[#a78bfa]"
                >
                  {t}
                </span>
              ))}
            </div>
          }
          placement="top"
        >
          <span className="inline-block px-2 py-0.5 rounded-md text-xs bg-[#8b5cf61a] text-[#8b5cf6] cursor-help">
            +{overflow.length}
          </span>
        </Tooltip>
      )}
    </div>
  );
};

const BrandsTable = ({
  brands = [],
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
  onDelete,
}) => {
  const { isdark } = useUserContext();
  const [modalImage, setModalImage] = useState(null);

  const antdTheme = {
    algorithm: isdark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    components: {
      Modal: {
        contentBg: isdark ? "#1e293b" : "#ffffff",
        headerBg: isdark ? "#1e293b" : "#ffffff",
        titleColor: isdark ? "#ffffff" : "#111827",
      },
    },
  };

  const headers = [
    "Logo",
    "Brand Name",
    "Industry",
    "Website",
    "Colors",
    "Target Audience",
    "Created At",
    "Actions",
  ];

  return (
    <ConfigProvider theme={antdTheme}>
      <div
        className={`w-full overflow-x-auto rounded-sm mt-5 ${
          isdark ? "bg-[#1e293b]" : "bg-white"
        } p-2`}
      >
        <table className="w-full min-w-[900px] border-separate border-spacing-0">
          <thead>
            <tr>
              {headers.map((head) => (
                <th
                  key={head}
                  className={`px-2 py-4 text-left text-sm font-semibold border-b ${
                    isdark
                      ? "text-white border-[#d2d7e04d]"
                      : "border-[#e2e8f0]"
                  }`}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="py-10 text-center text-sm text-[#94a3b8]"
                >
                  Loading brands...
                </td>
              </tr>
            ) : brands.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="py-10 text-center text-sm text-[#94a3b8]"
                >
                  No brands found.
                </td>
              </tr>
            ) : (
              brands.map((brand) => {
                const dt = brand.created_at ? dayjs(brand.created_at) : null;
                const dateStr = dt
                  ? dt.format("DD MMM, YYYY hh:mm A")
                  : "—";

                return (
                  <tr key={brand.id}>
                    {/* Logo */}
                    <td
                      className={`px-2 py-2 align-middle border-b ${
                        isdark
                          ? "border-[#d2d7e04d]"
                          : "border-[#e2e8f0]"
                      }`}
                    >
                      {brand.logo_url ? (
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md overflow-hidden bg-slate-100 cursor-pointer"
                          onClick={() => setModalImage(brand.logo_url)}
                        >
                          <ImageWithLoader
                            src={brand.logo_url}
                            alt={`${brand.brand_name} logo`}
                            className="h-10 w-10"
                            rounded="rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100">
                          <FaRegImage className="text-slate-400" size={16} />
                        </div>
                      )}
                    </td>

                    {/* Brand Name */}
                    <td
                      className={`px-2 py-2 align-middle border-b text-sm font-medium ${
                        isdark
                          ? "text-white border-[#d2d7e04d]"
                          : "text-[#1e293b] border-[#e2e8f0]"
                      }`}
                    >
                      {brand.brand_name || "—"}
                    </td>

                    {/* Industry */}
                    <td
                      className={`px-2 py-2 align-middle text-sm border-b ${
                        isdark
                          ? "text-[#94a3b8] border-[#d2d7e04d]"
                          : "text-[#475569] border-[#e2e8f0]"
                      }`}
                    >
                      {brand.industry || "—"}
                    </td>

                    {/* Website */}
                    <td
                      className={`px-2 py-2 align-middle text-sm border-b ${
                        isdark
                          ? "text-[#94a3b8] border-[#d2d7e04d]"
                          : "text-[#475569] border-[#e2e8f0]"
                      }`}
                    >
                      {brand.website_url ? (
                        <a
                          href={brand.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[#8b5cf6] hover:underline"
                        >
                          <BiGlobe size={14} />
                          <span className="max-w-[140px] truncate">
                            {brand.website_url.replace(/^https?:\/\//, "")}
                          </span>
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Colors */}
                    <td
                      className={`px-2 py-2 align-middle border-b ${
                        isdark
                          ? "border-[#d2d7e04d]"
                          : "border-[#e2e8f0]"
                      }`}
                    >
                      <ColorSwatches colors={brand.primary_colors} />
                    </td>

                    {/* Target Audience */}
                    <td
                      className={`px-2 py-2 align-middle border-b ${
                        isdark
                          ? "border-[#d2d7e04d]"
                          : "border-[#e2e8f0]"
                      }`}
                    >
                      <TagList
                        items={
                          brand.target_audience
                            ? brand.target_audience
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean)
                            : []
                        }
                        max={1}
                      />
                    </td>

                    {/* Created At */}
                    <td
                      className={`px-2 py-2 align-middle whitespace-nowrap text-sm border-b ${
                        isdark
                          ? "text-[#94a3b8] border-[#d2d7e04d]"
                          : "border-[#e2e8f0] text-[#475569]"
                      }`}
                    >
                      {dateStr}
                    </td>

                    {/* Actions */}
                    <td
                      className={`px-2 py-2 align-middle border-b ${
                        isdark
                          ? "border-[#d2d7e04d]"
                          : "border-[#e2e8f0]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/brands/${brand.id}/edit`}
                          className="flex items-center gap-1 text-sm text-[#8b5cf6] hover:text-[#7c3aed] transition-colors"
                          title="Edit"
                        >
                          <FaRegEdit size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDelete?.(brand)}
                          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <FaRegTrashAlt size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className={`flex items-center justify-center w-8 h-8 rounded-md border text-sm transition-colors disabled:opacity-40 ${
                isdark
                  ? "border-gray-600 text-white hover:bg-[#0f172a]"
                  : "border-gray-200 text-[#475569] hover:bg-gray-50"
              }`}
            >
              <FiChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange?.(p)}
                className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                  page === p
                    ? "bg-[#8b5cf6] text-white border border-[#8b5cf6]"
                    : isdark
                      ? "border border-gray-600 text-white hover:bg-[#0f172a]"
                      : "border border-gray-200 text-[#475569] hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className={`flex items-center justify-center w-8 h-8 rounded-md border text-sm transition-colors disabled:opacity-40 ${
                isdark
                  ? "border-gray-600 text-white hover:bg-[#0f172a]"
                  : "border-gray-200 text-[#475569] hover:bg-gray-50"
              }`}
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Logo preview modal */}
      <Modal
        open={!!modalImage}
        onCancel={() => setModalImage(null)}
        footer={null}
        width={640}
        title="Logo Preview"
        centered
      >
        {modalImage && (
          <ImageWithLoader
            src={modalImage}
            alt="brand logo preview"
            className="w-full min-h-[200px]"
            rounded="rounded-lg"
          />
        )}
      </Modal>
    </ConfigProvider>
  );
};

export default BrandsTable;