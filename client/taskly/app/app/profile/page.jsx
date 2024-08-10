"use client";
import Header from "@/ui/_mobile/app/profile/Header";
import SettingsScroll from "@/ui/_mobile/app/profile/SettingsScroll";
import { redirect } from "next/navigation";
import { useScreen } from "../../../context/ScreenContext";

export default function Page() {
  const { isMobile } = useScreen();

  if (!isMobile) {
    redirect("/app");
  }

  return (
    <div className="flex flex-col items-center justify-start gap-[3vh] h-[90vh] w-full">
      <Header pictDim={84} pictSrc={"/api/placeholder/150/150"} />
      <SettingsScroll />
    </div>
  );
}
