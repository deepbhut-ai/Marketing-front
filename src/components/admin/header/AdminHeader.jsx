"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { BiCategory, BiGrid, BiHomeAlt } from "react-icons/bi";
import { BsChatSquareText, BsImage, BsTools } from "react-icons/bs";
import { FiEdit, FiPhoneCall, FiUsers } from "react-icons/fi";
import { GoCreditCard, GoNote } from "react-icons/go";
import { LuLayoutGrid, LuTimerReset } from "react-icons/lu";
import {
  MdApi,
  MdArticle,
  MdGroups,
  MdHelpOutline,
  MdKeyboardArrowDown,
  MdLanguage,
  MdLink,
  MdLogin,
  MdOutlineAdminPanelSettings,
  MdOutlineBookmarks,
  MdOutlineCookie,
  MdOutlineExtension,
  MdOutlineNotifications,
  MdOutlinePayment,
  MdOutlinePhotoLibrary,
  MdOutlineQuestionAnswer,
  MdOutlineSettings,
  MdOutlineSettingsSuggest,
  MdOutlineWebAsset,
  MdRateReview,
  MdSchedule,
  MdSearch,
  MdSlowMotionVideo,
  MdSystemUpdate,
  MdWorkOutline,
} from "react-icons/md";
import { PiCubeTransparent, PiSubtitles } from "react-icons/pi";
import { TbDeviceImacCode, TbTemplate } from "react-icons/tb";
import { VscGraph } from "react-icons/vsc";
import { useUserContext } from "@/context/UserContext";
import { Tooltip } from "antd";
import { usePathname } from "next/navigation";

// ---------------------------------------------------------------------------
// Sidebar navigation data
// Each section has a title + items. An item with `children` renders as a
// collapsible group. Update paths/icons here — no JSX changes needed.
// ---------------------------------------------------------------------------
const NAV_SECTIONS = [
  {
    title: "Dashboard",
    items: [{ label: "Dashboard", linknav: "/admin/dashboard", icon: BiHomeAlt }],
  },
  {
    title: "SocialAI",
    items: [
      {
        label: "Brands",
        linknav: "/brands",
        icon: FiEdit,
        children: [
          { label: "Categories", linknav: "/admin/brand-categories" },
          { label: "Slogans", linknav: "/admin/brand-slogans" },
          { label: "Logos", linknav: "/admin/brand-logos" },
          { label: "Identity", linknav: "/brands/identity" },
          { label: "Audience", linknav: "/brands/audience" },
          { label: "Strategy", linknav: "/brands/strategy" },
          { label: "Voices", linknav: "/brands/voices" },
        ],
      },
      { label: "Designs", linknav: "/admin/designs", icon: BsImage },
      { label: "AI Prompts Settings", linknav: "/admin/ai-prompts-settings", icon: BsChatSquareText },
    ],
  },
  {
    title: "AI Templates",
    items: [
      { label: "AI Templates", linknav: "/admin/ai-templates", icon: TbTemplate },
      { label: "AI Generated History", linknav: "/ai-generated-history", icon: PiCubeTransparent },
      { label: "AI Templates Languages", linknav: "/admin/ai-templates-languages", icon: MdLanguage },
    ],
  },
  {
    title: "SaaS",
    items: [
      { label: "Users", linknav: "/admin/users", icon: FiUsers },
      { label: "User Logs", linknav: "/admin/user-logs", icon: LuTimerReset },
      { label: "Posts", linknav: "/admin/posts", icon: GoNote },
      { label: "Assets", linknav: "/assets", icon: BsImage },
      { label: "Platforms", linknav: "/platforms", icon: LuLayoutGrid },
      { label: "Credit Logs", linknav: "/admin/credit-logs", icon: GoCreditCard },
      { label: "Subscriptions", linknav: "/subscription", icon: PiSubtitles },
      { label: "Payment Gateways", linknav: "/admin/payment-gateways", icon: MdOutlinePayment },
      { label: "Cron Jobs", linknav: "/admin/cron-jobs", icon: MdSchedule },
      { label: "Help & Support", linknav: "/supports", icon: MdHelpOutline },
      { label: "Notifications", linknav: "/admin/notifications", icon: MdOutlineNotifications },
    ],
  },
  {
    title: "Appearance",
    items: [
      { label: "Services", linknav: "/admin/services", icon: BiGrid },
      { label: "Service Categories", linknav: "/admin/service-categories", icon: BiCategory },
      { label: "Career", linknav: "/admin/career", icon: MdWorkOutline },
      { label: "Blogs", linknav: "/admin/blogs", icon: MdArticle },
      { label: "Category", linknav: "/admin/category", icon: BiCategory },
      { label: "Faq", linknav: "/admin/faq", icon: MdOutlineQuestionAnswer },
      { label: "Integrations", linknav: "/admin/integrations", icon: MdOutlineExtension },
      { label: "Testimonials", linknav: "/admin/testimonials", icon: MdRateReview },
      { label: "Team", linknav: "/admin/team", icon: MdGroups },
    ],
  },
  {
    title: "Site Settings",
    items: [
      { label: "Custom Pages", linknav: "/admin/custom-pages", icon: MdOutlineWebAsset },
      { label: "Seo Settings", linknav: "/admin/seo-settings", icon: MdSearch },
      { label: "Page Settings", linknav: "/admin/page-settings", icon: MdArticle },
      {
        label: "Admin And Role",
        linknav: "/admin/admin-and-role",
        icon: MdOutlineAdminPanelSettings,
        children: [
          { label: "Admin", linknav: "/admin/admin-and-role/admin" },
          { label: "Roles", linknav: "/admin/admin-and-role/roles" },
        ],
      },
      { label: "Developer Settings", linknav: "/admin/developer-settings", icon: TbDeviceImacCode },
    ],
  },
  {
    title: "Profile Settings",
    items: [{ label: "Profile Settings", linknav: "/profile", icon: MdOutlineSettings }],
  },
  {
    title: "Social Links",
    items: [
      { label: "Social Profiles", linknav: "/admin/social-profiles", icon: FiUsers },
      { label: "Social Links", linknav: "/admin/social-links", icon: MdLink },
      { label: "Professions", linknav: "/admin/professions", icon: MdWorkOutline },
    ],
  },
  {
    title: "Video AI",
    items: [
      { label: "Configuration", linknav: "/admin/videoai/config", icon: MdOutlineSettingsSuggest },
      { label: "Prompt Presets", linknav: "/admin/videoai/prompt-presets", icon: MdOutlineBookmarks },
      { label: "Ai Api Setting", linknav: "/admin/videoai/api-setting", icon: MdApi },
      { label: "Stock Media Settings", linknav: "/admin/videoai/stock-media-settings", icon: MdOutlinePhotoLibrary },
      { label: "Social Login Settings", linknav: "/admin/videoai/social-login-settings", icon: MdLogin },
      { label: "Cookie Settings", linknav: "/admin/videoai/cookie-settings", icon: MdOutlineCookie },
      { label: "App Update", linknav: "/admin/videoai/app-update", icon: MdSystemUpdate },
      { label: "Generate Video", linknav: "/videoai-generate", icon: MdSlowMotionVideo },
    ],
  },
];

// ---------------------------------------------------------------------------
// Class-name helper — the single source of truth for the navli / navnor
// combination, so the "undefined"/"false" string-leak bug can't come back.
//   - navli  -> applied whenever the row is active (route match)
//   - navnor -> applied for hover styling, but suppressed while a parent
//               row is open (so hovering an expanded "Brands" doesn't
//               re-trigger the hover background)
// ---------------------------------------------------------------------------
const liClass = ({ active, open = false, isParent = false }) =>
  [
    "rounded-sm",
    "px-2",
    "py-1",
    "text-gray-500",
    active && "navli",
    isParent ? !open && "navnor" : "navnor",
  ]
    .filter(Boolean)
    .join(" ");

const findOpenParent = (pathname) =>
  NAV_SECTIONS.flatMap((s) => s.items)
    .filter((i) => i.children)
    .find((i) => i.children.some((c) => c.linknav === pathname));

const AdminHeader = () => {
  const { sidebarOpen, isdark, handleDarkMode, openMobileNav, setOpenMobileNav } =
    useUserContext();
  const pathname = usePathname();
  const mobileNavRef = useRef(null);

  const [openMenu, setOpenMenu] = useState(() => findOpenParent(pathname)?.label ?? null);

  useEffect(() => {
    const parent = findOpenParent(pathname);
    if (parent) setOpenMenu(parent.label);
  }, [pathname]);

  const renderNav = ({ sidebarOpen, onNavigate }) => (
    <ul className="flex flex-col gap-1">
      {NAV_SECTIONS.map((section) => (
        <React.Fragment key={section.title}>
          {sidebarOpen && (
            <p className="sidebar-text px-2 mt-3 mb-1 text-[11px] uppercase tracking-wide opacity-70">
              {section.title}
            </p>
          )}

          {section.items.map(({ label, linknav, icon: Icon, children }) => {
            // Only the item's OWN route lights up its pill/background.
            // A child route being active should never paint the parent's
            // whole block purple — it should just keep the group open
            // (handled separately by `openMenu` / findOpenParent below)
            // and let the matching child highlight itself.
            const isactive = pathname === linknav;
            const isOpen = openMenu === label;

            const iconSpan = (
              <span className={`p-2 shrink-0 sidebar-icon${isactive ? " activeliicon rounded-md " : ""}`}>
                <Icon size={16} />
              </span>
            );

            const textSpan = sidebarOpen && (
              <span
                className={`whitespace-nowrap sidebar-text transition-all duration-500 ${
                  sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                {label}
              </span>
            );

            // --- Parent item with a submenu -------------------------------
            if (children) {
              const trigger = (
                <button
                  type="button"
                  onClick={() => sidebarOpen && setOpenMenu(isOpen ? null : label)}
                  className={`w-full flex items-center gap-2 ${sidebarOpen ? "" : "justify-center"} ${
                    isactive ? "text-[#8b5cf6]" : ""
                  }`}
                >
                  {iconSpan}
                  {textSpan}
                  {sidebarOpen && (
                    <MdKeyboardArrowDown
                      size={16}
                      className={`ms-auto shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              );

              return (
                <li key={label} className={liClass({ active: isactive, open: isOpen, isParent: true })}>
                  {sidebarOpen ? trigger : <Tooltip title={label} placement="right">{trigger}</Tooltip>}

                  {sidebarOpen && isOpen && (
                    <ul className="mt-1 ml-4 pl-4 flex flex-col gap-1">
                      {children.map((child) => {
                        const childActive = pathname === child.linknav;
                        return (
                          <li key={child.label} className={liClass({ active: childActive })}>
                            <Link
                              href={child.linknav}
                              onClick={onNavigate}
                              className={`block whitespace-nowrap sidebar-text text-sm ${
                                childActive ? "text-[#8b5cf6]" : ""
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            // --- Plain leaf item -------------------------------------------
            const link = (
              <Link
                href={linknav}
                onClick={onNavigate}
                className={`flex items-center gap-2 ${sidebarOpen ? "" : "justify-center"} ${
                  isactive ? "text-[#8b5cf6]" : ""
                }`}
              >
                {iconSpan}
                {textSpan}
              </Link>
            );

            return (
              <li key={label} className={liClass({ active: isactive })}>
                {sidebarOpen ? link : <Tooltip title={label} placement="right">{link}</Tooltip>}
              </li>
            );
          })}
        </React.Fragment>
      ))}
    </ul>
  );

  return (
    <div className="header-main flex relative">
      {/* Desktop sidebar */}
      <div
        className={`side-bar shadow-md h-dvh flex flex-col overflow-hidden
          transition-[width] duration-300 ease-in-out
          ${sidebarOpen ? "w-72" : "w-16"} hidden lg:flex`}
      >
        <div className={`shrink-0 flex ${sidebarOpen ? "px-4 py-3" : "p-2 justify-center"}`}>
          {sidebarOpen ? (
            <Image
              src={isdark ? "/images/logos/logo-dark.svg" : "/images/logos/logo.svg"}
              alt="marketing ira"
              width={248}
              height={56}
              className="h-11 w-auto object-contain"
              priority
              unoptimized
            />
          ) : (
            <Image
              src="/icon.svg"
              alt="marketing ira"
              width={48}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          )}
        </div>
        <div className="nav_bar flex-1 min-h-0 overflow-y-auto nav_scrollbar pe-0">
          {renderNav({ sidebarOpen, onNavigate: undefined })}
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

      {/* Mobile sidebar — always mounted, slides in/out via transform */}
      <div
        ref={mobileNavRef}
        className={`side-bar fixed top-0 left-0 z-50 shadow-md h-dvh flex flex-col overflow-hidden
          w-72 transition-transform duration-300 ease-in-out will-change-transform
          ${openMobileNav ? "translate-x-0" : "-translate-x-full"} block lg:hidden`}
      >
        <div className="px-4 py-3 shrink-0">
          <Image
            src={isdark ? "/images/logos/logo-dark.svg" : "/images/logos/logo.svg"}
            alt="marketing ira"
            width={248}
            height={56}
            className="h-11 w-auto object-contain"
            priority
            unoptimized
          />
        </div>
        <div className="nav_bar flex-1 min-h-0 overflow-y-auto nav_scrollbar pe-0 ms-2">
          {renderNav({ sidebarOpen: true, onNavigate: () => setOpenMobileNav(false) })}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;