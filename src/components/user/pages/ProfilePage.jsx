"use client";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FiSave } from "react-icons/fi";

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

const ProfilePage = () => {
  const { isdark } = useUserContext();

  const [name, setName] = useState(PROFILE.name);
  const [phone, setPhone] = useState(PROFILE.phone);
  const [email, setEmail] = useState(PROFILE.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

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

  const onPickAvatar = (e) => {
    const f = e.target.files?.[0];
    if (f) setAvatar({ file: f, url: URL.createObjectURL(f) });
  };

  const handleUpdate = () => {
    console.log({ name, phone, email, currentPassword, avatar: avatar?.file });
    // TODO: call your API
  };

  const avatarSrc = avatar?.url || PROFILE.avatarUrl;

  return (
    <div>
      {/* ---------- breadcrumb ---------- */}
      <div className={`flex items-center gap-2 text-sm ${muted}`}>
        <span className="text-[#8b5cf6]">User</span>
        <MdOutlineKeyboardArrowRight />
        <span className={isdark ? "text-[#cbd5e1]" : "text-[#374151]"}>Profile</span>
      </div>

      {/* ---------- card ---------- */}
      <div
        className={`max-w-[1060px] mx-auto rounded-lg p-6 sm:p-8 mt-6 ${
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
    </div>
  );
};

export default ProfilePage;