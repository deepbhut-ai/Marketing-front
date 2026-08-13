'use client';

/**
 * MarketingIRA — Login page (connected to the new auth system)
 * --------------------------------------------------------------
 * Flow:
 *   1. POSTs to this app's own /api/login — never the external API
 *      directly. /api/login talks to your Python backend server-side
 *      and sets httpOnly cookies (mk_refresh, mk_session, mk_role)
 *      that middleware.js reads.
 *   2. Access token → memory only, via lib/tokenStore.js. Never
 *      localStorage.
 *   3. Redirects to `?next=` if middleware sent the user here from a
 *      protected page, otherwise falls back to /dashboard.
 *   4. Uses router.push (client-side nav) so the in-memory access
 *      token survives the redirect instead of being wiped by a full
 *      page reload.
 * --------------------------------------------------------------
 */

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Input, Button } from 'antd';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiAlertCircle,
  FiZap,
  FiCalendar,
  FiTrendingUp,
  FiShield,
} from 'react-icons/fi';
import { setAccessToken } from '@/lib/tokenStore';

// Dependency-free math captcha. Swap for reCAPTCHA / Turnstile in
// production — the answer still flows into the API as `captcha`.
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

function detectDeviceName() {
  if (typeof navigator === 'undefined') return 'computer';
  const ua = navigator.userAgent || '';
  if (/mobile|android|iphone/i.test(ua)) return 'mobile';
  if (/ipad|tablet/i.test(ua)) return 'tablet';
  return 'computer';
}

// Glass-style input, reaching into antd's internal classnames via
// arbitrary descendant selectors so no separate CSS file is needed.
const fieldWrapperClass =
  'rounded-xl border border-white/10 bg-[#0e1729]/90 backdrop-blur-sm ' +
  'px-3 py-1 transition-all duration-200 hover:border-violet/60 ' +
  'focus-within:border-violet focus-within:bg-[#131f3a] focus-within:ring-4 focus-within:ring-violet/20 ' +
  '[&_.ant-input-prefix]:mr-2.5 [&_.ant-input-prefix]:text-violet ' +
  '[&_input]:!bg-transparent [&_input]:!border-none [&_input]:!shadow-none [&_input]:!text-sm ' +
  '[&_input]:!text-black [&_input::placeholder]:!text-slate-500';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // Start as null on both server and client to avoid a hydration
  // mismatch — Math.random() inside generateCaptcha() would otherwise
  // produce a different value during SSR vs. the client's first render.
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

    setLoading(true);
    try {
      // Same-origin call to this app's own API route — the external
      // Python API is never called directly from the browser for auth.
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          device_name: detectDeviceName(),
          captcha: values.captchaInput,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || 'Login failed. Please check your credentials.');
      }

      // Access token → memory only. Refresh token is already sitting
      // in an httpOnly cookie set by /api/login; this page never sees it.
      setAccessToken(data.access);

      // Avoid persisting auth-related values in browser storage.
      // Keep the session state server-managed and rely on the secure
      // httpOnly cookies established by /api/login.

      // Honor middleware's ?next= (e.g. /login?next=/brands) so the
      // user lands back where they were headed, not always /dashboard.
      const next = searchParams.get('next');
      const fallback = data.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      router.push(next || fallback);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh w-full grid-cols-1 md:grid-cols-2 bg-ink font-sans">
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

        <div className="relative z-10 w-full max-w-[420px] animate-rise">
          <div className="moving-border shadow-2xl shadow-black/50">
            <div className="moving-border-inner border border-white/5 px-5 py-9 sm:px-9 sm:py-5">
              <div className="mb-7">
                <h2 className="font-display text-2xl font-bold tracking-tight text-white">Welcome back</h2>
                <p className="mt-1.5 text-sm text-slate-400">
                  Log in to manage your brands, accounts, and posts.
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

              <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} initialValues={{ remember: true }}>
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
                  name="password"
                  label={<span className="text-[13px] font-semibold text-slate-200">Password</span>}
                  rules={[{ required: true, message: 'Enter your password' }]}
                  className="mb-4"
                >
                  <Input
                    prefix={<FiLock />}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    size="large"
                    className={fieldWrapperClass}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="flex text-slate-500 hover:text-violet transition-colors"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-200">
                      <FiShield size={13} className="text-brand-teal" /> Security check
                    </span>
                  }
                  required
                  className="mb-2"
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

                <div className="mb-5 flex items-center justify-end">
                  <a href="/forgotpassword" className="text-[13px] font-semibold text-violet hover:text-brand-pink transition-colors">
                    Forgot password?
                  </a>
                </div>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="btn-shine h-[46px] w-full rounded-xl border-none bg-cta-gradient bg-[length:160%_160%] text-[15px] font-semibold shadow-cta-glow transition-all duration-300 hover:!bg-cta-gradient hover:bg-right hover:-translate-y-px hover:shadow-cta-glow-hover active:translate-y-0 active:scale-[0.99]"
                  >
                    {loading ? 'Logging in…' : 'Log in'}
                  </Button>
                </Form.Item>
              </Form>

              <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
                <span className="h-px flex-1 bg-white/10" />
                New to MarketingIRA?
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <p className="text-center text-[13px] text-slate-400">
                Don&rsquo;t have an account?{' '}
                <a href="/register" className="font-semibold text-violet hover:text-brand-pink transition-colors">
                  Create one for free
                </a>
              </p>
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