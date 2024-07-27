"use client";

import CTA from "../landing_page/CTA";

export default function LoginHeroe({ handle, darkMode, h1, button }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen z-10">
      <h1 className="font-black text-4xl text-center">{h1}</h1>
      <CTA
        onClick={handle}
        title={button}
        className={`${
          darkMode ? " border border-dominant" : ""
        } shadow-[0_2px_40px_rgba(0,0,0.1)] hover:scale-110 transition text-lg font-black rounded-full mt-[3vh]  px-[1.5vw] py-[1vh]`}
      />
    </div>
  );
}
