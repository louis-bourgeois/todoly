"use client";

import { useEffect } from "react";
import { useUserPreferences } from "../../context/UserPreferencesContext.js";

export default function Page() {
  const { preferences } = useUserPreferences();

  useEffect(() => {
    if (preferences && preferences.Default_Main_Page) {
      console.log(preferences);
      const defaultHomePage = preferences?.Default_Main_Page?.toLowerCase();
      window.location.href = `/app/${defaultHomePage}`;
    }
  }, [preferences]);

  // Afficher un message de chargement pendant que nous attendons les préférences
  return null;
}
