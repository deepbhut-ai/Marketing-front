"use client";
import { useUserContext } from "@/context/UserContext";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { HiOutlineRefresh } from "react-icons/hi";
import { FaHeart, FaRegHeart, FaVideo } from "react-icons/fa6";
import dayjs from "@/lib/dayjsSetup";

/** Format bytes → human readable (KB / MB) */
const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/** Thumbnail that shows a spinner until the image loads */
const Thumb = ({ src, alt, isdark, isVideo }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // For videos, show a playable video element with controls
  if (isVideo) {
    return (
      <div
        className={`relative w-full rounded-t-xl h-60 overflow-hidden ${
          isdark ? "bg-[#0f172a]" : "bg-slate-100"
        }`}
      >
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <HiOutlineRefresh className="animate-spin text-[#8b5cf6]" size={24} />
          </div>
        )}
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <FaVideo className="text-slate-400" size={40} />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <video
            src={src}
            alt={alt}
            onLoadedData={() => setLoaded(true)}
            onError={() => setError(true)}
            className={`w-full h-60 object-cover rounded-t-xl transition-opacity duration-200 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            muted
            playsInline
            controls
            preload="auto"
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full rounded-t-xl h-60 overflow-hidden ${
        isdark ? "bg-[#0f172a]" : "bg-slate-100"
      }`}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <HiOutlineRefresh className="animate-spin text-[#8b5cf6]" size={24} />
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-slate-400">No preview</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-60 object-cover rounded-t-xl transition-opacity duration-200 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};

/**
 * Reusable asset card.
 * Props:
 *   asset        — single item from api/assets/ (see fields below)
 *   onDelete(id) — called with asset.id when Delete is clicked
 *   onEdit(asset)— called with the full asset when Edit is clicked
 */
const AssetCard = ({ asset, onDelete, onEdit, onToggleFavorite }) => {
  const { isdark } = useUserContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [favBusy, setFavBusy] = useState(false);

  const imgSrc = asset.thumbnail_url || asset.public_url || asset.url;
  const isVideo = asset.asset_type === "video";
  const dateStr = asset.created_at
    ? dayjs(asset.created_at).format("DD MMM, YYYY")
    : "";

  return (
    <div
      className={`h-72 w-[15rem] relative rounded-xl shadow-sm border ${
        isdark
          ? "bg-[#0f172a7e] border border-gray-600"
          : "bg-white border-gray-300"
      }`}
    >
      <div>
        {imgSrc ? (
          <Thumb src={imgSrc} alt={asset.name} isdark={isdark} isVideo={isVideo} />
        ) : (
          <div
            className={`w-full rounded-t-xl h-60 flex items-center justify-center ${
              isdark ? "bg-[#0f172a]" : "bg-slate-100"
            }`}
          >
            <span className="text-xs text-slate-400">No preview</span>
          </div>
        )}
      </div>

      {/* footer: file size + date */}
      <div
        className={`flex items-center justify-between px-2 gap-1 py-3 text-xs ${
          isdark ? "text-white" : ""
        }`}
      >
        <span className="truncate">{asset.name || "—"}</span>
        <span className="shrink-0">{formatSize(asset.file_size)}</span>
      </div>

      {/* Favorite toggle */}
      <div
        onClick={async (e) => {
          e.stopPropagation();
          if (favBusy) return;
          setFavBusy(true);
          try {
            await onToggleFavorite?.(asset);
          } finally {
            setFavBusy(false);
          }
        }}
        className={`h-8 w-8 cursor-pointer absolute top-1 left-1 flex justify-center items-center rounded-full transition-colors ${
          isdark ? "bg-[#1e293b]/80 text-white" : "bg-white/80"
        } ${asset.is_favorite ? "text-red-500" : "text-slate-400"} hover:text-red-500`}
        title={asset.is_favorite ? "Unfavorite" : "Add to favorites"}
      >
        {favBusy ? (
          <HiOutlineRefresh className="animate-spin" size={14} />
        ) : asset.is_favorite ? (
          <FaHeart size={14} />
        ) : (
          <FaRegHeart size={14} />
        )}
      </div>

      {/* 3-dots menu */}
      <div
        onClick={() => setMenuOpen((o) => !o)}
        className={`h-8 w-8 cursor-pointer absolute top-1 right-1 flex justify-center items-center rounded-full ${
          isdark ? "bg-[#1e293b] text-white" : "bg-white"
        }`}
      >
        <BsThreeDotsVertical />
      </div>

      {menuOpen && (
        <>
          {/* click-away overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className={`absolute rounded-xl px-3 py-2 top-10 right-1 z-20 ${
              isdark ? "bg-[#1e293b] text-white" : "bg-white text-[#374151]"
            }`}
          >
            <ul>
              <li
                onClick={() => {
                  setMenuOpen(false);
                  onEdit?.(asset);
                }}
                className="flex cursor-pointer gap-2 items-center text-sm pb-1 mb-1"
              >
                <RiEdit2Fill /> Edit
              </li>
              <li
                onClick={() => {
                  setMenuOpen(false);
                  onDelete?.(asset.id);
                }}
                className="flex gap-2 items-center text-sm cursor-pointer"
              >
                <FaRegTrashAlt /> Delete
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default AssetCard;