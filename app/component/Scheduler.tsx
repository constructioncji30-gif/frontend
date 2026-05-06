"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomCalendar() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [calendarKey, setCalendarKey] = useState<number>(0); // trigger re-render

  const handleTodayClick = () => {
    const today = new Date();
    setStartDate(today);
    setCalendarKey((prev) => prev + 1); // force calendar re-render
  };

  const years = Array.from({ length: 50 }, (_, i) => 2000 + i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      <DatePicker
        key={calendarKey} // re-render trigger
        selected={startDate}
        onChange={(date: Date | null) => setStartDate(date)}
        inline
        openToDate={startDate || new Date()}
        calendarClassName="p-0 rounded-lg shadow-sm"
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          changeYear,
          changeMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex items-center justify-between px-3 py-2 bg-indigo-50 rounded-lg mb-3 shadow-sm w-full">
            {/* Previous Month */}
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className="text-indigo-500 text-lg hover:text-indigo-700 font-bold"
            >
              {"<"}
            </button>

            {/* Month + Year Select */}
            <div className="flex space-x-2">
              <select
                value={date.getFullYear()}
                onChange={({ target: { value } }) =>
                  changeYear(Number(value))
                }
                className="border rounded-md px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={months[date.getMonth()]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
                className="border rounded-md px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* Next Month */}
            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className="text-indigo-500 text-lg hover:text-indigo-700 font-bold"
            >
              {">"}
            </button>
          </div>
        )}
      />

      {/* Select Today Button */}
      <button
        onClick={handleTodayClick}
        className="mt-2 w-full bg-indigo-600 text-white py-1 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow"
      >
        Select Today
      </button>
    </div>
  );
}
