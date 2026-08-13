"use client";

/**
 * MarketingIRA — Landing page
 * --------------------------------------------------------------
 * Redesigned to spotlight the product's core super-powers:
 *   • AI-generated images, videos, and post copy
 *   • One-click auto-posting across social platforms
 *   • Likes & comments analytics
 * Shares the same auth-page design system (bg-ink, bg-mesh-gradient,
 * moving-border cards, bg-cta-gradient buttons, font-display, etc.).
 * --------------------------------------------------------------
 */

import { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import Image from "next/image";
import {
  FiZap,
  FiCalendar,
  FiTrendingUp,
  FiArrowRight,
  FiCheck,
  FiMenu,
  FiX,
  FiHeart,
  FiMessageCircle,
  FiClock,
  FiImage,
  FiVideo,
  FiType,
  FiShare2,
  FiBarChart2,
} from "react-icons/fi";
import { GiMountaintop } from "react-icons/gi";
import {
  MdOutlineDashboard,
  MdOutlineAutoAwesome,
  MdOutlineSchedule,
  MdOutlineInsights,
  MdOutlineImage,
  MdOutlineVideoCameraFront,
} from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi2";

// ---------------------------------------------------------------------------
// Section data
// ---------------------------------------------------------------------------
const FEATURES = [
  {
    icon: MdOutlineAutoAwesome,
    title: "AI Content Generation",
    desc: "Generate on-brand posts, captions, and hashtags with a single prompt. Powered by GPT-4 & Gemini.",
  },
  {
    icon: MdOutlineSchedule,
    title: "Smart Scheduling",
    desc: "Publish immediately or schedule across 14+ platforms. Pick active days, time zones, and let AI pick the best slots.",
  },
  {
    icon: MdOutlineInsights,
    title: "Analytics Dashboard",
    desc: "Track engagement, reach, and conversions per post, per platform, per brand — all in real time.",
  },
  {
    icon: MdOutlineImage,
    title: "Image Editor",
    desc: "A full Fabric.js canvas editor built in. Add text, shapes, layers, and export ready-to-post visuals.",
  },
  {
    icon: MdOutlineVideoCameraFront,
    title: "AI Video Generation",
    desc: "Turn a prompt and an image into a cinematic video. Choose duration, style, and preset templates.",
  },
  {
    icon: MdOutlineDashboard,
    title: "Multi-Brand Management",
    desc: "Manage unlimited brands from one dashboard. Each brand gets its own voice, audience, and strategy.",
  },
];

const CREATE_CARDS = [
  {
    icon: FiImage,
    label: "AI Images",
    title: "Generate scroll-stopping visuals",
    desc: "Describe the scene and get unique, on-brand images ready for any social format.",
    color: "violet",
  },
  {
    icon: FiVideo,
    label: "AI Videos",
    title: "Turn ideas into short videos",
    desc: "Create cinematic clips from a prompt and an image. Choose style, length, and platform format.",
    color: "brand-pink",
  },
  {
    icon: FiType,
    label: "AI Copy",
    title: "Write captions that convert",
    desc: "Generate hashtags, hooks, and full posts tuned to your brand voice and audience.",
    color: "brand-teal",
  },
];

const STEPS = [
  { num: "01", title: "Connect your accounts", desc: "Link LinkedIn, Twitter, Facebook, Instagram and more in one click." },
  { num: "02", title: "Describe your brand", desc: "Chat with our AI assistant to set up your brand voice, audience, and goals." },
  { num: "03", title: "Generate & publish", desc: "AI creates posts, you approve, and they go live or get scheduled automatically." },
];

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$10",
    period: "/mo",
    features: ["5,000 credits", "Max 10 brands", "Max 10 social accounts", "Max 25 posts", "Image editor", "Stock library access"],
    highlighted: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$20",
    period: "/mo",
    features: ["8,000 credits", "Max 20 brands", "Max 20 social accounts", "Max 100 posts", "AI video generation", "Priority support"],
    highlighted: true,
  },
  {
    id: "advance",
    name: "Advance",
    price: "$30",
    period: "/mo",
    features: ["20,000 credits", "Unlimited brands", "Unlimited social accounts", "Unlimited posts", "Custom AI training", "Dedicated manager"],
    highlighted: false,
  },
];

const STATS = [
  { value: "14+", label: "Connected platforms" },
  { value: "AI", label: "Post generation" },
  { value: "24/7", label: "Auto scheduling" },
  { value: "50k+", label: "Posts generated" },
];

const NAV_LINKS = [
  { label: "Create", href: "#create" },
  { label: "Auto-post", href: "#autopost" },
  { label: "Analytics", href: "#analytics" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
];

const SOCIAL_LOGOS = [
  { name: "Instagram", src: "/images/instagram.svg" },
  { name: "Facebook", src: "/images/facebook.svg" },
  { name: "LinkedIn", src: "/images/linkedin.svg" },
  { name: "Twitter", src: "/images/twitter.svg" },
  { name: "TikTok", src: "/images/tiktok.svg" },
];

// ---------------------------------------------------------------------------
// Scroll-reveal hook
// ---------------------------------------------------------------------------
function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isVisible];
}

function Reveal({ children, className = "", delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={{
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable helpers
// ---------------------------------------------------------------------------
function FloatCard({ className = "", delay = "0s", badge, Icon, lines = [], headWidth = "70%" }) {
  return (
    <div className={`absolute w-[168px] animate-float ${className}`} style={{ animationDelay: delay }}>
      <div className="moving-border-card shadow-brand-lg">
        <div className="moving-border-card-inner p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-[22px] w-[22px] shrink-0 rounded-[7px] bg-cta-gradient" />
            <div className="flex-1">
              <div className="h-1.5 rounded bg-white/15" style={{ width: headWidth }} />
            </div>
          </div>
          {lines.map((w, i) => (
            <div key={i} className={`h-1.5 rounded bg-white/15 ${i > 0 ? "mt-1.5" : ""}`} style={{ width: w }} />
          ))}
          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-brand-teal">
            <Icon size={11} /> {badge}
          </span>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, eyebrowIcon: EyebrowIcon, title, subtitle }) {
  return (
    <div className="mb-12 text-center">
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet">
        {EyebrowIcon && <EyebrowIcon size={13} />} {eyebrow}
      </span>
      <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-slate-400">{subtitle}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh w-full bg-ink font-sans text-slate-100">
      {/* ====== Navbar ====== */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cta-gradient text-lg text-white shadow-cta-glow">
              <GiMountaintop />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">MarketingIRA</span>
          </div>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a href="/login">
              <button className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:text-white">
                Log in
              </button>
            </a>
            <a href="/register">
              <button className="btn-shine flex items-center gap-1.5 rounded-lg bg-cta-gradient bg-[length:160%_160%] px-4 py-2 text-sm font-semibold shadow-cta-glow transition-all duration-300 hover:bg-right hover:-translate-y-px hover:shadow-cta-glow-hover">
                Get started <FiArrowRight size={14} />
              </button>
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/5 bg-ink-panel px-5 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2">
                <a href="/login">
                  <button className="w-full rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200">
                    Log in
                  </button>
                </a>
                <a href="/register">
                  <button className="w-full rounded-lg bg-cta-gradient px-4 py-2 text-sm font-semibold shadow-cta-glow">
                    Get started
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ====== Hero ====== */}
      <section className="relative isolate overflow-hidden px-5 py-16 md:px-8 md:py-24">
        <div aria-hidden="true" className="absolute -inset-[20%] -z-20 animate-drift bg-mesh-gradient bg-[length:160%_160%]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-violet/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-brand-teal/10 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-teal/30 bg-brand-teal/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-teal">
              <FiZap size={13} /> AI-powered social suite
            </span>
            <h1 className="font-display text-[38px] font-bold leading-[1.08] tracking-tight md:text-[56px]">
              Create. Schedule. {" "}
              <span className="bg-cta-gradient bg-clip-text text-transparent">Go viral.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-400 md:text-lg">
              Generate AI images, videos, and captions, then auto-post them across every major social platform — while tracking likes, comments, and growth in real time.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
              <a href="/register">
                <button className="btn-shine flex h-[48px] items-center gap-2 rounded-xl bg-cta-gradient bg-[length:160%_160%] px-6 text-[15px] font-semibold shadow-cta-glow transition-all duration-300 hover:bg-right hover:-translate-y-px hover:shadow-cta-glow-hover active:translate-y-0 active:scale-[0.99]">
                  Start free trial <FiArrowRight size={16} />
                </button>
              </a>
              <a href="/login">
                <button className="flex h-[48px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 text-[15px] font-semibold text-slate-200 transition-all hover:border-violet/60 hover:text-white">
                  Log in
                </button>
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-500">No credit card required · 14-day free trial · Cancel anytime</p>
          </Reveal>

          <Reveal delay={200} className="relative">
            <div className="relative mx-auto max-w-xl">
              <div className="absolute inset-0 -z-10 rounded-[32px] bg-cta-gradient opacity-20 blur-3xl animate-breathe" />
              <img
                src="/images/landing/hero-dashboard.svg"
                alt="MarketingIRA AI dashboard preview"
                className="relative w-full rounded-[24px] border border-white/10 shadow-2xl shadow-black/50"
                width={800}
                height={520}
              />
              {/* Floating preview cards */}
              <div className="pointer-events-none absolute -left-6 top-8 hidden md:block" aria-hidden="true">
                <FloatCard badge="AI generated" Icon={FiZap} lines={["92%", "60%"]} headWidth="70%" delay="0s" />
              </div>
              <div className="pointer-events-none absolute -right-4 bottom-12 hidden md:block" aria-hidden="true">
                <FloatCard badge="Scheduled" Icon={FiCalendar} lines={["85%"]} headWidth="80%" delay="1.4s" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====== Stats bar ====== */}
      <section className="border-y border-white/5 bg-ink-panel/50">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 py-10 md:grid-cols-4 md:px-8">
          {STATS.map((s) => (
            <Reveal key={s.label}>
              <div className="text-center">
                <b className="block font-display text-3xl font-bold text-white">{s.value}</b>
                <span className="text-sm text-slate-400">{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ====== Social platform marquee ====== */}
      <section className="border-b border-white/5 bg-ink-panel/30 py-8">
        <Reveal>
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
            Publish everywhere your audience lives
          </p>
        </Reveal>
        <div className="relative overflow-hidden">
          <div className="marquee-track animate-marquee items-center gap-12 px-6">
            {[...SOCIAL_LOGOS, ...SOCIAL_LOGOS, ...SOCIAL_LOGOS, ...SOCIAL_LOGOS].map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex shrink-0 items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-5 py-3 transition-colors hover:border-violet/30 hover:bg-white/[0.06]"
              >
                <img src={logo.src} alt={logo.name} className="h-7 w-7 object-contain opacity-90" />
                <span className="text-sm font-medium text-slate-300">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Create anything ====== */}
      <section id="create" className="relative px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Create anything"
              eyebrowIcon={HiOutlineSparkles}
              title="One prompt. Every format."
              subtitle="From images to videos to full post copy, MarketingIRA generates every asset you need to fill your content calendar."
            />
          </Reveal>

          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <Reveal delay={100}>
              <div className="grid gap-4">
                {CREATE_CARDS.map((card) => {
                  const Icon = card.icon;
                  const colorClass =
                    card.color === "violet"
                      ? "text-violet bg-violet/10 border-violet/30 group-hover:bg-violet group-hover:text-white"
                      : card.color === "brand-pink"
                      ? "text-brand-pink bg-brand-pink/10 border-brand-pink/30 group-hover:bg-brand-pink group-hover:text-white"
                      : "text-brand-teal bg-brand-teal/10 border-brand-teal/30 group-hover:bg-brand-teal group-hover:text-white";

                  return (
                    <div
                      key={card.label}
                      className="group moving-border-card cursor-default transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="moving-border-card-inner flex items-start gap-4 p-5">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-lg transition-colors ${colorClass}`}
                        >
                          <Icon size={22} />
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.label}</span>
                          <h3 className="mt-1 font-display text-lg font-semibold text-white">{card.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-400">{card.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={200} className="relative">
              <div className="relative">
                <div className="absolute -inset-4 -z-10 rounded-[32px] bg-gradient-to-br from-violet/20 to-brand-pink/10 blur-2xl" />
                <img
                  src="/images/landing/ai-content.svg"
                  alt="AI generating images, videos, and copy"
                  className="w-full rounded-[24px] border border-white/10 bg-ink-panel/60 shadow-2xl shadow-black/40"
                  width={640}
                  height={400}
                />
              </div>
            </Reveal>
          </div>

          {/* Video AI highlight */}
          <div className="mt-16 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <Reveal delay={100} className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 -z-10 rounded-[32px] bg-gradient-to-br from-brand-teal/20 to-violet/10 blur-2xl" />
                <img
                  src="/images/landing/video-ai.svg"
                  alt="AI video generation studio"
                  className="w-full rounded-[24px] border border-white/10 bg-ink-panel/60 shadow-2xl shadow-black/40"
                  width={640}
                  height={420}
                />
              </div>
            </Reveal>
            <Reveal delay={200} className="order-1 lg:order-2">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-pink/30 bg-brand-pink/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-pink">
                <FiVideo size={13} /> AI Video Studio
              </span>
              <h3 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                Turn a single image into a scroll-stopping video
              </h3>
              <p className="mt-3 text-slate-400">
                Pick a style, describe the motion, and let AI render platform-ready videos for Reels, TikTok, Shorts, and ads — no editing skills needed.
              </p>
              <ul className="mt-5 space-y-2.5">
                {["Multiple aspect ratios", "Cinematic style presets", "Auto-captions & music suggestions"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <FiCheck className="shrink-0 text-brand-teal" size={15} /> {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====== Auto post ====== */}
      <section id="autopost" className="relative overflow-hidden border-y border-white/5 bg-ink-panel px-5 py-16 md:px-8 md:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-brand-pink/10 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-teal/30 bg-brand-teal/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-teal">
                <FiClock size={13} /> Auto Post
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                Set it once. Publish forever.
              </h2>
              <p className="mt-3 text-slate-400">
                Queue weeks of content in minutes. MarketingIRA posts at the perfect time for each platform and timezone, so your brand never goes quiet.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { icon: FiCalendar, title: "Best-time scheduling", desc: "AI recommends peak engagement windows." },
                  { icon: FiShare2, title: "Cross-platform publishing", desc: "One post, 14+ networks, zero copy-paste." },
                  { icon: FiZap, title: "Bulk upload", desc: "Upload and schedule dozens of posts at once." },
                  { icon: FiTrendingUp, title: "Smart recycling", desc: "Resurface top posts when engagement dips." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-violet/10 text-violet">
                        <Icon size={18} />
                      </div>
                      <h4 className="font-display font-semibold text-white">{item.title}</h4>
                      <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="relative">
                <div className="absolute -inset-4 -z-10 rounded-[32px] bg-gradient-to-br from-violet/20 to-brand-teal/20 blur-2xl" />
                <img
                  src="/images/landing/auto-post.svg"
                  alt="Auto post scheduling across social platforms"
                  className="w-full rounded-[24px] border border-white/10 shadow-2xl shadow-black/40"
                  width={640}
                  height={420}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====== Analytics ====== */}
      <section id="analytics" className="relative px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Analytics"
              eyebrowIcon={FiBarChart2}
              title="See what your audience loves"
              subtitle="Track likes, comments, shares, and follower growth across every connected account — then double down on what works."
            />
          </Reveal>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal delay={100} className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 -z-10 rounded-[32px] bg-gradient-to-br from-brand-pink/20 to-violet/10 blur-2xl" />
                <img
                  src="/images/landing/analytics.svg"
                  alt="Likes and comments analytics dashboard"
                  className="w-full rounded-[24px] border border-white/10 shadow-2xl shadow-black/40"
                  width={640}
                  height={420}
                />
              </div>
            </Reveal>

            <Reveal delay={200} className="order-1 lg:order-2">
              <div className="grid gap-4">
                {[
                  {
                    icon: FiHeart,
                    title: "Likes & reactions",
                    desc: "See which posts earn the most love, broken down by platform and content type.",
                    color: "brand-pink",
                  },
                  {
                    icon: FiMessageCircle,
                    title: "Comments & replies",
                    desc: "Monitor conversations, reply faster, and turn comments into community.",
                    color: "brand-teal",
                  },
                  {
                    icon: FiTrendingUp,
                    title: "Growth trends",
                    desc: "Spot rising topics, best posting times, and your fastest-growing channels.",
                    color: "violet",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const colorClass =
                    item.color === "brand-pink"
                      ? "bg-brand-pink/10 text-brand-pink"
                      : item.color === "brand-teal"
                      ? "bg-brand-teal/10 text-brand-teal"
                      : "bg-violet/10 text-violet";
                  return (
                    <div
                      key={item.title}
                      className="moving-border-card group transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="moving-border-card-inner flex items-start gap-4 p-5">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
                          <Icon size={22} />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====== Features ====== */}
      <section id="features" className="relative border-y border-white/5 bg-ink-panel/50 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Features"
              eyebrowIcon={HiOutlineSparkles}
              title="Everything you need to scale your social presence"
              subtitle="From AI generation to scheduling to analytics — MarketingIRA brings every social media tool into one unified workspace."
            />
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 80}>
                  <div className="moving-border-card group h-full transition-transform duration-300 hover:-translate-y-1">
                    <div className="moving-border-card-inner h-full p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet/10 text-violet transition-colors group-hover:bg-cta-gradient group-hover:text-white">
                        <Icon size={24} />
                      </div>
                      <h3 className="mb-2 font-display text-lg font-semibold text-white">{f.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== How it works ====== */}
      <section id="how" className="relative overflow-hidden px-5 py-16 md:px-8 md:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-brand-pink/10 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              eyebrowIcon={FiTrendingUp}
              title="Get started in three steps"
            />
          </Reveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 120}>
                <div className="relative text-center md:text-left">
                  {i < STEPS.length - 1 && (
                    <div className="absolute top-8 left-[60%] hidden h-px w-[80%] bg-gradient-to-r from-violet/40 to-transparent md:block" />
                  )}
                  <div className="relative z-10">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cta-gradient font-display text-2xl font-bold text-white shadow-cta-glow md:mx-0">
                      {step.num}
                    </div>
                    <h3 className="mb-2 font-display text-xl font-semibold text-white">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-400">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Pricing ====== */}
      <section id="pricing" className="relative border-y border-white/5 bg-ink-panel/50 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Pricing"
              title="Simple, transparent pricing"
              subtitle="Start free, upgrade when you need more. No hidden fees."
            />
          </Reveal>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 100}>
                <div className={`moving-border-card h-full ${plan.highlighted ? "ring-2 ring-violet/50" : ""}`}>
                  <div className="moving-border-card-inner flex h-full flex-col p-6">
                    {plan.highlighted && (
                      <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-cta-gradient px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                        <FiZap size={11} /> Popular
                      </span>
                    )}
                    <h3 className="font-display text-xl font-bold text-white">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-sm text-slate-400">{plan.period}</span>
                    </div>
                    <ul className="mt-5 flex-1 space-y-2.5">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2 text-sm text-slate-300">
                          <FiCheck className="shrink-0 text-brand-teal" size={15} /> {feat}
                        </li>
                      ))}
                    </ul>
                    <a href="/register" className="mt-6">
                      <button
                        className={`btn-shine flex h-[44px] w-full items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-px active:translate-y-0 active:scale-[0.99] ${
                          plan.highlighted
                            ? "bg-cta-gradient bg-[length:160%_160%] text-white shadow-cta-glow hover:bg-right hover:shadow-cta-glow-hover"
                            : "border border-white/10 bg-white/5 text-slate-200 hover:border-violet/60"
                        }`}
                      >
                        Choose {plan.name}
                      </button>
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Final CTA ====== */}
      <section className="relative isolate overflow-hidden px-5 py-16 md:px-8 md:py-24">
        <div aria-hidden="true" className="absolute -inset-[10%] -z-20 animate-drift bg-mesh-gradient bg-[length:160%_160%] opacity-60" />
        <Reveal>
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="moving-border-card shadow-2xl shadow-black/50">
              <div className="moving-border-card-inner px-6 py-12 sm:px-12">
                <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cta-gradient text-2xl text-white shadow-cta-glow animate-pulse-glow">
                  <GiMountaintop />
                </span>
                <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Ready to grow your brand?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-slate-400">
                  Join thousands of marketers using MarketingIRA to create, schedule, and analyze their social media — all powered by AI.
                </p>
                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a href="/register">
                    <button className="btn-shine flex h-[48px] items-center gap-2 rounded-xl bg-cta-gradient bg-[length:160%_160%] px-6 text-[15px] font-semibold shadow-cta-glow transition-all duration-300 hover:bg-right hover:-translate-y-px hover:shadow-cta-glow-hover active:translate-y-0 active:scale-[0.99]">
                      Create free account <FiArrowRight size={16} />
                    </button>
                  </a>
                  <a href="/login">
                    <button className="flex h-[48px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 text-[15px] font-semibold text-slate-200 transition-all hover:border-violet/60 hover:text-white">
                      Log in
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ====== Footer ====== */}
      <footer className="border-t border-white/5 bg-ink-panel px-5 py-10 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cta-gradient text-lg text-white">
                <GiMountaintop />
              </span>
              <div>
                <span className="font-display text-lg font-bold tracking-tight text-white">MarketingIRA</span>
                <p className="text-xs text-slate-500">AI-powered social media suite</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                  {link.label}
                </a>
              ))}
              <a href="/login" className="text-sm text-slate-400 transition-colors hover:text-white">Log in</a>
              <a href="/register" className="text-sm text-slate-400 transition-colors hover:text-white">Sign up</a>
            </div>
          </div>

          <div className="mt-8 border-t border-white/5 pt-6 text-center">
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} MarketingIRA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
