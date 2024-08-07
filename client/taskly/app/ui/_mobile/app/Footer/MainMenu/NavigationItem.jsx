"use client";
import Link from "next/link";

export default function NavigationItem({ icon: Icon, label, path, isActive }) {
  const iconElement =
    typeof Icon === "function" ? (
      <Icon fill={isActive ? "#007AFF" : "#6B7280"} />
    ) : Icon && Icon.src ? (
      <></>
    ) : (
      // <Image
      //   src={Icon.src}
      //   width={Icon.width || 26}
      //   height={Icon.height || 29}
      //   alt={label}
      //   quality={100}
      //   priority={true}
      //   className="rounded-full"
      // />
      <div
        style={{ width: Icon?.width || 26, height: Icon?.height || 29 }}
        className="bg-gray-300 rounded-full"
      />
    );

  return (
    <Link
      href={path}
      className="flex flex-col items-center justify-between gap-[5px] h-[45px] cursor-pointer"
    >
      {iconElement}
      <span
        className={`text-xs transition-colors duration-200 ${
          isActive
            ? "text-dominant-500 font-semibold"
            : "text-gray-500 hover:text-dominant-500"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
