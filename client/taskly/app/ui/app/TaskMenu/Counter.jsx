"use client";
import { useEffect, useState } from "react";

export const Counter = ({ visibility, onChange, initialCount }) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  if (!visibility) {
    return null;
  }

  const handleIncrement = () => {
    if (count < 10) {
      const newCount = count + 1;
      setCount(newCount);
      onChange(newCount);
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
      onChange(newCount);
    }
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 10) {
      setCount(value);
      onChange(value);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <button
        onClick={handleDecrement}
        className="w-12 h-12 flex items-center justify-center rounded-full "
      >
        &lt;
      </button>
      <input
        type="number"
        value={count}
        onChange={handleChange}
        className="w-12 h-12 text-center  rounded-full no-arrows"
        min="1"
        max="10"
      />
      <button
        onClick={handleIncrement}
        className="w-12 h-12 flex items-center justify-center rounded-full"
      >
        &gt;
      </button>
    </div>
  );
};
