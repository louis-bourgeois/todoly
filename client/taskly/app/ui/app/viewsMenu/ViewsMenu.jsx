import React, { useCallback, useEffect, useRef, useState } from "react";
import { useUserPreferences } from "../../../../context/UserPreferencesContext";
import DropdownMenu from "../MainMenu/settings/DropdownMenu";

const ViewsMenu = ({ options, isOpen, onClose }) => {
  const { updatePreference, preferences } = useUserPreferences();

  const [selectedOptions, setSelectedOptions] = useState({
    "Sort by": preferences?.Sort_By || "Importance",
    Show: preferences?.Show || "All tasks",
  });
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setSelectedOptions({
      "Sort by": preferences?.Sort_By || "Importance",
      Show: preferences?.Show || "All tasks",
    });
  }, [preferences]);

  useEffect(() => {
    if (isOpen) setIsClosing(false);
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, closeMenu]);

  const handleOptionSelect = useCallback((title, item) => {
    setSelectedOptions((prev) => ({ ...prev, [title]: item }));
  }, []);

  const handleConfirm = useCallback(async () => {
    await Promise.all([
      updatePreference({
        key: "Sort_By",
        value: selectedOptions["Sort by"],
      }),
      updatePreference({ key: "Show", value: selectedOptions["Show"] }),
    ]);
    closeMenu();
  }, [updatePreference, selectedOptions, closeMenu]);

  const renderMenuContent = useCallback(
    () =>
      options.map((option, index) => (
        <div key={index} className="mb-6 last:mb-0">
          <h3 className="text-lg font-semibold mb-2  text-secondary tracking-wide">
            {option.title}
          </h3>
          <DropdownMenu
            title={selectedOptions[option.title] || "Select an option"}
            options={option.items}
            onSelect={(item) => handleOptionSelect(option.title, item)}
            className="text-secondary"
          />
        </div>
      )),
    [options, selectedOptions, handleOptionSelect]
  );

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-secondary-10 backdrop-blur-sm z-[190] transition-opacity duration-300 ${
        isOpen && !isClosing ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={menuRef}
        className={`w-[90vw] max-w-md bg-primary backdrop-blur-md rounded-3xl shadow-2xl p-8 transition-all duration-300 border border-white/50 ${
          isOpen && !isClosing ? "scale-100 opacity-100" : "scale-5 opacity-0"
        }`}
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-text">
          Views Menu
        </h2>
        <div className="space-y-6">
          {renderMenuContent()}
          <button
            onClick={handleConfirm}
            className="w-full py-2 bg-dominant text-primary rounded-full hover:bg-opacity-80 transition-colors duration-200 text-lg font-semibold mt-4"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ViewsMenu);
