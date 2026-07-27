import { useUserContext } from '@/context/UserContext';
import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const CalenderContent = () => {
  const { isdark } = useUserContext();
  const [weekOffset, setWeekOffset] = useState(0);

  // Build an array of 7 days for the current week (+ offset)
  const getWeekDays = (offset) => {
    const days = [];
    const today = new Date();
    // Move to Sunday of the current week
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay() + offset * 7);

    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays(weekOffset);

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
    });

  return (
    <div>
      <div
        className={`shadow-sm rounded-xl mt-5 p-4 ${isdark ? 'bg-[#1e293b]' : 'bg-white'}`}
      >
        <h6 className={`text-xl font-medium ${isdark ? 'text-white' : ''}`}>
          Calendar
        </h6>

        <div className="flex gap-4 mt-3">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className={`flex justify-center items-center py-3 rounded-sm w-10 shadow-sm cursor-pointer ${isdark ? 'bg-[#0f172a] text-white' : 'bg-[#f1f5f9]'}`}
          >
            <IoIosArrowBack />
          </button>
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className={`flex justify-center items-center py-3 rounded-sm w-10 shadow-sm cursor-pointer ${isdark ? 'bg-[#0f172a] text-white' : 'bg-[#f1f5f9]'}`}
          >
            <IoIosArrowForward />
          </button>
        </div>

        <div>
          <ul className="mt-5 flex gap-4 flex-wrap">
            {weekDays.map((day, index) => (
              <li
                key={index}
                className={`border border-dashed rounded-sm flex-1 min-w-32 border-[#22c55e] px-4 py-3 ${isdark ? 'text-white bg-[#0f172a]' : 'bg-[#f1f5f9]'}`}
              >
                <h6 className="text-center mb-2">{formatDate(day)}</h6>
                <button
                  className={`border border-dashed border-[#22c55e] rounded-sm px-2 py-2 w-full cursor-pointer ${isdark ? 'text-white' : ''}`}
                >
                  Create New
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CalenderContent;