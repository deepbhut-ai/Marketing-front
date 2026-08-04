"use client";
import React, { useMemo, useRef, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { ConfigProvider, Drawer, Dropdown, Modal, Select, message, theme } from "antd";
import { FiPlus, FiEdit2, FiTrash2, FiMoreVertical, FiSave } from "react-icons/fi";
import { BiCategory, BiCheckCircle, BiXCircle } from "react-icons/bi";

// ---------------------------------------------------------------------------
// Dummy seed data — swap for your real fetch/query
// ---------------------------------------------------------------------------
const CATEGORY_OPTIONS = ["Design", "Development", "Art"];

const INITIAL_SLOGANS = [
  { id: 1, text: "Code Smarter, Build Better Solutions", category: "Development", status: "Active", createdAt: "2-Aug-2024" },
  { id: 2, text: "Inspiring Creativity, Transforming Visual Art", category: "Art", status: "Active", createdAt: "2-Aug-2024" },
  { id: 3, text: "Inspire Creativity, Elevate Your Art", category: "Art", status: "Active", createdAt: "2-Aug-2024" },
  { id: 4, text: "Designing Digital Excellence, Crafting Success", category: "Design", status: "Active", createdAt: "2-Aug-2024" },
  { id: 5, text: "Unleash Imagination, Create Timeless Art", category: "Art", status: "Active", createdAt: "2-Aug-2024" },
  { id: 6, text: "Crafting Digital Experiences, Innovating Solutions", category: "Design", status: "Active", createdAt: "2-Aug-2024" },
  { id: 7, text: "Empowering Ideas, Building Tomorrow's Software", category: "Development", status: "Active", createdAt: "2-Aug-2024" },
  { id: 8, text: "Building Bold Brands, One Slogan at a Time", category: "Design", status: "Active", createdAt: "2-Aug-2024" },
  { id: 9, text: "Turning Vision into Visual Reality", category: "Art", status: "Active", createdAt: "2-Aug-2024" },
  { id: 10, text: "Engineering Tomorrow, Today", category: "Development", status: "Active", createdAt: "2-Aug-2024" },
];

const emptyForm = { id: null, category: "", text: "", status: "Active" };

const AdminBrandSlogans = () => {
  const { isdark } = useUserContext();

  const [slogans, setSlogans] = useState(INITIAL_SLOGANS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const drawerBodyRef = useRef(null);

  const isEditing = form.id !== null;

  const stats = useMemo(() => {
    const total = slogans.length;
    const active = slogans.filter((s) => s.status === "Active").length;
    return { total, active, inactive: total - active };
  }, [slogans]);

  // ---- Theme tokens (plain Tailwind, used outside antd components) -------
  const t = {
    card: isdark ? "bg-[#1e293b] border-[#334155]" : "bg-white border-gray-200",
    text: isdark ? "text-gray-200" : "text-gray-700",
    subtext: isdark ? "text-gray-400" : "text-gray-500",
    tableHead: isdark ? "bg-[#1e293b] text-gray-400" : "bg-white text-gray-500",
    rowBorder: isdark ? "border-[#334155]" : "border-gray-100",
    rowHover: isdark ? "hover:bg-[#273449]" : "hover:bg-gray-50",
    input: isdark
      ? "bg-[#0f172a] border-[#475569] text-white placeholder:text-gray-500"
      : "bg-white border-gray-300 text-gray-700 placeholder:text-gray-400",
    iconChip: isdark ? "bg-[#8b5cf6]/20 text-[#8b5cf6]" : "bg-purple-100 text-purple-600",
  };

  // ---- antd theme — single source of truth for Select/Drawer/Dropdown ---
  const antdTheme = {
    algorithm: isdark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: { colorPrimary: "#8b5cf6", borderRadius: 8 },
    components: {
      Select: {
        selectorBg: isdark ? "#0f172a" : "#ffffff",
        colorText: isdark ? "#ffffff" : "#111827",
        colorBorder: isdark ? "#475569" : "#d9d9d9",
        colorPrimaryHover: "#8b5cf6",
        colorPrimary: "#8b5cf6",
        controlOutline: "transparent",
        controlHeight: 44,
        optionSelectedBg: isdark ? "#334155" : "#e6f4ff",
        colorBgElevated: isdark ? "#1e293b" : "#ffffff",
      },
      Drawer: {
        colorBgElevated: isdark ? "#1e293b" : "#ffffff",
        colorText: isdark ? "#e2e8f0" : "#374151",
        colorIcon: isdark ? "#94a3b8" : "#6b7280",
        colorIconHover: isdark ? "#e2e8f0" : "#111827",
        colorSplit: isdark ? "#334155" : "#f0f0f0",
      },
      Dropdown: {
        colorBgElevated: isdark ? "#1e293b" : "#ffffff",
        colorText: isdark ? "#e2e8f0" : "#374151",
        controlItemBgHover: isdark ? "#334155" : "#f3f4f6",
      },
    },
  };

  // ---- Handlers ---------------------------------------------------------
  const openAddDrawer = () => {
    setForm(emptyForm);
    setDrawerOpen(true);
  };

  const openEditDrawer = (slogan) => {
    setForm({ id: slogan.id, category: slogan.category, text: slogan.text, status: slogan.status });
    setDrawerOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete slogan?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: () => {
        setSlogans((prev) => prev.filter((s) => s.id !== id));
        message.success("Slogan deleted");
      },
    });
  };

  const handleSave = () => {
    if (!form.category) {
      message.error("Please select a category");
      return;
    }
    if (!form.text.trim()) {
      message.error("Slogan title is required");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      if (isEditing) {
        setSlogans((prev) =>
          prev.map((s) =>
            s.id === form.id
              ? { ...s, category: form.category, text: form.text, status: form.status }
              : s
          )
        );
        message.success("Slogan updated");
      } else {
        setSlogans((prev) => [
          ...prev,
          {
            id: Date.now(),
            category: form.category,
            text: form.text,
            status: form.status,
            createdAt: new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          },
        ]);
        message.success("Slogan added");
      }
      setSaving(false);
      setDrawerOpen(false);
    }, 400);
  };

  // ---- Render -------------------------------------------------------------
  return (
    <ConfigProvider theme={antdTheme}>
      <div >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className={`text-sm ${t.subtext}`}>
            <span className="text-[#8b5cf6]">Admin</span> {">"} Brand-Slogans
          </p>
          <button
            onClick={openAddDrawer}
            className="flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <FiPlus size={16} />
            Add New
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard t={t} icon={<BiCategory size={20} />} label="Total" value={stats.total} />
          <StatCard t={t} icon={<BiCheckCircle size={20} />} label="Active" value={stats.active} />
          <StatCard t={t} icon={<BiXCircle size={20} />} label="Inactive" value={stats.inactive} />
        </div>

        {/* Table card */}
        <div className={`rounded-xl border ${t.card} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={t.tableHead}>
                  {["Slogan", "Category", "Status", "Created At", "Action"].map((h) => (
                    <th key={h} className="text-left font-medium px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slogans.map((s) => (
                  <tr key={s.id} className={`border-t ${t.rowBorder} ${t.rowHover} transition-colors`}>
                    <td className={`px-4 py-3 font-medium ${t.text}`}>{s.text}</td>
                    <td className={`px-4 py-3 ${t.subtext}`}>{s.category}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className={`px-4 py-3 ${t.subtext}`}>{s.createdAt}</td>
                    <td className="px-4 py-3">
                      <Dropdown
                        trigger={["click"]}
                        menu={{
                          items: [
                            {
                              key: "edit",
                              label: (
                                <span className="flex items-center gap-2">
                                  <FiEdit2 size={14} /> Edit
                                </span>
                              ),
                              onClick: () => openEditDrawer(s),
                            },
                            {
                              key: "delete",
                              danger: true,
                              label: (
                                <span className="flex items-center gap-2">
                                  <FiTrash2 size={14} /> Delete
                                </span>
                              ),
                              onClick: () => handleDelete(s.id),
                            },
                          ],
                        }}
                      >
                        <button
                          className={`p-1.5 rounded-md ${isdark ? "hover:bg-[#334155]" : "hover:bg-gray-100"}`}
                        >
                          <FiMoreVertical size={16} className={t.subtext} />
                        </button>
                      </Dropdown>
                    </td>
                  </tr>
                ))}

                {slogans.length === 0 && (
                  <tr>
                    <td colSpan={5} className={`px-4 py-10 text-center ${t.subtext}`}>
                      No slogans found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit panel — slides in from the right edge */}
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          placement="right"
          size={400}
          title={isEditing ? "Edit Slogan" : "Add New Slogan"}
          destroyOnClose
        >
          <div ref={drawerBodyRef}>
            <label className={`block text-sm mb-1 ${t.subtext}`}>Category</label>
            <Select
              value={form.category || undefined}
              placeholder="SELECT"
              onChange={(value) => setForm((f) => ({ ...f, category: value }))}
              getPopupContainer={() => drawerBodyRef.current || document.body}
              style={{ width: "100%" }}
              className="mb-4"
              options={CATEGORY_OPTIONS.map((c) => ({ value: c, label: c }))}
            />

            <label className={`block text-sm mb-1 ${t.subtext}`}>Slogan Title</label>
            <input
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              type="text"
              className={`w-full h-11 rounded-lg px-3.5 mb-4 border outline-none ${t.input}`}
            />

            <label className={`block text-sm mb-1 ${t.subtext}`}>Status</label>
            <Select
              value={form.status}
              onChange={(value) => setForm((f) => ({ ...f, status: value }))}
              getPopupContainer={() => drawerBodyRef.current || document.body}
              style={{ width: "100%" }}
              options={[
                { value: "Active", label: "Active" },
                { value: "Draft", label: "Draft" },
              ]}
            />

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setDrawerOpen(false)}
                className={`px-5 py-2 rounded-lg text-sm border ${
                  isdark ? "border-[#475569] text-gray-300" : "border-gray-300 text-gray-600"
                }`}
              >
                Close
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#a855f7] to-[#7c3aed] disabled:opacity-60"
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <FiSave size={14} />
                    {isEditing ? "Update" : "Create"}
                  </>
                )}
              </button>
            </div>
          </div>
        </Drawer>
      </div>
    </ConfigProvider>
  );
};

const StatCard = ({ t, icon, label, value }) => (
  <div className={`rounded-xl border ${t.card} p-4 flex items-center gap-3`}>
    <span className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${t.iconChip}`}>
      {icon}
    </span>
    <div>
      <p className={`text-sm ${t.subtext}`}>{label}</p>
      <p className={`text-2xl font-semibold ${t.text}`}>{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const active = status === "Active";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        active ? "bg-emerald-500/15 text-emerald-500" : "bg-rose-500/15 text-rose-500"
      }`}
    >
      {status}
    </span>
  );
};

export default AdminBrandSlogans;