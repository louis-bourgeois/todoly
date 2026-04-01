"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoMode } from "../../context/DemoModeContext";
import { useMenu } from "../../context/MenuContext.js";
import { useScreen } from "../../context/ScreenContext.js";
import { useUserPreferences } from "../../context/UserPreferencesContext.js";

export default function Page() {
  const { preferences } = useUserPreferences();
  const { isMobile } = useScreen();
  const { setCardType } = useMenu();
  const router = useRouter();
  const { mapAppRoute } = useDemoMode();

  useEffect(() => {
    if (preferences && preferences.Default_Main_Page) {
      const defaultHomePage = preferences?.Default_Main_Page?.toLowerCase();
      router.replace(mapAppRoute(`/app/${defaultHomePage}`));
    }
  }, [mapAppRoute, preferences, router]);

  useEffect(() => {
    if (isMobile) {
      setCardType(preferences?.Default_Main_Page);
    }
  }, [setCardType, preferences?.Default_Main_Page, isMobile]);

  
  return null;
}
