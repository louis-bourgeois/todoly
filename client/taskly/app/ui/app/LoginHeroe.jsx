"use client";
export default function LoginHeroe({ handle, darkMode, h1, button }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen z-10">
      <h1 className="font-black text-8xl text-center">{h1}</h1>
      <button
        onClick={handle}
        className={`${
          darkMode ? " border border-blue" : ""
        } shadow-[0_2px_40px_rgba(0,0,0.1)] hover:scale-110 transition text-3xl font-black rounded-full mt-[3vh]  px-[8vw] py-[1vh]`}
      >
        {button}
      </button>
    </div>
  );
}
