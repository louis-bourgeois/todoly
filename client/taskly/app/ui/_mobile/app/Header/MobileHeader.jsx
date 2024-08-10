"use client";
import { useEffect, useState } from "react";
import { useUser } from "../../../../../context/UserContext";
import { useUserPreferences } from "../../../../../context/UserPreferencesContext";
const TITLES = {
  evening: "Good Evening,",
  night: "Good Night,",
  morning: "Good Morning,",
  afternoon: "Good Afternoon,",
  meal: "Bon Appétit,",
};

export default function MobileHeader() {
  const { user } = useUser();
  const { preferences } = useUserPreferences();
  const [title, setTitle] = useState("");

  useEffect(() => {
    const getCurrentTitle = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 23 || currentHour < 6) return TITLES.night;
      if (currentHour >= 6 && currentHour < 12) return TITLES.morning;
      if (currentHour === 12) return TITLES.meal;
      if (currentHour > 12 && currentHour < 18) return TITLES.afternoon;
      return TITLES.evening;
    };
    setTitle(getCurrentTitle());
  }, []);

  return (
    <header className="w-full px-[17.5px]">
      <h1 className="text-2xl font-black text-text">
        {preferences?.Home_Page_Title ===
        "Depending on the time of day + name" ? (
          <>
            {title}{" "}
            <span className="text-dominant">{user?.first_name || "User"}</span>
          </>
        ) : (
          preferences?.Home_Page_Title || "Welcome"
        )}
      </h1>
    </header>
  );
}
