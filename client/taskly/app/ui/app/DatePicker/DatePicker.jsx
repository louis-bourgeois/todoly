"use client";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import TaskMenuSectionContainer from "../TaskMenu/TaskMenuSectionContainer";

const daysOfWeekSundayStart = ["S", "M", "T", "W", "T", "F", "S"];
const daysOfWeekMondayStart = ["M", "T", "W", "T", "F", "S", "S"];

const DatePicker = ({ startOfWeekOnSunday, onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);

  const adjustedDaysOfWeek = useMemo(
    () =>
      startOfWeekOnSunday === "Sunday"
        ? daysOfWeekSundayStart
        : daysOfWeekMondayStart,
    [startOfWeekOnSunday]
  );

  const generateDays = useCallback(
    (date) => {
      const weekStartsOn = startOfWeekOnSunday === "Sunday" ? 0 : 1;
      const start = startOfWeek(startOfMonth(date), { weekStartsOn });
      const end = endOfWeek(endOfMonth(date), { weekStartsOn });
      const daysArray = [];
      let day = start;
      while (day <= end) {
        daysArray.push(day);
        day = addDays(day, 1);
      }
      return daysArray;
    },
    [startOfWeekOnSunday]
  );

  useEffect(() => {
    setDays(generateDays(currentDate));
  }, [currentDate, generateDays]);

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  const isPastDate = (date) => {
    const today = new Date();
    return isBefore(date, today) && !isSameDay(date, today);
  };

  const isSelectedDate = (date) => {
    return selectedDate && isSameDay(new Date(selectedDate), date);
  };

  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => addDays(startOfMonth(prevDate), -1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => addDays(endOfMonth(prevDate), 1));
  };

  const handleDateClick = (date) => {
    if (!isPastDate(date)) {
      const formattedDate = format(date, "yyyy-MM-dd");
      onDateSelect(formattedDate);
    }
  };

  const handleFastDateClick = (name) => {
    let date;
    const today = new Date();
    switch (name) {
      case "Today":
        date = today;
        break;
      case "Tomorrow":
        date = addDays(today, 1);
        break;
      case "Next Week":
        const weekStartsOn = startOfWeekOnSunday === "Sunday" ? 0 : 1;
        date = startOfWeek(addDays(today, 7), { weekStartsOn });
        break;
      case "This Weekend":
        const dayOfWeek = today.getDay();
        if (dayOfWeek === 6 || dayOfWeek === 0) {
          date = addDays(today, 7 + (6 - dayOfWeek));
        } else {
          date = addDays(today, 6 - dayOfWeek);
        }
        break;
      default:
        return;
    }
    onDateSelect(format(date, "yyyy-MM-dd"));
    setCurrentDate(date);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-shrink-0 w-full bg-transparent py-2 px-4 overflow-clip">
        <Swiper
          spaceBetween={27.5}
          slidesPerView="3.5"
          centeredSlides={false}
          className="!overflow-visible"
        >
          {[
            { name: "Today" },
            { name: "Tomorrow" },
            { name: "This Weekend" },
            { name: "Next Week" },
          ].map((fastDate, index) => (
            <SwiperSlide key={index} className="!w-auto">
              <div
                onClick={() => handleFastDateClick(fastDate.name)}
                className="shadow-shadow_01 cursor-pointer hover:scale-105 transition-all flex items-center justify-center bg-dominant rounded-[20px] p-3 my-4"
              >
                <p className="text-xs 5xl:text-base text-primary font-bold whitespace-nowrap px-2">
                  {fastDate.name}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <TaskMenuSectionContainer othersStyles="flex-grow w-[96%] p-2 flex flex-col overflow-hidden mx-[2%]">
        <div className="w-full p-2 pt-1 flex items-center justify-between mb-5">
          <button
            className="select-none text-2xl"
            onClick={handlePreviousMonth}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#007AFF"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-text text-lg font-extrabold 5xl:text-xl">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <button className="select-none" onClick={handleNextMonth}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#007AFF"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="flex-grow flex flex-col min-h-0">
          <div className="grid grid-cols-7 gap-1">
            {adjustedDaysOfWeek.map((day, index) => (
              <div
                key={index}
                className="text-center text-text text-xs font-bold"
              >
                <span className="5xl:text-base">{day}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 flex-grow overflow-y-auto scroll-hide">
            {days.map((day, index) => (
              <div
                key={index}
                className={`text-center text-sm flex items-center justify-center transition-transform transition-color duration-200 cursor-pointer ${
                  isSameMonth(day, currentDate)
                    ? isPastDate(day)
                      ? "text-gray-400 cursor-default"
                      : isSelectedDate(day)
                      ? "text-dominant"
                      : "text-text hover:text-dominant hover:scale-105"
                    : "text-gray-300 cursor-default opacity-0"
                }`}
                onClick={() =>
                  isSameMonth(day, currentDate) && handleDateClick(day)
                }
              >
                <span className="font-medium text-sm 4xl:text-base">
                  {format(day, "d")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </TaskMenuSectionContainer>
    </div>
  );
};

export default DatePicker;
