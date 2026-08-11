"use client";
import { useUserContext } from "@/context/UserContext";
import { ConfigProvider, Select, theme } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CgSearch } from "react-icons/cg";
import { FaAngleDown } from "react-icons/fa";
import { LuBrainCog } from "react-icons/lu";
import { MdOutlineFileUpload, MdOutlineFilterAlt } from "react-icons/md";
import { TbBorderAll } from "react-icons/tb";
import { HiOutlineRefresh } from "react-icons/hi";
import { BiImageAlt, BiBrain, BiHeart } from "react-icons/bi";
import Allassets from "../sections/Allassets";
import Uploads from "../sections/Uploads";
import Aiassets from "../sections/Aiassets";
import { apiFetch } from "@/lib/apiClient";

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
];

// Map tab → source filter sent to the API
const TAB_SOURCE = { all: "", upload: "uploaded", ai: "ai" };

const formatSize = (mb) => {
  if (mb == null) return "—";
  if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`;
  return `${mb.toFixed(2)} MB`;
};

const AssetsPage = () => {
  const { isdark } = useUserContext();
  const [section, setSection] = useState("all");
  const [openFilter, setopenFilter] = useState(false);
  const filterRef = useRef(null);

  // ── API state (list) ───────────────────────────────────────────────
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // ── API state (summary) ────────────────────────────────────────────
  const [summary, setSummary] = useState(null);

  // ── filter state ───────────────────────────────────────────────────
  const [assetType, setAssetType] = useState("");  const [favoriteOnly, setFavoriteOnly] = useState(false);

  // ── delete state ───────────────────────────────────────────────────
  const [deletingId, setDeletingId] = useState(null);

  const fetchAssets = useCallback(
    async (pageNum = 1, type = assetType, fav = favoriteOnly) => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(pageNum),
          page_size: "10",
          asset_type: type || "",
          source: TAB_SOURCE[section] || "",
          ...(fav ? { favorite: "true" } : {}),
        }).toString();

        const data = await apiFetch(`api/assets/?${query}`);
        const items = data?.data?.items || [];
        const pg = data?.data?.pagination || {};

        setAssets(items);
        setTotal(pg.total || items.length);
        setTotalPages(pg.total_pages || 1);
        setPage(pg.page || pageNum);
      } catch (error) {
        console.error("Fetch assets failed:", error);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    },
    [assetType, section, favoriteOnly]
  );

  const fetchSummary = useCallback(async () => {
    try {
      const data = await apiFetch("api/assets/summary");
      setSummary(data?.data || null);
    } catch (error) {
      console.error("Fetch summary failed:", error);
    }
  }, []);

  // Fetch on mount, when tab changes, when page changes
  useEffect(() => {
    fetchAssets(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, section]);

  // Fetch summary once on mount
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Reset to page 1 when tab changes
  const handleTabChange = (tab) => {
    setSection(tab);
    setPage(1);
  };

  const handleSearch = () => {
    setPage(1);
    fetchAssets(1, assetType);
    setopenFilter(false);
  };

  const handleClear = () => {
    setAssetType("");
    setFavoriteOnly(false);
    setPage(1);
    fetchAssets(1, "", false);
    setopenFilter(false);
  };

  const handleToggleFavoriteFilter = () => {
    const next = !favoriteOnly;
    setFavoriteOnly(next);
    setPage(1);
    fetchAssets(1, assetType, next);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await apiFetch(`api/assets/${id}`, { method: "DELETE" });
      // remove from local state
      setAssets((prev) => prev.filter((a) => a.id !== id));
      // refresh summary
      fetchSummary();
    } catch (error) {
      console.error("Delete asset failed:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFavorite = async (asset) => {
    const endpoint = asset.is_favorite ? "unfavorite" : "favorite";
    // optimistic update
    setAssets((prev) =>
      prev.map((a) =>
        a.id === asset.id ? { ...a, is_favorite: !a.is_favorite } : a
      )
    );
    try {
      await apiFetch(`api/assets/${asset.id}/${endpoint}`, { method: "POST" });
    } catch (error) {
      console.error("Toggle favorite failed:", error);
      // revert on failure
      setAssets((prev) =>
        prev.map((a) =>
          a.id === asset.id ? { ...a, is_favorite: a.is_favorite } : a
        )
      );
    }
  };

  const handleEdit = (asset) => {
    // TODO: wire to an edit page/modal later
    console.log("Edit asset", asset);
  };

  const handleRefresh = () => {
    fetchAssets(page, assetType, favoriteOnly);
    fetchSummary();
  };

  // Called after a successful upload — refresh list + summary
  const handleUploaded = () => {
    setPage(1);
    fetchAssets(1, assetType, favoriteOnly);
    fetchSummary();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setopenFilter(false);
      }
    }
    if (openFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openFilter]);

  return (
    <div>
      {/* Summary stat cards */}
      <div className="flex gap-5 flex-wrap mt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
          <div
            className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <div className="p-3 flex justify-center items-center bg-[#8b5cf61a] text-[#8b5cf6] rounded-xl">
              <BiImageAlt size={24} />
            </div>
            <div>
              <p className="text-[#64748b]">Total Assets</p>
              <h6 className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}>
                {summary?.total ?? 0}
              </h6>
            </div>
          </div>
          <div
            className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <div className="p-3 flex justify-center items-center bg-[#10b9811a] text-[#10b981] rounded-xl">
              <MdOutlineFileUpload size={24} />
            </div>
            <div>
              <p className="text-[#64748b]">Uploaded</p>
              <h6 className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}>
                {summary?.by_source?.uploaded ?? 0}
              </h6>
            </div>
          </div>
          <div
            className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <div className="p-3 flex justify-center items-center bg-[#f59e0b1a] text-[#f59e0b] rounded-xl">
              <BiBrain size={24} />
            </div>
            <div>
              <p className="text-[#64748b]">AI Generated</p>
              <h6 className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}>
                {summary?.by_source?.ai ?? 0}
              </h6>
            </div>
          </div>
          <div
            className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <div className="p-3 flex justify-center items-center bg-[#8b5cf61a] text-[#8b5cf6] rounded-xl">
              <BiImageAlt size={24} />
            </div>
            <div>
              <p className="text-[#64748b]">Storage Used</p>
              <h6 className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}>
                {formatSize(summary?.total_size_mb)} / {formatSize(summary?.storage_limit_mb)}
              </h6>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + Refresh + Filter */}
      <div className="flex flex-wrap justify-between items-center gap-2 mt-5">
        <div className="flex gap-2 items-center">
          <div
            className={`flex flex-wrap gap-4 p-1 shadow-sm rounded-sm ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <button
              onClick={() => handleTabChange("all")}
              className={`flex gap-2 items-center rounded-sm px-4 py-2 ${isdark ? "text-white" : ""} ${section == "all" ? "text-white bg-[#8b5cf6] font-medium" : ""}`}
            >
              <TbBorderAll /> All
            </button>
            <button
              onClick={() => handleTabChange("upload")}
              className={`flex gap-2 items-center rounded-sm px-4 py-2 ${isdark ? "text-white" : ""} ${section == "upload" ? "text-white bg-[#8b5cf6] font-medium" : ""}`}
            >
              <MdOutlineFileUpload /> Uploads
            </button>
            <button
              onClick={() => handleTabChange("ai")}
              className={`flex gap-2 items-center rounded-sm px-4 py-2 ${isdark ? "text-white" : ""} ${section == "ai" ? "text-white bg-[#8b5cf6] font-medium" : ""}`}
            >
              <LuBrainCog /> Ai Generated
            </button>
          </div>
          <button
            onClick={handleRefresh}
            className={`px-2 py-1 text-white bg-[#8b5cf6] rounded-sm flex gap-2 items-center cursor-pointer disabled:opacity-50`}
            disabled={loading}
          >
            <HiOutlineRefresh className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={handleToggleFavoriteFilter}
            className={`flex gap-2 items-center shadow-sm rounded-sm px-4 py-2 transition-colors ${
              favoriteOnly
                ? "text-white bg-red-500 font-medium"
                : isdark
                  ? "text-white bg-[#1e293b]"
                  : "bg-white"
            }`}
          >
            <BiHeart className={favoriteOnly ? "text-white" : "text-[#f43f5e]"} />
            Favorites {summary?.favorites ?? 0}
          </button>
          <div className="relative" ref={filterRef}>
          <button
            onClick={() => setopenFilter(!openFilter)}
            className={`flex gap-2 items-center shadow-sm rounded-sm px-4 py-2 ${isdark ? "text-white bg-[#1e293b]" : " bg-white"}`}
          >
            <MdOutlineFilterAlt className="text-[#94a3b8]" /> Search{" "}
            <FaAngleDown className="text-[#94a3b8]" />
          </button>
          {openFilter && (
            <div
              className={`absolute z-10 top-12 px-4 py-3 shadow-sm border rounded-sm right-0 w-[260px] ${isdark ? "bg-[#1e293b] border-[#d2d7e04d]" : "bg-white border-[#e2e8f0]"}`}
            >
              <div className="space-y-3">
                <div>
                  <ConfigProvider
                    theme={{
                      algorithm: isdark ? theme.darkAlgorithm : theme.defaultAlgorithm,
                      components: {
                        Select: {
                          selectorBg: isdark ? "#1e293b" : "#ffffff",
                          colorText: isdark ? "#ffffff" : "#000000",
                          colorBorder: isdark ? "#475569" : "#d9d9d9",
                          colorPrimaryHover: isdark ? "#475569" : "#4096ff",
                          colorPrimary: isdark ? "#475569" : "#1677ff",
                          controlOutline: "transparent",
                          optionSelectedBg: isdark ? "#334155" : "#e6f4ff",
                          colorBgElevated: isdark ? "#1e293b" : "#ffffff",
                        },
                      },
                    }}
                  >
                    <label className={`block mb-1 text-sm ${isdark ? "text-white" : ""}`}>
                      Asset Type
                    </label>
                    <Select
                      className="selectSet w-full"
                      value={assetType}
                      onChange={setAssetType}
                      getPopupContainer={() => filterRef.current}
                      classNames={{
                        popup: {
                          root: isdark ? "darkSelectDropdown" : "lightSelectDropdown",
                        },
                      }}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                      placeholder="Select type"
                      options={TYPE_OPTIONS}
                    />
                  </ConfigProvider>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={handleSearch}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#8b5cf6] rounded-sm cursor-pointer text-white"
                    >
                      Search <CgSearch />
                    </button>
                    <button
                      onClick={handleClear}
                      className={`flex items-center justify-center gap-2 py-2 px-4 rounded-sm border cursor-pointer transition-colors ${
                        isdark
                          ? "border-gray-600 text-white hover:bg-[#0f172a]"
                          : "border-gray-200 text-[#475569] hover:bg-gray-50"
                      }`}
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Sections */}
      <div>
        {section == "all" && (
          <Allassets
            assets={assets}
            loading={loading}
            deletingId={deletingId}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleFavorite={handleToggleFavorite}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        {section == "upload" && (
          <Uploads
            assets={assets}
            loading={loading}
            deletingId={deletingId}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleFavorite={handleToggleFavorite}
            onUploaded={handleUploaded}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        {section == "ai" && (
          <Aiassets
            assets={assets}
            loading={loading}
            deletingId={deletingId}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleFavorite={handleToggleFavorite}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default AssetsPage;