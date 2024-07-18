import { useEffect, useState } from "react";

const DateInput = ({ dueDate, handleDateChange }) => {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (dueDate) {
      const date = new Date(dueDate);
      setDisplayValue(
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    } else {
      setDisplayValue("");
    }
  }, [dueDate]);

  const handleInputChange = (e) => {
    handleDateChange(e);
    setDisplayValue(e.target.value);
  };

  return (
    <div className="px-4 relative">
      <label
        htmlFor="dueDate"
        className="block text-lg font-bold text-black mb-2"
      >
        Due Date
      </label>
      <div className="relative">
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={dueDate || ""}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-3 py-2 pr-10 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-dominant focus:ring-opacity-50 appearance-none"
        />
        {!isFocused && (
          <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none">
            <span
              className={`${
                displayValue ? "text-gray-800" : "text-gray-500"
              } text-xs`}
            >
              {displayValue || "Hmmmm, there is no Date Selected"}
            </span>
          </div>
        )}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DateInput;
