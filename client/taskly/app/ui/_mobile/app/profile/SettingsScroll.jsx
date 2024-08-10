import { useCallback, useEffect, useMemo, useState } from "react";
import { useUserPreferences } from "../../../../../context/UserPreferencesContext";
import SettingsSection from "./SettingsSection";

const sections = [
  {
    title: "Layout",
    lines: [
      {
        Default_Main_Page: ["Currently", "All"],
      },
    ],
    type: "primary",
  },
  {
    title: "Appearance",
    lines: [
      {
        Color_Theme: [
          ["light", "#f7f4ed", "black"],
          ["black", "#000000", "white"],
        ],
      },
    ],
    type: "primary",
  },
  {
    title: "Notifications",
    toggle: true,
    toggles: ["Daily Recap", "Weekly Recap", "Monthly Recap"],
  },
  {
    title: "Language",
    lines: [
      {
        Language: ["English", "Français"],
      },
      {
        TZ: ["Europe/Paris", "America/New_York"],
      },
    ],
    toggles: [
      { key: "Date_Format", label: "24h date Format" },
      { key: "Week_Starts_On", label: "Week starts on Sunday" },
    ],
    type: "primary",
  },
  {
    title: "Integrations",

    type: "primary",
  },
];

const SettingsScroll = () => {
  const { updatePreference, preferences } = useUserPreferences();
  const [notificationsList, setNotificationsList] = useState([]);
  const [allowNotifications, setAllowNotifications] = useState(false);
  const [dateFormat, setDateFormat] = useState(false);
  const [weekStartsSunday, setWeekStartsSunday] = useState(false);

  useEffect(() => {
    console.log(preferences);
    if (preferences) {
      console.log("Initializing preferences:", preferences);
      setAllowNotifications(preferences.Allow_Notification === "true");
      setNotificationsList(
        preferences.Notifications_List
          ? preferences.Notifications_List.split(",")
          : []
      );
      setDateFormat(preferences.Date_Format === "24h");
      setWeekStartsSunday(preferences.Week_Starts_On === "Sunday");
    }
  }, [preferences]);

  const handlePreferenceChange = useCallback(
    (key, value) => {
      console.log("Preference change:", key, value);
      switch (value) {
        case "black":
          updatePreference({ key, value: "#000000" });
          break;
        case "light":
          updatePreference({ key, value: "#f7f4ed" });
        case "blue":
          updatePreference({ key, value: "#f7f4ed" });
        default:
          updatePreference({ key, value: String(value) });
          break;
      }
    },
    [updatePreference]
  );

  const handleNotificationToggle = useCallback(() => {
    const newValue = !allowNotifications;
    console.log("Toggling notifications:", newValue);
    setAllowNotifications(newValue);
    updatePreference({
      key: "Allow_Notification",
      value: newValue.toString(),
    });
  }, [allowNotifications, updatePreference]);

  const handleNotificationListChange = useCallback(
    (notificationName) => {
      console.log("Changing notification:", notificationName);
      setNotificationsList((currentList) => {
        let newList;
        if (currentList.includes(notificationName)) {
          newList = currentList.filter((name) => name !== notificationName);
        } else {
          newList = [...currentList, notificationName];
        }
        console.log("New notifications list:", newList);
        updatePreference({
          key: "Notifications_List",
          value: newList.join(","),
        });
        return newList;
      });
    },
    [updatePreference]
  );

  const handleDateFormatToggle = useCallback(() => {
    const newValue = !dateFormat;
    setDateFormat(newValue);
    updatePreference({
      key: "Date_Format",
      value: newValue ? "24h" : "12h",
    });
  }, [dateFormat, updatePreference]);

  const handleWeekStartToggle = useCallback(() => {
    const newValue = !weekStartsSunday;
    setWeekStartsSunday(newValue);
    updatePreference({
      key: "Week_Starts_On",
      value: newValue ? "Sunday" : "Monday",
    });
  }, [weekStartsSunday, updatePreference]);

  const memoizedSections = useMemo(() => sections, []);

  return (
    <main className="flex flex-col overflow-y-auto overflow-x-clip w-full px-[15px] justify-start gap-[20px] h-full">
      {memoizedSections.map((s, index) => (
        <SettingsSection
          key={index}
          toggle={s.toggle}
          toggles={s.toggles}
          title={s.title}
          dropdownType={s.type}
          lines={s.lines}
          type={s.type}
          onPreferenceChange={handlePreferenceChange}
          allowNotifications={allowNotifications}
          toggleNotifications={handleNotificationToggle}
          notificationsList={notificationsList}
          onNotificationListChange={handleNotificationListChange}
          preferences={preferences}
          dateFormat={dateFormat}
          weekStartsSunday={weekStartsSunday}
          onDateFormatToggle={handleDateFormatToggle}
          onWeekStartToggle={handleWeekStartToggle}
        />
      ))}
    </main>
  );
};

export default SettingsScroll;
