import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaThumbsUp, FaRegImage } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
 import { useUserContext } from '@/context/UserContext';

const PLATFORM_STYLES = {
  facebook: { bg: "bg-[#1877F2]", Icon: FaFacebook, shape: "rounded-full" },
  instagram: {
    bg: "bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5]",
    Icon: FaInstagram,
    shape: "rounded-full",
  },
  linkedin: { bg: "bg-[#0A66C2]", Icon: FaLinkedin, shape: "rounded-md" },
};

const rows = [
  {
    id: 1,
    platform: "facebook",
    content: "?Attention all our valued customers!?",
    date: "18 Oct, 2024 11:12 AM",
    reactions: 0,
    comments: 0,
    supported: true,
  },
  {
    id: 2,
    platform: "instagram",
    content: "?Attention all our valued customers!? We are thril...",
    date: "17 Oct, 2024 12:02 AM",
    reactions: 0,
    comments: 0,
    supported: true,
  },
  {
    id: 3,
    platform: "facebook",
    content: "Post cutting-edge technology, Deliver unparalleled...",
    date: "30 Aug, 2024 9:26 PM",
    reactions: 1,
    comments: 0,
    supported: true,
  },
  {
    id: 4,
    platform: "instagram",
    content: "Post cutting-edge technology, Deliver unparalleled...",
    date: "30 Aug, 2024 9:43 PM",
    reactions: 0,
    comments: 0,
    supported: true,
  },
  {
    id: 5,
    platform: "linkedin",
    content: "Post cutting-edge technology, Deliver unparalleled...",
    date: "30 Aug, 2024 9:46 PM",
    reactions: 0,
    comments: 0,
    supported: false,
  },
];

const PlatformIcon = ({ platform }) => {
  const style = PLATFORM_STYLES[platform];
  if (!style) return null;
  const { bg, Icon, shape } = style;
  return (
    <div className={`flex h-9 w-9 items-center justify-center ${shape} ${bg} shadow-sm`}>
      <Icon className="text-white" size={18} />
    </div>
  );
};

const StatPill = ({ icon: Icon, value, supported }) => {
  if (!supported) {
    return (
      <span className="inline-flex items-center rounded-full bg-indigo-500/90 px-3 py-1.5 text-xs font-medium text-white">
        not supported
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-600/60 bg-transparent px-3 py-1.5 text-xs font-medium ">
      <Icon size={13} />
      {value}
    </span>
  );
};

const AnalylicsTable = () => {
  const { isdark } = useUserContext();

  return (
    <div className={`w-full overflow-x-auto rounded-sm mt-5 ${isdark ?"bg-[#1e293b]":"bg-white"}  p-2`}>
      <table className="w-full min-w-[860px] border-separate border-spacing-0">
        <thead>
          <tr>
            {["Platform", "Content", "Publish Date", "Reactions", "Comments"].map((head) => (
              <th
                key={head}
                className={`px-2     py-4 text-left text-sm font-semibold  border-b  ${isdark ?" text-white border-[#d2d7e04d]":"border-[#e2e8f0]"} `}
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={``}>
              <td className={`px-2 py-2 align-middle border-b   ${isdark ?" text-[#94a3b8] border-[#d2d7e04d]":"text-[#475569] border-[#e2e8f0]"}`}>
                <PlatformIcon platform={row.platform} />
              </td>
              <td className={`px-1 py-2 align-middle border-b   ${isdark ?" text-[#94a3b8] border-[#d2d7e04d]":" text-[#475569] border-[#e2e8f0]"}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100">
                    <FaRegImage className="text-slate-400" size={15} />
                  </div>
                  <span className="max-w-[420px] truncate text-sm ">
                    {row.content}
                  </span>
                </div>
              </td>
              <td className={`px-1 py-2 align-middle whitespace-nowrap text-sm  border-b   ${isdark ?" text-[#94a3b8] border-[#d2d7e04d]":"border-[#e2e8f0] text-[#475569]"}`}>
                {row.date}
              </td>
              <td className={`px-1 py-2 align-middle border-b   ${isdark ?" text-[#94a3b8] border-[#d2d7e04d]":"border-[#e2e8f0] text-[#475569]"}`}>
                <StatPill icon={FaThumbsUp} value={row.reactions} supported={row.supported} />
              </td>
              <td className={`px-1 py-2 align-middle border-b   ${isdark ?" text-[#94a3b8] border-[#d2d7e04d]":"border-[#e2e8f0] text-[#475569]"}`}>
                <StatPill icon={FaRegComment} value={row.comments} supported={row.supported} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnalylicsTable;