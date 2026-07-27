"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiBell, FiLogOut } from "react-icons/fi";
import { GoSun } from "react-icons/go";
import { TbAlignLeft } from "react-icons/tb";
import { useUserContext } from "@/context/UserContext";
import { FaMoon, FaUser } from "react-icons/fa";
import { IoMoon } from "react-icons/io5";
import Link from "next/link";
const TopBar = () => {
  const { sidebarOpen, setSidebarOpen, isdark, handelDrakmode, openMobileNav, setOpenMobileNav } =
    useUserContext();
  const [openMode, setOpenMode] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const modeRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  const handelMode = () => {
    setOpenMode(!openMode);
    setOpenNotifications(false);
    setOpenProfile(false);
  };

  const handelNotifications = () => {
    setOpenNotifications(!openNotifications);
    setOpenMode(false);
    setOpenProfile(false);
  };
  const handelProfile = () => {
    setOpenProfile(!openProfile);
    setOpenMode(false);
    setOpenNotifications(false);
  };

  /* Close any open dropdown (mode / notifications / profile) when clicking outside of it */
  useEffect(() => {
    if (!openMode && !openNotifications && !openProfile) return;

    const handleClickOutside = (event) => {
      if (
        openMode &&
        modeRef.current &&
        !modeRef.current.contains(event.target)
      ) {
        setOpenMode(false);
      }
      if (
        openNotifications &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setOpenNotifications(false);
      }
      if (
        openProfile &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [openMode, openNotifications, openProfile]);

  return (
    <div className="top-bar   shadow-md w-full h-12 flex justify-between items-center px-3 ">
      <div>
        <TbAlignLeft
          size={24}
          className={`cursor-pointer hidden lg:block ${isdark ? "text-white" : "text-black"}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <TbAlignLeft
          size={24}
          className={`cursor-pointer block lg:hidden ${isdark ? "text-white" : "text-black"}`}
          onClick={() => setOpenMobileNav(!openMobileNav)}
        />
      </div>
      <div className="flex gap-5 items-center">
        <div className="relative" ref={modeRef}>
          {!isdark ? (
            <GoSun
              size={20}
              onClick={() => handelMode()}
              className={`cursor-pointer  ${isdark ? "text-[#94a3b8]" : "text-slate-500"}`}
            />
          ) : (
            <IoMoon
              size={20}
              onClick={() => handelMode()}
              className={`cursor-pointer  ${isdark ? "text-[#94a3b8]" : "text-slate-500"}`}
            />
          )}

          <div
            className={`absolute  top-9 left-[-35px] w-[140px] inset-shadow-sm  ${isdark ? "bg-[#1e293b] text-white" : "bg-white"} border border-gray-200 rounded-md z-10  ${openMode ? "block" : "hidden"}`}
          >
            <ul className="flex flex-col gap-1">
              <li
                className={`flex gap-3 items-center ${isdark ? "hover:bg-[#334155] rounded-t-md" : "hover:bg-gray-100 rounded-t-md"} ps-3 py-1 pt-2 cursor-pointer ${!isdark && "text-[#8b5cf6]"} `}
                onClick={() => handelDrakmode(false)}
              >
                {" "}
                <GoSun size={18} /> Light
              </li>
              <li
                className={`flex gap-3 items-center ${isdark ? "hover:bg-[#334155] rounded-b-md" : "hover:bg-gray-100 rounded-b-md"} ps-3 py-1 pb-2 cursor-pointer ${isdark && "text-[#8b5cf6]"} `}
                onClick={() => handelDrakmode(true)}
              >
                <IoMoon size={18} /> Dark
              </li>
            </ul>
          </div>
        </div>
        <div className="relative" ref={notificationsRef}>
          <FiBell
            size={20}
            className={`cursor-pointer  ${isdark ? "text-[#94a3b8]" : "text-slate-500"} `}
            onClick={() => handelNotifications()}
          />
          <div
            className={`absolute  top-9 left-[-227px] w-[300px] inset-shadow-sm  ${isdark ? "bg-[#1e293b] text-white" : "bg-white "} border border-gray-200 rounded-md z-10 ${openNotifications ? "block" : "hidden"}`}
          >
            <div>
              <div
                className={`flex items-center border-b-1 ${isdark ? "border-gray-500" : "border-gray-100"} justify-between px-4 py-4`}
              >
                <h6
                  className={`text-lg font-semibold ${isdark ? "text-white" : "text-black"}`}
                >
                  Notifications
                </h6>
              </div>
              <div className="p-4 h-60">
                <ul
                  className={`flex flex-col gap-2 overflow-y-auto h-full ${isdark ? "text-white" : "text-black"}`}
                >
                  <li>No notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="relative" ref={profileRef}>
          <div onClick={()=>handelProfile()} className="relative rounded-full w-10 h-10 cursor-pointer flex justify-center items-center bg-[#e5e7eb] text-lg font-semibold">
            MI
            <span className="p-1 bg-green-500 rounded-full border-2  border-white absolute bottom-[4%] right-[1%]"></span>
          </div>
          <div
            className={`absolute  top-12 left-[-181px] w-[200px] inset-shadow-sm  ${isdark ? "bg-[#1e293b] text-white border-gray-500" : "bg-white"} border  rounded-md z-10  ${openProfile ? "block" : "hidden"}`}
          >
            <ul>
              <li  className={`flex gap-3 items-center ${isdark ? "hover:bg-[#334155] rounded-t-md" : "hover:bg-gray-100 rounded-t-md"} ps-3 py-1 pt-2  ${!isdark && "text-black"} `}>
                <div>
                  <p>Welcome Test User !</p>
                  <p>(user@user.com)</p>
                </div>
              </li>
              <li  className={`flex gap-3 items-center border-y-1 border-gray-500 ${isdark ? "hover:bg-[#334155] " : "hover:bg-gray-100 "} ps-3 py-1 pt-2 cursor-pointer ${!isdark && "text-black"} `}>
                <Link href={"/profile"} className="flex gap-3 items-center">
                  <FaUser /> Edit Profile
                </Link>
              </li>
              <li  className={`flex gap-3 items-center ${isdark ? "hover:bg-[#334155] rounded-t-md" : "hover:bg-gray-100 rounded-t-md"} ps-3 py-1 pt-2 cursor-pointer ${!isdark && "text-black"} `}>
                <div className="flex gap-3 items-center">
                  <FiLogOut /> Logout
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;