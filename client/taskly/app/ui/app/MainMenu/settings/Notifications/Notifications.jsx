import { useEffect, useState } from "react";
import { useScreen } from "../../../../../../context/ScreenContext";
import { useUserPreferences } from "../../../../../../context/UserPreferencesContext";
import CheckboxContainer from "../CheckboxContainer";
import SectionTitle from "../SectionTitle";
import Switcher from "../Switcher";

export default function Notifications({ transitionStyles }) {
  const { updatePreference, preferences } = useUserPreferences();
  
  // Convertir la préférence Allow_Notifications en booléen
  const [allowNotifications, setAllowNotifications] = useState(
    JSON.parse(preferences.Allow_Notifications.toLowerCase())
  );
  const [notificationsList, setNotificationsList] = useState(
    preferences?.Notifications_List || []
  );
  const { isMobile } = useScreen();

  useEffect(() => {
    const newValue = allowNotifications.toString();
    if (preferences.Allow_Notifications !== newValue) {
      updatePreference({
        key: "Allow_Notifications",
        value: newValue,
      });
    }
  }, [allowNotifications, updatePreference, preferences]);
  
  useEffect(() => {
    const newListValue =
      typeof notificationsList === "string"
        ? notificationsList
        : notificationsList.toString();
    if (preferences.Notifications_List !== newListValue) {
      updatePreference({
        key: "Notifications_List",
        value: newListValue,
      });
    }
  }, [notificationsList, updatePreference, preferences]);
  

  const notifications = [
    // { name: "Daily Recap" },
    // { name: "Weekly Recap" },
    // { name: "Monthly Recap" },
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
      className={`flex flex-col w-full px-[4%] my-[4%] gap-[1.75vh] ${transitionStyles}`}
    >
      <div className="flex justify-between items-center">
        <SectionTitle>Coming soon, stay tuned!</SectionTitle>
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
          <span style={{ display: 'inline-flex', alignItems: 'center' }} className={`${isMobile ? "text-sm" : "text-base"} text-secondary leading-none`}>
            {notification.name}
          </span>
        </CheckboxContainer>
      ))}
    </div>
  );
}
