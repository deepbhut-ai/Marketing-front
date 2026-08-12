"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { BiGrid, BiHomeAlt } from "react-icons/bi";
import { BsImage, BsTools } from "react-icons/bs";
import { FiEdit, FiPhoneCall } from "react-icons/fi";
import { GoCreditCard, GoNote } from "react-icons/go";
import { LuLayoutGrid, LuTimerReset } from "react-icons/lu";
import { MdOutlineSettings, MdSlowMotionVideo } from "react-icons/md";
import { PiCubeTransparent, PiSubtitles } from "react-icons/pi";
import { TbDeviceImacCode } from "react-icons/tb";
import { VscGraph } from "react-icons/vsc";
import { useUserContext } from "@/context/UserContext";
import { Tooltip } from "antd";
import { usePathname } from "next/navigation";
const menuItems = [
  { label: "Dashboard",linknav:"/dashboard", icon: BiHomeAlt,  },
  { label: "Create Post",linknav:"/create-post", icon: BiHomeAlt,  },
  { label: "Upcoming Posts",linknav:"/upcoming-posts", icon: BiGrid },
  { label: "Post History", linknav:"/post-history", icon: VscGraph },
  { label: "Assets", linknav:"/assets", icon: BsImage },
  { label: "Brands", linknav:"/brands", icon: FiEdit },
  // { label: "Platforms",linknav:"/platforms", icon: LuLayoutGrid },
  // { label: "AI Tools", linknav:"/ai-tools", icon: BsTools },
  { label: "AI Generated History", linknav:"/ai-generated-history", icon: PiCubeTransparent },
  // { label: "Logs", linknav:"/logs", icon: LuTimerReset },
  // { label: "QA Dataset", linknav:"/qa-replies", icon: GoNote },
  // { label: "AI Training", linknav:"/ai-training", icon: TbDeviceImacCode },
  // { label: "Generate Video", linknav:"/videoai-generate", icon: MdSlowMotionVideo },
  // { label: "Subscription", linknav:"/subscription", icon: PiSubtitles },
  // { label: "Credits", linknav:"/credits", icon: GoCreditCard },
  // { label: "Supports", linknav:"/supports", icon: FiPhoneCall },
  { label: "Account Settings",linknav:"/settings", icon: MdOutlineSettings },
];

const Header = () => {
  const { sidebarOpen, isdark, handelDrakmode, openMobileNav, setOpenMobileNav } =
    useUserContext();
const pathname = usePathname();
  const mobileNavRef = useRef(null);
  
  return (
    <div className="header-main flex relative">
      <div
        className={`side-bar  shadow-md h-dvh flex flex-col overflow-hidden
          transition-[width] duration-300 ease-in-out
          ${sidebarOpen ? "w-56" : "w-16"} hidden lg:flex`}
      >
        <div className="ps-2 pe-3 py-2 shrink-0">
          <Image
            src="/images/logos/logo.svg"
            alt="marketing ira"
            width={200}
            height={100}
             priority
          />
        </div>

        <div className="nav_bar flex-1 min-h-0 overflow-y-auto nav_scrollbar pe-0">
          <ul className="flex flex-col gap-1">
            {menuItems.map(({ label,linknav, icon: Icon }) => {
              let isactive = pathname === linknav
              const link = (
                <Link
                  href={`${linknav}`}
                  className={` flex items-center gap-2 px-2 py-1 ${
                    sidebarOpen ? "" : "justify-center"
                  } ${ isactive ? "text-[#8b5cf6]" : ""}`}
                >
                  <span
                    className={`p-2 shrink-0 sidebar-icon${
                      isactive ? " activeliicon rounded-md " : ""
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  {sidebarOpen && (
                    <span
                      className={`whitespace-nowrap sidebar-text  transition-all duration-500 ${
                        sidebarOpen
                          ? "opacity-100"
                          : "opacity-0 w-0 overflow-hidden"
                      }`}
                    >
                      {label}
                    </span>
                  )}
                </Link>
              );

              return (
                <li
                  key={label}
                  className={`${isactive && "navli"} navnor rounded-sm   text-gray-500 ${
                    isactive && sidebarOpen ? "" : ""
                  }`}
                >
                  {sidebarOpen ? (
                    link
                  ) : (
                    <Tooltip title={label} placement="right">
                      {link}
                    </Tooltip>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* Backdrop — fades in/out and doubles as the outside-click target */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 lg:hidden
          transition-opacity duration-300 ease-in-out
          ${openMobileNav ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
        onClick={() => setOpenMobileNav(false)}
      />

      {/* Mobile nav — always mounted, slides in/out via transform for a smooth animation */}
      <div
        ref={mobileNavRef}
        className={`side-bar fixed top-0 left-0 z-50 shadow-md h-dvh flex flex-col overflow-hidden
          w-56 transition-transform duration-300 ease-in-out will-change-transform
          ${openMobileNav ? "translate-x-0" : "-translate-x-full"}
          block lg:hidden`}
      >
        <div className="ps-2 pe-3 py-2 shrink-0">
          <Image
            src="/images/logos/logo.svg"
            alt="marketing ira"
            width={200}
            height={100}
             priority
          />
        </div>

        <div className="nav_bar flex-1 min-h-0 overflow-y-auto nav_scrollbar pe-0 ms-2">
          <ul className="flex flex-col gap-1">
            {menuItems.map(({ label,linknav, icon: Icon}) => {
              let isactive = pathname === linknav
              const link = (
                <Link
                  href={`${linknav}`}
                  className={`flex items-center gap-2 px-2 py-1 ${
                    isactive ? "text-[#8b5cf6]" : ""
                  }`}
                >
                  <span
                    className={`p-2 shrink-0 sidebar-icon${
                      isactive ? " activeliicon rounded-md " : ""
                    }`}
                  >
                    <Icon size={16} />
                  </span>

                  <span className="whitespace-nowrap sidebar-text">
                    {label}
                  </span>
                </Link>
              );

              return (
                <li
                  key={label}
                  className={`${isactive && "navli"} navnor   text-gray-500`}
                >
                  {link}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;