"use client";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

const columns = ["#", "Title", "Items", "Actions"];

const QaRepliesPage = () => {
  const { isdark } = useUserContext();
  const [openActionModel, setOpenActionModel] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = (id) => {
    if (openActionModel === id) {
      setOpenActionModel(null);
      return;
    }
    const rect = btnRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: rect.right - 140 }); // 140 = menu width
    setOpenActionModel(id);
  };

  // close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !btnRef.current.contains(e.target)
      ) {
        setOpenActionModel(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div>
      <div className="flex justify-between gap-2 items-center">
        <div
          className={`flex items-center gap-2 text-sm shrink-0 ${
            isdark ? "text-[#64748b]" : "text-[#64748b]"
          }`}
        >
          <span className="text-[#8b5cf6]">User</span>{" "}
          <MdOutlineKeyboardArrowRight />{" "}
          <span className="text-[#8b5cf6]">Commentai</span>{" "}
          <MdOutlineKeyboardArrowRight /> <span>Qa-Replies</span>
        </div>
        <div>
          <Link href={"/qa-replies-create"} className={`bg-[#8b5cf6] px-3 py-1 rounded-sm text-white`}>
            Add QA Reply
          </Link>
        </div>
      </div>

      <div
        className={`mt-4 overflow-x-auto rounded-xl border ${
          isdark ? "border-[#1e293b] bg-[#1e293b]" : "border-[#e5e7eb] bg-white"
        }`}
      >
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr
              className={`border-b ${
                isdark ? "border-[#1e293b]" : "border-[#e5e7eb]"
              }`}
            >
              {columns.map((col, index) => (
                <th
                  key={col}
                  className={`px-6 py-4 font-semibold border-b whitespace-nowrap ${
                    isdark
                      ? "text-white border-[#d2d7e04d]"
                      : "text-[#0f172a] border-[#e2e8f0]"
                  } ${index === columns.length - 1 ? "text-right" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr
              className={`border-b last:border-b-0 ${
                isdark ? "border-[#1e293b]" : "border-[#f1f5f9]"
              }`}
            >
              <td
                className={`px-6 py-4 whitespace-nowrap border-b ${
                  isdark
                    ? "text-[#cbd5e1] border-[#d2d7e04d]"
                    : "text-[#334155] border-[#e2e8f0]"
                }`}
              >
                1
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap border-b ${
                  isdark
                    ? "border-[#d2d7e04d] text-[#cbd5e1]"
                    : "border-[#e2e8f0] text-[#334155]"
                }`}
              >
                SocialAI FAQ dataset
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap border-b ${
                  isdark
                    ? "text-[#cbd5e1] border-[#d2d7e04d]"
                    : "text-[#334155] border-[#e2e8f0]"
                }`}
              >
                17
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap border-b text-right ${
                  isdark
                    ? "text-[#cbd5e1] border-[#d2d7e04d]"
                    : "text-[#334155] border-[#e2e8f0]"
                }`}
              >
                <div className="flex justify-end">
                  <BsThreeDotsVertical
                    ref={btnRef}
                    className="cursor-pointer"
                    onClick={() => toggleMenu(1)}
                  />
                </div>

                {openActionModel === 1 &&
                  createPortal(
                    <div
                      ref={menuRef}
                      style={{
                        position: "fixed",
                        top: menuPos.top,
                        left: menuPos.left,
                        width: 140,
                      }}
                      className={`z-50 rounded-xl px-3 py-2 shadow-lg ${
                        isdark
                          ? "bg-[#1e293b] text-white"
                          : "bg-white text-[#374151]"
                      }`}
                    >
                      <ul>
                        <li className=" ">
                          <Link href={"/qa-replies/45"} className="flex cursor-pointer gap-2 items-center text-sm pb-1 mb-1">
                          
                          <RiEdit2Fill /> Edit
                          </Link>
                        </li>
                        <li className="flex gap-2 items-center text-sm cursor-pointer">
                          <FaRegTrashAlt /> Delete
                        </li>
                      </ul>
                    </div>,
                    document.body
                  )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QaRepliesPage;