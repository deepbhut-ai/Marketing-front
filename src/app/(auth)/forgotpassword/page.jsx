'use client';

/**
 * MarketingIRA — Forgot password page
 * --------------------------------------------------------------
 * Same design system as login/register — drop into
 * `app/(auth)/forgot-password/page.jsx`.
 *
 *   npm install antd react-icons
 *
 * Requires the same globals.css as login/register (.moving-border /
 * .moving-border-inner / .moving-border-card / .btn-shine).
 *
 * .env.local:
 *   NEXT_PUBLIC_API_URL=https://agents.zettalgor.com
 *
 * ENDPOINT ASSUMPTION: posts { email } to
 * `${NEXT_PUBLIC_API_URL}/accounts/forgot-password/` — I don't have
 * a Postman capture for this one like login/register, so confirm
 * the actual path/payload shape against your API and adjust
 * `FORGOT_PASSWORD_PATH` below if it differs.
 * --------------------------------------------------------------
 */

import { useState, useCallback, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import {
  FiMail,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiZap,
  FiCalendar,
  FiTrendingUp,
  FiShield,
  FiArrowLeft,
} from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
const FORGOT_PASSWORD_PATH = '/accounts/forgot-password/'; // <-- confirm against your API

// Dependency-free math captcha, same as login/register.
function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const ops = [
    { symbol: '+', fn: (x, y) => x + y },
    { symbol: '-', fn: (x, y) => Math.max(x, y) - Math.min(x, y) },
  ];
  const op = ops[Math.floor(Math.random() * ops.length)];
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  return { label: `${hi} ${op.symbol} ${lo}`, answer: String(op.fn(hi, lo)) };
}

// Same glass-input treatment as login/register — text forced black
// (with !important) to match the fix applied there.
const fieldWrapperClass =
  'rounded-xl border border-white/10 bg-[#0e1729]/90 backdrop-blur-sm ' +
  'px-3 py-1 transition-all duration-200 hover:border-violet/60 ' +
  'focus-within:border-violet focus-within:bg-[#131f3a] focus-within:ring-4 focus-within:ring-violet/20 ' +
  '[&_.ant-input-prefix]:mr-2.5 [&_.ant-input-prefix]:text-violet ' +
  '[&_input]:!bg-transparent [&_input]:!border-none [&_input]:!shadow-none [&_input]:!text-sm ' +
  '[&_input]:!text-black [&_input::placeholder]:!text-slate-500';

export default function ForgotPasswordPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const [captcha, setCaptcha] = useState(null);
  const [captchaSpin, setCaptchaSpin] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = useCallback(() => {
    setCaptchaSpin(true);
    setCaptcha(generateCaptcha());
    form.setFieldValue('captchaInput', '');
    setTimeout(() => setCaptchaSpin(false), 400);
  }, [form]);

  const onFinish = async (values) => {
    setErrorMsg('');

    if (!captcha || String(values.captchaInput).trim() !== captcha.answer) {
      setErrorMsg('Captcha answer is incorrect. Please try again.');
      refreshCaptcha();
      return;
    }

    if (!API_BASE) {
      setErrorMsg('NEXT_PUBLIC_API_URL is not set. Add it to your .env.local file.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${FORGOT_PASSWORD_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || 'Something went wrong. Please try again.');
      }

      setSentTo(values.email);
      setSent(true);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      refreshCaptcha();
    } finally {
      setLoading(false);
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
              src="/images/logos/logo-dark.svg"
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
              {!sent ? (
                <>
                  <a
                    href="/login"
                    className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-400 hover:text-violet transition-colors"
                  >
                    <FiArrowLeft size={14} /> Back to login
                  </a>

                  <div className="mb-7">
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white">Forgot your password?</h2>
                    <p className="mt-1.5 text-sm text-slate-400">
                      Enter the email on your account and we&rsquo;ll send you a link to reset it.
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

                  <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
                    <Form.Item
                      name="email"
                      label={<span className="text-[13px] font-semibold text-slate-200">Email</span>}
                      rules={[
                        { required: true, message: 'Enter your email address' },
                        { type: 'email', message: 'Enter a valid email address' },
                      ]}
                      className="mb-4"
                    >
                      <Input
                        prefix={<FiMail />}
                        placeholder="you@company.com"
                        autoComplete="email"
                        size="large"
                        className={fieldWrapperClass}
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-200">
                          <FiShield size={13} className="text-brand-teal" /> Security check
                        </span>
                      }
                      required
                      className="mb-5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="min-w-[108px] shrink-0 select-none rounded-xl border border-dashed border-white/15 bg-white/5 px-3 py-2 text-center font-display text-base font-bold tracking-wider text-slate-100"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(135deg, transparent, transparent 6px, rgba(132,87,246,0.12) 6px, rgba(132,87,246,0.12) 12px)',
                          }}
                        >
                          {captcha ? `${captcha.label} =` : '···'}
                        </span>
                        <Form.Item name="captchaInput" noStyle rules={[{ required: true, message: 'Answer the captcha' }]}>
                          <Input
                            placeholder="?"
                            size="large"
                            inputMode="numeric"
                            disabled={!captcha}
                            className={`${fieldWrapperClass} flex-1 [&_input]:!text-center`}
                          />
                        </Form.Item>
                        <button
                          type="button"
                          onClick={refreshCaptcha}
                          disabled={!captcha}
                          aria-label="Refresh captcha"
                          className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-violet hover:text-violet disabled:opacity-50 ${
                            captchaSpin ? 'rotate-180' : ''
                          }`}
                        >
                          <FiRefreshCw size={15} />
                        </button>
                      </div>
                    </Form.Item>

                    <Form.Item className="mb-0">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="btn-shine h-[46px] w-full rounded-xl border-none bg-cta-gradient bg-[length:160%_160%] text-[15px] font-semibold shadow-cta-glow transition-all duration-300 hover:!bg-cta-gradient hover:bg-right hover:-translate-y-px hover:shadow-cta-glow-hover active:translate-y-0 active:scale-[0.99]"
                      >
                        {loading ? 'Sending…' : 'Send reset link'}
                      </Button>
                    </Form.Item>
                  </Form>
                </>
              ) : (
                <div className="py-4 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-brand-teal/30 bg-brand-teal/10">
                    <FiCheckCircle size={26} className="text-brand-teal" />
                  </div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-white">Check your email</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    If an account exists for <span className="font-semibold text-slate-200">{sentTo}</span>, a password
                    reset link is on its way. It can take a minute or two to arrive.
                  </p>

                  <Button
                    onClick={() => {
                      setSent(false);
                      refreshCaptcha();
                    }}
                    className="mt-6 h-[44px] w-full rounded-xl border border-white/10 bg-white/5 text-[14px] font-semibold text-slate-200 hover:!border-violet hover:!text-violet"
                  >
                    Try a different email
                  </Button>

                  <a
                    href="/login"
                    className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-violet hover:text-brand-pink transition-colors"
                  >
                    <FiArrowLeft size={14} /> Back to login
                  </a>
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