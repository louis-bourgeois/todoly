"use client";

import { useEffect } from "react";
import { useMenu } from "../../context/MenuContext.js";
import { useScreen } from "../../context/ScreenContext.js";
import { useUserPreferences } from "../../context/UserPreferencesContext.js";

export default function Page() {
  const { preferences } = useUserPreferences();
  const { isMobile } = useScreen();
  const { setCardType } = useMenu();
  useEffect(() => {
    console.log(preferences, preferences.Default_Main_Page);
    if (preferences && preferences.Default_Main_Page) {
      console.log(preferences);
      const defaultHomePage = preferences?.Default_Main_Page?.toLowerCase();
      window.location.href = `/app/${defaultHomePage}`;
    }
  }, [preferences]);
  useEffect(() => {
    if (isMobile) {
      console.log("====================================");
      console.log("setting card type to ", preferences?.Default_Main_Page);
      console.log("====================================");
      setCardType(preferences?.Default_Main_Page);
    }
  }, [setCardType, preferences?.Default_Main_Page, isMobile]);

  // Afficher un message de chargement pendant que nous attendons les préférences
  return null;
}
