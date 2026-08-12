"use client";
import React, { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaThumbsUp,
  FaRegImage,
} from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa6";
import { useUserContext } from "@/context/UserContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ConfigProvider, Modal, Tooltip, theme } from "antd";
import { HiOutlineRefresh } from "react-icons/hi";
import dayjs from "@/lib/dayjsSetup";

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

const PLATFORM_STYLES = {
  facebook: { bg: "bg-[#1877F2]", Icon: FaFacebook, shape: "rounded-full" },
  instagram: {
    bg: "bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5]",
    Icon: FaInstagram,
    shape: "rounded-full",
  },
  linkedin: { bg: "bg-[#0A66C2]", Icon: FaLinkedin, shape: "rounded-md" },
  twitter: { bg: "bg-black", Icon: FaXTwitter, shape: "rounded-full" },
};

const STATUS_STYLES = {
  pending: "bg-[#f59e0b] text-white",
  posted: "bg-[#10b981] text-white",
  failed: "bg-[#f43f5e] text-white",
};

const PlatformIcon = ({ platform }) => {
  const style = PLATFORM_STYLES[platform];
  if (!style) return null;
  const { bg, Icon, shape } = style;
  return (
    <div className={`flex h-9 w-9 items-center justify-center ${shape} ${bg} shadow-sm`}>
      <Icon className="text-white" size={18} />
    </div>
  );
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
      STATUS_STYLES[status] ?? "bg-[#64748b] text-white"
    }`}
  >
    {status || "unknown"}
  </span>
);

const StatPill = ({ icon: Icon, value, supported }) => {
  if (!supported) {
    return (
      <span className="inline-flex items-center rounded-full bg-indigo-500/90 px-3 py-1.5 text-xs font-medium text-white">
        not supported
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-600/60 bg-transparent px-3 py-1.5 text-xs font-medium">
      <Icon size={13} />
      {value}
    </span>
  );
};

const AnalylicsTable = ({ posts = [], loading = false, page = 1, totalPages = 1, onPageChange }) => {
  const { isdark } = useUserContext();
  const [modalImage, setModalImage] = useState(null); // URL or null

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

  return (
    <ConfigProvider theme={antdTheme}>
      <div className={`w-full overflow-x-auto rounded-sm mt-5 ${isdark ? "bg-[#1e293b]" : "bg-white"} p-2`}>
        <table className="w-full min-w-[960px] border-separate border-spacing-0">
          <thead>
            <tr>
              {["Platform", "Content", "Publish Date", "Status", "Error", "Reactions", "Comments"].map((head) => (
                <th
                  key={head}
                  className={`px-2 py-4 text-left text-sm font-semibold border-b ${isdark ? "text-white border-[#d2d7e04d]" : "border-[#e2e8f0]"}`}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-[#94a3b8]">
                  Loading posts...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-[#94a3b8]">
                  No posts found.
                </td>
              </tr>
            ) : (
              posts.map((post) => {
                const dt = post.scheduled_time ? dayjs(post.scheduled_time) : null;
                const dateStr = dt ? dt.format("DD MMM, YYYY hh:mm A") : "—";
                const hasMedia = post.media && post.media.length > 0;
                const firstMedia = hasMedia ? post.media[0] : null;
                const captionText = post.caption || "—";

                return (
                  <tr key={post.id}>
                    {/* Platform */}
                    <td className={`px-2 py-2 align-middle border-b ${isdark ? "text-[#94a3b8] border-[#d2d7e04d]" : "text-[#475569] border-[#e2e8f0]"}`}>
                      <PlatformIcon platform={post.platform} />
                    </td>

                    {/* Content with Tooltip + image hover modal */}
                    <td className={`px-1 py-2 align-middle border-b ${isdark ? "text-[#94a3b8] border-[#d2d7e04d]" : "text-[#475569] border-[#e2e8f0]"}`}>
                      <div className="flex items-center gap-3">
                        {/* Image thumbnail — click to open modal */}
                        {firstMedia ? (
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md overflow-hidden bg-slate-100 cursor-pointer"
                            onClick={() => setModalImage(firstMedia)}
                          >
                            <ImageWithLoader
                              src={firstMedia}
                              alt="post media"
                              className="h-9 w-9"
                              rounded="rounded-md"
                            />
                          </div>
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100">
                            <FaRegImage className="text-slate-400" size={15} />
                          </div>
                        )}

                        {/* Caption with Tooltip */}
                        <Tooltip
                          title={captionText}
                          placement="topLeft"
                          styles={{ root: { maxWidth: 400 } }}
                        >
                          <span className="max-w-[200px] truncate text-sm cursor-help">
                            {captionText}
                          </span>
                        </Tooltip>
                      </div>
                    </td>

                    {/* Publish Date */}
                    <td className={`px-1 py-2 align-middle whitespace-nowrap text-sm border-b ${isdark ? "text-[#94a3b8] border-[#d2d7e04d]" : "border-[#e2e8f0] text-[#475569]"}`}>
                      {dateStr}
                    </td>

                    {/* Status */}
                    <td className={`px-1 py-2 align-middle border-b ${isdark ? "text-[#94a3b8] border-[#d2d7e04d]" : "border-[#e2e8f0] text-[#475569]"}`}>
                      <StatusBadge status={post.status} />
                    </td>

                    {/* Error */}
                    <td className={`px-1 py-2 align-middle border-b ${isdark ? "text-[#94a3b8] border-[#d2d7e04d]" : "border-[#e2e8f0] text-[#475569]"}`}>
                      {post.error_message ? (
                        <Tooltip
                          title={post.error_message}
                          placement="topLeft"
                          styles={{ root: { maxWidth: 400 } }}
                        >
                          <span className="max-w-[200px] truncate text-xs text-red-500 cursor-help inline-block">
                            {post.error_message}
                          </span>
                        </Tooltip>
                      ) : (
                        <span className="text-sm text-[#94a3b8]">—</span>
                      )}
                    </td>

                    {/* Reactions */}
                    <td className={`px-1 py-2 align-middle border-b ${isdark ? "text-[#94a3b8] border-[#d2d7e04d]" : "border-[#e2e8f0] text-[#475569]"}`}>
                      <StatPill icon={FaThumbsUp} value={0} supported={true} />
                    </td>

                    {/* Comments */}
                    <td className={`px-1 py-2 align-middle border-b ${isdark ? "text-[#94a3b8] border-[#d2d7e04d]" : "border-[#e2e8f0] text-[#475569]"}`}>
                      <StatPill icon={FaRegComment} value={0} supported={true} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination — Previous | 1 ... current ... last | Next */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4">
            {/* Previous */}
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

            {/* First page — always show, highlight if current */}
            <button
              onClick={() => onPageChange?.(1)}
              className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                page === 1
                  ? "bg-[#8b5cf6] text-white border border-[#8b5cf6]"
                  : isdark
                    ? "border border-gray-600 text-white hover:bg-[#0f172a]"
                    : "border border-gray-200 text-[#475569] hover:bg-gray-50"
              }`}
            >
              1
            </button>

            {/* Ellipsis if current is far from page 1 */}
            {page > 3 && (
              <span className={`text-sm ${isdark ? "text-[#64748b]" : "text-gray-400"}`}>…</span>
            )}

            {/* Page 2 — show when current is 2 or 3, but only if totalPages > 2 */}
            {page >= 2 && page <= 3 && totalPages > 2 && (
              <button
                onClick={() => onPageChange?.(2)}
                className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                  page === 2
                    ? "bg-[#8b5cf6] text-white border border-[#8b5cf6]"
                    : isdark
                      ? "border border-gray-600 text-white hover:bg-[#0f172a]"
                      : "border border-gray-200 text-[#475569] hover:bg-gray-50"
                }`}
              >
                2
              </button>
            )}

            {/* Current page (if > 2 and not last) */}
            {page > 2 && page < totalPages && (
              <button
                onClick={() => onPageChange?.(page)}
                className="flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium bg-[#8b5cf6] text-white border border-[#8b5cf6]"
              >
                {page}
              </button>
            )}

            {/* Page before last — show when current is near the end,
                but skip if it's the same as the current page or page 1 */}
            {page >= totalPages - 1 && page < totalPages && totalPages > 2 && totalPages - 1 !== page && (
              <button
                onClick={() => onPageChange?.(totalPages - 1)}
                className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                  page === totalPages - 1
                    ? "bg-[#8b5cf6] text-white border border-[#8b5cf6]"
                    : isdark
                      ? "border border-gray-600 text-white hover:bg-[#0f172a]"
                      : "border border-gray-200 text-[#475569] hover:bg-gray-50"
                }`}
              >
                {totalPages - 1}
              </button>
            )}

            {/* Ellipsis if current is far from last */}
            {page < totalPages - 2 && (
              <span className={`text-sm ${isdark ? "text-[#64748b]" : "text-gray-400"}`}>…</span>
            )}

            {/* Last page — always show (when > 1) */}
            {totalPages > 1 && (
              <button
                onClick={() => onPageChange?.(totalPages)}
                className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                  page === totalPages
                    ? "bg-[#8b5cf6] text-white border border-[#8b5cf6]"
                    : isdark
                      ? "border border-gray-600 text-white hover:bg-[#0f172a]"
                      : "border border-gray-200 text-[#475569] hover:bg-gray-50"
                }`}
              >
                {totalPages}
              </button>
            )}

            {/* Next */}
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

      {/* Image preview modal — opens when a thumbnail is clicked */}
      <Modal
        open={!!modalImage}
        onCancel={() => setModalImage(null)}
        footer={null}
        width={640}
        title="Media Preview"
        centered
      >
        {modalImage && (
          <ImageWithLoader
            src={modalImage}
            alt="post media preview"
            className="w-full min-h-[200px]"
            rounded="rounded-lg"
          />
        )}
      </Modal>
    </ConfigProvider>
  );
};

export default AnalylicsTable;