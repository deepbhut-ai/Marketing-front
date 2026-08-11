"use client";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FiKey, FiSave, FiTrash2 } from "react-icons/fi";
import { LuCopy, LuCheckCheck, LuMonitor } from "react-icons/lu";
import { apiFetch, hydrateSession } from "@/lib/apiClient";
import { ConfigProvider, Modal, Select, message, theme } from "antd";

// Replace with your API data
const PROFILE = {
  name: "test user",
  phone: "",
  email: "user@user.com",
  avatarUrl: "",
};

const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const Settings = () => {
  const { isdark } = useUserContext();

  const [name, setName] = useState(PROFILE.name);
  const [phone, setPhone] = useState(PROFILE.phone);
  const [email, setEmail] = useState(PROFILE.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  // Gemini settings
  const [geminiKeyHint, setGeminiKeyHint] = useState(""); // last4 from API
  const [geminiKey, setGeminiKey] = useState("");
  const [imageModel, setImageModel] = useState("");
  const [videoModel, setVideoModel] = useState("");
  const [geminiImageModels, setGeminiImageModels] = useState([]);
  const [geminiVideoModels, setGeminiVideoModels] = useState([]);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [savingDefaults, setSavingDefaults] = useState(false);
  const [geminiError, setGeminiError] = useState("");
  const [geminiSuccess, setGeminiSuccess] = useState("");

  // Agent token state
  const [agentToken, setAgentToken] = useState(null); // { token, device_name, is_online, created_at }
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenGenerating, setTokenGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const heading = isdark ? "text-white" : "text-[#111827]";
  const muted = isdark ? "text-[#94a3b8]" : "text-[#64748b]";

  const labelCls = `block text-base mb-2 ${isdark ? "text-[#cbd5e1]" : "text-[#374151]"}`;

  const fieldCls = `w-full px-4 py-3 text-base rounded-md outline-none border transition-colors
    focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]
    ${
      isdark
        ? "bg-transparent border-[#334155] text-white placeholder:text-[#64748b]"
        : "bg-white border-[#e2e8f0] text-[#111827] placeholder:text-[#9ca3af]"
    }`;

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Restore the in-memory access token first (lost on hard reload)
      await hydrateSession();
      if (!mounted) return;
      try {
        // 1. Get Gemini status (configured, last4, default models)
        const statusData = await apiFetch("api/ai-keys/gemini");
        if (!mounted) return;
        const sData = statusData?.data || {};
        setGeminiKeyHint(sData.last4 || "");
        setImageModel(sData.default_image_model || "");
        setVideoModel(sData.default_video_model || "");

        // 2. Fetch available models list
        try {
          const modelsData = await apiFetch("api/ai-keys/gemini/models");
          if (!mounted) return;
          const mData = modelsData?.data || {};
          setGeminiImageModels(
            (mData.image_models || []).map((m) => ({
              value: m.code,
              label: m.label,
            }))
          );
          setGeminiVideoModels(
            (mData.video_models || []).map((m) => ({
              value: m.code,
              label: m.label,
            }))
          );
          // Set defaults from the models API if status didn't provide them
          if (!imageModel && mData.default_image_model) {
            setImageModel(mData.default_image_model);
          }
          if (!videoModel && mData.default_video_model) {
            setVideoModel(mData.default_video_model);
          }
        } catch {
          // models list fetch failed — dropdowns will be empty
        }

        // 3. Fetch agent token — call POST to get or create token
        try {
          const tokenData = await apiFetch("agent/token/", { method: "POST" });
          if (!mounted) return;
          if (tokenData?.data?.token) setAgentToken(tokenData.data);
        } catch {
          // token fetch failed — user can retry via Generate button
        }
      } catch (err) {
        const errData = err?.data;
        const errMsg =
          (Array.isArray(errData) && errData[0]?.message) ||
          errData?.message ||
          err?.message;
        if (errMsg) setGeminiError(errMsg);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ── Agent token handlers ───────────────────────────────────────────
  const handleGenerateToken = async () => {
    setTokenGenerating(true);
    try {
      const data = await apiFetch("agent/token/", { method: "POST" });
      const d = data?.data || {};
      setAgentToken(d);
      messageApi.success(data?.message || "Agent token generated successfully!");
    } catch (err) {
      const errMsg = err?.data?.message || err?.message || "Failed to generate agent token.";
      messageApi.error(errMsg);
    } finally {
      setTokenGenerating(false);
    }
  };

  const handleCopyToken = async () => {
    if (!agentToken?.token) return;
    try {
      await navigator.clipboard.writeText(agentToken.token);
      setCopied(true);
      messageApi.success("Token copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      messageApi.error("Failed to copy token.");
    }
  };

  const handleRemoveToken = () => {
    Modal.confirm({
      title: "Remove Agent Token",
      content: "Are you sure you want to remove this agent token? You will need to generate a new one to reconnect.",
      okText: "Remove",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        setTokenLoading(true);
        try {
          await apiFetch("agent/token/", { method: "DELETE" });
          setAgentToken(null);
          messageApi.success("Agent token removed successfully!");
        } catch (err) {
          const errMsg = err?.data?.message || err?.message || "Failed to remove agent token.";
          messageApi.error(errMsg);
        } finally {
          setTokenLoading(false);
        }
      },
    });
  };

  const handleModelChange = async (newImageModel, newVideoModel) => {
    setGeminiError("");
    setGeminiSuccess("");
    setSavingDefaults(true);
    try {
      const data = await apiFetch("api/ai-keys/gemini", {
        method: "PATCH",
        body: JSON.stringify({
          default_image_model: newImageModel,
          default_video_model: newVideoModel,
        }),
      });
      const msg = data?.message || "Default model updated.";
      setGeminiSuccess(msg);
      messageApi.success(msg);
    } catch (err) {
      const errData = err?.data;
      const errMsg =
        (Array.isArray(errData) && errData[0]?.message) ||
        errData?.message ||
        err?.message ||
        "Failed to update default model.";
      setGeminiError(errMsg);
      messageApi.error(errMsg);
    } finally {
      setSavingDefaults(false);
    }
  };

  const onPickAvatar = (e) => {
    const f = e.target.files?.[0];
    if (f) setAvatar({ file: f, url: URL.createObjectURL(f) });
  };

  const handleUpdate = () => {
    console.log({ name, phone, email, currentPassword, avatar: avatar?.file });
    // TODO: call your API
  };

  const handleSaveGeminiKey = async () => {
    if (!geminiKey.trim()) return;
    setGeminiLoading(true);
    setGeminiError("");
    setGeminiSuccess("");
    try {
      const data = await apiFetch("api/ai-keys/gemini", {
        method: "POST",
        body: JSON.stringify({ api_key: geminiKey.trim() }),
      });
      const d = data?.data || {};
      setGeminiKey("");
      setGeminiKeyHint(d.last4 || "");
      messageApi.success(data?.message || "Gemini key saved");
      if (d.validated === false) {
        messageApi.warning("Key saved but not validated yet");
      }

      // Re-fetch status to keep the UI in sync
      try {
        const statusData = await apiFetch("api/ai-keys/gemini");
        const sData = statusData?.data || {};
        setGeminiKeyHint(sData.last4 || d.last4 || "");
        setImageModel(sData.default_image_model || "");
        setVideoModel(sData.default_video_model || "");
      } catch {
        // keep the values from the POST response
      }
    } catch (err) {
      const errData = err?.data;
      const errMsg =
        (Array.isArray(errData) && errData[0]?.message) ||
        errData?.message ||
        err?.message ||
        "Failed to save Gemini API key.";
      setGeminiError(errMsg);
      messageApi.error(errMsg);
    } finally {
      setGeminiLoading(false);
    }
  };

  const handleSaveGeminiDefaults = async () => {
    setSavingDefaults(true);
    setGeminiError("");
    setGeminiSuccess("");
    try {
      const data = await apiFetch("api/ai-keys/gemini", {
        method: "PATCH",
        body: JSON.stringify({
          default_image_model: imageModel,
          default_video_model: videoModel,
        }),
      });
      const msg = data?.message || "Default Gemini models saved successfully.";
      setGeminiSuccess(msg);
      messageApi.success(msg);
    } catch (err) {
      const errData = err?.data;
      const errMsg =
        (Array.isArray(errData) && errData[0]?.message) ||
        errData?.message ||
        err?.message ||
        "Failed to save default models.";
      setGeminiError(errMsg);
      messageApi.error(errMsg);
    } finally {
      setSavingDefaults(false);
    }
  };

  const avatarSrc = avatar?.url || PROFILE.avatarUrl;

  const antdTheme = {
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
  };

  return (
    <div>
      {contextHolder}
      {/* ---------- breadcrumb ---------- */}
      <div className={`flex items-center gap-2 text-sm ${muted}`}>
        <span className="text-[#8b5cf6]">User</span>
        <MdOutlineKeyboardArrowRight />
        <span className={isdark ? "text-[#cbd5e1]" : "text-[#374151]"}>Settings</span>
      </div>

      {/* ---------- card ---------- */}
      <div
        className={`max-w-[1060px] mx-auto rounded-lg hidden p-6 sm:p-8 mt-6 ${
          isdark ? "bg-[#1e293b]" : "bg-white shadow-sm"
        }`}
      >
        <h5 className={`text-2xl font-bold ${heading}`}>Edit Profile</h5>

        {/* avatar row */}
        <div className="flex items-center gap-6 flex-wrap mt-6">
          <span className="w-[108px] h-[108px] rounded-full overflow-hidden shrink-0">
            {avatarSrc ? (
              <img src={avatarSrc} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span
                className={`w-full h-full flex items-center justify-center text-4xl ${
                  isdark ? "bg-[#e2e8f0] text-[#1e293b]" : "bg-[#e5e7eb] text-[#374151]"
                }`}
              >
                {initialsOf(name)}
              </span>
            )}
          </span>

          <div className="min-w-0">
            <label className={labelCls}>Avatar</label>
            <div
              className={`flex items-center rounded-md border overflow-hidden transition-colors
                focus-within:border-[#8b5cf6] focus-within:ring-1 focus-within:ring-[#8b5cf6]
                ${isdark ? "border-[#334155]" : "border-[#e2e8f0]"}`}
            >
              <label
                className={`px-4 py-3 text-base cursor-pointer shrink-0 ${
                  isdark ? "bg-[#2d3c4e] text-[#cbd5e1]" : "bg-[#f8fafc] text-[#475569]"
                }`}
              >
                Choose File
                <input type="file" accept="image/*" className="hidden" onChange={onPickAvatar} />
              </label>
              <span className={`px-4 py-3 text-base truncate ${isdark ? "text-[#cbd5e1]" : "text-[#374151]"}`}>
                {avatar?.file?.name ?? "No file chosen"}
              </span>
            </div>
          </div>
        </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {/* fields */}
        <div className="mt-5">
          <label className={labelCls}>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={fieldCls} />
        </div>

        <div className="mt-4">
          <label className={labelCls}>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+810 989 989 989"
            className={fieldCls}
          />
        </div>

        <div className="mt-4">
          <label className={labelCls}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldCls} />
        </div>

        <div className="mt-4">
          <label className={labelCls}>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="enter your current password"
            className={fieldCls}
          />
        </div>
        </div>

        {/* change password link */}
        <p className={`mt-4 ${isdark ? "text-[#cbd5e1]" : "text-[#374151]"}`}>
          Want to change the password?{" "}
          <Link href="/change-password" className="text-[#8b5cf6] font-semibold">
            Click here
          </Link>
        </p>

        {/* submit */}
        <button
          onClick={handleUpdate}
          className="flex items-center gap-3 mt-4 px-5 py-3 rounded-md bg-[#8b5cf6] text-white text-base
            cursor-pointer hover:bg-[#7c4fe0] transition-colors"
        >
          Update Information <FiSave size={17} />
        </button>
      </div>

      {/* ---------- Gemini API settings ---------- */}
      <div
        className={`max-w-[1060px] mx-auto rounded-lg p-6 sm:p-8 mt-6 ${
          isdark ? "bg-[#1e293b]" : "bg-white shadow-sm"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="text-[#8b5cf6]">
            <FiKey size={22} />
          </span>
          <h5 className={`text-xl font-bold ${heading}`}>Gemini API key</h5>
        </div>
        <p className={`mt-1 text-sm ${muted}`}>
          Required for AI image generation. Stored encrypted; only the last 4 characters are ever shown back.
        </p>

        {/* status banner */}
        <div
          className={`mt-5 rounded-md border px-4 py-3 text-sm ${
            geminiKeyHint
              ? isdark
                ? "border-[#334155] bg-[#0f172a]/50 text-[#94a3b8]"
                : "border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]"
              : isdark
                ? "border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#fbbf24]"
                : "border-[#f59e0b]/30 bg-[#fff7ed] text-[#b45309]"
          }`}
        >
          {geminiKeyHint
            ? `Gemini key on file ends in ••••${geminiKeyHint}. You can update it below.`
            : "No Gemini key on file yet. You need to save one before creating an AI content plan."}
        </div>

        {/* paste key */}
        <div className="mt-6">
          <label className={labelCls}>Paste your key</label>
          <div className="flex gap-3">
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder={
                geminiKeyHint
                  ? `••••••••${geminiKeyHint} (key already saved — enter new key to update)`
                  : "AIzaSy..."
              }
              className={fieldCls}
            />
            <button
              onClick={handleSaveGeminiKey}
              disabled={!geminiKey.trim() || geminiLoading}
              className="shrink-0 px-5 py-3 rounded-md bg-[#2563eb] text-white text-base
                cursor-pointer hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {geminiLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* divider */}
        <div className={`my-6 border-t ${isdark ? "border-[#334155]" : "border-[#e2e8f0]"}`} />

        {/* default models */}
        <div>
          <h6 className={`text-lg font-semibold ${heading}`}>Default Gemini models</h6>
          <p className={`mt-0.5 text-sm ${muted}`}>
            Used as the per-plan default. You can override on the New Plan form.
          </p>

          <ConfigProvider theme={antdTheme}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
            <div>
              <label className={labelCls}>Image model</label>
              <Select
                className="w-full"
                value={imageModel || undefined}
                onChange={(value) => {
                  setImageModel(value);
                  handleModelChange(value, videoModel);
                }}
                placeholder="Select image model"
                options={geminiImageModels}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>

            <div>
              <label className={labelCls}>Video model</label>
              <Select
                className="w-full"
                value={videoModel || undefined}
                onChange={(value) => {
                  setVideoModel(value);
                  handleModelChange(imageModel, value);
                }}
                placeholder="Select video model"
                options={geminiVideoModels}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>
          </div>
          </ConfigProvider>

          <div className="flex justify-end mt-5">
            <button
              onClick={handleSaveGeminiDefaults}
              disabled={savingDefaults}
              className={`flex items-center gap-3 mt-4 px-5 py-3 rounded-md bg-[#8b5cf6] text-white text-base
            cursor-pointer hover:bg-[#7c4fe0] transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {savingDefaults ? "Saving..." : "Save defaults"}
            </button>
          </div>
        </div>

        {/* feedback */}
        {geminiError && (
          <p className="mt-4 text-sm text-[#ef4444]">{geminiError}</p>
        )}
        {geminiSuccess && (
          <p className="mt-4 text-sm text-[#22c55e]">{geminiSuccess}</p>
        )}
      </div>

      {/* ---------- Agent Token section ---------- */}
      <div
        className={`max-w-[1060px] mx-auto rounded-lg p-6 sm:p-8 mt-6 ${
          isdark ? "bg-[#1e293b]" : "bg-white shadow-sm"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="text-[#8b5cf6]">
            <LuMonitor size={22} />
          </span>
          <h5 className={`text-xl font-bold ${heading}`}>Agent Token</h5>
        </div>
        <p className={`mt-1 text-sm ${muted}`}>
          Use this token to connect the MarketingIRA desktop agent to your account.
        </p>

        {agentToken?.token ? (
          <>
            {/* token display */}
            <div className="mt-5">
              <label className={labelCls}>Your Agent Token</label>
              <div className="flex gap-3 items-stretch">
                <div
                  className={`flex-1 flex items-center rounded-md border px-4 py-3 text-sm font-mono break-all ${
                    isdark
                      ? "bg-[#0f172a] border-[#334155] text-[#cbd5e1]"
                      : "bg-[#f8fafc] border-[#e2e8f0] text-[#475569]"
                  }`}
                >
                  {agentToken.token}
                </div>
                <button
                  onClick={handleCopyToken}
                  className={`shrink-0 px-4 py-3 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${
                    copied
                      ? "bg-[#22c55e] text-white"
                      : "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"
                  }`}
                >
                  {copied ? <LuCheckCheck size={18} /> : <LuCopy size={18} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* token meta */}
            <div className={`mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4`}>
              <div className={`rounded-md border px-4 py-3 ${
                isdark ? "border-[#334155] bg-[#0f172a]/50" : "border-[#e2e8f0] bg-[#f8fafc]"
              }`}>
                <p className={`text-xs ${muted}`}>Device Name</p>
                <p className={`text-sm font-medium ${isdark ? "text-white" : "text-[#374151]"}`}>
                  {agentToken.device_name || "—"}
                </p>
              </div>
              <div className={`rounded-md border px-4 py-3 ${
                isdark ? "border-[#334155] bg-[#0f172a]/50" : "border-[#e2e8f0] bg-[#f8fafc]"
              }`}>
                <p className={`text-xs ${muted}`}>Status</p>
                <p className={`text-sm font-medium flex items-center gap-1.5 ${
                  agentToken.is_online ? "text-[#22c55e]" : isdark ? "text-[#94a3b8]" : "text-[#64748b]"
                }`}>
                  <span className={`h-2 w-2 rounded-full ${
                    agentToken.is_online ? "bg-[#22c55e]" : "bg-[#94a3b8]"
                  }`} />
                  {agentToken.is_online ? "Online" : "Offline"}
                </p>
              </div>
              <div className={`rounded-md border px-4 py-3 ${
                isdark ? "border-[#334155] bg-[#0f172a]/50" : "border-[#e2e8f0] bg-[#f8fafc]"
              }`}>
                <p className={`text-xs ${muted}`}>Created At</p>
                <p className={`text-sm font-medium ${isdark ? "text-white" : "text-[#374151]"}`}>
                  {agentToken.created_at
                    ? new Date(agentToken.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
            </div>

            {/* remove button */}
            <button
              onClick={handleRemoveToken}
              disabled={tokenLoading}
              className="flex items-center gap-2 mt-6 px-5 py-3 rounded-md text-sm font-medium text-white bg-[#ef4444] hover:bg-[#dc2626] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiTrash2 size={16} /> {tokenLoading ? "Removing..." : "Remove Token"}
            </button>
          </>
        ) : (
          /* no token state */
          <div className="mt-5">
            <div
              className={`rounded-md border px-4 py-3 text-sm ${
                isdark
                  ? "border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#fbbf24]"
                  : "border-[#f59e0b]/30 bg-[#fff7ed] text-[#b45309]"
              }`}
            >
              No agent token generated yet. Click below to generate one.
            </div>
            <button
              onClick={handleGenerateToken}
              disabled={tokenGenerating}
              className="flex items-center gap-2 mt-4 px-5 py-3 rounded-md bg-[#8b5cf6] text-white text-sm font-medium cursor-pointer hover:bg-[#7c3aed] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LuMonitor size={16} /> {tokenGenerating ? "Generating..." : "Generate Token"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;