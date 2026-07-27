import { useUserContext } from '@/context/UserContext'
import { ConfigProvider, Modal, Select,theme } from 'antd'
import Image from 'next/image'
import React, { useState } from 'react'
import { FaRegCircleCheck } from 'react-icons/fa6'
import { GoPlus } from 'react-icons/go'
import { LiaTelegramPlane } from 'react-icons/lia'
import { MdOutlineFileUpload, MdOutlineKeyboardVoice } from 'react-icons/md'

const CardSeactions = () => {
      const { isdark } = useUserContext();
 const [isModalOpen, setIsModalOpen] = useState(false);
        const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
  <div
        className={`shadow-sm rounded-xl mt-5  ${isdark ? "bg-[#1e293b]" : "bg-white"} `}
      >
  
        <div className="py-5 px-5">
          <ul
     
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 "
    
          >
            <li
              onClick={showModal}
              className={`h-96 min-w-[14rem] sm:min-w-[18rem] relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#ddd6fe] ${isdark ? "bg-[#6d28d91a]" : "bg-[#a78bfa1a]"}  `}>
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
  )
}

export default CardSeactions