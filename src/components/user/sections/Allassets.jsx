"use client";
import { useUserContext } from "@/context/UserContext";
import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AssetCard from "./AssetCard";
import TableLoader from "@/components/common/TableLoader";

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

const Allassets = ({
  assets = [],
  loading = false,
  deletingId = null,
  onDelete,
  onEdit,
  onToggleFavorite,
  page = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const { isdark } = useUserContext();

  if (loading) {
    return <TableLoader />;
  }

  if (assets.length === 0) {
    return (
      <div className="flex justify-center items-center py-20 text-sm text-[#94a3b8]">
        No assets found.
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
};

export default Allassets;
