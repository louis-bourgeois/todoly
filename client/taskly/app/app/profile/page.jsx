"use client";
import Header from "@/ui/_mobile/app/profile/Header";
import SettingsScroll from "@/ui/_mobile/app/profile/SettingsScroll";
import { useScreen } from "../../../context/ScreenContext";

export default function Page() {
  const { isMobile } = useScreen();

  if (!isMobile) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-[30px] xs:max-h-[100vh] 2xs:max-h-[82.5vh] w-full">
      <Header pictDim={84} pictSrc={"/api/placeholder/150/150"} />
      <SettingsScroll />
    </div>
  );
}
