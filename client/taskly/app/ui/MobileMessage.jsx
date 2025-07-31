"use client";

import { useState, useEffect } from "react";

export default function MobileMessage() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem("mobileMessageShown");
    if (!hasBeenShown) {
      setIsOpen(true);
      sessionStorage.setItem("mobileMessageShown", "true");
    }
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center text-white max-w-sm relative border border-gray-700">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-2 -right-2 text-white bg-red-500 rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          aria-label="Close message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4">Desktop Version Recommended</h2>
        <p>
          For the best experience and full feature set, we recommend using the desktop version of our application.
        </p>
        <p>The mobile version is still in development (alpha version) and is not finished at all, I'm working on it!</p>
      </div>
    </div>
  );
}