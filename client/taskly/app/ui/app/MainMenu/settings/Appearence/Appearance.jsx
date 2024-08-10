import { useEffect, useRef, useState } from "react";
import { useUserPreferences } from "../../../../../../context/UserPreferencesContext";
import Circle from "../Circle";
import SectionTitle from "../SectionTitle";

export default function Appearance({ transitionStyles }) {
  const { updatePreference, preferences } = useUserPreferences();
  const [selectedCircle, setSelectedCircle] = useState(null);
  const siblingRefs = useRef([]);

  const rgbToHex = (rgb) => {
    let hex = rgb
      .match(/\d+/g)
      .map((x) => parseInt(x).toString(16).padStart(2, "0"))
      .join("");
    return `#${hex}`;
  };
  const rows = [
    { color: "#ffffff" },
    { color: "#000000" },
    { color: "#007AFF" },
  ];
  const handleCircleClick = async (index) => {
    const siblingDiv = siblingRefs.current[index];
    if (siblingDiv) {
      setSelectedCircle(index);
      const bgColor = window.getComputedStyle(siblingDiv).backgroundColor;
      const hexColor = rgbToHex(bgColor);
      console.log(hexColor);
      await updatePreference({
        key: "Color_Theme",
        value: hexColor,
      });
    }
  };

  useEffect(() => {
    if (preferences?.Color_Theme) {
      const initialThemeIndex = rows.findIndex(
        (row) =>
          row.color.toLowerCase() === preferences.Color_Theme.toLowerCase()
      );
      setSelectedCircle(initialThemeIndex !== -1 ? initialThemeIndex : null);
    } else {
      setSelectedCircle(null);
    }
  }, [preferences?.Color_Theme]);

  return (
    <div
      className={`flex flex-col w-full px-[4%] gap-[1.75vh] justify-start ${transitionStyles}`}
    >
      <SectionTitle>Color Theme</SectionTitle>
      <div className="w-full flex flex-col justify-around gap-[1.25vw]">
        {rows.map((row, index) => (
          <div
            key={index}
            className={`w-full flex justify-between items-center`}
          >
            <div
              ref={(el) => (siblingRefs.current[index] = el)}
              style={{ backgroundColor: row.color }}
              className={`rounded-[10px] w-[87.5%] h-[5vh]  ${
                (row.color === "#ffffff" || row.color === "#f7f4ed") &&
                "border border-secondary"
              }`}
            ></div>
            <Circle
              onColorChange={() => handleCircleClick(index)}
              isSelected={selectedCircle === index}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
