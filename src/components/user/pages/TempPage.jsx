"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ConfigProvider, Select, Button, Input, Form, message, Spin, Card, Typography, Divider, theme } from "antd";
import { useUserContext } from "@/context/UserContext";
import { getAccessToken } from "@/lib/tokenStore";
import { apiFetch, hydrateSession } from "@/lib/apiClient";
import Image from "next/image";
import { FiImage, FiType, FiSend, FiCpu } from "react-icons/fi";

const { TextArea } = Input;
const { Title, Text } = Typography;

const PLATFORM_OPTIONS = [
  { label: "Instagram", value: "instagram" },
  { label: "Facebook", value: "facebook" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Twitter", value: "twitter" },
];

const CONTENT_TYPE_OPTIONS = [
  { label: "Post", value: "post" },
  { label: "Story", value: "story" },
  { label: "Ad", value: "ad" },
];

const TONE_OPTIONS = [
  { label: "Friendly", value: "friendly" },
  { label: "Professional", value: "professional" },
  { label: "Bold", value: "bold" },
  { label: "Playful", value: "playful" },
];

const LANGUAGE_OPTIONS = [
  { label: "English", value: "English" },
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const CreatePost = () => {
  const { isdark } = useUserContext();
  const [form] = Form.useForm();
  const [currentStage, setCurrentStage] = useState("text");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [stageOneCompleted, setStageOneCompleted] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const ok = await hydrateSession();
        if (!active) return;
        if (!ok) {
          setErrorMessage("Session expired. Please log in again.");
        }
      } catch {
        if (active) {
          setErrorMessage("Unable to restore your session. Please log in again.");
        }
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const themeToken = useMemo(
    () => ({
      colorBgContainer: isdark ? "#111827" : "#ffffff",
      colorText: isdark ? "#f9fafb" : "#111827",
      colorTextSecondary: isdark ? "#cbd5e1" : "#475569",
      colorBorder: isdark ? "#334155" : "#e2e8f0",
      colorPrimary: "#8b5cf6",
      colorPrimaryHover: "#7c3aed",
      borderRadius: 12,
      controlHeight: 42,
    }),
    [isdark]
  );

  const selectTheme = useMemo(
    () => ({
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
    }),
    [isdark]
  );

  const extractErrorMessage = (error) => {
    const data = error?.data;

    if (Array.isArray(data)) {
      const first = data[0];
      if (first?.message) return first.message;
    }

    if (data?.message) return data.message;
    if (data?.detail) return data.detail;
    if (error?.message) return error.message;

    return "Something went wrong.";
  };

  const onSubmit = async (values) => {
    if (!API_URL) {
      messageApi.error("API URL is not configured. Please add NEXT_PUBLIC_API_URL.");
      return;
    }

    setLoading(true);
    setResult(null);
    setErrorMessage("");

    try {
      const sessionReady = await hydrateSession();
      const accessToken = getAccessToken();

      if (!sessionReady || !accessToken) {
        throw new Error("Authentication token is missing. Please log in again and try once more.");
      }

      const endpoint = currentStage === "image" ? "posts/generate-image/" : "posts/generate-content/";
      const body =
        currentStage === "image"
          ? {
              text: values.text,
              platform: values.platform,
            }
          : {
              text: values.text,
              platform: values.platform,
              content_type: values.content_type,
              tone: values.tone,
              language: values.language,
            };

      const payload = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      const generatedData = payload?.data || payload;
      setResult(generatedData);

      if (currentStage === "text") {
        setStageOneCompleted(true);
      }

      messageApi.success(
        currentStage === "image" ? "Image generation request completed." : "Content generated successfully."
      );
      form.resetFields(["text"]);
    } catch (error) {
      const msg = extractErrorMessage(error);
      setErrorMessage(msg);
      messageApi.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const resultCard = result ? (
    <Card
      className="mt-6"
      style={{
        background: isdark ? "#111827" : "#ffffff",
        borderColor: isdark ? "#334155" : "#e2e8f0",
      }}
    >
      <Title level={4} style={{ color: isdark ? "#f8fafc" : "#0f172a", marginBottom: 8 }}>
        {currentStage === "image" ? "Image generation result" : "Generated content"}
      </Title>

      {currentStage === "image" ? (
        <div className="space-y-3">
          <Text style={{ color: isdark ? "#cbd5e1" : "#475569" }}>
            {result?.message || result?.caption || "Your generated image details will appear here."}
          </Text>
          {result?.image_url || result?.url ? (
            <div className="overflow-hidden rounded-xl border" style={{ borderColor: isdark ? "#334155" : "#e2e8f0" }}>
              <Image
                src={result.image_url || result.url}
                alt="Generated visual"
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
              />
            </div>
          ) : null}
          {Array.isArray(result) ? (
            <div className="space-y-2">
              {result.map((item, index) => (
                <div key={index} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: isdark ? "#334155" : "#e2e8f0" }}>
                  {item?.message || JSON.stringify(item)}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <Text style={{ color: isdark ? "#cbd5e1" : "#475569" }}>
            {result.caption || "No caption generated."}
          </Text>
          <Divider />
          <div className="space-y-2">
            <Text strong style={{ color: isdark ? "#f8fafc" : "#0f172a" }}>
              Hashtags
            </Text>
            <div style={{ color: isdark ? "#cbd5e1" : "#475569" }}>{result.hashtags || "—"}</div>
          </div>
          <Divider />
          <div>
            <Text strong style={{ color: isdark ? "#f8fafc" : "#0f172a" }}>
              Suggestions
            </Text>
            <div style={{ color: isdark ? "#cbd5e1" : "#475569" }}>{result.suggestions || "—"}</div>
          </div>
        </>
      )}
    </Card>
  ) : null;

  return (
    <ConfigProvider theme={{ token: themeToken, ...selectTheme }}>
      {contextHolder}
      <div className={`min-h-screen px-4 py-6 md:px-8 ${isdark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Title level={2} style={{ color: isdark ? "#f8fafc" : "#0f172a", marginBottom: 4 }}>
                Create Post
              </Title>
              <Text style={{ color: isdark ? "#cbd5e1" : "#475569" }}>
                Generate polished social content quickly with secure, optimized requests.
              </Text>
            </div>
            <div className={`rounded-full border px-3 py-1 text-sm ${isdark ? "border-violet-500/30 bg-violet-500/10 text-violet-200" : "border-violet-200 bg-violet-50 text-violet-700"}`}>
              <FiCpu className="mr-2 inline" /> AI-powered content assistant
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card
              className="shadow-sm"
              style={{
                background: isdark ? "#111827" : "#ffffff",
                borderColor: isdark ? "#334155" : "#e2e8f0",
              }}
            >
              {errorMessage ? (
                <div className={`mb-4 rounded-lg border px-3 py-2 text-sm ${isdark ? "border-rose-500/30 bg-rose-500/10 text-rose-200" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                  {errorMessage}
                </div>
              ) : null}

              <div className="mb-4 flex flex-wrap gap-2">
                <Button
                  type={currentStage === "text" ? "primary" : "default"}
                  icon={<FiType />}
                  onClick={() => {
                    setCurrentStage("text");
                    setErrorMessage("");
                    setResult(null);
                  }}
                >
                  Stage 1 - Text Content
                </Button>
                <Button
                  type={currentStage === "image" ? "primary" : "default"}
                  icon={<FiImage />}
                  disabled={!stageOneCompleted}
                  onClick={() => {
                    setCurrentStage("image");
                    setErrorMessage("");
                    setResult(null);
                  }}
                >
                  Stage 2 - Image Generation
                </Button>
              </div>

              <Form form={form} layout="vertical" onFinish={onSubmit} initialValues={{ platform: "instagram", content_type: "post", tone: "friendly", language: "English" }}>
                <Form.Item label="Platform" name="platform" rules={[{ required: true, message: "Please select a platform" }]}>
                  <Select options={PLATFORM_OPTIONS} placeholder="Select platform" />
                </Form.Item>

                {currentStage === "image" ? (
                  <>
                    <div className="mb-3 rounded-xl border border-dashed px-3 py-3 text-sm" style={{ borderColor: isdark ? "#475569" : "#cbd5e1", color: isdark ? "#cbd5e1" : "#475569" }}>
                      This stage sends the payload to the image API with the prompt and platform you choose.
                    </div>
                    <Form.Item label="Image Prompt" name="text" rules={[{ required: true, message: "Please enter an image prompt" }]}>
                      <TextArea rows={6} placeholder="Example: Launching our new organic skincare line with a soft pastel look and a modern skincare bottle." />
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <Form.Item label="Content Type" name="content_type" rules={[{ required: true, message: "Please select content type" }]}>
                      <Select options={CONTENT_TYPE_OPTIONS} placeholder="Select content type" />
                    </Form.Item>

                    <Form.Item label="Tone" name="tone" rules={[{ required: true, message: "Please select a tone" }]}>
                      <Select options={TONE_OPTIONS} placeholder="Select tone" />
                    </Form.Item>

                    <Form.Item label="Language" name="language" rules={[{ required: true, message: "Please select a language" }]}>
                      <Select options={LANGUAGE_OPTIONS} placeholder="Select language" />
                    </Form.Item>

                    <Form.Item label="Prompt / Topic" name="text" rules={[{ required: true, message: "Please enter a topic or prompt" }]}>
                      <TextArea rows={8} placeholder="Example: We just launched a new organic skincare line made with aloe vera and green tea. Help me announce it." />
                    </Form.Item>
                  </>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  {currentStage === "image" ? (
                    <Button
                      onClick={() => {
                        setCurrentStage("text");
                        setErrorMessage("");
                        setResult(null);
                      }}
                    >
                      Back
                    </Button>
                  ) : null}

                  {currentStage === "text" && stageOneCompleted ? (
                    <Button
                      type="default"
                      onClick={() => {
                        setCurrentStage("image");
                        setErrorMessage("");
                        setResult(null);
                      }}
                    >
                      Next
                    </Button>
                  ) : null}

                  <Button type="primary" htmlType="submit" icon={<FiSend />} loading={loading}>
                    {currentStage === "image" ? "Generate Image" : "Generate Content"}
                  </Button>
                  <Button onClick={() => form.resetFields()}>Reset</Button>
                </div>
              </Form>
            </Card>

            <Card
              className="shadow-sm"
              style={{
                background: isdark ? "#111827" : "#ffffff",
                borderColor: isdark ? "#334155" : "#e2e8f0",
              }}
            >
              <Title level={4} style={{ color: isdark ? "#f8fafc" : "#0f172a", marginBottom: 8 }}>
                Result Preview
              </Title>
              <Text style={{ color: isdark ? "#cbd5e1" : "#475569" }}>
                Your generated caption, hashtags, and suggestions will appear here.
              </Text>
              {loading ? (
                <div className="mt-6 flex items-center gap-3">
                  <Spin />
                  <span style={{ color: isdark ? "#cbd5e1" : "#475569" }}>Generating your content...</span>
                </div>
              ) : (
                resultCard
              )}
            </Card>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CreatePost;