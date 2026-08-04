"use client";
import PageLoader from "@/components/common/Pageloader";
import { useUserContext } from "@/context/UserContext";
import { Modal, Select, ConfigProvider, theme } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import {
  BiBox,
  BiCommentDetail,
  BiLike,
  BiMemoryCard,
  BiReceipt,
} from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { IoIosArrowForward, IoMdCalendar } from "react-icons/io";
import { LiaTelegramPlane } from "react-icons/lia";
import {
  MdOutlineFileUpload,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardVoice,
} from "react-icons/md";
import { RiGroupLine } from "react-icons/ri";

const DashbordPage = () => {
  const scrollRef = useRef(null);
  const { isdark } = useUserContext();
  const date = new Date();
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" }); // "Mon"
  const month = date.toLocaleDateString("en-US", { month: "long" }); // "July"
  const year = date.getFullYear();
  const today = date.getDate();
  const weekDays = Array.from({ length: 7 }, (_, i) => today + i);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // scroll
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };
  const handleMouseLeave = () => {
    isDown.current = false;
  };
  const handleMouseUp = () => {
    isDown.current = false;
  };
  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };
  // scroll end
  // model
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <div>
      {/* <PageLoader/> */}
      <div
        className={`flex items-center gap-2 text-sm  ${isdark ? "text-[#64748b]" : "text-[#64748b]"}`}
      >
        <span className="text-[#8b5cf6]">User</span>{" "}
        <MdOutlineKeyboardArrowRight /> <span>Dashboard</span>
      </div>
      <div>
        <p
          className={`  p-5 rounded-md my-3 ${!isdark ? "text-[#f43f5e] bg-[#ffe4e6] " : "text-[#ffe4e6] bg-[#f43f5e]"}  bg-[#f43f5e]`}
        >
          Your subscription has already expired Renew Now
        </p>
      </div>

      <div className={`flex gap-5 flex-wrap`}>
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 w-full sm:w-fit `}
        >
          <div
            className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <div className="p-3 flex justify-center items-center bg-[#8b5cf61a] text-[#8b5cf6] rounded-xl">
              {" "}
              <BiBox size={24} />
            </div>
            <div>
              <p className={`text-[#64748b]`}>Total Brands</p>
              <h6
                className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
              >
                6
              </h6>
            </div>
          </div>
          <div
            className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <div className="p-3 flex justify-center items-center bg-[#10b9811a] text-[#10b981] rounded-xl">
              {" "}
              <BiReceipt size={24} />
            </div>
            <div>
              <p className={`text-[#64748b]`}>Total Post</p>
              <h6
                className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
              >
                4
              </h6>
            </div>
          </div>
          <div
            className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <div className="p-3 flex justify-center items-center bg-[#f59e0b1a] text-[#f59e0b] rounded-xl">
              {" "}
              <BiMemoryCard size={24} />
            </div>
            <div>
              <p className={`text-[#64748b]`}>Storage Used</p>
              <h6
                className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
              >
                425.00 MB
              </h6>
            </div>
          </div>
          <div
            className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <div className="p-3 flex justify-center items-center bg-[#6366f11a] text-[#6366f1] rounded-xl">
              {" "}
              <RiGroupLine size={24} />
            </div>
            <div>
              <p className={`text-[#64748b]`}>Social Accounts</p>
              <h6
                className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
              >
                14
              </h6>
            </div>
          </div>
          <div
            className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <div className="p-3 flex justify-center items-center bg-[#0ea5e91a] text-[#0ea5e9] rounded-xl">
              {" "}
              <BiLike size={24} />
            </div>
            <div>
              <p className={`text-[#64748b]`}>Reactions</p>
              <h6
                className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
              >
                1
              </h6>
            </div>
          </div>
          <div
            className={`flex gap-2 shadow-sm rounded-xl p-5 ${isdark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <div className="p-3 flex justify-center items-center bg-[#84cc161a] text-[#84cc16] rounded-xl">
              {" "}
              <BiCommentDetail size={24} />
            </div>
            <div>
              <p className={`text-[#64748b]`}>Reactions</p>
              <h6
                className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
              >
                0
              </h6>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div
            className={`shadow-sm rounded-t-xl  ${isdark ? "bg-[#1e293b]" : "bg-white"} `}
          >
            <div
              className={`border-b ${isdark ? "border-gray-600" : "border-gray-200"} `}
            >
              <div className="flex gap-5 justify-between p-5 ">
                <div className="flex gap-5">
                  <div className="p-3 flex justify-center items-center bg-[#34d3991a] text-[#10b981] rounded-xl">
                    {" "}
                    <IoMdCalendar size={24} />
                  </div>
                  <div>
                    <p className={`text-[#64748b]`}></p>
                    <h6
                      className={`text-xl ${isdark ? "text-white" : "text-[#64748b]"}`}
                    >
                      {weekday}, {month} <br /> {year}
                    </h6>
                  </div>
                </div>
                <Link href={""}>
                  <div
                    className={
                      'rounded-xl shadow-sm px-4 py-3 border w-12  ${isdark ? "bg-[#1e293b] text-white border-white" : "bg-white text-black border-gray-500"}'
                    }
                  >
                    <IoIosArrowForward
                      className={`${isdark ? "text-white" : "text-[#1e293b]"}`}
                    />
                  </div>
                </Link>
              </div>
            </div>
            <div className="flex items-center mt-3 pb-3 mb-3">
              <ul className="flex justify-evenly w-full">
                {weekDays.map((day) => (
                  <li
                    key={day}
                    className={`rounded-full h-5 w-5 sm:h-10 sm:w-10 flex justify-center items-center sm:text-xl ${
                      day === today
                        ? "border border-[#10b981] text-[#10b981]"
                        : isdark
                          ? "text-white"
                          : "text-black"
                    }`}
                  >
                    {day}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div
            className={`shadow-sm rounded-b-xl py-2 ${isdark ? "bg-[#1e293b]" : "bg-white"} `}
          >
            <p className={` text-center ${isdark ? "text-white" : ""}`}>
              You do not have scheduled posts yet.
            </p>
          </div>
        </div>
      </div>

      <div
        className={`shadow-sm rounded-xl mt-5  ${isdark ? "bg-[#1e293b]" : "bg-white"} `}
      >
        <div>
          <div
            className={`flex justify-between items-center border-b py-3 px-4 ${isdark ? "border-gray-600" : "border-gray-200"} `}
          >
            <div className="flex items-center gap-5">
              <div className="p-3 flex justify-center items-center bg-[#10b9811a] text-[#10b981] rounded-xl">
                {" "}
                <BiReceipt size={24} />
              </div>
              <span
                className={`text-2xl font-medium ${isdark ? "text-white" : "text-[#475569]"}`}
              >
                Posts
              </span>
            </div>
            <div className={`${isdark ? "text-white" : "text-[#475569]"}`}>
              <FaPlus onClick={showModal} />
            </div>
          </div>
        </div>
        <div className=" px-5">
          <ul
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto dashbordpostscroll py-5"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <li
              onClick={showModal}
              className={`h-96 min-w-[14rem] sm:min-w-[18rem] relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#ddd6fe] ${isdark ? "bg-[#6d28d91a]" : "bg-[#a78bfa1a]"}  `}
            >
              <div className="rounded-full font-light h-10 w-10 text-[#8b5cf6] bg-[#a78bfa1a] flex justify-center items-center">
                <GoPlus size={24} />
              </div>
              <span
                className={`font-medium text-xl ${isdark ? "text-white" : ""}`}
              >
                Create Post
              </span>
            </li>
            <li
              className={`h-96 min-w-[14rem] sm:min-w-[18rem] relative flex flex-col items-center justify-center rounded-xl shadow-sm ${isdark ? "bg-[#0f172a7e] border border-gray-600" : "bg-white"}  `}
            >
              <div className="w-full h-full">
                <div>
                  <Image
                    src="/images/fathersday.jpg"
                    alt=""
                    className="w-full h-[257px] rounded-t-xl block object-cover"
                    width={100}
                    height={100}
                  />
                </div>
                <div
                  className={`px-4 py-2 border-b  ${isdark ? "border-gray-600" : "border-gray-200"}`}
                >
                  <div className={`flex justify-between items-center gap-2  `}>
                    <h6 className={`font-medium ${isdark ? "text-white" : ""}`}>
                      Fathers day
                    </h6>
                    <p className={`text-[#6b7280]`}>1yr ago</p>
                  </div>
                  <div className={`text-[#6b7280]`}>Microsoft</div>
                </div>
                <div className="flex justify-between items-center gap-2 px-4 pt-5">
                  <div>
                    <ul className="flex items-center gap-1 ">
                      <li className="w-6 rounded-md border p-1 border-green-600 bg-green-50">
                        <Image
                          src="/images/facebook.svg"
                          alt="facebool"
                          width={100}
                          height={100}
                        />
                      </li>
                      <li className="w-6 rounded-md border p-1 border-green-600 bg-green-50">
                        <Image
                          src="/images/instagram.svg"
                          alt="facebool"
                          width={100}
                          height={100}
                        />
                      </li>
                      <li className="w-6 rounded-md border p-1 border-red-600 bg-red-50">
                        <Image
                          src="/images/twitter.svg"
                          alt="facebool"
                          width={100}
                          height={100}
                        />
                      </li>
                      <li className="w-6 rounded-md border p-1 border-green-600 bg-green-50">
                        <Image
                          src="/images/linkedin.svg"
                          alt="facebool"
                          width={100}
                          height={100}
                        />
                      </li>
                    </ul>
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded-sm scale-90 border dark:bg-secondary-800 border-green-300 px-2   text-green-600`}
                  >
                    <FaRegCircleCheck /> Published
                  </div>
                </div>
              </div>
            </li>
            <li
              className={`h-96 min-w-[14rem] sm:min-w-[18rem] relative flex flex-col items-center justify-center rounded-xl shadow-sm ${isdark ? "bg-[#0f172a7e] border border-gray-600" : "bg-white"}  `}
            >
              <div className="w-full h-full">
                <div>
                  <Image
                    src="/images/fathersday.jpg"
                    alt=""
                    className="w-full h-[257px] rounded-t-xl block object-cover"
                    width={100}
                    height={100}
                  />
                </div>
                <div
                  className={`px-4 py-2 border-b  ${isdark ? "border-gray-600" : "border-gray-200"}`}
                >
                  <div className={`flex justify-between items-center gap-2  `}>
                    <h6 className={`font-medium ${isdark ? "text-white" : ""}`}>
                      Fathers day
                    </h6>
                    <p className={`text-[#6b7280]`}>1yr ago</p>
                  </div>
                  <div className={`text-[#6b7280]`}>Microsoft</div>
                </div>
                <div className="flex justify-between items-center gap-2 px-4 pt-5">
                  <div>
                    <ul className="flex items-center gap-1 ">
                      <li className="w-6 rounded-md border p-1 border-green-600 bg-green-50">
                        <Image
                          src="/images/facebook.svg"
                          alt="facebool"
                          width={100}
                          height={100}
                        />
                      </li>
                      <li className="w-6 rounded-md border p-1 border-green-600 bg-green-50">
                        <Image
                          src="/images/instagram.svg"
                          alt="facebool"
                          width={100}
                          height={100}
                        />
                      </li>
                      <li className="w-6 rounded-md border p-1 border-red-600 bg-red-50">
                        <Image
                          src="/images/twitter.svg"
                          alt="facebool"
                          width={100}
                          height={100}
                        />
                      </li>
                      <li className="w-6 rounded-md border p-1 border-green-600 bg-green-50">
                        <Image
                          src="/images/linkedin.svg"
                          alt="facebool"
                          width={100}
                          height={100}
                        />
                      </li>
                    </ul>
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded-sm scale-90 border dark:bg-secondary-800 border-green-300 px-2   text-green-600`}
                  >
                    <FaRegCircleCheck /> Published
                  </div>
                </div>
              </div>
            </li>
            <li
              className={`h-96 min-w-[14rem] sm:min-w-[18rem] relative flex flex-col items-center justify-center rounded-xl shadow-sm ${isdark ? "bg-[#0f172a7e] border border-gray-600" : "bg-white"}  `}
            >
              <div className="w-full h-full">
                <div>
                  <Image
                    src="/images/fathersday.jpg"
                    alt=""
                    className="w-full h-[257px] rounded-t-xl block object-cover"
                    width={100}
                    height={100}
                  />
                </div>
                <div
                  className={`px-4 py-2 border-b  ${isdark ? "border-gray-600" : "border-gray-200"}`}
                >
                  <div className={`flex justify-between items-center gap-2  `}>
                    <h6 className={`font-medium ${isdark ? "text-white" : ""}`}>
                      Fathers day
                    </h6>
                    <p className={`text-[#6b7280]`}>1yr ago</p>
                  </div>
                  <div className={`text-[#6b7280]`}>Microsoft</div>
                </div>
                <div className="flex justify-between items-center gap-2 px-4 pt-5">
                  <div>
                    <ul className="flex items-center gap-1 ">
                      <li className="w-6 rounded-md border p-1 border-green-600 bg-green-50">
                        <Image
                          src="/images/facebook.svg"
                          alt="facebool"
                          width={100}
                          height={100}
                        />
                      </li>
                      <li className="w-6 rounded-md border p-1 border-green-600 bg-green-50">
                        <Image
                          src="/images/instagram.svg"
                          alt="facebool"
                          width={100}
                          height={100}
                        />
                      </li>
                      <li className="w-6 rounded-md border p-1 border-red-600 bg-red-50">
                        <Image
                          src="/images/twitter.svg"
                          alt="facebool"
                          width={100}
                          height={100}
                        />
                      </li>
                      <li className="w-6 rounded-md border p-1 border-green-600 bg-green-50">
                        <Image
                          src="/images/linkedin.svg"
                          alt="facebool"
                          width={100}
                          height={100}
                        />
                      </li>
                    </ul>
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded-sm scale-90 border dark:bg-secondary-800 border-green-300 px-2   text-green-600`}
                  >
                    <FaRegCircleCheck /> Published
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <ConfigProvider
        theme={{
          algorithm: isdark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          components: {
            Select: {
              selectorBg: isdark ? "#1e293b" : "#ffffff", // the background you keep fighting
              colorText: isdark ? "#ffffff" : "#000000", // selected value color ("Lucy")
              colorBorder: isdark ? "#475569" : "#d9d9d9", // default border
              colorPrimaryHover: isdark ? "#475569" : "#4096ff", // hover border
              colorPrimary: isdark ? "#475569" : "#1677ff", // focus border
              controlOutline: "transparent", // removes focus glow
              optionSelectedBg: isdark ? "#334155" : "#e6f4ff",
              colorBgElevated: isdark ? "#1e293b" : "#ffffff", // dropdown bg
            },
          },
        }}
      >
        <Modal
          title={
            <span className={`${isdark ? "text-white" : ""} font-semibold`}>
              Description
            </span>
          }
          className="modelset"
          closable={{ "aria-label": "Custom Close Button" }}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null} // hide default OK/Cancel since you have custom buttons
        >
          <div>
            <Select
              className="selectSet"
              classNames={{
                popup: {
                  root: isdark ? "darkSelectDropdown" : "lightSelectDropdown",
                },
              }}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              placeholder="Select Brand"
              options={[
                { value: "1", label: "Jack" },
                { value: "2", label: "Lucy" },
                { value: "3", label: "Tom" },
              ]}
            />

            <input type="text" placeholder="Title" />

            <textarea placeholder="Write something"></textarea>

            <div className="actions-row flex-wrap gap-2">
              <div className="flex flex-wrap gap-2">
                <button className="btn-voice">
                  <MdOutlineKeyboardVoice /> Voice Typing
                </button>
                <button className="btn-upload">
                  <MdOutlineFileUpload /> Upload Image
                </button>
              </div>
              <div>
                <button className="btn-generate flex">
                  <LiaTelegramPlane /> Generate&nbsp;Post
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default DashbordPage;
