import { useEffect, useState } from "react";
import { useUser } from "../../../../../../context/UserContext";
import { useUserPreferences } from "../../../../../../context/UserPreferencesContext";
import CheckboxContainer from "../CheckboxContainer";
import SectionTitle from "../SectionTitle";
import Switcher from "../Switcher";

export default function Notifications({ transitionStyles }) {
  const { preferences } = useUser();
  const { updateUserPreference } = useUserPreferences();
  const [allowNotifications, setAllowNotifications] = useState(
    JSON.parse(preferences.Allow_Notification.toLowerCase())
  );
  const [notificationsList, setNotificationsList] = useState(
    preferences?.Notifications_List || []
  );

  useEffect(() => {
    updateUserPreference({
      key: "Allow_Notifications",
      value: allowNotifications.toString(),
    });
  }, [allowNotifications]);

  useEffect(() => {
    updateUserPreference({
      key: "Notifications_List",
      value: notificationsList.toString(),
    });
  }, [notificationsList]);

  const notifications = [
    { name: "Daily Recap" },
    { name: "Weekly Recap" },
    { name: "Monthly Recap" },
  ];

  const handleNotificationChange = (notificationName) => {
    setNotificationsList((prevList) => {
      // Si prevList est une chaîne de caractères, la convertir en tableau
      if (typeof prevList === "string") {
        prevList = prevList.split(",");
      }

      // Vérifier si prevList contient la notification
      if (prevList.includes(notificationName)) {
        return prevList.filter((name) => name !== notificationName);
      } else {
        return [...prevList, notificationName];
      }
    });
  };

  return (
    <div
      className={`flex flex-col w-full px-[4%] mt-[4%] gap-[1.75vh] justify-start ${transitionStyles}`}
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
          <span>{notification.name}</span>
        </CheckboxContainer>
      ))}
    </div>
  );
}
