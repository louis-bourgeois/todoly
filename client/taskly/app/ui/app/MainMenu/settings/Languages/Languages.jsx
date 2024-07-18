import { useEffect, useState } from "react";
import { useUserPreferences } from "../../../../../../context/UserPreferencesContext";
import Circle from "../Circle";
import DropdownMenu from "../DropdownMenu";
import SectionTitle from "../SectionTitle";

export default function Languages({ transitionStyles }) {
  const { updateUserPreference, preferences } = useUserPreferences();
  const [settings, setSettings] = useState({
    language: preferences?.Language,
    tz: preferences?.TZ,
    dateFormat: preferences?.Date_Format,
    weekStartOn: preferences?.Week_Starts_On,
  });

  useEffect(() => {
    setSettings({
      language: preferences?.Language,
      tz: preferences?.TZ,
      dateFormat: preferences?.Date_Format,
      weekStartOn: preferences?.Week_Starts_On,
    });
  }, [preferences]);

  const updateSetting = async (key, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
    try {
      await updateUserPreference({ key, value });
      console.log("Mise à jour réussie:", key, value);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const toggleDateFormat = () => {
    const newFormat = settings.dateFormat === "24h" ? "12h" : "24h";
    updateSetting("Date_Format", newFormat);
  };

  const toggleWeekStart = () => {
    const newDayStart = settings.weekStartOn === "Monday" ? "Sunday" : "Monday";
    updateSetting("Week_Starts_On", newDayStart);
  };

  return (
    <div
      className={`flex flex-col w-full px-[4%] mt-[4%] gap-[1.75vh] justify-start ${transitionStyles}`}
    >
      <SectionTitle>Language</SectionTitle>
      <DropdownMenu
        title={settings.language}
        onClick={(newLanguage) => updateSetting("Language", newLanguage)}
        options={["English", "French"]}
      />
      <SectionTitle>Time Zone</SectionTitle>
      <DropdownMenu
        title={settings.tz}
        onClick={(newTz) => updateSetting("TZ", newTz)}
        options={["Europe/Paris", "America/New York"]}
      />
      <div className="flex-col flex justify-start gap-[0.5vw]">
        <div className="flex justify-start w-full items-center gap-[2.5vw]">
          <Circle
            borderColor="dominant"
            onClick={toggleDateFormat}
            isSelected={settings.dateFormat === "12h"}
          />
          <h2 className="text-dominant font-bold">12h Date Format</h2>
        </div>
        <div className="flex justify-start w-full items-center gap-[2.5vw]">
          <Circle
            borderColor="dominant"
            onClick={toggleWeekStart}
            isSelected={settings.weekStartOn === "Sunday"}
          />
          <h2 className="text-dominant font-bold">Week Starts on Sunday</h2>
        </div>
      </div>
    </div>
  );
}
