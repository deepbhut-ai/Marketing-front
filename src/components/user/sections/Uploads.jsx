"use client";
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import { FaRegFile, FaCheckCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiOutlineRefresh } from "react-icons/hi";
import AssetCard from "./AssetCard";
import { apiFetch } from "@/lib/apiClient";

// ── Upload constraints ───────────────────────────────────────────────
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const ALLOWED_EXTS = [".jpg", ".jpeg", ".png"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const Pagination = ({ page, totalPages, onPageChange, isdark }) => {
  if (totalPages <= 1) return null;
  return (
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
      <span className={`text-sm ${isdark ? "text-[#94a3b8]" : "text-[#475569]"}`}>
        Page {page} of {totalPages}
      </span>
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
  );
};

const Uploads = ({
  assets = [],
  loading = false,
  deletingId = null,
  onDelete,
  onEdit,
  onToggleFavorite,
  onUploaded,
  page = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const { isdark } = useUserContext();
  const fileInputRef = useRef(null);

  // ── Upload state ───────────────────────────────────────────────────
  const [files, setFiles] = useState([]); // [{ file, preview, error }]
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const validateFile = (file) => {
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTS.includes(ext)) {
      return "Only JPG, PNG, JPEG allowed";
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File exceeds 10 MB (${formatSize(file.size)})`;
    }
    return "";
  };

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    setUploadError("");

    const newFiles = selected.map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      error: validateFile(file),
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    // reset so selecting the same files again still fires onChange
    fileInputRef.current.value = "";
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => {
      const item = prev[index];
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleClearAll = () => {
    files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
    setFiles([]);
    setUploadError("");
  };

  const handleUpload = async () => {
    const valid = files.filter((f) => !f.error);
    if (valid.length === 0) {
      setUploadError("Please select valid files to upload.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      valid.forEach((f) => formData.append("files", f.file));
      formData.append("description", "Batch upload");
      formData.append("tags", "batch,2026");
      formData.append("is_favorite", "false");

      await apiFetch("api/assets/upload", {
        method: "POST",
        body: formData,
      });

      // success — clean up previews and refresh
      files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
      setFiles([]);
      onUploaded?.();
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError(error?.data?.message || error?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // preview cleanup on unmount
  React.useEffect(() => {
    return () => {
      files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validCount = files.filter((f) => !f.error).length;
  const hasFiles = files.length > 0;

  return (
    <div>
      {/* Upload area + selected files preview */}
      <div className="flex flex-wrap items-start gap-5 mt-5">
        {/* Drop/select box */}
        <div
          onClick={handleBoxClick}
          className={`h-48 w-[14rem] relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#ddd6fe] cursor-pointer overflow-hidden transition-colors ${
            isdark ? "bg-[#6d28d91a]" : "bg-[#a78bfa1a]"
          } hover:border-[#8b5cf6]`}
        >
          <div className="rounded-full font-light h-10 w-10 text-[#8b5cf6] bg-[#a78bfa1a] flex justify-center items-center">
            <GoPlus size={24} />
          </div>
          <span className={`font-medium text-xl ${isdark ? "text-white" : ""}`}>
            Upload Images
          </span>
          <span className="text-xs text-[#94a3b8] mt-1 text-center px-2">
            JPG, PNG, JPEG · max 10 MB each
          </span>
        </div>

        {/* hidden file input — multiple */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Selected files list */}
        {hasFiles && (
          <div
            className={`flex-1 min-w-[280px] rounded-2xl border p-4 ${
              isdark ? "bg-[#1e293b] border-[#334155]" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${isdark ? "text-white" : "text-[#374151]"}`}>
                {files.length} file{files.length !== 1 ? "s" : ""} selected · {validCount} valid
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleClearAll}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    isdark
                      ? "border-gray-600 text-[#94a3b8] hover:bg-[#0f172a]"
                      : "border-gray-200 text-[#475569] hover:bg-gray-50"
                  }`}
                >
                  Clear All
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || validCount === 0}
                  className="flex items-center gap-2 text-xs px-3 py-1 rounded bg-[#8b5cf6] text-white cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <HiOutlineRefresh className="animate-spin" size={13} />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle size={13} />
                      Upload {validCount > 0 ? `(${validCount})` : ""}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* file chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[180px] overflow-y-auto">
              {files.map((item, i) => (
                <div
                  key={i}
                  className={`relative rounded-lg border overflow-hidden ${
                    item.error
                      ? "border-red-400"
                      : isdark
                        ? "border-[#334155]"
                        : "border-gray-200"
                  }`}
                >
                  <div className="h-20 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                    {item.preview ? (
                      <Image
                        src={item.preview}
                        alt={item.file.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <FaRegFile className="text-slate-400" size={20} />
                    )}
                  </div>
                  <div className="px-1.5 py-1">
                    <p
                      className={`text-xs truncate ${isdark ? "text-white" : "text-[#374151]"}`}
                    >
                      {item.file.name}
                    </p>
                    <p className="text-[10px] text-[#94a3b8]">{formatSize(item.file.size)}</p>
                    {item.error && (
                      <p className="text-[10px] text-red-400 truncate">{item.error}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveFile(i)}
                    className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <IoMdClose size={11} />
                  </button>
                </div>
              ))}
            </div>

            {uploadError && (
              <p className="text-xs text-red-400 mt-3">{uploadError}</p>
            )}
          </div>
        )}
      </div>

      {/* Uploaded assets grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-sm text-[#94a3b8]">
          Loading uploads...
        </div>
      ) : assets.length === 0 ? (
        <div className="flex justify-center items-center py-20 text-sm text-[#94a3b8]">
          No uploaded assets found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
            {assets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onDelete={onDelete}
                onEdit={onEdit}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            isdark={isdark}
          />
        </>
      )}
    </div>
  );
};

export default Uploads;