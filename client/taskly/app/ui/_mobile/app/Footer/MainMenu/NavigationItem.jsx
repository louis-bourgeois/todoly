"use client";
import Image from "next/image";

export default function NavigationItem({
  icon: Icon,
  label,
  isActive,

}) {
  const iconElement =
    typeof Icon === "function" ? (
      <Icon fill={isActive ? "#007AFF" : "#6B7280"} />
    ) : (
      <Image
        src={Icon.src}
        width={Icon.width || 26}
        height={Icon.height || 29}
        alt={label}
        className={`rounded-full`}
      />
    );

  return (
    <div
      className="flex flex-col items-center justify-between gap-[5px] h-[45px] cursor-pointer"
    >
      {iconElement}
      <span
        className={`text-xs transition-color duration-200 hover:text-blue ${
          isActive ? "text-blue" : "text-gray-500 hover:text-blue-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
