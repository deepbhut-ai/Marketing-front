'use client';

/**
 * MarketingIRA — OTP verification page
 * --------------------------------------------------------------
 * Same design system as login/register/forgot-password — drop into
 * `app/(auth)/verify-otp/page.jsx`.
 *
 *   npm install antd react-icons
 *
 * Requires the same globals.css as the other auth pages
 * (.moving-border / .moving-border-inner / .moving-border-card /
 * .btn-shine).
 *
 * .env.local:
 *   NEXT_PUBLIC_API_URL=https://agents.zettalgor.com
 *
 * ENDPOINT ASSUMPTION: no Postman capture for this one either —
 * confirm against your API and adjust the two path constants below
 * if they differ.
 *   verify: POST { email, otp }               -> VERIFY_OTP_PATH
 *   resend: POST { email }                     -> RESEND_OTP_PATH
 *
 * Expects an `?email=` query param (e.g. linked from the
 * forgot-password flow: /verify-otp?email=you@company.com). Falls
 * back to an inline "not your email?" edit affordance if it's
 * missing.
 * --------------------------------------------------------------
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'antd';
import { FiAlertCircle, FiCheckCircle, FiZap, FiCalendar, FiTrendingUp, FiArrowLeft, FiMail } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
const VERIFY_OTP_PATH = '/accounts/verify-otp/'; // <-- confirm against your API
const RESEND_OTP_PATH = '/accounts/resend-otp/'; // <-- confirm against your API
const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds

export default function OtpVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  const inputRefs = useRef([]);

  // resend cooldown ticker
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const focusBox = (index) => {
    const el = inputRefs.current[index];
    if (el) el.focus();
  };

  const setDigitAt = (index, value) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleChange = (index, rawValue) => {
    const value = rawValue.replace(/\D/g, ''); // digits only

    if (value.length === 0) {
      setDigitAt(index, '');
      return;
    }

    if (value.length === 1) {
      setDigitAt(index, value);
      if (index < OTP_LENGTH - 1) focusBox(index + 1);
      return;
    }

    // Multiple characters landed in one box (e.g. mobile autofill) —
    // treat it the same as a paste and spread it across the boxes.
    distributeDigits(value, index);
  };

  const distributeDigits = (value, startIndex = 0) => {
    const clean = value.replace(/\D/g, '').slice(0, OTP_LENGTH - startIndex);
    if (!clean) return;

    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < clean.length; i += 1) {
        next[startIndex + i] = clean[i];
      }
      return next;
    });

    const lastFilledIndex = Math.min(startIndex + clean.length, OTP_LENGTH - 1);
    focusBox(lastFilledIndex);
  };

  const handlePaste = (index, e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    distributeDigits(pasted, index);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        setDigitAt(index, '');
      } else if (index > 0) {
        focusBox(index - 1);
        setDigitAt(index - 1, '');
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusBox(index - 1);
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      focusBox(index + 1);
    }
  };

  const code = digits.join('');
  const isComplete = code.length === OTP_LENGTH;

  const handleVerify = useCallback(async () => {
    setErrorMsg('');

    if (!isComplete) {
      setErrorMsg(`Enter all ${OTP_LENGTH} digits.`);
      return;
    }
    if (!API_BASE) {
      setErrorMsg('NEXT_PUBLIC_API_URL is not set. Add it to your .env.local file.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${VERIFY_OTP_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || 'Invalid or expired code. Please try again.');
      }

      setVerified(true);
      setTimeout(() => router.push('/login'), 1400);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setDigits(Array(OTP_LENGTH).fill(''));
      focusBox(0);
    } finally {
      setLoading(false);
    }
  }, [isComplete, code, email, router]);

  // Auto-submit the moment all 6 boxes are filled.
  useEffect(() => {
    if (isComplete && !loading && !verified) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setErrorMsg('');
    setResending(true);
    try {
      const res = await fetch(`${API_BASE}${RESEND_OTP_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || 'Could not resend the code. Please try again.');
      }
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(OTP_LENGTH).fill(''));
      focusBox(0);
    } catch (err) {
      setErrorMsg(err.message || 'Could not resend the code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="grid min-h-dvh w-full grid-cols-1 md:grid-cols-[1fr_1.15fr] bg-ink font-sans">
      {/* ---------------- Brand / motion panel ---------------- */}
      <section className="relative isolate min-h-[260px] overflow-hidden bg-ink px-7 py-10 md:px-14 md:py-12 flex flex-col justify-between text-slate-100">
        <div
          aria-hidden="true"
          className="absolute -inset-[20%] -z-20 animate-drift bg-mesh-gradient bg-[length:160%_160%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cta-gradient text-white text-xl shadow-cta-glow overflow-hidden">
            <img
              src="/icon.svg"
              alt="MarketingIRA"
              className="h-full w-full p-1"
            />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">MarketingIRA</span>
        </div>

        <div className="relative z-10 mt-0 max-w-md">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-teal/30 bg-brand-teal/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-teal">
            <FiZap size={13} /> AI-powered social suite
          </span>
          <h1 className="font-display text-[28px] md:text-[38px] font-bold leading-tight tracking-tight">
            Turn one brand into every channel.
          </h1>
          <p className="mt-3.5 text-[15px] leading-relaxed text-slate-400 hidden sm:block">
            Connect your social accounts, generate on-brand posts with AI, and
            publish immediately or schedule them for later — all from one dashboard.
          </p>
        </div>

        <div className="relative z-10 mt-9 hidden h-[118px] md:block" aria-hidden="true">
          <FloatCard className="left-[4%] top-0" delay="0s" badge="AI generated" Icon={FiZap} lines={['92%', '60%']} headWidth="70%" />
          <FloatCard className="left-[42%] top-[34px]" delay="1.4s" badge="Scheduled" Icon={FiCalendar} lines={['85%']} headWidth="80%" />
          <FloatCard className="left-[76%] top-2 w-[130px]" delay="2.6s" badge="Live now" Icon={FiTrendingUp} lines={['90%', '50%']} headWidth="65%" />
        </div>

        <div className="relative z-10 mt-6 hidden gap-7 border-t border-white/10 pt-2 md:flex">
          <Stat value="14+" label="Connected platforms" />
          <Stat value="AI" label="Post generation" />
          <Stat value="24/7" label="Auto scheduling" />
        </div>
      </section>

      {/* ---------------- Form panel ---------------- */}
      <section className="relative flex items-center justify-center overflow-hidden bg-ink-panel px-5 py-8 sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-brand-teal/10 blur-3xl"
        />

        <div className="relative z-10 w-full max-w-[500px] animate-rise">
          <div className="moving-border shadow-2xl shadow-black/50">
            <div className="moving-border-inner border border-white/5 px-6 py-9 sm:px-11 sm:py-11">
              {!verified ? (
                <>
                  <a
                    href="/login"
                    className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-400 hover:text-violet transition-colors"
                  >
                    <FiArrowLeft size={14} /> Back to login
                  </a>

                  <div className="mb-7">
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white">Verify your email</h2>
                    <p className="mt-1.5 text-sm text-slate-400">
                      {email ? (
                        <>
                          Enter the 6-digit code we sent to{' '}
                          <span className="font-semibold text-slate-200">{email}</span>.
                        </>
                      ) : (
                        'Enter the 6-digit code we sent to your email.'
                      )}
                    </p>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      errorMsg ? 'mb-4 max-h-24 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {errorMsg && (
                      <div className="flex items-center gap-2 rounded-xl border border-brand-coral/35 bg-brand-coral/10 px-3 py-2.5 text-[13px] text-brand-coral">
                        <FiAlertCircle className="shrink-0" />
                        {errorMsg}
                      </div>
                    )}
                  </div>

                  {/* ---- 6-box OTP input ---- */}
                  <div className="mb-6 flex justify-between gap-2 sm:gap-3">
                    {digits.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          inputRefs.current[i] = el;
                        }}
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={(e) => handlePaste(i, e)}
                        onFocus={(e) => e.target.select()}
                        inputMode="numeric"
                        autoComplete={i === 0 ? 'one-time-code' : 'off'}
                        maxLength={OTP_LENGTH} // allows the paste-into-one-box case; handleChange trims it
                        aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
                        className={`h-14 w-full max-w-[54px] rounded-xl border-2 text-center font-display text-2xl font-bold text-white outline-none transition-all duration-200 ${
                          digit
                            ? 'border-violet bg-[#1d2b4d] shadow-[0_0_0_4px_rgba(132,87,246,0.22)]'
                            : 'border-white/25 bg-[#18233f] hover:border-violet/60'
                        } focus:border-violet focus:bg-[#1d2b4d] focus:shadow-[0_0_0_4px_rgba(132,87,246,0.28)]`}
                      />
                    ))}
                  </div>

                  <Button
                    type="primary"
                    loading={loading}
                    disabled={!isComplete}
                    onClick={handleVerify}
                    className="btn-shine h-[46px] w-full rounded-xl border-none !bg-cta-gradient bg-[length:160%_160%] text-[15px] font-semibold !text-white shadow-cta-glow transition-all duration-300 hover:!bg-cta-gradient hover:bg-right hover:-translate-y-px hover:shadow-cta-glow-hover active:translate-y-0 active:scale-[0.99] disabled:!cursor-not-allowed disabled:!opacity-40 [&.ant-btn-disabled]:!border-none [&.ant-btn-disabled]:!bg-cta-gradient [&.ant-btn-disabled]:!text-white"
                  >
                    {loading ? 'Verifying…' : 'Verify code'}
                  </Button>

                  <p className="mt-5 text-center text-[13px] text-slate-400">
                    Didn&rsquo;t get a code?{' '}
                    {cooldown > 0 ? (
                      <span className="text-slate-500">Resend in {cooldown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resending}
                        className="font-semibold text-violet hover:text-brand-pink transition-colors disabled:opacity-50"
                      >
                        {resending ? 'Sending…' : 'Resend code'}
                      </button>
                    )}
                  </p>

                  {!email && (
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
                      <FiMail size={12} /> No email found for this link — go back and request a new code.
                    </p>
                  )}
                </>
              ) : (
                <div className="py-4 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-brand-teal/30 bg-brand-teal/10">
                    <FiCheckCircle size={26} className="text-brand-teal" />
                  </div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-white">Verified</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">Redirecting you to log in…</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FloatCard({ className = '', delay = '0s', badge, Icon, lines = [], headWidth = '70%' }) {
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
            <div key={i} className={`h-1.5 rounded bg-white/15 ${i > 0 ? 'mt-1.5' : ''}`} style={{ width: w }} />
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