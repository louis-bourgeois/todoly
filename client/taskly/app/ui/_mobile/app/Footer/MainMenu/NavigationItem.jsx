"use client";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../../../../../../context/UserContext";

export default function NavigationItem({ icon: Icon, label, path, isActive }) {
  const { user } = useUser();
  const iconElement =
    user?.image_url && label === "Profile" ? (
      <Image
        src={user.image_url}
        width={Icon.width || 26}
        height={Icon.height || 29}
        alt={label}
        quality={100}
        priority
        className="rounded-full"
      />
    ) : typeof Icon === "function" ? (
      <Icon fill={isActive ? "#007AFF" : "#6B7280"} />
    ) : null;

  return (
    <Link
      href={path}
      className={`flex flex-col items-center justify-between gap-[5px] h-[45px] cursor-pointer  ${
        isActive
          ? "text-dominant-500 font-semibold"
          : "text-gray-500 hover:text-dominant-500"
      }`}
    >
      {iconElement}
      <span className={`text-xs transition-colors duration-200 text-text `}>
        {label}
      </span>
    </Link>
  );
}
