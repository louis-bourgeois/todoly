"use client";
import { useEffect, useState } from "react";

export const Counter = ({ visibility, onChange, initialCount }) => {
  const [count, setCount] = useState(initialCount);
  const [inputValue, setInputValue] = useState(initialCount.toString());

  useEffect(() => {
    setCount(initialCount);
    setInputValue(initialCount.toString());
  }, [initialCount]);

  if (!visibility) {
    return null;
  }

  const handleIncrement = () => {
    if (count < 10) {
      const newCount = count + 1;
      setCount(newCount);
      setInputValue(newCount.toString());
      onChange(newCount);
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
      setInputValue(newCount.toString());
      onChange(newCount);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 10) {
      setCount(numValue);
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    if (inputValue === "" || isNaN(parseInt(inputValue, 10))) {
      setInputValue(count.toString());
    } else {
      const numValue = Math.max(1, Math.min(10, parseInt(inputValue, 10)));
      setCount(numValue);
      setInputValue(numValue.toString());
      onChange(numValue);
    }
  };

  return (
    <div className="flex items-center justify-center bg-transparent">
      <button
        onClick={handleDecrement}
        className="w-12 h-12 flex items-center justify-center rounded-full text-text"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-12 h-12 text-center bg-transparent text-dominant"
        min="1"
        max="10"
      />
      <button
        onClick={handleIncrement}
        className="w-12 h-12 flex items-center justify-center rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 text-text"
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
  );
};
