"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import LinesElement from "./LinesElement";

const MenuLines = React.memo(
  ({ children, text, href, setShowMenu = undefined }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
      <div
        className="button-wrapper m-[5%] my-0 flex items-center justify-between rx-4 py-2"
        onClick={() => setShowMenu && setShowMenu((prev) => !prev)}
      >
        <Link href={href} className="w-full">
          <div className="relative z-10 flex items-center justify-start w-full">
            <LinesElement>{children}</LinesElement>
            <LinesElement>
              <span
                className={`transition duration-300 ease-in-out ${
                  isActive ? "text-dominant font-bold" : "text-text"
                }`}
              >
                {text}
              </span>
            </LinesElement>
          </div>
        </Link>
      </div>
    );
  }
);

MenuLines.displayName = "MenuLines";

export default MenuLines;
