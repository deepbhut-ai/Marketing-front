"use client";

/**
 * MarketingIRA — Landing page
 * --------------------------------------------------------------
 * Shares the exact same design system as the login & register pages:
 *   • bg-ink / bg-ink-panel dark canvas
 *   • bg-mesh-gradient + animate-drift background
 *   • moving-border / moving-border-card glass cards
 *   • bg-cta-gradient + btn-shine buttons
 *   • FloatCard + Stat helpers (same shapes as auth pages)
 *   • font-display (Space Grotesk) headings
 *   • violet / brand-teal / brand-pink / brand-coral palette
 * --------------------------------------------------------------
 */

import { useState } from "react";
import { Button } from "antd";
import {
  FiZap,
  FiCalendar,
  FiTrendingUp,
  FiShield,
  FiArrowRight,
  FiCheck,
  FiMenu,
  FiX,
} from "react-icons/fi";
import {
  GiMountaintop,
} from "react-icons/gi";
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
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
];

// ---------------------------------------------------------------------------
// Reusable helpers (same shapes as the auth pages)
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

function Stat({ value, label }) {
  return (
    <div>
      <b className="block font-display text-xl">{value}</b>
      <span className="text-xs text-slate-400">{label}</span>
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
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cta-gradient text-white text-lg shadow-cta-glow">
              <GiMountaintop />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">MarketingIRA</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
              >
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

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        {/* Mobile menu */}
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
        {/* Mesh gradient background */}
        <div
          aria-hidden="true"
          className="absolute -inset-[20%] -z-20 animate-drift bg-mesh-gradient bg-[length:160%_160%]"
        />
        {/* Noise overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        {/* Glow blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-violet/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-brand-teal/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-teal/30 bg-brand-teal/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-teal">
            <FiZap size={13} /> AI-powered social suite
          </span>

          <h1 className="font-display text-[36px] font-bold leading-[1.1] tracking-tight md:text-[56px]">
            Turn one brand into{" "}
            <span className="bg-cta-gradient bg-clip-text text-transparent">every channel.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-400 md:text-lg">
            Connect your social accounts, generate on-brand posts with AI, and publish
            immediately or schedule them for later — all from one dashboard.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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

          <p className="mt-4 text-xs text-slate-500">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>

        {/* Floating preview cards */}
        <div className="relative z-10 mx-auto mt-12 hidden h-[130px] max-w-4xl md:block" aria-hidden="true">
          <FloatCard className="left-[8%] top-0" delay="0s" badge="AI generated" Icon={FiZap} lines={["92%", "60%"]} headWidth="70%" />
          <FloatCard className="left-[42%] top-[34px]" delay="1.4s" badge="Scheduled" Icon={FiCalendar} lines={["85%"]} headWidth="80%" />
          <FloatCard className="left-[76%] top-2 w-[130px]" delay="2.6s" badge="Live now" Icon={FiTrendingUp} lines={["90%", "50%"]} headWidth="65%" />
        </div>
      </section>

      {/* ====== Stats bar ====== */}
      <section className="border-y border-white/5 bg-ink-panel/50">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 py-10 md:grid-cols-4 md:px-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <b className="block font-display text-3xl font-bold text-white">{s.value}</b>
              <span className="text-sm text-slate-400">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ====== Features ====== */}
      <section id="features" className="relative px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet">
              <HiOutlineSparkles size={13} /> Features
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to scale your social presence
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              From AI generation to scheduling to analytics — MarketingIRA brings every
              social media tool into one unified workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="moving-border-card group transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="moving-border-card-inner p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet/10 text-violet transition-colors group-hover:bg-cta-gradient group-hover:text-white">
                      <Icon size={24} />
                    </div>
                    <h3 className="mb-2 font-display text-lg font-semibold text-white">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== How it works ====== */}
      <section id="how" className="relative overflow-hidden border-y border-white/5 bg-ink-panel px-5 py-16 md:px-8 md:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-brand-pink/10 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-teal/30 bg-brand-teal/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-teal">
              <FiTrendingUp size={13} /> How it works
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Get started in three steps
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="absolute top-8 left-[60%] hidden h-px w-[80%] bg-gradient-to-r from-violet/40 to-transparent md:block" />
                )}
                <div className="relative z-10">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cta-gradient font-display text-2xl font-bold text-white shadow-cta-glow">
                    {step.num}
                  </div>
                  <h3 className="mb-2 font-display text-xl font-semibold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Pricing ====== */}
      <section id="pricing" className="relative px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet">
              Pricing
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Start free, upgrade when you need more. No hidden fees.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`moving-border-card ${plan.highlighted ? "ring-2 ring-violet/50" : ""}`}
              >
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
            ))}
          </div>
        </div>
      </section>

      {/* ====== Final CTA ====== */}
      <section className="relative isolate overflow-hidden px-5 py-16 md:px-8 md:py-24">
        <div
          aria-hidden="true"
          className="absolute -inset-[10%] -z-20 animate-drift bg-mesh-gradient bg-[length:160%_160%] opacity-60"
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="moving-border shadow-2xl shadow-black/50">
            <div className="moving-border-inner border border-white/5 px-6 py-12 sm:px-12">
              <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cta-gradient text-2xl text-white shadow-cta-glow">
                <GiMountaintop />
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                Ready to grow your brand?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-400">
                Join thousands of marketers using MarketingIRA to create, schedule, and
                analyze their social media — all powered by AI.
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
      </section>

      {/* ====== Footer ====== */}
      <footer className="border-t border-white/5 bg-ink-panel px-5 py-10 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cta-gradient text-white text-lg">
                <GiMountaintop />
              </span>
              <div>
                <span className="font-display text-lg font-bold tracking-tight text-white">MarketingIRA</span>
                <p className="text-xs text-slate-500">AI-powered social media suite</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a href="/login" className="text-sm text-slate-400 transition-colors hover:text-white">Log in</a>
              <a href="/register" className="text-sm text-slate-400 transition-colors hover:text-white">Sign up</a>
            </div>
          </div>

          <div className="mt-8 border-t border-white/5 pt-6 text-center">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} MarketingIRA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}