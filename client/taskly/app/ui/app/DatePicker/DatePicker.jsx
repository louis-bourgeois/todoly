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
import { useCallback, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import TaskMenuSectionContainer from "../TaskMenu/TaskMenuSectionContainer";

const daysOfWeekSundayStart = ["S", "M", "T", "W", "T", "F", "S"];
const daysOfWeekMondayStart = ["M", "T", "W", "T", "F", "S", "S"];

const DatePicker = ({ startOfWeekOnSunday, onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [adjustedDaysOfWeek, setAdjustedDaysOfWeek] = useState(
    startOfWeekOnSunday === "Sunday"
      ? daysOfWeekSundayStart
      : daysOfWeekMondayStart
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
      setDays(daysArray);
    },
    [startOfWeekOnSunday]
  );

  useEffect(() => {
    generateDays(currentDate);
    setAdjustedDaysOfWeek(
      startOfWeekOnSunday === "Sunday"
        ? daysOfWeekSundayStart
        : daysOfWeekMondayStart
    );
  }, [currentDate, startOfWeekOnSunday, generateDays]);

  useEffect(() => {
    if (selectedDate && !isSameMonth(new Date(selectedDate), currentDate)) {
      setCurrentDate(new Date(selectedDate));
    }
  }, [selectedDate, currentDate]);

  const isPastDate = (date) => {
    const today = new Date();
    return isBefore(date, today) && !isSameDay(date, today);
  };

  const isSelectedDate = (date) => {
    return selectedDate && isSameDay(new Date(selectedDate), date);
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
  };

  const handlePreviousMonth = () => {
    setCurrentDate(addDays(startOfMonth(currentDate), -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addDays(endOfMonth(currentDate), 1));
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
        date = new Date();
        break;
      case "Tomorrow":
        date = addDays(new Date(), 1);
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
  };

  return (
    <>
      <div className="w-full p-4">
        <Slider {...settings}>
          {[
            { name: "Today" },
            { name: "Tomorrow" },
            { name: "This Weekend" },
            { name: "Next Week" },
          ].map((fastDate, index) => (
            <div key={index} className="px-2">
              <div
                onClick={() => handleFastDateClick(fastDate.name)}
                className="cursor-pointer hover:scale-105 transition-all flex h-[50%] items-center justify-center bg-primary rounded-[20px] my-2 p-2"
                style={{
                  boxShadow: "0px 4px 4px 0px rgba(0, 122, 255, 0.25)",
                }}
              >
                <p className="text-xs text-text font-bold">{fastDate.name}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <TaskMenuSectionContainer othersStyles="w-full h-[75%] p-4 flex flex-col">
        <div className="w-full p-4 pt-0 flex items-center justify-between ">
          <button
            className="select-none text-4xl"
            onClick={handlePreviousMonth}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#007AFF"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-text">{format(currentDate, "MMMM yyyy")}</h2>
          <button
            className="select-none text-4xl 4xl:text-6xl"
            onClick={handleNextMonth}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#007AFF"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {adjustedDaysOfWeek.map((day, index) => (
            <div
              key={index}
              className="text-center text-text text-xs 4xl:text-base font-bold"
            >
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <div
              key={index}
              className={`text-center text-xs 4xl:text-base transition-transform transition-color duration-500 cursor-pointer ${
                isSameMonth(day, currentDate)
                  ? isPastDate(day)
                    ? "text-gray-400 cursor-default"
                    : isSelectedDate(day)
                    ? "text-dominant"
                    : "text-text hover:text-dominant hover:scale-110 active:scale-95"
                  : "text-gray-300 cursor-default opacity-0"
              }`}
              onClick={() =>
                isSameMonth(day, currentDate) && handleDateClick(day)
              }
            >
              {format(day, "d")}
            </div>
          ))}
        </div>
      </TaskMenuSectionContainer>
    </>
  );
};

export default DatePicker;
