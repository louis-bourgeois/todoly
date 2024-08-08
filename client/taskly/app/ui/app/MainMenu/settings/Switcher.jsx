import { useEffect, useState } from "react";

const Switcher = ({ isChecked, onChange, className = "" }) => {
  const [animationClass, setAnimationClass] = useState(
    isChecked ? "checked" : "unchecked"
  );

  useEffect(() => {
    setAnimationClass(isChecked ? "checked" : "unchecked");
  }, [isChecked]);

  return (
    <label
      className={`switch relative inline-block w-[50px] h-[24px] ${className}`}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="opacity-0 w-0 h-0"
      />
      <span
        className={`
        slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 
        rounded-full transition-all duration-300
        bg-[#A3A3A3] overflow-hidden
      `}
      >
        <span
          className={`
          circle absolute h-[20px] w-[20px] 
          left-[2px] top-1/2 -translate-y-1/2
          rounded-full transition-all duration-300 bg-white
          ${animationClass} z-[300]
        `}
        />
        <span
          className={`rounded-full
         absolute top-0 left-0 right-0 bottom-0
          bg-dominant transition-all duration-500 ease-in-out
          ${isChecked ? "translate-x-0" : "-translate-x-full"}
        `}
        />
      </span>
      <style jsx>{`
        @keyframes moveCircle {
          0% {
            transform: translate(0, -50%);
            width: 20px;
            height: 20px;
          }
          20% {
            transform: translate(12px, -50%);
            width: 28px;
            height: 16px;
          }
          50% {
            transform: translate(24px, -50%);
            width: 22px;
            height: 16px;
          }
          80% {
            transform: translate(26px, -50%);
            width: 18px;
            height: 20px;
          }
          100% {
            transform: translate(24px, -50%);
            width: 20px;
            height: 20px;
          }
        }
        @keyframes moveCircleBack {
          0% {
            transform: translate(24px, -50%);
            width: 20px;
            height: 20px;
          }
          20% {
            transform: translate(12px, -50%);
            width: 28px;
            height: 16px;
          }
          50% {
            transform: translate(0, -50%);
            width: 22px;
            height: 16px;
          }
          80% {
            transform: translate(-2px, -50%);
            width: 18px;
            height: 20px;
          }
          100% {
            transform: translate(0, -50%);
            width: 20px;
            height: 20px;
          }
        }
        .circle.checked {
          animation: moveCircle 0.5s forwards ease-in-out;
          transform-origin: right center;
        }
        .circle.unchecked {
          animation: moveCircleBack 0.5s forwards ease-in-out;
          transform-origin: left center;
        }
      `}</style>
    </label>
  );
};

export default Switcher;
