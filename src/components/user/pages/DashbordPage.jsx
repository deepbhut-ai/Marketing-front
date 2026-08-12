"use client";
import { useUserContext } from "@/context/UserContext";
import { Modal, Select, ConfigProvider, theme } from "antd";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BiBox,
  BiCommentDetail,
  BiMemoryCard,
  BiReceipt,
} from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { IoIosArrowForward, IoMdCalendar } from "react-icons/io";
import { LiaTelegramPlane } from "react-icons/lia";
import {
  MdOutlineFileUpload,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardVoice,
} from "react-icons/md";
import { RiGroupLine } from "react-icons/ri";
import { apiFetch } from "@/lib/apiClient";
import dayjs from "@/lib/dayjsSetup";
import TableLoader from "@/components/common/TableLoader";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaTiktok,
} from "react-icons/fa6";

const PLATFORM_ICONS = {
  facebook: { Icon: FaFacebook, color: "#1877F2" },
  instagram: { Icon: FaInstagram, color: "#D62976" },
  linkedin: { Icon: FaLinkedin, color: "#0A66C2" },
  x: { Icon: FaXTwitter, color: "#000000" },
  tiktok: { Icon: FaTiktok, color: "#010101" },
};

const DashbordPage = () => {
  const scrollRef = useRef(null);
  const { isdark } = useUserContext();
  const date = new Date();
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();
  const today = date.getDate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── API state ──────────────────────────────────────────────────────
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("posts/dashboard/");
      setDashboard(data?.data || null);
    } catch (error) {
      console.error("Fetch dashboard failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // scroll handlers
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };
  const handleMouseLeave = () => { isDown.current = false; };
  const handleMouseUp = () => { isDown.current = false; };
  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const overview = dashboard?.overview || {};
  const recentPosts = dashboard?.recent_posts || [];
  const upcomingTotal = dashboard?.upcoming?.total_pending || 0;

  return (
    <div>
      <div className={`flex items-center gap-2 text-sm ${isdark ? "text-[#64748b]" : "text-[#64748b]"}`}>
        <span className="text-[#8b5cf6]">User</span>{" "}
        <MdOutlineKeyboardArrowRight /> <span>Dashboard</span>
      </div>

      {/* Stat cards from API overview */}
      <div className="flex gap-5 flex-wrap mt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 w-full">
          <div className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}>
            <div className="p-3 flex justify-center items-center bg-[#8b5cf61a] text-[#8b5cf6] rounded-xl">
              <BiReceipt size={24} />
            </div>
            <div>
              <p className="text-[#64748b]">Total Posts</p>
              <h6 className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}>
                {overview.total ?? 0}
              </h6>
            </div>
          </div>
          <div className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}>
            <div className="p-3 flex justify-center items-center bg-[#f59e0b1a] text-[#f59e0b] rounded-xl">
              <BiMemoryCard size={24} />
            </div>
            <div>
              <p className="text-[#64748b]">Pending</p>
              <h6 className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}>
                {overview.pending ?? 0}
              </h6>
            </div>
          </div>
          <div className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}>
            <div className="p-3 flex justify-center items-center bg-[#10b9811a] text-[#10b981] rounded-xl">
              <FaRegCircleCheck size={24} />
            </div>
            <div>
              <p className="text-[#64748b]">Posted</p>
              <h6 className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}>
                {overview.posted ?? 0}
              </h6>
            </div>
          </div>
          <div className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}>
            <div className="p-3 flex justify-center items-center bg-[#f43f5e1a] text-[#f43f5e] rounded-xl">
              <BiCommentDetail size={24} />
            </div>
            <div>
              <p className="text-[#64748b]">Failed</p>
              <h6 className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}>
                {overview.failed ?? 0}
              </h6>
            </div>
          </div>
          <div className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}>
            <div className="p-3 flex justify-center items-center bg-[#0ea5e91a] text-[#0ea5e9] rounded-xl">
              <RiGroupLine size={24} />
            </div>
            <div>
              <p className="text-[#64748b]">Upcoming</p>
              <h6 className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}>
                {upcomingTotal}
              </h6>
            </div>
          </div>
        </div>
      </div>

      {/* Platform usage */}
      <div className="flex gap-5 flex-wrap mt-5">
        {/* Platform usage */}
        <div className={`flex-1 min-w-[300px] shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-[#8b5cf61a] text-[#8b5cf6]">
              <BiBox size={20} />
            </div>
            <h6 className={`text-lg font-medium ${isdark ? "text-white" : "text-[#475569]"}`}>
              Platform Usage
            </h6>
          </div>
          <div className="space-y-3">
            {Object.entries(dashboard?.by_platform || {}).map(([platform, count]) => {
              const pInfo = PLATFORM_ICONS[platform];
              if (!pInfo) return null;
              const { Icon, color } = pInfo;
              const maxCount = Math.max(...Object.values(dashboard?.by_platform || {}));
              const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div key={platform} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-28 shrink-0">
                    <Icon style={{ color }} size={18} />
                    <span className={`text-sm capitalize ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
                      {platform}
                    </span>
                  </div>
                  <div className={`flex-1 h-2 rounded-full overflow-hidden ${isdark ? "bg-[#334155]" : "bg-gray-100"}`}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className={`text-sm font-medium w-8 text-right ${isdark ? "text-white" : "text-[#475569]"}`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className={`shadow-sm rounded-xl mt-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}>
        <div>
          <div className={`flex justify-between items-center border-b py-3 px-4 ${isdark ? "border-gray-600" : "border-gray-200"}`}>
            <div className="flex items-center gap-5">
              <div className="p-3 flex justify-center items-center bg-[#10b9811a] text-[#10b981] rounded-xl">
                <BiReceipt size={24} />
              </div>
              <span className={`text-2xl font-medium ${isdark ? "text-white" : "text-[#475569]"}`}>
                Recent Posts
              </span>
            </div>
            <Link href="/create-post" className={`${isdark ? "text-white" : "text-[#475569]"}`}>
              <FaPlus />
            </Link>
          </div>
        </div>
        <div className="px-5">
          <ul
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto dashbordpostscroll py-5"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {/* Create Post card */}
            <Link href="/create-post">
              <li
                className={`h-96 min-w-[14rem] sm:min-w-[18rem] relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#ddd6fe] ${isdark ? "bg-[#6d28d91a]" : "bg-[#a78bfa1a]"}`}
              >
                <div className="rounded-full font-light h-10 w-10 text-[#8b5cf6] bg-[#a78bfa1a] flex justify-center items-center">
                  <GoPlus size={24} />
                </div>
                <span className={`font-medium text-xl ${isdark ? "text-white" : ""}`}>
                  Create Post
                </span>
              </li>
            </Link>

            {/* Recent posts from API */}
            {loading ? (
              <li className="w-full">
                <TableLoader />
              </li>
            ) : recentPosts.length === 0 ? (
              <li className={`h-96 min-w-[14rem] sm:min-w-[18rem] flex items-center justify-center ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
                No recent posts.
              </li>
            ) : (
              recentPosts.map((post) => {
                const dt = post.scheduled_time ? dayjs(post.scheduled_time) : null;
                const dateStr = dt ? dt.format("DD MMM, YYYY") : "—";
                const pInfo = PLATFORM_ICONS[post.platform];
                const statusColor =
                  post.status === "posted" ? "text-green-600 border-green-300"
                  : post.status === "failed" ? "text-red-600 border-red-300"
                  : "text-yellow-600 border-yellow-300";

                return (
                  <li
                    key={post.id}
                    className={`h-96 min-w-[14rem] sm:min-w-[18rem] relative flex flex-col rounded-xl shadow-sm ${isdark ? "bg-[#0f172a7e] border border-gray-600" : "bg-white"}`}
                  >
                    <div className="w-full h-full flex flex-col">
                      {/* Media or placeholder */}
                      <div className="w-full h-[257px] rounded-t-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                        {post.media && post.media.length > 0 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.media[0]}
                            alt="post media"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`flex flex-col items-center gap-2 ${isdark ? "text-[#475569]" : "text-slate-400"}`}>
                            {pInfo && <pInfo.Icon size={36} style={{ color: pInfo.color }} />}
                            <span className="text-xs">No media</span>
                          </div>
                        )}
                      </div>
                      {/* Caption */}
                      <div className={`px-4 py-2 border-b ${isdark ? "border-gray-600" : "border-gray-200"}`}>
                        <div className="flex justify-between items-center gap-2">
                          <h6 className={`font-medium text-sm truncate ${isdark ? "text-white" : ""}`}>
                            {post.caption ? post.caption.split("\n")[0].slice(0, 40) + (post.caption.length > 40 ? "..." : "") : "—"}
                          </h6>
                        </div>
                        <div className="text-[#6b7280] text-xs">{dateStr}</div>
                      </div>
                      {/* Platform + status */}
                      <div className="flex justify-between items-center gap-2 px-4 pt-3 mt-auto pb-3">
                        <div>
                          {pInfo && (
                            <span
                              className="w-8 h-8 rounded-md flex items-center justify-center"
                              style={{ backgroundColor: pInfo.color + "1a" }}
                            >
                              <pInfo.Icon size={16} style={{ color: pInfo.color }} />
                            </span>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 rounded-sm scale-90 border px-2 capitalize ${statusColor}`}>
                          <FaRegCircleCheck /> {post.status}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>

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
        <Modal
          title={
            <span className={`${isdark ? "text-white" : ""} font-semibold`}>
              Description
            </span>
          }
          className="modelset"
          closable={{ "aria-label": "Custom Close Button" }}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <div>
            <Select
              className="selectSet"
              classNames={{
                popup: { root: isdark ? "darkSelectDropdown" : "lightSelectDropdown" },
              }}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              placeholder="Select Brand"
              options={[
                { value: "1", label: "Jack" },
                { value: "2", label: "Lucy" },
                { value: "3", label: "Tom" },
              ]}
            />
            <input type="text" placeholder="Title" />
            <textarea placeholder="Write something"></textarea>
            <div className="actions-row flex-wrap gap-2">
              <div className="flex flex-wrap gap-2">
                <button className="btn-voice">
                  <MdOutlineKeyboardVoice /> Voice Typing
                </button>
                <button className="btn-upload">
                  <MdOutlineFileUpload /> Upload Image
                </button>
              </div>
              <div>
                <button className="btn-generate flex">
                  <LiaTelegramPlane /> Generate&nbsp;Post
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default DashbordPage;