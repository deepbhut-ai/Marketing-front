"use client";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineKeyboardArrowRight, MdOutlineSubject } from "react-icons/md";
import { TbKey } from "react-icons/tb";
import { FiTrash2, FiSave } from "react-icons/fi";
import Image from "next/image";

// ---------------------------------------------------------------------------
// Data — replace with your API response
// ---------------------------------------------------------------------------
const PROVIDERS = [
  {
    id: "openai",
    name: "OpenAi",
    drawerTitle: "Openai",
    logo: "/logos/openai.svg", // put your logo files in /public/logos
    baseUrl: "https://api.openai.com/v1",
    models: ["gpt-4-0613", "gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
  },
];

const FILE_FORMATS = ["CSV", "JSON"];

// ---------------------------------------------------------------------------
// Right-side drawer shell
// ---------------------------------------------------------------------------
const Drawer = ({ open, onClose, isdark, width = "max-w-[365px]", children }) => (
  <>
    {/* overlay */}
    <div
      onClick={onClose}
      className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    />
    {/* panel */}
    <div
      className={`fixed top-0 right-0 z-50 h-full w-full ${width} p-6 overflow-y-auto shadow-2xl
        transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "translate-x-full"}
        ${isdark ? "bg-[#1e293b] text-white" : "bg-white text-[#374151]"}`}
    >
      {children}
    </div>
  </>
);

// ---------------------------------------------------------------------------
// Shared field styles
// ---------------------------------------------------------------------------
const labelCls = (isdark) => `block text-sm mb-1.5 ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`;

const fieldCls = (isdark) =>
  `w-full px-3 py-2 text-sm rounded-md outline-none border transition-colors
   focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]
   ${
     isdark
       ? "bg-[#2d3c4e] border-[#2d3c4e] text-white placeholder:text-[#94a3b8]"
       : "bg-[#f8fafc] border-[#e2e8f0] text-[#111827] placeholder:text-[#94a3b8]"
   }`;

// ---------------------------------------------------------------------------
// Provider card + kebab menu
// ---------------------------------------------------------------------------
const ProviderCard = ({ provider, isdark, onOpenCredentials, onOpenLogs }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`rounded-lg w-56 p-4 shadow-lg ${
        isdark ? "bg-[#1e293b] text-white" : "bg-white text-[#374151]"
      }`}
    >
      <div className="flex justify-between gap-2 items-center">
        <h6 className="text-[15px]">{provider.name}</h6>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className={`cursor-pointer ${menuOpen ? "text-[#8b5cf6]" : ""}`}
          >
            <BsThreeDotsVertical />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className={`absolute right-0 top-7 z-20 w-36 border rounded-md shadow-xl overflow-hidden text-sm ${
                  isdark ? "bg-[#1a2738] border-gray-500" : "bg-white border border-[#e2e8f0]"
                }`}
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenCredentials(provider);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 cursor-pointer ${
                    isdark ? "hover:bg-[#2d3c4c] text-[#e2e8f0]" : "hover:bg-[#f1f5f9] text-[#374151]"
                  }`}
                >
                  <TbKey className="shrink-0 text-[#94a3b8]" size={15} />
                  <span className="flex ">
                  Ai Credentials
                  </span>
                </button>
                <Link
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenLogs(provider);
                  }}
                  href={"/ai-training-logs"}
                  className={`w-full flex items-center gap-2 px-3 py-2 cursor-pointer ${
                    isdark ? "hover:bg-[#2d3c4c] text-[#e2e8f0]" : "hover:bg-[#f1f5f9] text-[#374151]"
                  }`}
                >
                  <MdOutlineSubject className="shrink-0 text-[#94a3b8]" size={15} />
                  Logs
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="h-32 flex items-center justify-center">
        <Image
          src={provider.logo}
          alt={provider.name}
          width={100}
          height={100}
          className={`max-h-12 w-auto object-contain ${isdark ? "opacity-90 invert" : ""}`}
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Ai Credentials drawer
// ---------------------------------------------------------------------------
const CredentialsDrawer = ({ provider, open, onClose, isdark }) => {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(provider?.models?.[0] ?? "");

  return (
    <Drawer open={open} onClose={onClose} isdark={isdark}>
      <h5 className="text-lg font-semibold mb-5">{provider?.drawerTitle}</h5>

      <div className="mb-4">
        <label className={labelCls(isdark)}>Base Url</label>
        <input readOnly value={provider?.baseUrl ?? ""} className={fieldCls(isdark)} />
      </div>

      <div className="mb-4">
        <label className={labelCls(isdark)}>Api Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className={fieldCls(isdark)}
        />
      </div>

      <div className="mb-4">
        <label className={labelCls(isdark)}>Model</label>
        <select value={model} onChange={(e) => setModel(e.target.value)} className={fieldCls(isdark)}>
          {provider?.models?.map((m) => (
            <option key={m} value={m} className={isdark ? "bg-[#1e293b]" : "bg-white"}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <p className={`text-sm ${isdark ? "text-[#cbd5e1]" : "text-[#64748b]"}`}>
        * Please! provide correct credentials.
      </p>
      <p className={`text-sm mb-6 ${isdark ? "text-[#cbd5e1]" : "text-[#64748b]"}`}>
        * Check your credentials before submit.
      </p>

      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md bg-[#f43f5e] text-white text-sm cursor-pointer hover:bg-[#e11d48] transition-colors">
          <FiTrash2 size={15} /> Remove
        </button>
        <button className="flex-[1.4] py-2.5 rounded-md bg-[#8b5cf6] text-white text-sm cursor-pointer hover:bg-[#7c4fe0] transition-colors">
          Save
        </button>
      </div>
    </Drawer>
  );
};

// ---------------------------------------------------------------------------
// Import Dataset drawer
// ---------------------------------------------------------------------------
const ImportDatasetDrawer = ({ open, onClose, isdark }) => {
  const [title, setTitle] = useState("");
  const [providerId, setProviderId] = useState("");
  const [format, setFormat] = useState("JSON");
  const [file, setFile] = useState(null);

  return (
    <Drawer open={open} onClose={onClose} isdark={isdark} width="max-w-[450px]">
      <h5 className="text-lg font-semibold mb-5">Import Dataset</h5>

      <div className="mb-4">
        <label className={labelCls(isdark)}>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={fieldCls(isdark)} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelCls(isdark)}>Select Provider</label>
          <select
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            className={fieldCls(isdark)}
          >
            <option value="" className={isdark ? "bg-[#1e293b]" : "bg-white"}>
              Select Provider
            </option>
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id} className={isdark ? "bg-[#1e293b]" : "bg-white"}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls(isdark)}>Select File Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className={fieldCls(isdark)}
          >
            {FILE_FORMATS.map((f) => (
              <option key={f} value={f} className={isdark ? "bg-[#1e293b]" : "bg-white"}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-5">
        <label className={labelCls(isdark)}>Select Dataset</label>
        <div
          className={`flex items-center rounded-md border overflow-hidden ${
            isdark ? "bg-[#1e293b] border-[#334155]" : "bg-white border-[#e2e8f0]"
          }`}
        >
          <label
            className={`px-3 py-2 text-sm cursor-pointer shrink-0 ${
              isdark ? "bg-[#2d3c4e] text-[#cbd5e1]" : "bg-[#f1f5f9] text-[#475569]"
            }`}
          >
            Choose File
            <input
              type="file"
              className="hidden"
              accept={format === "CSV" ? ".csv" : ".json"}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <span className={`px-3 text-sm truncate ${isdark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
            {file ? file.name : "No file chosen"}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <a href="/demo-dataset.json" download className="text-sm text-[#8b5cf6] underline">
          Download Demo Dataset
        </a>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#8b5cf6] text-white text-sm cursor-pointer hover:bg-[#7c4fe0] transition-colors">
          <FiSave size={15} /> Save
        </button>
      </div>
    </Drawer>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const AiTraining = () => {
  const { isdark } = useUserContext();
  const [credentialsFor, setCredentialsFor] = useState(null);
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between gap-2 items-center">
        <div className="flex items-center gap-2 text-sm shrink-0 text-[#64748b]">
          <span className="text-[#8b5cf6]">User</span> <MdOutlineKeyboardArrowRight />{" "}
          <span className="text-[#8b5cf6]">Commentai</span> <MdOutlineKeyboardArrowRight />{" "}
          <span className={isdark ? "text-[#cbd5e1]" : "text-[#374151]"}>Ai-Training</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setImportOpen(true)}
            className="bg-[#8b5cf6] px-3 py-1 rounded-sm text-white cursor-pointer hover:bg-[#7c4fe0] transition-colors"
          >
            Import Dataset
          </button>
          <Link
            href={"/ai-training-create"}
            className="bg-[#8b5cf6] px-3 py-1 rounded-sm text-white hover:bg-[#7c4fe0] transition-colors"
          >
            Add Data
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
        {PROVIDERS.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            isdark={isdark}
            onOpenCredentials={setCredentialsFor}
            onOpenLogs={() => {}}
          />
        ))}
      </div>

      <CredentialsDrawer
        key={credentialsFor?.id}
        provider={credentialsFor}
        open={!!credentialsFor}
        onClose={() => setCredentialsFor(null)}
        isdark={isdark}
      />

      <ImportDatasetDrawer open={importOpen} onClose={() => setImportOpen(false)} isdark={isdark} />
    </div>
  );
};

export default AiTraining;