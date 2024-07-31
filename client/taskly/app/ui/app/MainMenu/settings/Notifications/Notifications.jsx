import { useEffect, useState } from "react";
import { useScreen } from "../../../../../../context/ScreenContext";
import { useUserPreferences } from "../../../../../../context/UserPreferencesContext";
import CheckboxContainer from "../CheckboxContainer";
import SectionTitle from "../SectionTitle";
import Switcher from "../Switcher";

export default function Notifications({ transitionStyles }) {
  const { updatePreference, preferences } = useUserPreferences();
  const [allowNotifications, setAllowNotifications] = useState(
    JSON.parse(preferences.Allow_Notification.toLowerCase())
  );
  const [notificationsList, setNotificationsList] = useState(
    preferences?.Notifications_List || []
  );
  const { isMobile } = useScreen();

  useEffect(() => {
    updatePreference({
      key: "Allow_Notifications",
      value: allowNotifications.toString(),
    });
    console.log(preferences);
  }, [allowNotifications, updatePreference]);

  useEffect(() => {
    updatePreference({
      key: "Notifications_List",
      value: notificationsList.toString(),
    });
  }, [notificationsList, updatePreference]);

  const notifications = [
    { name: "Daily Recap" },
    { name: "Weekly Recap" },
    { name: "Monthly Recap" },
  ];

  const handleNotificationChange = (notificationName) => {
    setNotificationsList((prevList) => {
      const list =
        typeof prevList === "string" ? prevList.split(",") : prevList;
      return list.includes(notificationName)
        ? list.filter((name) => name !== notificationName)
        : [...list, notificationName];
    });
  };

  return (
    <div
      className={`flex flex-col w-full px-[4%] mt-[4%] gap-[1.75vh] ${transitionStyles}`}
    >
      <div className="flex justify-between items-center">
        <SectionTitle>Notification</SectionTitle>
        <Switcher
          isChecked={allowNotifications}
          onChange={() => setAllowNotifications((prev) => !prev)}
        />
      </div>
      {notifications.map((notification) => (
        <CheckboxContainer
          key={notification.name}
          isChecked={notificationsList.includes(notification.name)}
          onChange={() => handleNotificationChange(notification.name)}
        >
          <span className={isMobile ? "text-sm" : "text-base"}>
            {notification.name}
          </span>
        </CheckboxContainer>
      ))}
    </div>
  );
}
