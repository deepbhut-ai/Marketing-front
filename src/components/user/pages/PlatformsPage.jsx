"use client";

import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaLinkedin, FaTwitter, FaRegImage } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";

const connections = [
  {
    id: 1,
    platform: "linkedin",
    name: "Sidney Ferreira",
    handle: "sidney.ferreira1975@outlook.com",
    avatar: null,
    connectedAs: "User",
  },
  {
    id: 2,
    platform: "linkedin",
    name: "Sneha Patel",
    handle: "sneha@tecobytes.in",
    avatar: null,
    connectedAs: "User",
  },
  {
    id: 3,
    platform: "twitter",
    name: "smart leader",
    handle: "smartleader2025",
    avatar: null,
    connectedAs: "User",
  },
  {
    id: 4,
    platform: "linkedin",
    name: "John Dsouza",
    handle: "skvidyabhaban@gmail.com",
    avatar: null,
    connectedAs: "User",
  },
  {
    id: 5,
    platform: "linkedin",
    name: "Sebastian Hills",
    handle: "officialsebastianhills@gmail.com",
    avatar: null,
    connectedAs: "User",
  },
  {
    id: 6,
    platform: "twitter",
    name: "Ambrose Iorshile",
    handle: "big_brose",
    avatar: "/images/avatar-ambrose.jpg",
    connectedAs: "User",
  },
  {
    id: 7,
    platform: "twitter",
    name: "Ritesh Darode",
    handle: "rdarode13",
    avatar: null,
    initials: "R",
    connectedAs: "User",
  },
  {
    id: 8,
    platform: "linkedin",
    name: "Ritesh Darode",
    handle: "rdarode13@gmail.com",
    avatar: null,
    connectedAs: "User",
  },
];

const PLATFORM_META = {
  linkedin: { label: "Linkedin", Icon: FaLinkedin, color: "text-[#0A66C2]" },
  twitter: { label: "Twitter", Icon: FaTwitter, color: "text-[#1DA1F2]" },
};

const Avatar = ({ conn, isdark }) => {
  if (conn.avatar) {
    return (
      <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden relative">
        <Image src={conn.avatar} alt={conn.name} fill className="object-cover" />
      </div>
    );
  }
  if (conn.initials) {
    return (
      <div className="h-9 w-9 shrink-0 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-sm font-semibold">
        {conn.initials}
      </div>
    );
  }
  return (
    <div
      className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${
        isdark ? "bg-[#334155]" : "bg-gray-100"
      }`}
    >
      <FaRegImage className={isdark ? "text-gray-500" : "text-gray-400"} size={14} />
    </div>
  );
};

const PlatformsTable = ({ isdark }) => (
  <div className={`w-full overflow-x-auto rounded-sm mt-5 ${isdark ? "bg-[#1e293b]" : "bg-white"} p-2`}>
    <table className="w-full min-w-[820px] border-separate border-spacing-0">
      <thead>
        <tr>
          {["Platform", "Details", "Connected As", "Action"].map((head, i) => (
            <th
              key={head}
              className={`px-4 py-3 text-sm font-semibold border-b ${
                i === 3 ? "text-right" : "text-left"
              } ${isdark ? "text-white border-[#d2d7e04d]" : "text-[#1e293b] border-[#e2e8f0]"}`}
            >
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {connections.map((conn) => {
          const meta = PLATFORM_META[conn.platform];
          const PlatformIcon = meta.Icon;
          return (
            <tr key={conn.id} className={`border-t ${isdark ? "border-[#334155]" : "border-gray-100"}`}>
              <td className={`px-4 py-2 align-middle whitespace-nowrap border-b ${isdark ?"border-[#d2d7e04d]":"border-[#e2e8f0]"}`}>
                <div className={`flex items-center gap-2 text-sm ${isdark ? "text-gray-300" : "text-gray-700"}`}>
                  <PlatformIcon className={meta.color} size={16} />
                  {meta.label}
                </div>
              </td>
              <td className={`px-4 py-2 align-middle border-b ${isdark ?"border-[#d2d7e04d]":"border-[#e2e8f0]"}`}>
                <div className="flex items-center gap-3">
                  <Avatar conn={conn} isdark={isdark} />
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${isdark ? "text-gray-100" : "text-[#1e293b]"}`}>
                      {conn.name}
                    </p>
                    <p className={`text-xs truncate ${isdark ? "text-gray-400" : "text-gray-500"}`}>
                      ({conn.handle})
                    </p>
                  </div>
                </div>
              </td>
              <td className={`px-4 py-2 align-middle border-b ${isdark ?"border-[#d2d7e04d]":"border-[#e2e8f0]"}`}>
                <span className="inline-flex items-center rounded-full bg-[#8b5cf6] px-4 py-1.5 text-xs font-medium text-white">
                  {conn.connectedAs}
                </span>
              </td>
              <td className={`px-4 py-2 align-middle text-right border-b ${isdark ?"border-[#d2d7e04d]":"border-[#e2e8f0]"}`}>
                <button
                  type="button"
                  onClick={() => console.log("disconnect", conn.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#ef4444] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#dc2626] transition-colors"
                >
                  <IoCloseCircle size={14} />
                  Disconnect
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const PlatformsPage = () => {
  const { isdark } = useUserContext();
  return (
    <div>
      <div
        className={`flex items-center gap-2 text-sm  ${isdark ? "text-[#64748b]" : "text-[#64748b]"}`}
      >
        <span className="text-[#8b5cf6]">User</span>{" "}
        <MdOutlineKeyboardArrowRight /> <span>Platforms</span>
      </div>
      <div
        className={` shadow-sm rounded-lg border mt-5 px-3 py-2 flex items-center  ${isdark ? "bg-[#1e293b] border-gray-600" : "bg-white border-gray-200"}`}
      >
        <div>
          <h6
            className={`text-lg me-2  ${isdark ? "text-white" : "text-[#475569]"}`}
          >
            Connect :
          </h6>
        </div>
        <div>
          <button className=" rounded-lg  py-3 hover:bg-gray-700 dark:hover:bg-gray-700 sm:px-6">
            {" "}
            <Image
              src={"/images/facebook.svg"}
              alt=""
              height={100}
              width={100}
              className="w-5 h-5"
            />{" "}
          </button>
          <button className=" rounded-lg  py-3 hover:bg-gray-700 dark:hover:bg-gray-700 sm:px-6">
            {" "}
            <Image
              src={"/images/instagram.svg"}
              alt=""
              height={100}
              width={100}
              className="w-5 h-5"
            />{" "}
          </button>
          <button className=" rounded-lg  py-3 hover:bg-gray-700 dark:hover:bg-gray-700 sm:px-6">
            {" "}
            <Image
              src={"/images/twitter.svg"}
              alt=""
              height={100}
              width={100}
              className="w-5 h-5"
            />{" "}
          </button>
          <button className=" rounded-lg  py-3 hover:bg-gray-700 dark:hover:bg-gray-700 sm:px-6">
            {" "}
            <Image
              src={"/images/linkedin.svg"}
              alt=""
              height={100}
              width={100}
              className="w-5 h-5"
            />{" "}
          </button>
          <button className=" rounded-lg  py-3 hover:bg-gray-700 dark:hover:bg-gray-700 sm:px-6">
            {" "}
            <Image
              src={"/images/tiktok.svg"}
              alt=""
              height={100}
              width={100}
              className="w-5 h-5"
            />{" "}
          </button>
        </div>
      </div>

      <PlatformsTable isdark={isdark} />
    </div>
  );
};

export default PlatformsPage;