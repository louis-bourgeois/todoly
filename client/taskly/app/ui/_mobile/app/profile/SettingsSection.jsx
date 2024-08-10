import DropdownMenu from "@/ui/app/MainMenu/settings/DropdownMenu";
import Switcher from "@/ui/app/MainMenu/settings/Switcher";
import React from "react";
import TagToggle from "./TagToggle";

const formatTitle = (title) => {
  if (title === "TZ") return "Time Zone";
  return title
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const SettingsSection = React.memo(
  ({
    title,
    type,
    lines = [],
    toggle = false,
    toggles = [],
    onPreferenceChange,
    allowNotifications,
    toggleNotifications,
    notificationsList,
    onNotificationListChange,
    preferences,
    dateFormat,
    weekStartsSunday,
    onDateFormatToggle,
    onWeekStartToggle,
  }) => {
    return (
      <section className="flex flex-col items-start gap-4 w-full">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-bold text-text">{formatTitle(title)}</h2>
          {toggle && (
            <Switcher
              isChecked={allowNotifications}
              onChange={toggleNotifications}
            />
          )}
        </div>
        {toggle && toggles.length > 0 && (
          <div className="flex flex-col items-start gap-2 w-full">
            {toggles.map((toggleItem, index) => (
              <TagToggle
                key={index}
                libelle={toggleItem}
                isChecked={notificationsList.includes(toggleItem)}
                onChange={() => {
                  console.log("TagToggle changed:", toggleItem);
                  onNotificationListChange(toggleItem);
                }}
              />
            ))}
          </div>
        )}
        {lines.map((line, index) => {
          const [key, value] = Object.entries(line)[0];
          const isComplexValue =
            Array.isArray(value) && Array.isArray(value[0]);
          const selectedOption = isComplexValue
            ? value.find((item) => item[1] === preferences[key]) || value[0]
            : null;
          const displayValue = isComplexValue
            ? selectedOption[0]
            : preferences[key];


          return (
            <div
              key={index}
              className="flex justify-between w-full items-center"
            >
              <h4 className="text-base mr-4 text-text">{formatTitle(key)}</h4>
              <DropdownMenu
                textWeight="bold"
                title={displayValue}
                onSelect={(selected) => {
                  const newValue = isComplexValue
                    ? value.find((item) => item[0] === selected)?.[1] ||
                      selected
                    : selected;
                  onPreferenceChange(key, newValue);
                }}
                options={isComplexValue ? value.map((item) => item[0]) : value}
                size="little"
                className={`rounded-full capitalize min-w-[150px]`}
              />
            </div>
          );
        })}
        {title === "Language" && (
          <div className="flex flex-col items-start gap-2 w-full">
            <TagToggle
              libelle="24h date Format"
              isChecked={dateFormat}
              onChange={onDateFormatToggle}
            />
            <TagToggle
              libelle="Week starts on Sunday"
              isChecked={weekStartsSunday}
              onChange={onWeekStartToggle}
            />
          </div>
        )}
      </section>
    );
  }
);

SettingsSection.displayName = "SettingsSection";

export default SettingsSection;
